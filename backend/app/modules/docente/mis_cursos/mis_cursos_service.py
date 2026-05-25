from math import ceil
from fastapi import HTTPException

from app.database import get_connection


def _obtener_semestre(cur, docente_id: int, semestre_id: int | None):
    if semestre_id:
        cur.execute(
            """
            SELECT id, codigo, nombre, estado
            FROM semestres_academicos
            WHERE id = %s
            """,
            (semestre_id,),
        )
    else:
        cur.execute(
            """
            SELECT
                sem.id,
                sem.codigo,
                sem.nombre,
                sem.estado
            FROM semestres_academicos sem
            WHERE EXISTS (
                SELECT 1
                FROM docente_curso_asignado dca
                WHERE dca.semestre_id = sem.id
                  AND dca.docente_id = %s
                  AND dca.estado = 'ASIGNADO'
            )
            ORDER BY
                CASE
                    WHEN sem.estado = 'ACTIVO' THEN 1
                    WHEN sem.estado = 'PLANIFICACION' THEN 2
                    ELSE 3
                END,
                sem.id DESC
            LIMIT 1
            """,
            (docente_id,),
        )

    semestre = cur.fetchone()

    if not semestre:
        raise HTTPException(
            status_code=404,
            detail="No se encontró un semestre con cursos asignados para este docente.",
        )

    return semestre


def listar_mis_cursos_docente(
    docente_id: int,
    semestre_id: int | None = None,
    page: int = 1,
    limit: int = 10,
):
    if page < 1:
        page = 1

    if limit < 1:
        limit = 10

    if limit > 10:
        limit = 10

    offset = (page - 1) * limit

    conn = get_connection()

    try:
        with conn.cursor() as cur:
            semestre = _obtener_semestre(cur, docente_id, semestre_id)

            cur.execute(
                """
                SELECT DISTINCT
                    sem.id,
                    sem.codigo,
                    sem.nombre,
                    sem.estado
                FROM semestres_academicos sem
                INNER JOIN docente_curso_asignado dca ON dca.semestre_id = sem.id
                WHERE dca.docente_id = %s
                  AND dca.estado = 'ASIGNADO'
                ORDER BY sem.id DESC
                """,
                (docente_id,),
            )
            semestres = cur.fetchall()

            cur.execute(
                """
                SELECT COUNT(*) AS total
                FROM vw_cursos_asignados_docente v
                LEFT JOIN secciones s ON s.docente_id = v.docente_id
                    AND s.curso_id = v.curso_id
                    AND s.semestre_id = v.semestre_id
                    AND s.estado <> 'CANCELADA'
                WHERE v.docente_id = %s
                  AND v.semestre_id = %s
                """,
                (docente_id, semestre["id"]),
            )
            total = cur.fetchone()["total"]

            cur.execute(
                """
                SELECT
                    v.asignacion_id,
                    v.docente_id,
                    v.curso_id,
                    v.curso_codigo AS codigo,
                    v.curso AS nombre,
                    v.creditos,
                    v.semestre_id,
                    v.semestre,
                    v.estado AS estado_asignacion,
                    v.fecha_asignacion,
                    s.id AS seccion_id,
                    s.nrc,
                    s.estado AS estado_seccion
                FROM vw_cursos_asignados_docente v
                LEFT JOIN secciones s ON s.docente_id = v.docente_id
                    AND s.curso_id = v.curso_id
                    AND s.semestre_id = v.semestre_id
                    AND s.estado <> 'CANCELADA'
                WHERE v.docente_id = %s
                  AND v.semestre_id = %s
                ORDER BY v.curso_codigo ASC, s.nrc ASC NULLS LAST
                LIMIT %s OFFSET %s
                """,
                (docente_id, semestre["id"], limit, offset),
            )
            cursos = cur.fetchall()

            total_pages = ceil(total / limit) if total > 0 else 1

            return {
                "semestre": semestre,
                "semestres": semestres,
                "cursos": cursos,
                "pagination": {
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