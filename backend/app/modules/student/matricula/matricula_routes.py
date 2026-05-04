from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor
from app.database import get_connection

router = APIRouter()


@router.get("/cursos-disponibles/{estudiante_id}")
def cursos_disponibles(estudiante_id: int):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Obtener programa activo del estudiante
        cursor.execute("""
            SELECT programa_id
            FROM estudiante_programas
            WHERE estudiante_id = %s
              AND estado = 'ACTIVO'
            LIMIT 1;
        """, (estudiante_id,))

        programa = cursor.fetchone()

        if not programa:
            raise HTTPException(
                status_code=404,
                detail="El estudiante no tiene programa activo asignado"
            )

        programa_id = programa["programa_id"]

        # Obtener semestre activo
        cursor.execute("""
            SELECT id
            FROM semestres_academicos
            WHERE estado IN ('ABIERTO', 'EN_CURSO')
            ORDER BY fecha_inicio DESC, id DESC
            LIMIT 1;
        """)

        semestre = cursor.fetchone()

        if not semestre:
            raise HTTPException(
                status_code=404,
                detail="No hay semestre activo"
            )

        semestre_id = semestre["id"]

        # IMPORTANTE:
        # seccion_id se mantiene por compatibilidad con tu frontend,
        # pero realmente representa disponibilidad_docente.id
        cursor.execute("""
            SELECT
                dd.id AS seccion_id,
                dd.id AS disponibilidad_id,
                c.id AS curso_id,
                c.codigo,
                c.nombre AS curso,
                c.creditos,
                d.id AS docente_id,
                d.nombre_completo AS docente,
                'Sin aula' AS aula,
                dd.dia_semana,
                dd.hora_inicio,
                dd.hora_fin,
                40 AS capacidad,
                0 AS matriculados_actuales
            FROM disponibilidad_docente dd
            INNER JOIN docentes d
                ON d.id = dd.docente_id
            INNER JOIN cursos c
                ON c.id = dd.curso_id
            WHERE dd.disponible = TRUE
              AND dd.semestre_id = %s
              AND c.programa_id = %s
              AND c.activo = TRUE
            ORDER BY dd.dia_semana, dd.hora_inicio;
        """, (semestre_id, programa_id))

        cursos = cursor.fetchall()

        return cursos

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@router.post("/registrar")
def registrar_matricula(data: dict):
    conn = None
    cursor = None

    try:
        estudiante_id = data.get("estudiante_id")
        secciones = data.get("secciones", [])

        if not estudiante_id:
            raise HTTPException(status_code=400, detail="Falta estudiante_id")

        if not secciones:
            raise HTTPException(
                status_code=400,
                detail="Debe seleccionar al menos un curso"
            )

        # Acepta lista de ids o lista de objetos
        disponibilidades_ids = []

        for item in secciones:
            if isinstance(item, dict):
                valor = item.get("disponibilidad_id") or item.get("seccion_id")
            else:
                valor = item

            if valor is not None:
                disponibilidades_ids.append(int(valor))

        if not disponibilidades_ids:
            raise HTTPException(
                status_code=400,
                detail="No se recibieron disponibilidades válidas"
            )

        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Obtener programa activo del estudiante
        cursor.execute("""
            SELECT programa_id
            FROM estudiante_programas
            WHERE estudiante_id = %s
              AND estado = 'ACTIVO'
            LIMIT 1;
        """, (estudiante_id,))

        programa = cursor.fetchone()

        if not programa:
            raise HTTPException(
                status_code=404,
                detail="El estudiante no tiene programa activo asignado"
            )

        programa_id = programa["programa_id"]

        # Obtener semestre activo
        cursor.execute("""
            SELECT id
            FROM semestres_academicos
            WHERE estado IN ('ABIERTO', 'EN_CURSO')
            ORDER BY fecha_inicio DESC, id DESC
            LIMIT 1;
        """)

        semestre = cursor.fetchone()

        if not semestre:
            raise HTTPException(
                status_code=404,
                detail="No hay semestre activo"
            )

        semestre_id = semestre["id"]

        # Crear o recuperar matrícula
        cursor.execute("""
            INSERT INTO matriculas (
                estudiante_id,
                programa_id,
                semestre_id,
                total_creditos,
                estado
            )
            VALUES (%s, %s, %s, 0, 'ACTIVO')
            ON CONFLICT (estudiante_id, programa_id, semestre_id)
            DO UPDATE SET estado = 'ACTIVO'
            RETURNING id;
        """, (estudiante_id, programa_id, semestre_id))

        matricula_id = cursor.fetchone()["id"]

        # Crear o recuperar horario publicado del programa y semestre
        cursor.execute("""
            INSERT INTO horarios (
                semestre_id,
                programa_id,
                version,
                puntaje,
                cantidad_conflictos,
                algoritmo_generacion,
                publicado,
                fecha_publicacion
            )
            VALUES (%s, %s, 1, 100, 0, 'MATRICULA_MANUAL', TRUE, CURRENT_TIMESTAMP)
            ON CONFLICT (semestre_id, programa_id, version)
            DO UPDATE SET
                publicado = TRUE,
                fecha_publicacion = CURRENT_TIMESTAMP
            RETURNING id;
        """, (semestre_id, programa_id))

        horario_id = cursor.fetchone()["id"]

        for disponibilidad_id in disponibilidades_ids:

            # Obtener disponibilidad docente seleccionada
            cursor.execute("""
                SELECT
                    dd.id AS disponibilidad_id,
                    dd.docente_id,
                    dd.curso_id,
                    dd.semestre_id,
                    dd.dia_semana,
                    dd.hora_inicio,
                    dd.hora_fin,
                    c.programa_id,
                    c.creditos,
                    c.nombre AS curso
                FROM disponibilidad_docente dd
                INNER JOIN cursos c
                    ON c.id = dd.curso_id
                WHERE dd.id = %s
                  AND dd.disponible = TRUE
                  AND dd.semestre_id = %s
                  AND c.programa_id = %s
                  AND c.activo = TRUE;
            """, (disponibilidad_id, semestre_id, programa_id))

            disponibilidad = cursor.fetchone()

            if not disponibilidad:
                raise HTTPException(
                    status_code=400,
                    detail=f"La disponibilidad {disponibilidad_id} no existe o no pertenece al programa/semestre activo"
                )

            # Validar que el estudiante no esté matriculado ya en el mismo curso
            cursor.execute("""
                SELECT c.nombre AS curso
                FROM matricula_cursos mc
                INNER JOIN secciones_curso sc
                    ON sc.id = mc.seccion_curso_id
                INNER JOIN cursos c
                    ON c.id = sc.curso_id
                WHERE mc.matricula_id = %s
                  AND sc.curso_id = %s
                  AND mc.estado = 'MATRICULADO'
                LIMIT 1;
            """, (matricula_id, disponibilidad["curso_id"]))

            curso_repetido = cursor.fetchone()

            if curso_repetido:
                raise HTTPException(
                    status_code=400,
                    detail=f"Ya estás matriculado en el curso {curso_repetido['curso']}"
                )

            # Validar cruce de horario
            cursor.execute("""
                SELECT
                    c.nombre AS curso,
                    bh.dia_semana,
                    bh.hora_inicio,
                    bh.hora_fin
                FROM matricula_cursos mc
                INNER JOIN secciones_curso sc
                    ON sc.id = mc.seccion_curso_id
                INNER JOIN cursos c
                    ON c.id = sc.curso_id
                INNER JOIN bloques_horario bh
                    ON bh.seccion_curso_id = sc.id
                WHERE mc.matricula_id = %s
                  AND mc.estado = 'MATRICULADO'
                  AND bh.dia_semana = %s
                  AND bh.hora_inicio < %s
                  AND bh.hora_fin > %s
                LIMIT 1;
            """, (
                matricula_id,
                disponibilidad["dia_semana"],
                disponibilidad["hora_fin"],
                disponibilidad["hora_inicio"]
            ))

            cruce = cursor.fetchone()

            if cruce:
                raise HTTPException(
                    status_code=400,
                    detail=f"Cruce de horario con {cruce['curso']} "
                           f"({cruce['hora_inicio']} - {cruce['hora_fin']})"
                )

            # Crear o recuperar sección real
            cursor.execute("""
                INSERT INTO secciones_curso (
                    curso_id,
                    docente_id,
                    semestre_id,
                    numero_seccion,
                    capacidad,
                    matriculados_actuales,
                    tipo,
                    estado
                )
                VALUES (%s, %s, %s, %s, 40, 0, 'TEORICO', 'ABIERTO')
                ON CONFLICT (curso_id, docente_id, semestre_id, numero_seccion)
                DO UPDATE SET estado = 'ABIERTO'
                RETURNING id;
            """, (
                disponibilidad["curso_id"],
                disponibilidad["docente_id"],
                disponibilidad["semestre_id"],
                disponibilidad["disponibilidad_id"]
            ))

            seccion_curso_id = cursor.fetchone()["id"]

            # Crear bloque horario real
            cursor.execute("""
                INSERT INTO bloques_horario (
                    horario_id,
                    seccion_curso_id,
                    aula_id,
                    dia_semana,
                    hora_inicio,
                    hora_fin,
                    tipo_bloque
                )
                VALUES (%s, %s, NULL, %s, %s, %s, 'TEORICO')
                ON CONFLICT (horario_id, seccion_curso_id, dia_semana, hora_inicio, hora_fin)
                DO NOTHING;
            """, (
                horario_id,
                seccion_curso_id,
                disponibilidad["dia_semana"],
                disponibilidad["hora_inicio"],
                disponibilidad["hora_fin"]
            ))

            # Registrar curso en matrícula
            cursor.execute("""
                INSERT INTO matricula_cursos (
                    matricula_id,
                    seccion_curso_id,
                    estado
                )
                VALUES (%s, %s, 'MATRICULADO')
                ON CONFLICT (matricula_id, seccion_curso_id)
                DO NOTHING
                RETURNING id;
            """, (matricula_id, seccion_curso_id))

            insertado = cursor.fetchone()

            if insertado:
                cursor.execute("""
                    UPDATE secciones_curso
                    SET matriculados_actuales = matriculados_actuales + 1
                    WHERE id = %s
                      AND matriculados_actuales < capacidad;
                """, (seccion_curso_id,))

        # Recalcular créditos
        cursor.execute("""
            UPDATE matriculas
            SET total_creditos = (
                SELECT COALESCE(SUM(c.creditos), 0)
                FROM matricula_cursos mc
                INNER JOIN secciones_curso sc
                    ON sc.id = mc.seccion_curso_id
                INNER JOIN cursos c
                    ON c.id = sc.curso_id
                WHERE mc.matricula_id = %s
                  AND mc.estado = 'MATRICULADO'
            )
            WHERE id = %s;
        """, (matricula_id, matricula_id))

        conn.commit()

        return {
            "mensaje": "Matrícula registrada correctamente",
            "matricula_id": matricula_id
        }

    except HTTPException:
        if conn:
            conn.rollback()
        raise

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()