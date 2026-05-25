from math import ceil
from typing import Optional

from fastapi import HTTPException

from app.database import get_connection


MAX_LIMIT = 10


def obtener_estudiante(cursor, estudiante_id: int):
    cursor.execute(
        """
        SELECT
            e.id,
            e.codigo_estudiante,
            e.nombre_completo,
            e.ciclo,
            e.programa_id,
            p.nombre AS programa
        FROM estudiantes e
        INNER JOIN programas_academicos p ON p.id = e.programa_id
        WHERE e.id = %s
          AND e.activo = TRUE;
        """,
        (estudiante_id,),
    )

    estudiante = cursor.fetchone()

    if not estudiante:
        raise HTTPException(
            status_code=404,
            detail="El estudiante no existe o está inactivo.",
        )

    return dict(estudiante)


def obtener_estudiante_por_usuario(cursor, usuario_id: int):
    cursor.execute(
        """
        SELECT
            e.id,
            e.codigo_estudiante,
            e.nombre_completo,
            e.ciclo,
            e.programa_id,
            p.nombre AS programa
        FROM estudiantes e
        INNER JOIN usuarios u ON u.id = e.usuario_id
        INNER JOIN programas_academicos p ON p.id = e.programa_id
        WHERE e.usuario_id = %s
          AND e.activo = TRUE
          AND u.activo = TRUE
          AND u.rol = 'ESTUDIANTE';
        """,
        (usuario_id,),
    )

    estudiante = cursor.fetchone()

    if not estudiante:
        raise HTTPException(
            status_code=404,
            detail="No se encontró un estudiante activo asociado al usuario.",
        )

    return dict(estudiante)


def listar_semestres_matriculados(cursor, estudiante_id: int):
    cursor.execute(
        """
        SELECT DISTINCT
            sem.id,
            sem.codigo,
            sem.nombre,
            sem.estado,
            sem.fecha_inicio
        FROM matriculas m
        INNER JOIN semestres_academicos sem ON sem.id = m.semestre_id
        WHERE m.estudiante_id = %s
          AND m.estado <> 'ANULADA'
        ORDER BY sem.fecha_inicio DESC;
        """,
        (estudiante_id,),
    )

    return [dict(row) for row in cursor.fetchall()]


def obtener_semestre_seleccionado(
    cursor,
    estudiante_id: int,
    semestre_id: Optional[int] = None,
):
    if semestre_id:
        cursor.execute(
            """
            SELECT id, codigo, nombre, estado, fecha_inicio
            FROM semestres_academicos
            WHERE id = %s;
            """,
            (semestre_id,),
        )

        semestre = cursor.fetchone()

        if not semestre:
            raise HTTPException(
                status_code=404,
                detail="El semestre seleccionado no existe.",
            )

        return dict(semestre)

    cursor.execute(
        """
        SELECT
            sem.id,
            sem.codigo,
            sem.nombre,
            sem.estado,
            sem.fecha_inicio
        FROM matriculas m
        INNER JOIN semestres_academicos sem ON sem.id = m.semestre_id
        WHERE m.estudiante_id = %s
          AND m.estado <> 'ANULADA'
          AND sem.estado = 'ACTIVO'
        ORDER BY sem.fecha_inicio DESC
        LIMIT 1;
        """,
        (estudiante_id,),
    )

    semestre = cursor.fetchone()

    if semestre:
        return dict(semestre)

    cursor.execute(
        """
        SELECT
            sem.id,
            sem.codigo,
            sem.nombre,
            sem.estado,
            sem.fecha_inicio
        FROM matriculas m
        INNER JOIN semestres_academicos sem ON sem.id = m.semestre_id
        WHERE m.estudiante_id = %s
          AND m.estado <> 'ANULADA'
        ORDER BY sem.fecha_inicio DESC
        LIMIT 1;
        """,
        (estudiante_id,),
    )

    semestre = cursor.fetchone()

    if not semestre:
        return None

    return dict(semestre)


def obtener_resumen(cursor, estudiante_id: int, semestre_id: int):
    cursor.execute(
        """
        SELECT
            COUNT(DISTINCT s.id) AS total_cursos,
            COALESCE(SUM(c.creditos), 0) AS total_creditos
        FROM matriculas m
        INNER JOIN matricula_detalle md ON md.matricula_id = m.id
        INNER JOIN secciones s ON s.id = md.seccion_id
        INNER JOIN cursos c ON c.id = s.curso_id
        WHERE m.estudiante_id = %s
          AND m.semestre_id = %s
          AND m.estado <> 'ANULADA'
          AND md.estado = 'ACTIVO';
        """,
        (estudiante_id, semestre_id),
    )

    resumen = cursor.fetchone()

    return {
        "total_cursos": resumen["total_cursos"] or 0,
        "total_creditos": resumen["total_creditos"] or 0,
    }


def obtener_estado_matricula(cursor, estudiante_id: int, semestre_id: int):
    cursor.execute(
        """
        SELECT id, estado, fecha_matricula
        FROM matriculas
        WHERE estudiante_id = %s
          AND semestre_id = %s
          AND estado <> 'ANULADA'
        ORDER BY fecha_matricula DESC
        LIMIT 1;
        """,
        (estudiante_id, semestre_id),
    )

    matricula = cursor.fetchone()

    if not matricula:
        return None

    return dict(matricula)


def listar_mis_cursos(
    estudiante_id: int,
    page: int = 1,
    limit: int = 10,
    semestre_id: Optional[int] = None,
):
    page = max(page, 1)
    limit = min(max(limit, 1), MAX_LIMIT)
    offset = (page - 1) * limit

    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            estudiante = obtener_estudiante(cursor, estudiante_id)
            semestres = listar_semestres_matriculados(cursor, estudiante_id)
            semestre = obtener_semestre_seleccionado(
                cursor,
                estudiante_id,
                semestre_id,
            )

            if not semestre:
                return {
                    "estudiante": estudiante,
                    "semestres": semestres,
                    "semestre": None,
                    "matricula": None,
                    "items": [],
                    "resumen": {
                        "total_cursos": 0,
                        "total_creditos": 0,
                    },
                    "paginacion": {
                        "page": page,
                        "limit": limit,
                        "total": 0,
                        "total_pages": 1,
                        "has_next": False,
                        "has_prev": False,
                    },
                }

            matricula = obtener_estado_matricula(
                cursor,
                estudiante_id,
                semestre["id"],
            )

            resumen = obtener_resumen(
                cursor,
                estudiante_id,
                semestre["id"],
            )

            cursor.execute(
                """
                SELECT COUNT(DISTINCT s.id) AS total
                FROM matriculas m
                INNER JOIN matricula_detalle md ON md.matricula_id = m.id
                INNER JOIN secciones s ON s.id = md.seccion_id
                INNER JOIN cursos c ON c.id = s.curso_id
                WHERE m.estudiante_id = %s
                  AND m.semestre_id = %s
                  AND m.estado <> 'ANULADA'
                  AND md.estado = 'ACTIVO';
                """,
                (estudiante_id, semestre["id"]),
            )

            total = cursor.fetchone()["total"] or 0

            cursor.execute(
                """
                SELECT
                    s.id AS seccion_id,
                    s.nrc,
                    s.estado AS estado_seccion,

                    c.id AS curso_id,
                    c.codigo AS curso_codigo,
                    c.nombre AS curso,
                    c.creditos,
                    c.ciclo,

                    d.id AS docente_id,
                    d.nombre_completo AS docente,

                    a.id AS aula_id,
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
                    ba.hora_inicio::text AS hora_inicio,
                    ba.hora_fin::text AS hora_fin,
                    ba.turno,

                    m.id AS matricula_id,
                    m.estado AS estado_matricula,
                    md.estado AS estado_detalle
                FROM matriculas m
                INNER JOIN matricula_detalle md ON md.matricula_id = m.id
                INNER JOIN secciones s ON s.id = md.seccion_id
                INNER JOIN cursos c ON c.id = s.curso_id
                INNER JOIN docentes d ON d.id = s.docente_id
                INNER JOIN bloques_horario bh ON bh.seccion_id = s.id
                INNER JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
                INNER JOIN aulas a ON a.id = bh.aula_id
                WHERE m.estudiante_id = %s
                  AND m.semestre_id = %s
                  AND m.estado <> 'ANULADA'
                  AND md.estado = 'ACTIVO'
                ORDER BY c.ciclo ASC NULLS LAST, c.nombre ASC, s.nrc ASC
                LIMIT %s OFFSET %s;
                """,
                (
                    estudiante_id,
                    semestre["id"],
                    limit,
                    offset,
                ),
            )

            items = []

            for row in cursor.fetchall():
                hora_inicio = row["hora_inicio"][:5] if row["hora_inicio"] else ""
                hora_fin = row["hora_fin"][:5] if row["hora_fin"] else ""

                items.append(
                    {
                        "id": row["seccion_id"],
                        "seccion_id": row["seccion_id"],
                        "codigo": row["curso_codigo"],
                        "nombre": row["curso"],
                        "curso_id": row["curso_id"],
                        "nrc": row["nrc"],
                        "docente_id": row["docente_id"],
                        "docente": row["docente"],
                        "creditos": row["creditos"],
                        "ciclo": row["ciclo"],
                        "aula_id": row["aula_id"],
                        "aula": row["aula"],
                        "dia_semana": row["dia_semana"],
                        "dia_nombre": row["dia_nombre"],
                        "bloque_academico_id": row["bloque_academico_id"],
                        "bloque": row["bloque"],
                        "hora_inicio": row["hora_inicio"],
                        "hora_fin": row["hora_fin"],
                        "turno": row["turno"],
                        "horario": f"{row['dia_nombre']} {hora_inicio} - {hora_fin}",
                        "estado": "Matriculado",
                        "estado_matricula": row["estado_matricula"],
                        "estado_seccion": row["estado_seccion"],
                    }
                )

            total_pages = max(1, ceil(total / limit)) if total else 1

            return {
                "estudiante": estudiante,
                "semestres": semestres,
                "semestre": semestre,
                "matricula": matricula,
                "items": items,
                "resumen": resumen,
                "paginacion": {
                    "page": page,
                    "limit": limit,
                    "total": total,
                    "total_pages": total_pages,
                    "has_next": page < total_pages,
                    "has_prev": page > 1,
                },
            }

    finally:
        conn.close()


def listar_mis_cursos_por_usuario(
    usuario_id: int,
    page: int = 1,
    limit: int = 10,
    semestre_id: Optional[int] = None,
):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            estudiante = obtener_estudiante_por_usuario(cursor, usuario_id)

        return listar_mis_cursos(
            estudiante_id=estudiante["id"],
            page=page,
            limit=limit,
            semestre_id=semestre_id,
        )

    finally:
        conn.close()