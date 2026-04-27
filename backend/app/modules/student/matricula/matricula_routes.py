from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor
from app.database import get_connection

router = APIRouter()


@router.get("/cursos-disponibles/{estudiante_id}")
def cursos_disponibles(estudiante_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Obtener programa del estudiante
        cursor.execute("""
            SELECT programa_id
            FROM estudiante_programas
            WHERE estudiante_id = %s
            LIMIT 1;
        """, (estudiante_id,))
        programa = cursor.fetchone()

        if not programa:
            raise HTTPException(status_code=404, detail="No tiene programa asignado")

        programa_id = programa["programa_id"]

        # Obtener semestre activo
        cursor.execute("""
            SELECT id
            FROM semestres_academicos
            WHERE estado IN ('ABIERTO', 'EN_CURSO')
            LIMIT 1;
        """)
        semestre = cursor.fetchone()

        if not semestre:
            raise HTTPException(status_code=404, detail="No hay semestre activo")

        semestre_id = semestre["id"]

        cursor.execute("""
    SELECT
        dd.id AS seccion_id,
        c.id AS curso_id,
        c.codigo,
        c.nombre AS curso,
        c.creditos,
        d.nombre_completo AS docente,
        'Sin aula' AS aula,
        dd.dia_semana,
        dd.hora_inicio,
        dd.hora_fin,
        40 AS capacidad,
        0 AS matriculados_actuales
    FROM disponibilidad_docente dd
    INNER JOIN docentes d ON d.id = dd.docente_id
    INNER JOIN cursos c ON c.id = dd.curso_id
    INNER JOIN semestres_academicos s ON s.id = dd.semestre_id
    WHERE dd.disponible = TRUE
      AND s.estado IN ('ABIERTO', 'EN_CURSO')
      AND c.programa_id = %s
    ORDER BY dd.dia_semana, dd.hora_inicio;
""", (programa_id,))

        cursos = cursor.fetchall()

        cursor.close()
        conn.close()

        return cursos

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/registrar")
def registrar_matricula(data: dict):
    estudiante_id = data["estudiante_id"]
    secciones = data["secciones"]

    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Obtener programa y semestre
        cursor.execute("""
            SELECT programa_id
            FROM estudiante_programas
            WHERE estudiante_id = %s
            LIMIT 1;
        """, (estudiante_id,))
        programa_id = cursor.fetchone()["programa_id"]

        cursor.execute("""
            SELECT id
            FROM semestres_academicos
            WHERE estado IN ('ABIERTO', 'EN_CURSO')
            LIMIT 1;
        """)
        semestre_id = cursor.fetchone()["id"]

        # Crear matrícula
        cursor.execute("""
            INSERT INTO matriculas (estudiante_id, programa_id, semestre_id, estado)
            VALUES (%s, %s, %s, 'ACTIVO')
            ON CONFLICT (estudiante_id, programa_id, semestre_id)
            DO UPDATE SET estado = 'ACTIVO'
            RETURNING id;
        """, (estudiante_id, programa_id, semestre_id))

        matricula_id = cursor.fetchone()["id"]

        for seccion_id in secciones:
            cursor.execute("""
                INSERT INTO matricula_cursos (matricula_id, seccion_curso_id)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING;
            """, (matricula_id, seccion_id))

        conn.commit()
        cursor.close()
        conn.close()

        return {"mensaje": "Matrícula registrada correctamente"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))