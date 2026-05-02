from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor
from app.database import get_connection

router = APIRouter()


@router.get("/docente/{docente_id}")
def listar_cursos_docente(docente_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT
                sc.id AS seccion_id,
                c.id AS curso_id,
                c.codigo AS codigo_curso,
                c.nombre AS curso,
                c.creditos,
                c.nivel,
                sc.numero_seccion,
                sc.capacidad,
                sc.matriculados_actuales,
                sc.tipo,
                sc.estado,
                s.id AS semestre_id,
                s.codigo AS semestre
            FROM secciones_curso sc
            INNER JOIN cursos c ON c.id = sc.curso_id
            INNER JOIN semestres_academicos s ON s.id = sc.semestre_id
            WHERE sc.docente_id = %s
            ORDER BY s.id DESC, c.nombre ASC;
        """, (docente_id,))

        cursos = cursor.fetchall()

        cursor.close()
        conn.close()

        return cursos

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))