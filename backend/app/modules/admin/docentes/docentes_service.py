from fastapi import HTTPException
from app.database import get_connection


def listar_docentes():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                d.id,
                d.usuario_id,
                u.correo,
                u.activo,
                d.nombre_completo,
                d.numero_identificacion,
                d.telefono,
                d.especialidad
            FROM docentes d
            INNER JOIN usuarios u ON d.usuario_id = u.id
            ORDER BY d.id DESC;
        """)

        columnas = [desc[0] for desc in cursor.description]
        return [dict(zip(columnas, fila)) for fila in cursor.fetchall()]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def obtener_docente(docente_id: int):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                d.id,
                d.usuario_id,
                u.correo,
                u.activo,
                d.nombre_completo,
                d.numero_identificacion,
                d.telefono,
                d.especialidad
            FROM docentes d
            INNER JOIN usuarios u ON d.usuario_id = u.id
            WHERE d.id = %s;
        """, (docente_id,))

        fila = cursor.fetchone()

        if not fila:
            raise HTTPException(status_code=404, detail="Docente no encontrado")

        columnas = [desc[0] for desc in cursor.description]
        return dict(zip(columnas, fila))

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def crear_docente(data):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("BEGIN;")

        cursor.execute("""
            INSERT INTO usuarios (correo, contrasena_hash, activo)
            VALUES (%s, crypt(%s, gen_salt('bf')), TRUE)
            RETURNING id;
        """, (
            data.correo,
            data.contrasena
        ))

        usuario_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO docentes (
                usuario_id,
                nombre_completo,
                numero_identificacion,
                telefono,
                correo,
                especialidad,
                activo
            )
            VALUES (%s, %s, %s, %s, %s, %s, TRUE)
            RETURNING id;
        """, (
            usuario_id,
            data.nombre_completo,
            data.numero_identificacion,
            data.telefono,
            data.correo,
            data.especialidad
        ))

        docente_id = cursor.fetchone()[0]

        cursor.execute("""
            SELECT id FROM roles WHERE nombre = 'DOCENTE';
        """)

        rol = cursor.fetchone()

        if not rol:
            raise HTTPException(status_code=400, detail="Rol DOCENTE no existe")

        rol_id = rol[0]

        cursor.execute("""
            INSERT INTO usuario_roles (usuario_id, rol_id)
            VALUES (%s, %s);
        """, (
            usuario_id,
            rol_id
        ))

        conn.commit()

        return {
            "mensaje": "Docente creado correctamente",
            "docente_id": docente_id,
            "usuario_id": str(usuario_id)
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


def actualizar_docente(docente_id: int, data):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("BEGIN;")

        cursor.execute("""
            UPDATE docentes
            SET 
                nombre_completo = %s,
                numero_identificacion = %s,
                telefono = %s,
                especialidad = %s,
                activo = %s
            WHERE id = %s
            RETURNING usuario_id;
        """, (
            data.nombre_completo,
            data.numero_identificacion,
            data.telefono,
            data.especialidad,
            data.activo,
            docente_id
        ))

        fila = cursor.fetchone()

        if not fila:
            raise HTTPException(status_code=404, detail="Docente no encontrado")

        usuario_id = fila[0]

        cursor.execute("""
            UPDATE usuarios
            SET activo = %s
            WHERE id = %s;
        """, (
            data.activo,
            usuario_id
        ))

        conn.commit()

        return {
            "mensaje": "Docente actualizado correctamente",
            "docente_id": docente_id
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