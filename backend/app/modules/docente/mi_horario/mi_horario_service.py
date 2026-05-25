from fastapi import HTTPException

from app.database import get_connection


def _formatear_hora(valor):
    if valor is None:
        return None

    if hasattr(valor, "strftime"):
        return valor.strftime("%H:%M")

    return str(valor)[:5]


def _obtener_semestre(cur, semestre_id: int | None):
    if semestre_id:
        cur.execute(
            """
            SELECT id, codigo, nombre, estado
            FROM semestres_academicos
            WHERE id = %s
            """,
            (semestre_id,),
        )
    else:
        cur.execute(
            """
            SELECT id, codigo, nombre, estado
            FROM semestres_academicos
            WHERE estado IN ('ACTIVO', 'PLANIFICACION')
            ORDER BY
                CASE
                    WHEN estado = 'ACTIVO' THEN 1
                    WHEN estado = 'PLANIFICACION' THEN 2
                    ELSE 3
                END,
                id DESC
            LIMIT 1
            """
        )

    semestre = cur.fetchone()

    if not semestre:
        raise HTTPException(
            status_code=404,
            detail="No se encontró un semestre académico activo o en planificación.",
        )

    return semestre


def obtener_mi_horario_docente(docente_id: int, semestre_id: int | None = None):
    conn = get_connection()

    try:
        with conn.cursor() as cur:
            semestre = _obtener_semestre(cur, semestre_id)

            cur.execute(
                """
                SELECT DISTINCT
                    sem.id,
                    sem.codigo,
                    sem.nombre,
                    sem.estado
                FROM semestres_academicos sem
                LEFT JOIN docente_curso_asignado dca ON dca.semestre_id = sem.id
                LEFT JOIN secciones s ON s.semestre_id = sem.id
                WHERE dca.docente_id = %s
                   OR s.docente_id = %s
                ORDER BY sem.id DESC
                """,
                (docente_id, docente_id),
            )
            semestres = cur.fetchall()

            cur.execute(
                """
                SELECT
                    id,
                    nombre,
                    hora_inicio,
                    hora_fin,
                    turno
                FROM bloques_academicos
                ORDER BY hora_inicio ASC
                """
            )
            bloques_bd = cur.fetchall()

            bloques = []

            for bloque in bloques_bd:
                hora_inicio = _formatear_hora(bloque["hora_inicio"])
                hora_fin = _formatear_hora(bloque["hora_fin"])

                bloques.append(
                    {
                        "id": bloque["id"],
                        "nombre": bloque["nombre"],
                        "hora_inicio": hora_inicio,
                        "hora_fin": hora_fin,
                        "hora": f"{hora_inicio} - {hora_fin}",
                        "turno": bloque["turno"],
                    }
                )

            cur.execute(
                """
                SELECT
                    s.id AS seccion_id,
                    s.nrc,
                    s.estado AS estado_seccion,
                    c.codigo AS curso_codigo,
                    c.nombre AS curso,
                    a.codigo AS aula,
                    a.nombre AS aula_nombre,
                    bh.dia_semana,
                    CASE bh.dia_semana
                        WHEN 1 THEN 'Lunes'
                        WHEN 2 THEN 'Martes'
                        WHEN 3 THEN 'Miércoles'
                        WHEN 4 THEN 'Jueves'
                        WHEN 5 THEN 'Viernes'
                        WHEN 6 THEN 'Sábado'
                    END AS dia_nombre,
                    ba.id AS bloque_academico_id,
                    ba.nombre AS bloque,
                    ba.hora_inicio,
                    ba.hora_fin,
                    ba.turno
                FROM bloques_horario bh
                INNER JOIN secciones s ON s.id = bh.seccion_id
                INNER JOIN cursos c ON c.id = s.curso_id
                INNER JOIN aulas a ON a.id = bh.aula_id
                INNER JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
                WHERE s.docente_id = %s
                  AND s.semestre_id = %s
                  AND s.estado <> 'CANCELADA'
                ORDER BY bh.dia_semana ASC, ba.hora_inicio ASC
                """,
                (docente_id, semestre["id"]),
            )
            horarios_bd = cur.fetchall()

            horarios = []

            for item in horarios_bd:
                hora_inicio = _formatear_hora(item["hora_inicio"])
                hora_fin = _formatear_hora(item["hora_fin"])

                horarios.append(
                    {
                        "seccion_id": item["seccion_id"],
                        "nrc": item["nrc"],
                        "estado_seccion": item["estado_seccion"],
                        "curso_codigo": item["curso_codigo"],
                        "curso": item["curso"],
                        "aula": item["aula"],
                        "aula_nombre": item["aula_nombre"],
                        "dia_semana": item["dia_semana"],
                        "dia_nombre": item["dia_nombre"],
                        "bloque_academico_id": item["bloque_academico_id"],
                        "bloque": item["bloque"],
                        "hora_inicio": hora_inicio,
                        "hora_fin": hora_fin,
                        "hora": f"{hora_inicio} - {hora_fin}",
                        "turno": item["turno"],
                    }
                )

            return {
                "semestre": semestre,
                "semestres": semestres,
                "bloques": bloques,
                "horarios": horarios,
            }

    finally:
        conn.close()