from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor
from psycopg2.errors import UniqueViolation, ForeignKeyViolation, CheckViolation
from app.database import get_connection
from app.modules.teacher.disponibilidad.disponibilidad_schema import (
    DisponibilidadCreate,
    DisponibilidadUpdate
)

router = APIRouter()


@router.get("/")
def listar_disponibilidad():
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT 
                dd.id,
                dd.docente_id,
                d.nombre_completo AS docente,
                dd.curso_id,
                c.nombre AS curso,
                dd.semestre_id,
                s.codigo AS semestre,
                dd.dia_semana,
                dd.hora_inicio,
                dd.hora_fin,
                dd.turno,
                dd.disponible
            FROM disponibilidad_docente dd
            INNER JOIN docentes d ON d.id = dd.docente_id
            INNER JOIN cursos c ON c.id = dd.curso_id
            INNER JOIN semestres_academicos s ON s.id = dd.semestre_id
            ORDER BY dd.dia_semana, dd.hora_inicio;
        """)

        datos = cursor.fetchall()
        cursor.close()
        conn.close()

        return datos

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/docente/{docente_id}")
def listar_por_docente(docente_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT 
                dd.id,
                dd.docente_id,
                d.nombre_completo AS docente,
                dd.curso_id,
                c.nombre AS curso,
                dd.semestre_id,
                s.codigo AS semestre,
                dd.dia_semana,
                dd.hora_inicio,
                dd.hora_fin,
                dd.turno,
                dd.disponible
            FROM disponibilidad_docente dd
            INNER JOIN docentes d ON d.id = dd.docente_id
            INNER JOIN cursos c ON c.id = dd.curso_id
            INNER JOIN semestres_academicos s ON s.id = dd.semestre_id
            WHERE dd.docente_id = %s
            ORDER BY dd.dia_semana, dd.hora_inicio;
        """, (docente_id,))

        datos = cursor.fetchall()
        cursor.close()
        conn.close()

        return datos

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def crear_disponibilidad(data: DisponibilidadCreate):
    if data.hora_fin <= data.hora_inicio:
        raise HTTPException(
            status_code=400,
            detail="La hora fin debe ser mayor que la hora inicio"
        )

    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            INSERT INTO disponibilidad_docente (
                docente_id,
                curso_id,
                semestre_id,
                dia_semana,
                hora_inicio,
                hora_fin,
                turno,
                disponible
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *;
        """, (
            data.docente_id,
            data.curso_id,
            data.semestre_id,
            data.dia_semana,
            data.hora_inicio,
            data.hora_fin,
            data.turno,
            data.disponible
        ))

        nuevo = cursor.fetchone()
        conn.commit()

        cursor.close()
        conn.close()

        return {
            "mensaje": "Disponibilidad registrada correctamente",
            "data": nuevo
        }

    except UniqueViolation:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail="Ya existe una disponibilidad igual para este docente, curso y semestre"
        )

    except ForeignKeyViolation:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail="Docente, curso o semestre no existe"
        )

    except CheckViolation:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail="Datos inválidos. Verifica día, turno u horas"
        )

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{disponibilidad_id}")
def actualizar_disponibilidad(disponibilidad_id: int, data: DisponibilidadUpdate):
    if data.hora_fin <= data.hora_inicio:
        raise HTTPException(
            status_code=400,
            detail="La hora fin debe ser mayor que la hora inicio"
        )

    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            UPDATE disponibilidad_docente
            SET 
                dia_semana = %s,
                hora_inicio = %s,
                hora_fin = %s,
                turno = %s,
                disponible = %s
            WHERE id = %s
            RETURNING *;
        """, (
            data.dia_semana,
            data.hora_inicio,
            data.hora_fin,
            data.turno,
            data.disponible,
            disponibilidad_id
        ))

        actualizado = cursor.fetchone()

        if not actualizado:
            raise HTTPException(status_code=404, detail="Disponibilidad no encontrada")

        conn.commit()
        cursor.close()
        conn.close()

        return {
            "mensaje": "Disponibilidad actualizada correctamente",
            "data": actualizado
        }

    except HTTPException:
        raise

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{disponibilidad_id}")
def eliminar_disponibilidad(disponibilidad_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM disponibilidad_docente
            WHERE id = %s;
        """, (disponibilidad_id,))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Disponibilidad no encontrada")

        conn.commit()
        cursor.close()
        conn.close()

        return {"mensaje": "Disponibilidad eliminada correctamente"}

    except HTTPException:
        raise

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/docente/{docente_id}/cursos")
def obtener_cursos_docente(docente_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT c.id, c.nombre
        FROM cursos c
        INNER JOIN secciones_curso sc ON sc.curso_id = c.id
        WHERE sc.docente_id = %s
        GROUP BY c.id, c.nombre
        ORDER BY c.nombre;
    """, (docente_id,))

    cursos = cursor.fetchall()

    cursor.close()
    conn.close()

    return [{"id": c[0], "nombre": c[1]} for c in cursos]

@router.get("/semestres")
def obtener_semestres():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, codigo
        FROM semestres_academicos
        ORDER BY id DESC;
    """)

    semestres = cursor.fetchall()

    cursor.close()
    conn.close()

    return [{"id": s[0], "codigo": s[1]} for s in semestres]
    
    