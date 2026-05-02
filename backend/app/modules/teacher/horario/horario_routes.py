from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor
from app.database import get_connection

router = APIRouter()


@router.get("/docente/{docente_id}")
def obtener_horario_docente(docente_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT
                bh.id AS bloque_id,
                bh.dia_semana,
                bh.hora_inicio,
                bh.hora_fin,
                c.codigo AS codigo_curso,
                c.nombre AS curso,
                sc.numero_seccion,
                sc.tipo AS tipo_seccion,
                a.codigo AS aula,
                h.id AS horario_id,
                h.version,
                s.codigo AS semestre
            FROM bloques_horario bh
            INNER JOIN secciones_curso sc ON sc.id = bh.seccion_curso_id
            INNER JOIN cursos c ON c.id = sc.curso_id
            INNER JOIN horarios h ON h.id = bh.horario_id
            INNER JOIN semestres_academicos s ON s.id = h.semestre_id
            LEFT JOIN aulas a ON a.id = bh.aula_id
            WHERE sc.docente_id = %s
            AND h.publicado = TRUE
            ORDER BY bh.dia_semana, bh.hora_inicio;
        """, (docente_id,))

        datos = cursor.fetchall()

        cursor.close()
        conn.close()

        return datos

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))