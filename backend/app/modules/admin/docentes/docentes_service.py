from math import ceil

import psycopg2
from fastapi import HTTPException

from app.database import get_connection


def listar_docentes(page: int = 1, limit: int = 10, search: str = ""):
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
                FROM docentes d
                INNER JOIN usuarios u ON u.id = d.usuario_id
                WHERE (
                    %s = ''
                    OR d.codigo_docente ILIKE %s
                    OR d.nombre_completo ILIKE %s
                    OR u.correo ILIKE %s
                    OR d.especialidad ILIKE %s
                    OR d.dni ILIKE %s
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
                    d.id,
                    d.usuario_id,
                    d.codigo_docente,
                    d.dni,
                    d.nombre_completo,
                    u.correo,
                    d.especialidad,
                    d.activo,
                    u.activo AS usuario_activo,
                    d.fecha_registro
                FROM docentes d
                INNER JOIN usuarios u ON u.id = d.usuario_id
                WHERE (
                    %s = ''
                    OR d.codigo_docente ILIKE %s
                    OR d.nombre_completo ILIKE %s
                    OR u.correo ILIKE %s
                    OR d.especialidad ILIKE %s
                    OR d.dni ILIKE %s
                )
                ORDER BY d.id DESC
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

            docentes = [dict(row) for row in cursor.fetchall()]

            return {
                "items": docentes,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": max(1, ceil(total / limit)) if total else 1,
            }

    finally:
        conn.close()


def obtener_docente(docente_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    d.id,
                    d.usuario_id,
                    d.codigo_docente,
                    d.dni,
                    d.nombre_completo,
                    u.correo,
                    d.especialidad,
                    d.activo,
                    u.activo AS usuario_activo,
                    d.fecha_registro
                FROM docentes d
                INNER JOIN usuarios u ON u.id = d.usuario_id
                WHERE d.id = %s;
                """,
                (docente_id,),
            )

            docente = cursor.fetchone()

            if not docente:
                raise HTTPException(status_code=404, detail="Docente no encontrado.")

            return dict(docente)

    finally:
        conn.close()


def crear_docente(docente):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
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
                    'DOCENTE',
                    %s
                )
                RETURNING id;
                """,
                (
                    docente.correo.lower().strip(),
                    docente.contrasena,
                    docente.activo,
                ),
            )

            usuario_id = cursor.fetchone()["id"]

            cursor.execute(
                """
                INSERT INTO docentes (
                    usuario_id,
                    codigo_docente,
                    dni,
                    nombre_completo,
                    especialidad,
                    activo
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    usuario_id,
                    docente.codigo_docente.strip().upper(),
                    docente.dni.strip() if docente.dni else None,
                    docente.nombre_completo.strip(),
                    docente.especialidad.strip() if docente.especialidad else None,
                    docente.activo,
                ),
            )

            docente_id = cursor.fetchone()["id"]
            conn.commit()

            return obtener_docente(docente_id)

    except psycopg2.errors.UniqueViolation as error:
        conn.rollback()

        mensaje = str(error)

        if "usuarios_correo_key" in mensaje:
            detalle = "Ya existe un usuario con ese correo."
        elif "docentes_codigo_docente_key" in mensaje:
            detalle = "Ya existe un docente con ese código."
        elif "docentes_dni_key" in mensaje:
            detalle = "Ya existe un docente con ese DNI."
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
            detail=f"Error al crear docente: {str(error)}",
        )

    finally:
        conn.close()


def actualizar_docente(docente_id: int, docente):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT usuario_id
                FROM docentes
                WHERE id = %s;
                """,
                (docente_id,),
            )

            docente_actual = cursor.fetchone()

            if not docente_actual:
                raise HTTPException(status_code=404, detail="Docente no encontrado.")

            usuario_id = docente_actual["usuario_id"]

            if docente.contrasena:
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
                        docente.correo.lower().strip(),
                        docente.contrasena,
                        docente.activo,
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
                        docente.correo.lower().strip(),
                        docente.activo,
                        usuario_id,
                    ),
                )

            cursor.execute(
                """
                UPDATE docentes
                SET
                    codigo_docente = %s,
                    dni = %s,
                    nombre_completo = %s,
                    especialidad = %s,
                    activo = %s
                WHERE id = %s
                RETURNING id;
                """,
                (
                    docente.codigo_docente.strip().upper(),
                    docente.dni.strip() if docente.dni else None,
                    docente.nombre_completo.strip(),
                    docente.especialidad.strip() if docente.especialidad else None,
                    docente.activo,
                    docente_id,
                ),
            )

            actualizado = cursor.fetchone()

            if not actualizado:
                raise HTTPException(status_code=404, detail="Docente no encontrado.")

            conn.commit()

            return obtener_docente(docente_id)

    except psycopg2.errors.UniqueViolation as error:
        conn.rollback()

        mensaje = str(error)

        if "usuarios_correo_key" in mensaje:
            detalle = "Ya existe otro usuario con ese correo."
        elif "docentes_codigo_docente_key" in mensaje:
            detalle = "Ya existe otro docente con ese código."
        elif "docentes_dni_key" in mensaje:
            detalle = "Ya existe otro docente con ese DNI."
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
            detail=f"Error al actualizar docente: {str(error)}",
        )

    finally:
        conn.close()


def eliminar_docente(docente_id: int):
    """
    Eliminación lógica.
    No borra físicamente porque el docente puede estar relacionado con cursos,
    secciones, disponibilidad u horarios.
    """
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT usuario_id
                FROM docentes
                WHERE id = %s;
                """,
                (docente_id,),
            )

            docente = cursor.fetchone()

            if not docente:
                raise HTTPException(status_code=404, detail="Docente no encontrado.")

            usuario_id = docente["usuario_id"]

            cursor.execute(
                """
                UPDATE docentes
                SET activo = FALSE
                WHERE id = %s;
                """,
                (docente_id,),
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
                "message": "Docente desactivado correctamente.",
                "id": docente_id,
            }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al eliminar docente: {str(error)}",
        )

    finally:
        conn.close()