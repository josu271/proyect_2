from fastapi import HTTPException
from app.database import get_connection


def listar_cursos():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                c.id,
                c.codigo,
                c.nombre,
                c.descripcion,
                c.creditos,
                c.nivel,
                c.activo,
                p.id AS programa_id,
                p.nombre AS programa
            FROM cursos c
            INNER JOIN programas_academicos p ON c.programa_id = p.id
            ORDER BY c.id DESC;
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


def obtener_curso(curso_id: int):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                c.id,
                c.codigo,
                c.nombre,
                c.descripcion,
                c.creditos,
                c.nivel,
                c.activo,
                p.id AS programa_id,
                p.nombre AS programa
            FROM cursos c
            INNER JOIN programas_academicos p ON c.programa_id = p.id
            WHERE c.id = %s;
        """, (curso_id,))

        fila = cursor.fetchone()

        if not fila:
            raise HTTPException(status_code=404, detail="Curso no encontrado")

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


def crear_curso(data):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO cursos (
                codigo,
                nombre,
                descripcion,
                creditos,
                nivel,
                programa_id,
                activo
            )
            VALUES (%s, %s, %s, %s, %s, %s, TRUE)
            RETURNING id;
        """, (
            data.codigo,
            data.nombre,
            data.descripcion,
            data.creditos,
            data.nivel,
            data.programa_id
        ))

        curso_id = cursor.fetchone()[0]
        conn.commit()

        return {
            "mensaje": "Curso creado correctamente",
            "curso_id": curso_id
        }

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def actualizar_curso(curso_id: int, data):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE cursos
            SET
                codigo = %s,
                nombre = %s,
                descripcion = %s,
                creditos = %s,
                nivel = %s,
                programa_id = %s,
                activo = %s
            WHERE id = %s
            RETURNING id;
        """, (
            data.codigo,
            data.nombre,
            data.descripcion,
            data.creditos,
            data.nivel,
            data.programa_id,
            data.activo,
            curso_id
        ))

        actualizado = cursor.fetchone()

        if not actualizado:
            raise HTTPException(status_code=404, detail="Curso no encontrado")

        conn.commit()

        return {
            "mensaje": "Curso actualizado correctamente",
            "curso_id": curso_id
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


def listar_docentes():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, nombre_completo, especialidad
            FROM docentes
            WHERE activo = TRUE
            ORDER BY nombre_completo ASC;
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


def listar_semestres():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, codigo, anio, numero_semestre, estado
            FROM semestres_academicos
            ORDER BY anio DESC, numero_semestre DESC;
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


def asignar_docente_a_curso(curso_id: int, data):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO secciones_curso (
                curso_id,
                docente_id,
                semestre_id,
                numero_seccion,
                capacidad,
                matriculados_actuales,
                tipo,
                estado
            )
            VALUES (%s, %s, %s, %s, %s, 0, %s, 'ABIERTO')
            RETURNING id;
        """, (
            curso_id,
            data.docente_id,
            data.semestre_id,
            data.numero_seccion,
            data.capacidad,
            data.tipo
        ))

        seccion_id = cursor.fetchone()[0]
        conn.commit()

        return {
            "mensaje": "Docente asignado al curso correctamente",
            "seccion_id": seccion_id
        }

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()