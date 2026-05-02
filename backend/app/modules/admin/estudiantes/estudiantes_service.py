from fastapi import HTTPException
from passlib.context import CryptContext
from app.database import get_connection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def listar_estudiantes():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                e.id,
                e.usuario_id,
                u.correo,
                u.activo,
                e.nombre_completo,
                e.numero_identificacion,
                e.telefono,
                e.direccion,
                p.id AS programa_id,
                p.nombre AS programa,
                ep.estado
            FROM estudiantes e
            INNER JOIN usuarios u ON e.usuario_id = u.id
            LEFT JOIN estudiante_programas ep ON e.id = ep.estudiante_id
            LEFT JOIN programas_academicos p ON ep.programa_id = p.id
            ORDER BY e.id DESC;
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


def obtener_estudiante(estudiante_id: int):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                e.id,
                e.usuario_id,
                u.correo,
                u.activo,
                e.nombre_completo,
                e.numero_identificacion,
                e.telefono,
                e.direccion,
                p.id AS programa_id,
                p.nombre AS programa,
                ep.estado
            FROM estudiantes e
            INNER JOIN usuarios u ON e.usuario_id = u.id
            LEFT JOIN estudiante_programas ep ON e.id = ep.estudiante_id
            LEFT JOIN programas_academicos p ON ep.programa_id = p.id
            WHERE e.id = %s;
        """, (estudiante_id,))

        fila = cursor.fetchone()

        if not fila:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")

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


def crear_estudiante(data):
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
            INSERT INTO estudiantes (
                usuario_id,
                nombre_completo,
                numero_identificacion,
                telefono,
                direccion
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (
            usuario_id,
            data.nombre_completo,
            data.numero_identificacion,
            data.telefono,
            data.direccion
        ))

        estudiante_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO estudiante_programas (
                estudiante_id,
                programa_id,
                estado
            )
            VALUES (%s, %s, 'ACTIVO');
        """, (estudiante_id, data.programa_id))

        cursor.execute("""
            SELECT id FROM roles WHERE nombre = 'ESTUDIANTE';
        """)

        rol = cursor.fetchone()

        if not rol:
            raise HTTPException(status_code=400, detail="Rol ESTUDIANTE no existe")

        rol_id = rol[0]

        cursor.execute("""
            INSERT INTO usuario_roles (usuario_id, rol_id)
            VALUES (%s, %s);
        """, (usuario_id, rol_id))

        conn.commit()

        return {
            "mensaje": "Estudiante creado correctamente",
            "estudiante_id": estudiante_id,
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


def actualizar_estudiante(estudiante_id: int, data):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("BEGIN;")

        cursor.execute("""
            UPDATE estudiantes
            SET 
                nombre_completo = %s,
                numero_identificacion = %s,
                telefono = %s,
                direccion = %s
            WHERE id = %s
            RETURNING usuario_id;
        """, (
            data.nombre_completo,
            data.numero_identificacion,
            data.telefono,
            data.direccion,
            estudiante_id
        ))

        fila = cursor.fetchone()

        if not fila:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")

        usuario_id = fila[0]

        cursor.execute("""
            UPDATE usuarios
            SET activo = %s
            WHERE id = %s;
        """, (data.activo, usuario_id))

        if data.programa_id:
            cursor.execute("""
                UPDATE estudiante_programas
                SET programa_id = %s
                WHERE estudiante_id = %s;
            """, (data.programa_id, estudiante_id))

        conn.commit()

        return {
            "mensaje": "Estudiante actualizado correctamente",
            "estudiante_id": estudiante_id
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


def listar_programas():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, codigo, nombre
            FROM programas_academicos
            WHERE activo = TRUE
            ORDER BY nombre ASC;
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