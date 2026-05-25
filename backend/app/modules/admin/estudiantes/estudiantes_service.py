from math import ceil

import psycopg2
from fastapi import HTTPException

from app.database import get_connection


def listar_programas():
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id, codigo, nombre, activo
                FROM programas_academicos
                WHERE activo = TRUE
                ORDER BY nombre ASC;
            """)

            return [dict(row) for row in cursor.fetchall()]

    finally:
        conn.close()


def validar_programa(programa_id: int, cursor):
    cursor.execute(
        """
        SELECT id
        FROM programas_academicos
        WHERE id = %s AND activo = TRUE;
        """,
        (programa_id,),
    )

    if not cursor.fetchone():
        raise HTTPException(
            status_code=400,
            detail="El programa académico no existe o está inactivo.",
        )


def listar_estudiantes(page: int = 1, limit: int = 10, search: str = ""):
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
                FROM estudiantes e
                INNER JOIN usuarios u ON u.id = e.usuario_id
                INNER JOIN programas_academicos p ON p.id = e.programa_id
                WHERE (
                    %s = ''
                    OR e.codigo_estudiante ILIKE %s
                    OR e.nombre_completo ILIKE %s
                    OR u.correo ILIKE %s
                    OR p.nombre ILIKE %s
                    OR e.dni ILIKE %s
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
                    e.id,
                    e.usuario_id,
                    e.programa_id,
                    p.nombre AS programa,
                    e.codigo_estudiante,
                    e.dni,
                    e.nombre_completo,
                    u.correo,
                    e.ciclo,
                    e.activo,
                    u.activo AS usuario_activo,
                    e.fecha_registro
                FROM estudiantes e
                INNER JOIN usuarios u ON u.id = e.usuario_id
                INNER JOIN programas_academicos p ON p.id = e.programa_id
                WHERE (
                    %s = ''
                    OR e.codigo_estudiante ILIKE %s
                    OR e.nombre_completo ILIKE %s
                    OR u.correo ILIKE %s
                    OR p.nombre ILIKE %s
                    OR e.dni ILIKE %s
                )
                ORDER BY e.id DESC
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

            estudiantes = [dict(row) for row in cursor.fetchall()]

            return {
                "items": estudiantes,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": max(1, ceil(total / limit)) if total else 1,
            }

    finally:
        conn.close()


def obtener_estudiante(estudiante_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    e.id,
                    e.usuario_id,
                    e.programa_id,
                    p.nombre AS programa,
                    e.codigo_estudiante,
                    e.dni,
                    e.nombre_completo,
                    u.correo,
                    e.ciclo,
                    e.activo,
                    u.activo AS usuario_activo,
                    e.fecha_registro
                FROM estudiantes e
                INNER JOIN usuarios u ON u.id = e.usuario_id
                INNER JOIN programas_academicos p ON p.id = e.programa_id
                WHERE e.id = %s;
                """,
                (estudiante_id,),
            )

            estudiante = cursor.fetchone()

            if not estudiante:
                raise HTTPException(
                    status_code=404,
                    detail="Estudiante no encontrado.",
                )

            return dict(estudiante)

    finally:
        conn.close()


def crear_estudiante(estudiante):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            validar_programa(estudiante.programa_id, cursor)

            cursor.execute(
                """
                INSERT INTO usuarios (
                    correo,
                    contrasena_hash,
                    rol,
                    activo
                )
                VALUES (
                    %s,
                    crypt(%s, gen_salt('bf')),
                    'ESTUDIANTE',
                    %s
                )
                RETURNING id;
                """,
                (
                    estudiante.correo.lower().strip(),
                    estudiante.contrasena,
                    estudiante.activo,
                ),
            )

            usuario_id = cursor.fetchone()["id"]

            cursor.execute(
                """
                INSERT INTO estudiantes (
                    usuario_id,
                    programa_id,
                    codigo_estudiante,
                    dni,
                    nombre_completo,
                    ciclo,
                    activo
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    usuario_id,
                    estudiante.programa_id,
                    estudiante.codigo_estudiante.strip().upper(),
                    estudiante.dni.strip() if estudiante.dni else None,
                    estudiante.nombre_completo.strip(),
                    estudiante.ciclo,
                    estudiante.activo,
                ),
            )

            estudiante_id = cursor.fetchone()["id"]
            conn.commit()

            return obtener_estudiante(estudiante_id)

    except psycopg2.errors.UniqueViolation as error:
        conn.rollback()

        mensaje = str(error)

        if "usuarios_correo_key" in mensaje:
            detalle = "Ya existe un usuario con ese correo."
        elif "estudiantes_codigo_estudiante_key" in mensaje:
            detalle = "Ya existe un estudiante con ese código."
        elif "estudiantes_dni_key" in mensaje:
            detalle = "Ya existe un estudiante con ese DNI."
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
            detail=f"Error al crear estudiante: {str(error)}",
        )

    finally:
        conn.close()


def actualizar_estudiante(estudiante_id: int, estudiante):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            validar_programa(estudiante.programa_id, cursor)

            cursor.execute(
                """
                SELECT usuario_id
                FROM estudiantes
                WHERE id = %s;
                """,
                (estudiante_id,),
            )

            estudiante_actual = cursor.fetchone()

            if not estudiante_actual:
                raise HTTPException(
                    status_code=404,
                    detail="Estudiante no encontrado.",
                )

            usuario_id = estudiante_actual["usuario_id"]

            if estudiante.contrasena:
                cursor.execute(
                    """
                    UPDATE usuarios
                    SET
                        correo = %s,
                        contrasena_hash = crypt(%s, gen_salt('bf')),
                        activo = %s
                    WHERE id = %s;
                    """,
                    (
                        estudiante.correo.lower().strip(),
                        estudiante.contrasena,
                        estudiante.activo,
                        usuario_id,
                    ),
                )
            else:
                cursor.execute(
                    """
                    UPDATE usuarios
                    SET
                        correo = %s,
                        activo = %s
                    WHERE id = %s;
                    """,
                    (
                        estudiante.correo.lower().strip(),
                        estudiante.activo,
                        usuario_id,
                    ),
                )

            cursor.execute(
                """
                UPDATE estudiantes
                SET
                    programa_id = %s,
                    codigo_estudiante = %s,
                    dni = %s,
                    nombre_completo = %s,
                    ciclo = %s,
                    activo = %s
                WHERE id = %s
                RETURNING id;
                """,
                (
                    estudiante.programa_id,
                    estudiante.codigo_estudiante.strip().upper(),
                    estudiante.dni.strip() if estudiante.dni else None,
                    estudiante.nombre_completo.strip(),
                    estudiante.ciclo,
                    estudiante.activo,
                    estudiante_id,
                ),
            )

            actualizado = cursor.fetchone()

            if not actualizado:
                raise HTTPException(
                    status_code=404,
                    detail="Estudiante no encontrado.",
                )

            conn.commit()

            return obtener_estudiante(estudiante_id)

    except psycopg2.errors.UniqueViolation as error:
        conn.rollback()

        mensaje = str(error)

        if "usuarios_correo_key" in mensaje:
            detalle = "Ya existe otro usuario con ese correo."
        elif "estudiantes_codigo_estudiante_key" in mensaje:
            detalle = "Ya existe otro estudiante con ese código."
        elif "estudiantes_dni_key" in mensaje:
            detalle = "Ya existe otro estudiante con ese DNI."
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
            detail=f"Error al actualizar estudiante: {str(error)}",
        )

    finally:
        conn.close()


def eliminar_estudiante(estudiante_id: int):
    """
    Eliminación lógica.
    No borra físicamente porque el estudiante puede tener matrícula,
    historial académico o disponibilidad registrada.
    """
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT usuario_id
                FROM estudiantes
                WHERE id = %s;
                """,
                (estudiante_id,),
            )

            estudiante = cursor.fetchone()

            if not estudiante:
                raise HTTPException(
                    status_code=404,
                    detail="Estudiante no encontrado.",
                )

            usuario_id = estudiante["usuario_id"]

            cursor.execute(
                """
                UPDATE estudiantes
                SET activo = FALSE
                WHERE id = %s;
                """,
                (estudiante_id,),
            )

            cursor.execute(
                """
                UPDATE usuarios
                SET activo = FALSE
                WHERE id = %s;
                """,
                (usuario_id,),
            )

            conn.commit()

            return {
                "message": "Estudiante desactivado correctamente.",
                "id": estudiante_id,
            }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al eliminar estudiante: {str(error)}",
        )

    finally:
        conn.close()