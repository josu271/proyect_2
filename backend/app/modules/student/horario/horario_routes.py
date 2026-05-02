from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor
from app.database import get_connection

router = APIRouter()


@router.get("/{estudiante_id}")
def obtener_horario_estudiante(estudiante_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT
                c.nombre AS curso,
                c.codigo,
                c.creditos,
                d.nombre_completo AS docente,
                a.codigo AS aula,
                bh.dia_semana,
                bh.hora_inicio,
                bh.hora_fin,
                mc.estado AS estado_matricula
            FROM matriculas m
            INNER JOIN matricula_cursos mc ON mc.matricula_id = m.id
            INNER JOIN secciones_curso sc ON sc.id = mc.seccion_curso_id
            INNER JOIN cursos c ON c.id = sc.curso_id
            INNER JOIN docentes d ON d.id = sc.docente_id
            LEFT JOIN bloques_horario bh ON bh.seccion_curso_id = sc.id
            LEFT JOIN aulas a ON a.id = bh.aula_id
            WHERE m.estudiante_id = %s
              AND m.estado = 'ACTIVO'
              AND mc.estado = 'MATRICULADO'
            ORDER BY bh.dia_semana, bh.hora_inicio;
        """, (estudiante_id,))

        horario = cursor.fetchall()

        cursor.close()
        conn.close()

        return horario

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))