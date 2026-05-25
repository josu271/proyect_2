from math import ceil

import psycopg2
from fastapi import HTTPException

from app.database import get_connection


def obtener_semestre_activo(cursor):
    cursor.execute(
        """
        SELECT id, codigo, nombre
        FROM semestres_academicos
        WHERE estado IN ('ACTIVO', 'PLANIFICACION')
        ORDER BY
            CASE estado
                WHEN 'ACTIVO' THEN 1
                WHEN 'PLANIFICACION' THEN 2
                ELSE 3
            END,
            fecha_inicio DESC
        LIMIT 1;
        """
    )

    semestre = cursor.fetchone()

    if not semestre:
        raise HTTPException(
            status_code=400,
            detail="No existe un semestre activo o en planificación.",
        )

    return dict(semestre)


def obtener_aula(cursor, aula_id: int):
    cursor.execute(
        """
        SELECT id, codigo, tipo_aula, capacidad
        FROM aulas
        WHERE id = %s
          AND activa = TRUE;
        """,
        (aula_id,),
    )

    aula = cursor.fetchone()

    if not aula:
        raise HTTPException(
            status_code=400,
            detail="El aula no existe o está inactiva.",
        )

    return dict(aula)


def validar_entidades(cursor, seccion):
    cursor.execute(
        """
        SELECT id, nombre, tipo_aula_requerida
        FROM cursos
        WHERE id = %s
          AND activo = TRUE;
        """,
        (seccion.curso_id,),
    )

    curso = cursor.fetchone()

    if not curso:
        raise HTTPException(
            status_code=400,
            detail="El curso no existe o está inactivo.",
        )

    cursor.execute(
        """
        SELECT id
        FROM docentes
        WHERE id = %s
          AND activo = TRUE;
        """,
        (seccion.docente_id,),
    )

    if not cursor.fetchone():
        raise HTTPException(
            status_code=400,
            detail="El docente no existe o está inactivo.",
        )

    aula = obtener_aula(cursor, seccion.aula_id)

    tipo_requerido = curso["tipo_aula_requerida"]
    tipo_aula = aula["tipo_aula"]

    if tipo_requerido == "LABORATORIO" and tipo_aula != "LABORATORIO":
        raise HTTPException(
            status_code=400,
            detail="El curso requiere laboratorio. Seleccione un aula de tipo LABORATORIO.",
        )

    if tipo_requerido == "TEORICA" and tipo_aula not in ("TEORICA", "AUDITORIO"):
        raise HTTPException(
            status_code=400,
            detail="El curso requiere aula teórica o auditorio.",
        )

    if tipo_requerido == "VIRTUAL" and tipo_aula != "VIRTUAL":
        raise HTTPException(
            status_code=400,
            detail="El curso requiere aula virtual.",
        )

    return aula


def asegurar_asignacion_docente_curso(
    cursor,
    docente_id: int,
    curso_id: int,
    semestre_id: int,
):
    cursor.execute(
        """
        INSERT INTO docente_curso_asignado (
            docente_id,
            curso_id,
            semestre_id,
            estado
        )
        SELECT %s, %s, %s, 'ASIGNADO'
        WHERE NOT EXISTS (
            SELECT 1
            FROM docente_curso_asignado
            WHERE docente_id = %s
              AND curso_id = %s
              AND semestre_id = %s
              AND estado = 'ASIGNADO'
        );
        """,
        (
            docente_id,
            curso_id,
            semestre_id,
            docente_id,
            curso_id,
            semestre_id,
        ),
    )


def listar_opciones():
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, nombre
                FROM cursos
                WHERE activo = TRUE
                ORDER BY nombre ASC;
                """
            )
            cursos = [dict(row) for row in cursor.fetchall()]

            cursor.execute(
                """
                SELECT id, nombre_completo
                FROM docentes
                WHERE activo = TRUE
                ORDER BY nombre_completo ASC;
                """
            )
            docentes = [dict(row) for row in cursor.fetchall()]

            cursor.execute(
                """
                SELECT id, codigo, tipo_aula, capacidad, ubicacion
                FROM aulas
                WHERE activa = TRUE
                ORDER BY codigo ASC;
                """
            )
            aulas = [dict(row) for row in cursor.fetchall()]

            semestre = obtener_semestre_activo(cursor)

            return {
                "cursos": cursos,
                "docentes": docentes,
                "aulas": aulas,
                "semestre": semestre,
            }

    finally:
        conn.close()


def listar_secciones(page: int = 1, limit: int = 10, search: str = ""):
    page = max(page, 1)
    limit = 10
    offset = (page - 1) * limit

    search_text = search.strip()
    search_like = f"%{search_text}%"

    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT COUNT(*) AS total
                FROM secciones s
                INNER JOIN cursos c ON c.id = s.curso_id
                INNER JOIN docentes d ON d.id = s.docente_id
                INNER JOIN semestres_academicos sem ON sem.id = s.semestre_id
                LEFT JOIN aulas a ON a.id = s.aula_id
                WHERE (
                    %s = ''
                    OR s.nrc ILIKE %s
                    OR c.nombre ILIKE %s
                    OR d.nombre_completo ILIKE %s
                    OR a.codigo ILIKE %s
                    OR sem.codigo ILIKE %s
                );
                """,
                (
                    search_text,
                    search_like,
                    search_like,
                    search_like,
                    search_like,
                    search_like,
                ),
            )

            total = cursor.fetchone()["total"]

            cursor.execute(
                """
                SELECT
                    s.id,
                    s.nrc,

                    s.curso_id,
                    c.nombre AS curso,

                    s.docente_id,
                    d.nombre_completo AS docente,

                    s.aula_id,
                    a.codigo AS aula,
                    a.tipo_aula,
                    a.capacidad AS capacidad_aula,

                    s.semestre_id,
                    sem.codigo AS semestre,

                    s.cupo_max,
                    s.estado,
                    s.fecha_creacion,

                    EXISTS (
                        SELECT 1
                        FROM bloques_horario bh
                        WHERE bh.seccion_id = s.id
                    ) AS tiene_horario
                FROM secciones s
                INNER JOIN cursos c ON c.id = s.curso_id
                INNER JOIN docentes d ON d.id = s.docente_id
                INNER JOIN semestres_academicos sem ON sem.id = s.semestre_id
                LEFT JOIN aulas a ON a.id = s.aula_id
                WHERE (
                    %s = ''
                    OR s.nrc ILIKE %s
                    OR c.nombre ILIKE %s
                    OR d.nombre_completo ILIKE %s
                    OR a.codigo ILIKE %s
                    OR sem.codigo ILIKE %s
                )
                ORDER BY s.id DESC
                LIMIT %s OFFSET %s;
                """,
                (
                    search_text,
                    search_like,
                    search_like,
                    search_like,
                    search_like,
                    search_like,
                    limit,
                    offset,
                ),
            )

            secciones = [dict(row) for row in cursor.fetchall()]

            return {
                "items": secciones,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": max(1, ceil(total / limit)) if total else 1,
            }

    finally:
        conn.close()


def obtener_seccion(seccion_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    s.id,
                    s.nrc,

                    s.curso_id,
                    c.nombre AS curso,

                    s.docente_id,
                    d.nombre_completo AS docente,

                    s.aula_id,
                    a.codigo AS aula,
                    a.tipo_aula,
                    a.capacidad AS capacidad_aula,

                    s.semestre_id,
                    sem.codigo AS semestre,

                    s.cupo_max,
                    s.estado,
                    s.fecha_creacion,

                    EXISTS (
                        SELECT 1
                        FROM bloques_horario bh
                        WHERE bh.seccion_id = s.id
                    ) AS tiene_horario
                FROM secciones s
                INNER JOIN cursos c ON c.id = s.curso_id
                INNER JOIN docentes d ON d.id = s.docente_id
                INNER JOIN semestres_academicos sem ON sem.id = s.semestre_id
                LEFT JOIN aulas a ON a.id = s.aula_id
                WHERE s.id = %s;
                """,
                (seccion_id,),
            )

            seccion = cursor.fetchone()

            if not seccion:
                raise HTTPException(
                    status_code=404,
                    detail="Sección no encontrada.",
                )

            return dict(seccion)

    finally:
        conn.close()


def crear_seccion(seccion):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            aula = validar_entidades(cursor, seccion)

            semestre = obtener_semestre_activo(cursor)
            semestre_id = semestre["id"]
            cupo_max = aula["capacidad"]

            asegurar_asignacion_docente_curso(
                cursor,
                seccion.docente_id,
                seccion.curso_id,
                semestre_id,
            )

            cursor.execute(
                """
                INSERT INTO secciones (
                    nrc,
                    curso_id,
                    docente_id,
                    aula_id,
                    semestre_id,
                    cupo_max,
                    estado
                )
                VALUES (%s, %s, %s, %s, %s, %s, 'BORRADOR')
                RETURNING id;
                """,
                (
                    seccion.nrc.strip().upper(),
                    seccion.curso_id,
                    seccion.docente_id,
                    seccion.aula_id,
                    semestre_id,
                    cupo_max,
                ),
            )

            seccion_id = cursor.fetchone()["id"]
            conn.commit()

            return obtener_seccion(seccion_id)

    except psycopg2.errors.UniqueViolation as error:
        conn.rollback()

        mensaje = str(error)

        if "secciones_semestre_id_nrc_key" in mensaje:
            detalle = "Ya existe una sección con ese NRC en el semestre activo."
        else:
            detalle = "Ya existe un registro duplicado."

        raise HTTPException(status_code=400, detail=detalle)

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al crear sección: {str(error)}",
        )

    finally:
        conn.close()


def actualizar_seccion(seccion_id: int, seccion):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id
                FROM secciones
                WHERE id = %s;
                """,
                (seccion_id,),
            )

            if not cursor.fetchone():
                raise HTTPException(
                    status_code=404,
                    detail="Sección no encontrada.",
                )

            cursor.execute(
                """
                SELECT COUNT(*) AS total
                FROM bloques_horario
                WHERE seccion_id = %s;
                """,
                (seccion_id,),
            )

            tiene_horario = cursor.fetchone()["total"] > 0

            if tiene_horario:
                raise HTTPException(
                    status_code=400,
                    detail="No se puede editar esta sección porque el docente ya asignó día y hora.",
                )

            aula = validar_entidades(cursor, seccion)

            semestre = obtener_semestre_activo(cursor)
            semestre_id = semestre["id"]
            cupo_max = aula["capacidad"]

            asegurar_asignacion_docente_curso(
                cursor,
                seccion.docente_id,
                seccion.curso_id,
                semestre_id,
            )

            cursor.execute(
                """
                UPDATE secciones
                SET
                    nrc = %s,
                    curso_id = %s,
                    docente_id = %s,
                    aula_id = %s,
                    semestre_id = %s,
                    cupo_max = %s,
                    estado = 'BORRADOR'
                WHERE id = %s
                RETURNING id;
                """,
                (
                    seccion.nrc.strip().upper(),
                    seccion.curso_id,
                    seccion.docente_id,
                    seccion.aula_id,
                    semestre_id,
                    cupo_max,
                    seccion_id,
                ),
            )

            conn.commit()

            return obtener_seccion(seccion_id)

    except psycopg2.errors.UniqueViolation as error:
        conn.rollback()

        mensaje = str(error)

        if "secciones_semestre_id_nrc_key" in mensaje:
            detalle = "Ya existe otra sección con ese NRC en el semestre activo."
        else:
            detalle = "Ya existe un registro duplicado."

        raise HTTPException(status_code=400, detail=detalle)

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar sección: {str(error)}",
        )

    finally:
        conn.close()


def eliminar_seccion(seccion_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT COUNT(*) AS total
                FROM matricula_detalle md
                INNER JOIN matriculas m ON m.id = md.matricula_id
                WHERE md.seccion_id = %s
                  AND md.estado = 'ACTIVO'
                  AND m.estado <> 'ANULADA';
                """,
                (seccion_id,),
            )

            matriculados = cursor.fetchone()["total"]

            if matriculados > 0:
                raise HTTPException(
                    status_code=400,
                    detail="No se puede cancelar la sección porque tiene estudiantes matriculados.",
                )

            cursor.execute(
                """
                UPDATE secciones
                SET estado = 'CANCELADA'
                WHERE id = %s
                RETURNING id;
                """,
                (seccion_id,),
            )

            seccion = cursor.fetchone()

            if not seccion:
                conn.rollback()
                raise HTTPException(
                    status_code=404,
                    detail="Sección no encontrada.",
                )

            conn.commit()

            return {
                "message": "Sección cancelada correctamente.",
                "id": seccion_id,
            }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al cancelar sección: {str(error)}",
        )

    finally:
        conn.close()