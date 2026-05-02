from fastapi import APIRouter, HTTPException
from app.database import get_connection

router = APIRouter(prefix="/cursos", tags=["Cursos"])

@router.get("/")
def listar_cursos():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, codigo, nombre, descripcion, creditos, nivel, programa_id, activo
            FROM cursos
            ORDER BY id;
        """)

        columnas = [desc[0] for desc in cursor.description]
        cursos = [dict(zip(columnas, fila)) for fila in cursor.fetchall()]

        cursor.close()
        conn.close()

        return cursos

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    