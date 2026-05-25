import psycopg2
from fastapi import HTTPException

from app.database import get_connection


def obtener_docente_por_usuario(cursor, usuario_id: int):
    cursor.execute(
        """
        SELECT
            d.id AS docente_id,
            d.usuario_id,
            d.codigo_docente,
            d.nombre_completo,
            d.especialidad,
            u.correo
        FROM docentes d
        INNER JOIN usuarios u ON u.id = d.usuario_id
        WHERE d.usuario_id = %s
          AND d.activo = TRUE
          AND u.activo = TRUE
          AND u.rol = 'DOCENTE';
        """,
        (usuario_id,),
    )

    docente = cursor.fetchone()

    if not docente:
        raise HTTPException(
            status_code=404,
            detail="No se encontró un docente activo asociado al usuario.",
        )

    return dict(docente)


def obtener_seccion_docente(cursor, seccion_id: int, docente_id: int):
    cursor.execute(
        """
        SELECT
            s.id AS seccion_id,
            s.nrc,
            s.curso_id,
            c.nombre AS curso,
            s.docente_id,
            d.nombre_completo AS docente,
            s.aula_id,
            a.codigo AS aula,
            a.tipo_aula,
            a.capacidad,
            s.semestre_id,
            sem.codigo AS semestre,
            s.cupo_max,
            s.estado
        FROM secciones s
        INNER JOIN cursos c ON c.id = s.curso_id
        INNER JOIN docentes d ON d.id = s.docente_id
        INNER JOIN semestres_academicos sem ON sem.id = s.semestre_id
        LEFT JOIN aulas a ON a.id = s.aula_id
        WHERE s.id = %s
          AND s.docente_id = %s
          AND s.estado NOT IN ('CERRADA', 'CANCELADA');
        """,
        (seccion_id, docente_id),
    )

    seccion = cursor.fetchone()

    if not seccion:
        raise HTTPException(
            status_code=404,
            detail="La sección no existe, no pertenece al docente o no está disponible.",
        )

    seccion = dict(seccion)

    if not seccion["aula_id"]:
        raise HTTPException(
            status_code=400,
            detail="La sección no tiene aula asignada por el administrador.",
        )

    return seccion


def listar_inicial(usuario_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            docente = obtener_docente_por_usuario(cursor, usuario_id)
            docente_id = docente["docente_id"]

            cursor.execute(
                """
                SELECT
                    s.id AS seccion_id,
                    s.nrc,
                    c.nombre AS curso,
                    d.nombre_completo AS docente,
                    a.id AS aula_id,
                    a.codigo AS aula,
                    a.tipo_aula,
                    a.capacidad AS capacidad_aula,
                    sem.id AS semestre_id,
                    sem.codigo AS semestre,
                    s.cupo_max,
                    s.estado,

                    bh.id AS horario_id,
                    bh.dia_semana,
                    CASE bh.dia_semana
                        WHEN 1 THEN 'Lunes'
                        WHEN 2 THEN 'Martes'
                        WHEN 3 THEN 'Miércoles'
                        WHEN 4 THEN 'Jueves'
                        WHEN 5 THEN 'Viernes'
                        WHEN 6 THEN 'Sábado'
                        ELSE 'Pendiente'
                    END AS dia_nombre,
                    bh.bloque_academico_id,
                    ba.hora_inicio::text AS hora_inicio,
                    ba.hora_fin::text AS hora_fin,
                    ba.turno
                FROM secciones s
                INNER JOIN cursos c ON c.id = s.curso_id
                INNER JOIN docentes d ON d.id = s.docente_id
                INNER JOIN semestres_academicos sem ON sem.id = s.semestre_id
                LEFT JOIN aulas a ON a.id = s.aula_id
                LEFT JOIN bloques_horario bh ON bh.seccion_id = s.id
                LEFT JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
                WHERE s.docente_id = %s
                  AND s.estado <> 'CANCELADA'
                ORDER BY
                    CASE WHEN bh.id IS NULL THEN 0 ELSE 1 END ASC,
                    s.id DESC;
                """,
                (docente_id,),
            )

            secciones = [dict(row) for row in cursor.fetchall()]

            cursor.execute(
                """
                SELECT
                    id,
                    nombre,
                    hora_inicio::text AS hora_inicio,
                    hora_fin::text AS hora_fin,
                    turno
                FROM bloques_academicos
                ORDER BY hora_inicio ASC;
                """
            )

            bloques = [dict(row) for row in cursor.fetchall()]

            cursor.execute(
                """
                SELECT
                    dd.id,
                    dd.docente_id,
                    dd.semestre_id,
                    sem.codigo AS semestre,
                    dd.dia_semana,
                    CASE dd.dia_semana
                        WHEN 1 THEN 'Lunes'
                        WHEN 2 THEN 'Martes'
                        WHEN 3 THEN 'Miércoles'
                        WHEN 4 THEN 'Jueves'
                        WHEN 5 THEN 'Viernes'
                        WHEN 6 THEN 'Sábado'
                    END AS dia_nombre,
                    dd.bloque_academico_id,
                    ba.hora_inicio::text AS hora_inicio,
                    ba.hora_fin::text AS hora_fin,
                    ba.turno,
                    dd.disponible
                FROM disponibilidad_docente dd
                INNER JOIN semestres_academicos sem ON sem.id = dd.semestre_id
                INNER JOIN bloques_academicos ba ON ba.id = dd.bloque_academico_id
                WHERE dd.docente_id = %s
                ORDER BY dd.dia_semana ASC, ba.hora_inicio ASC;
                """,
                (docente_id,),
            )

            disponibilidad = [dict(row) for row in cursor.fetchall()]

            return {
                "docente": docente,
                "secciones": secciones,
                "bloques": bloques,
                "disponibilidad": disponibilidad,
            }

    finally:
        conn.close()


def asignar_horario(data):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            docente = obtener_docente_por_usuario(cursor, data.usuario_id)
            docente_id = docente["docente_id"]

            seccion = obtener_seccion_docente(
                cursor,
                data.seccion_id,
                docente_id,
            )

            semestre_id = seccion["semestre_id"]
            aula_id = seccion["aula_id"]

            cursor.execute(
                """
                SELECT id
                FROM bloques_academicos
                WHERE id = %s;
                """,
                (data.bloque_academico_id,),
            )

            if not cursor.fetchone():
                raise HTTPException(
                    status_code=400,
                    detail="El bloque académico seleccionado no existe.",
                )

            cursor.execute(
                """
                INSERT INTO disponibilidad_docente (
                    docente_id,
                    semestre_id,
                    dia_semana,
                    bloque_academico_id,
                    disponible
                )
                VALUES (%s, %s, %s, %s, TRUE)
                ON CONFLICT (
                    docente_id,
                    semestre_id,
                    dia_semana,
                    bloque_academico_id
                )
                DO UPDATE SET disponible = TRUE;
                """,
                (
                    docente_id,
                    semestre_id,
                    data.dia_semana,
                    data.bloque_academico_id,
                ),
            )

            cursor.execute(
                """
                INSERT INTO bloques_horario (
                    seccion_id,
                    aula_id,
                    dia_semana,
                    bloque_academico_id
                )
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (seccion_id)
                DO UPDATE SET
                    aula_id = EXCLUDED.aula_id,
                    dia_semana = EXCLUDED.dia_semana,
                    bloque_academico_id = EXCLUDED.bloque_academico_id;
                """,
                (
                    data.seccion_id,
                    aula_id,
                    data.dia_semana,
                    data.bloque_academico_id,
                ),
            )

            conn.commit()

            return {
                "message": "Horario asignado correctamente. La sección fue completada.",
                "seccion_id": data.seccion_id,
            }

    except psycopg2.errors.RaiseException as error:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(error).split("CONTEXT")[0].strip(),
        )

    except psycopg2.Error as error:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(error).split("CONTEXT")[0].strip(),
        )

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al asignar horario: {str(error)}",
        )

    finally:
        conn.close()


def quitar_horario(usuario_id: int, seccion_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            docente = obtener_docente_por_usuario(cursor, usuario_id)
            docente_id = docente["docente_id"]

            obtener_seccion_docente(cursor, seccion_id, docente_id)

            cursor.execute(
                """
                DELETE FROM bloques_horario
                WHERE seccion_id = %s
                RETURNING id;
                """,
                (seccion_id,),
            )

            eliminado = cursor.fetchone()

            if not eliminado:
                raise HTTPException(
                    status_code=404,
                    detail="La sección no tiene horario asignado.",
                )

            conn.commit()

            return {
                "message": "Horario retirado correctamente.",
                "seccion_id": seccion_id,
            }

    except psycopg2.errors.RaiseException as error:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(error).split("CONTEXT")[0].strip(),
        )

    except psycopg2.Error as error:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(error).split("CONTEXT")[0].strip(),
        )

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al retirar horario: {str(error)}",
        )

    finally:
        conn.close()