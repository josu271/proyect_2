import math
import psycopg2
from fastapi import HTTPException

from app.database import get_connection

MAX_LIMIT = 10
MAX_CREDITOS = 22


def _obtener_semestre_activo(cursor):
    cursor.execute(
        """
        SELECT id, codigo, nombre
        FROM semestres_academicos
        WHERE estado = 'ACTIVO'
        ORDER BY fecha_inicio DESC
        LIMIT 1
        """
    )

    semestre = cursor.fetchone()

    if not semestre:
        raise HTTPException(
            status_code=404,
            detail="No existe un semestre académico activo."
        )

    return semestre


def _verificar_estudiante(cursor, estudiante_id: int):
    cursor.execute(
        """
        SELECT
            id,
            programa_id,
            codigo_estudiante,
            nombre_completo,
            ciclo
        FROM estudiantes
        WHERE id = %s
          AND activo = TRUE
        """,
        (estudiante_id,)
    )

    estudiante = cursor.fetchone()

    if not estudiante:
        raise HTTPException(
            status_code=404,
            detail="El estudiante no existe o está inactivo."
        )

    return estudiante


def _obtener_matricula_actual(cursor, estudiante_id: int, semestre_id: int):
    cursor.execute(
        """
        SELECT id, estado
        FROM matriculas
        WHERE estudiante_id = %s
          AND semestre_id = %s
        """,
        (estudiante_id, semestre_id)
    )

    return cursor.fetchone()


def _obtener_secciones_seleccionadas(cursor, estudiante_id: int, semestre_id: int):
    cursor.execute(
        """
        SELECT
            s.id AS seccion_id,
            s.nrc,
            c.id AS curso_id,
            c.codigo AS curso_codigo,
            c.nombre AS curso,
            c.creditos,
            c.ciclo,
            d.nombre_completo AS docente,
            a.codigo AS aula,
            bh.dia_semana,
            CASE bh.dia_semana
                WHEN 1 THEN 'Lunes'
                WHEN 2 THEN 'Martes'
                WHEN 3 THEN 'Miércoles'
                WHEN 4 THEN 'Jueves'
                WHEN 5 THEN 'Viernes'
                WHEN 6 THEN 'Sábado'
            END AS dia_nombre,
            ba.id AS bloque_academico_id,
            ba.nombre AS bloque,
            ba.hora_inicio,
            ba.hora_fin,
            ba.turno,
            s.cupo_max,
            COALESCE(v.cupos_disponibles, 0) AS cupos_disponibles
        FROM matriculas m
        INNER JOIN matricula_detalle md ON md.matricula_id = m.id
        INNER JOIN secciones s ON s.id = md.seccion_id
        INNER JOIN cursos c ON c.id = s.curso_id
        INNER JOIN docentes d ON d.id = s.docente_id
        INNER JOIN bloques_horario bh ON bh.seccion_id = s.id
        INNER JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
        INNER JOIN aulas a ON a.id = bh.aula_id
        LEFT JOIN vw_secciones_publicadas v ON v.seccion_id = s.id
        WHERE m.estudiante_id = %s
          AND m.semestre_id = %s
          AND m.estado <> 'ANULADA'
          AND md.estado = 'ACTIVO'
        ORDER BY bh.dia_semana, ba.hora_inicio
        """,
        (estudiante_id, semestre_id)
    )

    filas = cursor.fetchall()

    secciones = []
    total_creditos = 0

    for row in filas:
        total_creditos += row["creditos"]

        secciones.append({
            "id": row["seccion_id"],
            "nrc": row["nrc"],
            "cursoId": row["curso_id"],
            "codigoCurso": row["curso_codigo"],
            "nombreCurso": row["curso"],
            "creditos": row["creditos"],
            "ciclo": row["ciclo"],
            "docente": row["docente"],
            "aula": row["aula"],
            "diaId": row["dia_semana"],
            "diaNombre": row["dia_nombre"],
            "bloqueId": row["bloque_academico_id"],
            "bloque": row["bloque"],
            "horaInicio": str(row["hora_inicio"]),
            "horaFin": str(row["hora_fin"]),
            "turno": row["turno"],
            "cuposDisponibles": row["cupos_disponibles"],
        })

    return {
        "ids": [s["id"] for s in secciones],
        "detalle": secciones,
        "total_creditos": total_creditos
    }


def _filtro_cursos_permitidos_sql():
    """
    Reglas:
    - No mostrar cursos ya aprobados o convalidados.
    - Permitir cursos de ciclos anteriores, ciclo actual y ciclo siguiente.
    - No permitir cursos mayores a ciclo actual + 1.
    - Validar prerrequisitos aprobados o convalidados.
    """
    return """
        AND (
            c.ciclo IS NULL
            OR c.ciclo <= COALESCE(%s, 1) + 1
        )
        AND NOT EXISTS (
            SELECT 1
            FROM historial_academico ha_aprobado
            WHERE ha_aprobado.estudiante_id = %s
              AND ha_aprobado.curso_id = c.id
              AND ha_aprobado.estado IN ('APROBADO', 'CONVALIDADO')
        )
        AND NOT EXISTS (
            SELECT 1
            FROM curso_prerequisitos cp
            WHERE cp.curso_id = c.id
              AND NOT EXISTS (
                  SELECT 1
                  FROM historial_academico ha_pr
                  WHERE ha_pr.estudiante_id = %s
                    AND ha_pr.curso_id = cp.prerequisito_curso_id
                    AND ha_pr.estado IN ('APROBADO', 'CONVALIDADO')
              )
        )
    """


def listar_cursos_disponibles(estudiante_id: int, page: int = 1, limit: int = 10):
    page = max(page, 1)
    limit = min(max(limit, 1), MAX_LIMIT)
    offset = (page - 1) * limit

    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            estudiante = _verificar_estudiante(cursor, estudiante_id)
            semestre = _obtener_semestre_activo(cursor)

            ciclo_estudiante = estudiante["ciclo"] or 1

            matricula = _obtener_matricula_actual(
                cursor,
                estudiante_id,
                semestre["id"]
            )

            seleccionadas = _obtener_secciones_seleccionadas(
                cursor,
                estudiante_id,
                semestre["id"]
            )

            filtro_cursos = _filtro_cursos_permitidos_sql()

            cursor.execute(
                f"""
                SELECT COUNT(DISTINCT c.id) AS total
                FROM vw_secciones_publicadas v
                INNER JOIN cursos c ON c.id = v.curso_id
                WHERE v.semestre_id = %s
                  AND c.programa_id = %s
                  {filtro_cursos}
                """,
                (
                    semestre["id"],
                    estudiante["programa_id"],
                    ciclo_estudiante,
                    estudiante_id,
                    estudiante_id,
                )
            )

            total = cursor.fetchone()["total"] or 0

            cursor.execute(
                f"""
                SELECT DISTINCT
                    c.id,
                    c.codigo,
                    c.ciclo,
                    c.nombre,
                    c.creditos
                FROM vw_secciones_publicadas v
                INNER JOIN cursos c ON c.id = v.curso_id
                WHERE v.semestre_id = %s
                  AND c.programa_id = %s
                  {filtro_cursos}
                ORDER BY c.ciclo, c.nombre
                LIMIT %s OFFSET %s
                """,
                (
                    semestre["id"],
                    estudiante["programa_id"],
                    ciclo_estudiante,
                    estudiante_id,
                    estudiante_id,
                    limit,
                    offset,
                )
            )

            cursos_pagina = cursor.fetchall()
            cursos_ids = [curso["id"] for curso in cursos_pagina]

            if not cursos_ids:
                return {
                    "estudiante": estudiante,
                    "semestre": semestre,
                    "estado_matricula": matricula["estado"] if matricula else "SIN_MATRICULA",
                    "cursos": [],
                    "secciones_seleccionadas": seleccionadas["ids"],
                    "secciones_seleccionadas_detalle": seleccionadas["detalle"],
                    "total_creditos": seleccionadas["total_creditos"],
                    "reglas_matricula": {
                        "ciclo_estudiante": ciclo_estudiante,
                        "ciclo_maximo_permitido": ciclo_estudiante + 1,
                        "max_creditos": MAX_CREDITOS,
                    },
                    "paginacion": {
                        "page": page,
                        "limit": limit,
                        "total": total,
                        "total_pages": math.ceil(total / limit) if total else 0,
                        "has_next": False,
                        "has_prev": page > 1
                    }
                }

            cursor.execute(
                """
                SELECT
                    v.seccion_id,
                    v.nrc,
                    v.semestre_id,
                    v.semestre,
                    v.curso_id,
                    v.curso_codigo,
                    v.curso,
                    c.ciclo,
                    v.creditos,
                    v.docente_id,
                    v.docente,
                    v.aula,
                    v.dia_semana,
                    v.dia_nombre,
                    v.bloque_academico_id,
                    v.bloque,
                    v.hora_inicio,
                    v.hora_fin,
                    v.turno,
                    v.cupo_max,
                    v.cupos_ocupados,
                    v.cupos_disponibles
                FROM vw_secciones_publicadas v
                INNER JOIN cursos c ON c.id = v.curso_id
                WHERE v.semestre_id = %s
                  AND c.programa_id = %s
                  AND v.curso_id = ANY(%s)
                ORDER BY c.ciclo, c.nombre, v.nrc
                """,
                (
                    semestre["id"],
                    estudiante["programa_id"],
                    cursos_ids
                )
            )

            filas = cursor.fetchall()

            cursos = {}

            for row in filas:
                curso_id = row["curso_id"]

                if curso_id not in cursos:
                    cursos[curso_id] = {
                        "id": curso_id,
                        "codigo": row["curso_codigo"],
                        "nombre": row["curso"],
                        "creditos": row["creditos"],
                        "ciclo": row["ciclo"],
                        "estado": "Disponible",
                        "secciones": []
                    }

                cursos[curso_id]["secciones"].append({
                    "id": row["seccion_id"],
                    "nrc": row["nrc"],
                    "docente": row["docente"],
                    "aula": row["aula"],
                    "diaId": row["dia_semana"],
                    "diaNombre": row["dia_nombre"],
                    "bloqueId": row["bloque_academico_id"],
                    "bloque": row["bloque"],
                    "horaInicio": str(row["hora_inicio"]),
                    "horaFin": str(row["hora_fin"]),
                    "turno": row["turno"],
                    "cuposDisponibles": row["cupos_disponibles"],
                    "cupoMax": row["cupo_max"],
                    "seleccionada": row["seccion_id"] in seleccionadas["ids"]
                })

            total_pages = math.ceil(total / limit) if total else 0

            return {
                "estudiante": estudiante,
                "semestre": semestre,
                "estado_matricula": matricula["estado"] if matricula else "SIN_MATRICULA",
                "cursos": list(cursos.values()),
                "secciones_seleccionadas": seleccionadas["ids"],
                "secciones_seleccionadas_detalle": seleccionadas["detalle"],
                "total_creditos": seleccionadas["total_creditos"],
                "reglas_matricula": {
                    "ciclo_estudiante": ciclo_estudiante,
                    "ciclo_maximo_permitido": ciclo_estudiante + 1,
                    "max_creditos": MAX_CREDITOS,
                },
                "paginacion": {
                    "page": page,
                    "limit": limit,
                    "total": total,
                    "total_pages": total_pages,
                    "has_next": page < total_pages,
                    "has_prev": page > 1
                }
            }

    finally:
        conn.close()


def _validar_secciones_para_matricula(
    cursor,
    estudiante,
    semestre,
    secciones_ids: list[int]
):
    estudiante_id = estudiante["id"]
    programa_id = estudiante["programa_id"]
    ciclo_estudiante = estudiante["ciclo"] or 1
    ciclo_maximo = ciclo_estudiante + 1

    cursor.execute(
        """
        SELECT
            s.id AS seccion_id,
            s.nrc,
            s.semestre_id,
            s.estado AS estado_seccion,
            c.id AS curso_id,
            c.codigo AS curso_codigo,
            c.nombre AS curso,
            c.programa_id,
            c.creditos,
            c.ciclo,
            EXISTS (
                SELECT 1
                FROM bloques_horario bh
                WHERE bh.seccion_id = s.id
            ) AS tiene_horario
        FROM secciones s
        INNER JOIN cursos c ON c.id = s.curso_id
        WHERE s.id = ANY(%s)
        """,
        (secciones_ids,)
    )

    secciones = cursor.fetchall()

    if len(secciones) != len(secciones_ids):
        raise HTTPException(
            status_code=400,
            detail="Una o más secciones seleccionadas no existen."
        )

    cursos_ids = [row["curso_id"] for row in secciones]

    if len(cursos_ids) != len(set(cursos_ids)):
        raise HTTPException(
            status_code=400,
            detail="No puede seleccionar dos secciones del mismo curso."
        )

    total_creditos = 0

    for row in secciones:
        total_creditos += row["creditos"]

        if row["semestre_id"] != semestre["id"]:
            raise HTTPException(
                status_code=400,
                detail=f"La sección {row['nrc']} no pertenece al semestre activo."
            )

        if row["programa_id"] != programa_id:
            raise HTTPException(
                status_code=400,
                detail=f"El curso {row['curso']} no pertenece al programa académico del estudiante."
            )

        if row["estado_seccion"] != "PUBLICADA":
            raise HTTPException(
                status_code=400,
                detail=f"La sección {row['nrc']} no está publicada."
            )

        if not row["tiene_horario"]:
            raise HTTPException(
                status_code=400,
                detail=f"La sección {row['nrc']} no tiene horario asignado."
            )

        if row["ciclo"] is not None and row["ciclo"] > ciclo_maximo:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"No puede llevar {row['curso']} porque pertenece al ciclo "
                    f"{row['ciclo']}. El estudiante está en ciclo {ciclo_estudiante} "
                    f"y solo puede llevar hasta ciclo {ciclo_maximo}."
                )
            )

        cursor.execute(
            """
            SELECT 1
            FROM historial_academico
            WHERE estudiante_id = %s
              AND curso_id = %s
              AND estado IN ('APROBADO', 'CONVALIDADO')
            LIMIT 1
            """,
            (estudiante_id, row["curso_id"])
        )

        if cursor.fetchone():
            raise HTTPException(
                status_code=400,
                detail=f"El estudiante ya aprobó o convalidó el curso {row['curso']}."
            )

        cursor.execute(
            """
            SELECT
                cp.prerequisito_curso_id,
                c_pre.nombre AS prerequisito
            FROM curso_prerequisitos cp
            INNER JOIN cursos c_pre ON c_pre.id = cp.prerequisito_curso_id
            WHERE cp.curso_id = %s
              AND NOT EXISTS (
                  SELECT 1
                  FROM historial_academico ha
                  WHERE ha.estudiante_id = %s
                    AND ha.curso_id = cp.prerequisito_curso_id
                    AND ha.estado IN ('APROBADO', 'CONVALIDADO')
              )
            """,
            (row["curso_id"], estudiante_id)
        )

        prerequisitos_faltantes = cursor.fetchall()

        if prerequisitos_faltantes:
            nombres = ", ".join(
                item["prerequisito"] for item in prerequisitos_faltantes
            )

            raise HTTPException(
                status_code=400,
                detail=f"No cumple prerrequisito para {row['curso']}: falta aprobar {nombres}."
            )

    if total_creditos > MAX_CREDITOS:
        raise HTTPException(
            status_code=400,
            detail=f"No se puede confirmar. Se supera el límite máximo de {MAX_CREDITOS} créditos."
        )


def confirmar_matricula(estudiante_id: int, secciones_ids: list[int]):
    if not secciones_ids:
        raise HTTPException(
            status_code=400,
            detail="Debe seleccionar al menos una sección para confirmar la matrícula."
        )

    secciones_ids = list(dict.fromkeys(secciones_ids))

    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            estudiante = _verificar_estudiante(cursor, estudiante_id)
            semestre = _obtener_semestre_activo(cursor)

            _validar_secciones_para_matricula(
                cursor=cursor,
                estudiante=estudiante,
                semestre=semestre,
                secciones_ids=secciones_ids
            )

            cursor.execute(
                """
                INSERT INTO matriculas (estudiante_id, semestre_id, estado)
                VALUES (%s, %s, 'BORRADOR')
                ON CONFLICT (estudiante_id, semestre_id)
                DO UPDATE SET estado = 'BORRADOR'
                RETURNING id
                """,
                (estudiante_id, semestre["id"])
            )

            matricula_id = cursor.fetchone()["id"]

            cursor.execute(
                """
                UPDATE matricula_detalle
                SET estado = 'RETIRADO'
                WHERE matricula_id = %s
                  AND estado = 'ACTIVO'
                """,
                (matricula_id,)
            )

            for seccion_id in secciones_ids:
                cursor.execute(
                    """
                    INSERT INTO matricula_detalle (
                        matricula_id,
                        seccion_id,
                        estado
                    )
                    VALUES (%s, %s, 'ACTIVO')
                    ON CONFLICT (matricula_id, seccion_id)
                    DO UPDATE SET
                        estado = 'ACTIVO',
                        fecha_registro = CURRENT_TIMESTAMP
                    """,
                    (matricula_id, seccion_id)
                )

            cursor.execute(
                """
                UPDATE matriculas
                SET estado = 'CONFIRMADA'
                WHERE id = %s
                """,
                (matricula_id,)
            )

        conn.commit()

        return {
            "mensaje": "Matrícula confirmada correctamente.",
            "matricula_id": matricula_id
        }

    except psycopg2.Error as error:
        conn.rollback()

        mensaje = error.diag.message_primary if error.diag else str(error)

        raise HTTPException(
            status_code=400,
            detail=mensaje
        )

    except HTTPException:
        conn.rollback()
        raise

    finally:
        conn.close()