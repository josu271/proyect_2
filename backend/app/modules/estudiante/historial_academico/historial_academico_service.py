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


def listar_semestres_historial(cursor, estudiante_id: int):
    cursor.execute(
        """
        SELECT DISTINCT
            sem.id,
            sem.codigo,
            sem.nombre
        FROM historial_academico ha
        INNER JOIN semestres_academicos sem ON sem.id = ha.semestre_id
        WHERE ha.estudiante_id = %s
        ORDER BY sem.codigo DESC;
        """,
        (estudiante_id,),
    )

    return [dict(row) for row in cursor.fetchall()]


def obtener_resumen(cursor, estudiante_id: int):
    cursor.execute(
        """
        SELECT
            COUNT(*) AS total_cursos,
            COUNT(*) FILTER (
                WHERE estado IN ('APROBADO', 'CONVALIDADO')
            ) AS cursos_aprobados,
            COALESCE(SUM(c.creditos) FILTER (
                WHERE ha.estado IN ('APROBADO', 'CONVALIDADO')
            ), 0) AS creditos_aprobados,
            ROUND(AVG(ha.nota) FILTER (
                WHERE ha.nota IS NOT NULL
            ), 2) AS promedio_general
        FROM historial_academico ha
        INNER JOIN cursos c ON c.id = ha.curso_id
        WHERE ha.estudiante_id = %s;
        """,
        (estudiante_id,),
    )

    resumen = cursor.fetchone()

    if not resumen:
        return {
            "total_cursos": 0,
            "cursos_aprobados": 0,
            "creditos_aprobados": 0,
            "promedio_general": 0,
        }

    return {
        "total_cursos": resumen["total_cursos"] or 0,
        "cursos_aprobados": resumen["cursos_aprobados"] or 0,
        "creditos_aprobados": resumen["creditos_aprobados"] or 0,
        "promedio_general": float(resumen["promedio_general"] or 0),
    }


def listar_historial(
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
            semestres = listar_semestres_historial(cursor, estudiante_id)
            resumen = obtener_resumen(cursor, estudiante_id)

            cursor.execute(
                """
                SELECT COUNT(*) AS total
                FROM historial_academico ha
                INNER JOIN cursos c ON c.id = ha.curso_id
                LEFT JOIN semestres_academicos sem ON sem.id = ha.semestre_id
                WHERE ha.estudiante_id = %s
                  AND (
                    %s IS NULL
                    OR ha.semestre_id = %s
                  );
                """,
                (estudiante_id, semestre_id, semestre_id),
            )

            total = cursor.fetchone()["total"] or 0

            cursor.execute(
                """
                SELECT
                    ha.id,
                    ha.estudiante_id,
                    ha.curso_id,
                    c.codigo AS curso_codigo,
                    c.nombre AS curso,
                    c.creditos,
                    c.ciclo,
                    ha.semestre_id,
                    COALESCE(sem.codigo, 'Sin semestre') AS semestre,
                    COALESCE(sem.nombre, 'Sin semestre') AS semestre_nombre,
                    ha.nota,
                    ha.estado,
                    ha.fecha_registro
                FROM historial_academico ha
                INNER JOIN cursos c ON c.id = ha.curso_id
                LEFT JOIN semestres_academicos sem ON sem.id = ha.semestre_id
                WHERE ha.estudiante_id = %s
                  AND (
                    %s IS NULL
                    OR ha.semestre_id = %s
                  )
                ORDER BY
                    sem.fecha_inicio DESC NULLS LAST,
                    c.ciclo ASC NULLS LAST,
                    c.nombre ASC
                LIMIT %s OFFSET %s;
                """,
                (
                    estudiante_id,
                    semestre_id,
                    semestre_id,
                    limit,
                    offset,
                ),
            )

            items = []

            for row in cursor.fetchall():
                items.append(
                    {
                        "id": row["id"],
                        "estudiante_id": row["estudiante_id"],
                        "curso_id": row["curso_id"],
                        "curso_codigo": row["curso_codigo"],
                        "curso": row["curso"],
                        "creditos": row["creditos"],
                        "ciclo": row["ciclo"],
                        "semestre_id": row["semestre_id"],
                        "semestre": row["semestre"],
                        "semestre_nombre": row["semestre_nombre"],
                        "nota": float(row["nota"]) if row["nota"] is not None else None,
                        "estado": row["estado"],
                    }
                )

            total_pages = max(1, ceil(total / limit)) if total else 1

            return {
                "estudiante": estudiante,
                "resumen": resumen,
                "semestres": semestres,
                "items": items,
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


def listar_historial_por_usuario(
    usuario_id: int,
    page: int = 1,
    limit: int = 10,
    semestre_id: Optional[int] = None,
):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            estudiante = obtener_estudiante_por_usuario(cursor, usuario_id)

        return listar_historial(
            estudiante_id=estudiante["id"],
            page=page,
            limit=limit,
            semestre_id=semestre_id,
        )

    finally:
        conn.close()