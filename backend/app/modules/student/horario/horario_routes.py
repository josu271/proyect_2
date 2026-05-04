from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor
from app.database import get_connection

router = APIRouter()


@router.get("/{estudiante_id}")
def obtener_mi_horario(estudiante_id: int):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT
                e.id AS estudiante_id,
                c.id AS curso_id,
                c.nombre AS curso,
                c.codigo AS codigo_curso,
                c.creditos,
                d.nombre_completo AS docente,
                COALESCE(a.codigo, 'Sin aula') AS aula,
                bh.dia_semana,
                bh.hora_inicio,
                bh.hora_fin,
                sc.id AS seccion_id,
                sc.numero_seccion,
                m.estado AS estado_matricula,
                mc.estado AS estado_curso,
                h.publicado
            FROM estudiantes e
            INNER JOIN matriculas m
                ON m.estudiante_id = e.id
            INNER JOIN matricula_cursos mc
                ON mc.matricula_id = m.id
            INNER JOIN secciones_curso sc
                ON sc.id = mc.seccion_curso_id
            INNER JOIN cursos c
                ON c.id = sc.curso_id
            INNER JOIN docentes d
                ON d.id = sc.docente_id
            INNER JOIN bloques_horario bh
                ON bh.seccion_curso_id = sc.id
            INNER JOIN horarios h
                ON h.id = bh.horario_id
            LEFT JOIN aulas a
                ON a.id = bh.aula_id
            WHERE e.id = %s
              AND m.estado = 'ACTIVO'
              AND mc.estado = 'MATRICULADO'
            ORDER BY bh.dia_semana, bh.hora_inicio;
        """, (estudiante_id,))

        horario = cursor.fetchall()

        return horario

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()