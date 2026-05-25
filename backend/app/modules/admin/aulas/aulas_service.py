from math import ceil

import psycopg2
from fastapi import HTTPException

from app.database import get_connection


def listar_aulas(page: int = 1, limit: int = 10, search: str = ""):
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
                FROM aulas
                WHERE (
                    %s = ''
                    OR codigo ILIKE %s
                    OR nombre ILIKE %s
                    OR tipo_aula ILIKE %s
                    OR ubicacion ILIKE %s
                );
                """,
                (
                    search_text,
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
                    id,
                    codigo,
                    nombre,
                    tipo_aula,
                    capacidad,
                    ubicacion,
                    activa
                FROM aulas
                WHERE (
                    %s = ''
                    OR codigo ILIKE %s
                    OR nombre ILIKE %s
                    OR tipo_aula ILIKE %s
                    OR ubicacion ILIKE %s
                )
                ORDER BY id DESC
                LIMIT %s OFFSET %s;
                """,
                (
                    search_text,
                    search_like,
                    search_like,
                    search_like,
                    search_like,
                    limit,
                    offset,
                ),
            )

            aulas = [dict(row) for row in cursor.fetchall()]

            return {
                "items": aulas,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": max(1, ceil(total / limit)) if total else 1,
            }

    finally:
        conn.close()


def obtener_aula(aula_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    codigo,
                    nombre,
                    tipo_aula,
                    capacidad,
                    ubicacion,
                    activa
                FROM aulas
                WHERE id = %s;
                """,
                (aula_id,),
            )

            aula = cursor.fetchone()

            if not aula:
                raise HTTPException(status_code=404, detail="Aula no encontrada.")

            return dict(aula)

    finally:
        conn.close()


def crear_aula(aula):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO aulas (
                    codigo,
                    nombre,
                    tipo_aula,
                    capacidad,
                    ubicacion,
                    activa
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    aula.codigo.strip().upper(),
                    aula.nombre.strip() if aula.nombre else aula.codigo.strip().upper(),
                    aula.tipo_aula.value,
                    aula.capacidad,
                    aula.ubicacion.strip() if aula.ubicacion else None,
                    aula.activa,
                ),
            )

            aula_id = cursor.fetchone()["id"]
            conn.commit()

            return obtener_aula(aula_id)

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail="Ya existe un aula con ese código.",
        )

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al crear aula: {str(error)}",
        )

    finally:
        conn.close()


def actualizar_aula(aula_id: int, aula):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE aulas
                SET
                    codigo = %s,
                    nombre = %s,
                    tipo_aula = %s,
                    capacidad = %s,
                    ubicacion = %s,
                    activa = %s
                WHERE id = %s
                RETURNING id;
                """,
                (
                    aula.codigo.strip().upper(),
                    aula.nombre.strip() if aula.nombre else aula.codigo.strip().upper(),
                    aula.tipo_aula.value,
                    aula.capacidad,
                    aula.ubicacion.strip() if aula.ubicacion else None,
                    aula.activa,
                    aula_id,
                ),
            )

            actualizado = cursor.fetchone()

            if not actualizado:
                conn.rollback()
                raise HTTPException(status_code=404, detail="Aula no encontrada.")

            conn.commit()

            return obtener_aula(aula_id)

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail="Ya existe otra aula con ese código.",
        )

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar aula: {str(error)}",
        )

    finally:
        conn.close()


def eliminar_aula(aula_id: int):
    """
    Eliminación lógica.
    No se borra físicamente porque el aula puede estar relacionada con bloques_horario.
    """
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE aulas
                SET activa = FALSE
                WHERE id = %s
                RETURNING id;
                """,
                (aula_id,),
            )

            aula = cursor.fetchone()

            if not aula:
                conn.rollback()
                raise HTTPException(status_code=404, detail="Aula no encontrada.")

            conn.commit()

            return {
                "message": "Aula desactivada correctamente.",
                "id": aula_id,
            }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al eliminar aula: {str(error)}",
        )

    finally:
        conn.close()