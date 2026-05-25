from math import ceil

import psycopg2
from fastapi import HTTPException

from app.database import get_connection


MAX_SUGERENCIAS = 6


def listar_programas(search: str = "", limit: int = 6):
    """
    Búsqueda optimizada para combo/autocomplete de programas.
    No precarga todos los programas. Devuelve máximo 6 resultados.
    """
    search_text = search.strip()
    search_like = f"%{search_text}%"
    limit = min(max(limit, 1), MAX_SUGERENCIAS)

    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    codigo,
                    nombre,
                    activo
                FROM programas_academicos
                WHERE activo = TRUE
                  AND (
                    %s = ''
                    OR codigo ILIKE %s
                    OR nombre ILIKE %s
                  )
                ORDER BY nombre ASC
                LIMIT %s;
                """,
                (
                    search_text,
                    search_like,
                    search_like,
                    limit,
                ),
            )

            return [dict(row) for row in cursor.fetchall()]

    finally:
        conn.close()


def listar_cursos_prerequisitos(
    search: str = "",
    exclude_id: int | None = None,
    limit: int = 6,
):
    """
    Búsqueda optimizada para seleccionar prerrequisitos.
    No precarga todos los cursos. Devuelve máximo 6 resultados.
    exclude_id evita que el curso editado se seleccione como prerrequisito.
    """
    search_text = search.strip()
    search_like = f"%{search_text}%"
    limit = min(max(limit, 1), MAX_SUGERENCIAS)

    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    codigo,
                    nombre,
                    ciclo,
                    creditos
                FROM cursos
                WHERE activo = TRUE
                  AND (
                    %s = ''
                    OR codigo ILIKE %s
                    OR nombre ILIKE %s
                  )
                  AND (
                    %s IS NULL
                    OR id <> %s
                  )
                ORDER BY ciclo ASC NULLS LAST, nombre ASC
                LIMIT %s;
                """,
                (
                    search_text,
                    search_like,
                    search_like,
                    exclude_id,
                    exclude_id,
                    limit,
                ),
            )

            return [dict(row) for row in cursor.fetchall()]

    finally:
        conn.close()


def obtener_prerequisitos_curso(cursor, curso_id: int):
    cursor.execute(
        """
        SELECT
            cp.prerequisito_curso_id AS id,
            c.codigo,
            c.nombre,
            c.ciclo,
            c.creditos
        FROM curso_prerequisitos cp
        INNER JOIN cursos c ON c.id = cp.prerequisito_curso_id
        WHERE cp.curso_id = %s
        ORDER BY c.ciclo ASC NULLS LAST, c.nombre ASC;
        """,
        (curso_id,),
    )

    return [dict(row) for row in cursor.fetchall()]


def validar_programa(programa_id: int, cursor):
    cursor.execute(
        """
        SELECT id
        FROM programas_academicos
        WHERE id = %s
          AND activo = TRUE;
        """,
        (programa_id,),
    )

    if not cursor.fetchone():
        raise HTTPException(
            status_code=400,
            detail="El programa académico no existe o está inactivo.",
        )


def validar_prerequisitos(
    cursor,
    curso_id: int | None,
    prerequisitos_ids: list[int],
):
    prerequisitos_ids = list(dict.fromkeys(prerequisitos_ids or []))

    if not prerequisitos_ids:
        return []

    if curso_id and curso_id in prerequisitos_ids:
        raise HTTPException(
            status_code=400,
            detail="Un curso no puede ser prerrequisito de sí mismo.",
        )

    cursor.execute(
        """
        SELECT id
        FROM cursos
        WHERE id = ANY(%s)
          AND activo = TRUE;
        """,
        (prerequisitos_ids,),
    )

    encontrados = [row["id"] for row in cursor.fetchall()]
    faltantes = set(prerequisitos_ids) - set(encontrados)

    if faltantes:
        raise HTTPException(
            status_code=400,
            detail="Uno o más prerrequisitos no existen o están inactivos.",
        )

    if curso_id:
        cursor.execute(
            """
            WITH RECURSIVE cadena_prerequisitos(id) AS (
                SELECT cp.prerequisito_curso_id
                FROM curso_prerequisitos cp
                WHERE cp.curso_id = ANY(%s)

                UNION

                SELECT cp.prerequisito_curso_id
                FROM curso_prerequisitos cp
                INNER JOIN cadena_prerequisitos c ON c.id = cp.curso_id
            )
            SELECT 1
            FROM cadena_prerequisitos
            WHERE id = %s
            LIMIT 1;
            """,
            (
                prerequisitos_ids,
                curso_id,
            ),
        )

        if cursor.fetchone():
            raise HTTPException(
                status_code=400,
                detail=(
                    "No se puede guardar porque generaría un prerrequisito "
                    "circular entre cursos."
                ),
            )

    return prerequisitos_ids


def guardar_prerequisitos(
    cursor,
    curso_id: int,
    prerequisitos_ids: list[int],
):
    prerequisitos_ids = validar_prerequisitos(
        cursor=cursor,
        curso_id=curso_id,
        prerequisitos_ids=prerequisitos_ids,
    )

    cursor.execute(
        """
        DELETE FROM curso_prerequisitos
        WHERE curso_id = %s;
        """,
        (curso_id,),
    )

    for prerequisito_id in prerequisitos_ids:
        cursor.execute(
            """
            INSERT INTO curso_prerequisitos (
                curso_id,
                prerequisito_curso_id
            )
            VALUES (%s, %s)
            ON CONFLICT (curso_id, prerequisito_curso_id) DO NOTHING;
            """,
            (
                curso_id,
                prerequisito_id,
            ),
        )


def listar_cursos(page: int = 1, limit: int = 10, search: str = ""):
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
                FROM cursos c
                INNER JOIN programas_academicos p ON p.id = c.programa_id
                WHERE (
                    %s = ''
                    OR c.codigo ILIKE %s
                    OR c.nombre ILIKE %s
                    OR p.nombre ILIKE %s
                );
                """,
                (
                    search_text,
                    search_like,
                    search_like,
                    search_like,
                ),
            )

            total = cursor.fetchone()["total"]

            cursor.execute(
                """
                SELECT
                    c.id,
                    c.programa_id,
                    p.nombre AS programa,
                    c.codigo,
                    c.nombre,
                    c.creditos,
                    c.ciclo,
                    c.tipo_aula_requerida,
                    c.activo
                FROM cursos c
                INNER JOIN programas_academicos p ON p.id = c.programa_id
                WHERE (
                    %s = ''
                    OR c.codigo ILIKE %s
                    OR c.nombre ILIKE %s
                    OR p.nombre ILIKE %s
                )
                ORDER BY c.id DESC
                LIMIT %s OFFSET %s;
                """,
                (
                    search_text,
                    search_like,
                    search_like,
                    search_like,
                    limit,
                    offset,
                ),
            )

            cursos = [dict(row) for row in cursor.fetchall()]

            for curso in cursos:
                curso["prerequisitos"] = obtener_prerequisitos_curso(
                    cursor,
                    curso["id"],
                )
                curso["prerequisitos_ids"] = [
                    item["id"] for item in curso["prerequisitos"]
                ]

            return {
                "items": cursos,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": max(1, ceil(total / limit)) if total else 1,
            }

    finally:
        conn.close()


def obtener_curso(curso_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    c.id,
                    c.programa_id,
                    p.nombre AS programa,
                    c.codigo,
                    c.nombre,
                    c.creditos,
                    c.ciclo,
                    c.tipo_aula_requerida,
                    c.activo
                FROM cursos c
                INNER JOIN programas_academicos p ON p.id = c.programa_id
                WHERE c.id = %s;
                """,
                (curso_id,),
            )

            curso = cursor.fetchone()

            if not curso:
                raise HTTPException(
                    status_code=404,
                    detail="Curso no encontrado.",
                )

            curso = dict(curso)
            curso["prerequisitos"] = obtener_prerequisitos_curso(
                cursor,
                curso_id,
            )
            curso["prerequisitos_ids"] = [
                item["id"] for item in curso["prerequisitos"]
            ]

            return curso

    finally:
        conn.close()


def crear_curso(curso):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            validar_programa(curso.programa_id, cursor)

            cursor.execute(
                """
                INSERT INTO cursos (
                    programa_id,
                    codigo,
                    nombre,
                    creditos,
                    ciclo,
                    tipo_aula_requerida,
                    activo
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    curso.programa_id,
                    curso.codigo.strip().upper(),
                    curso.nombre.strip(),
                    curso.creditos,
                    curso.ciclo,
                    curso.tipo_aula_requerida.value,
                    curso.activo,
                ),
            )

            nuevo_id = cursor.fetchone()["id"]

            guardar_prerequisitos(
                cursor=cursor,
                curso_id=nuevo_id,
                prerequisitos_ids=curso.prerequisitos_ids,
            )

            conn.commit()

            return obtener_curso(nuevo_id)

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail="Ya existe un curso con ese código o un prerrequisito duplicado.",
        )

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al crear curso: {str(error)}",
        )

    finally:
        conn.close()


def actualizar_curso(curso_id: int, curso):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            validar_programa(curso.programa_id, cursor)

            cursor.execute(
                """
                UPDATE cursos
                SET
                    programa_id = %s,
                    codigo = %s,
                    nombre = %s,
                    creditos = %s,
                    ciclo = %s,
                    tipo_aula_requerida = %s,
                    activo = %s
                WHERE id = %s
                RETURNING id;
                """,
                (
                    curso.programa_id,
                    curso.codigo.strip().upper(),
                    curso.nombre.strip(),
                    curso.creditos,
                    curso.ciclo,
                    curso.tipo_aula_requerida.value,
                    curso.activo,
                    curso_id,
                ),
            )

            actualizado = cursor.fetchone()

            if not actualizado:
                conn.rollback()
                raise HTTPException(
                    status_code=404,
                    detail="Curso no encontrado.",
                )

            guardar_prerequisitos(
                cursor=cursor,
                curso_id=curso_id,
                prerequisitos_ids=curso.prerequisitos_ids,
            )

            conn.commit()

            return obtener_curso(curso_id)

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail=(
                "Ya existe otro curso con ese código o un prerrequisito "
                "duplicado."
            ),
        )

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar curso: {str(error)}",
        )

    finally:
        conn.close()


def eliminar_curso(curso_id: int):
    """
    Eliminación lógica.
    No borra físicamente porque cursos puede estar relacionado con secciones,
    matrícula, prerrequisitos o asignaciones.
    """
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE cursos
                SET activo = FALSE
                WHERE id = %s
                RETURNING id;
                """,
                (curso_id,),
            )

            curso = cursor.fetchone()

            if not curso:
                conn.rollback()
                raise HTTPException(
                    status_code=404,
                    detail="Curso no encontrado.",
                )

            conn.commit()

            return {
                "message": "Curso desactivado correctamente.",
                "id": curso_id,
            }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al eliminar curso: {str(error)}",
        )

    finally:
        conn.close()