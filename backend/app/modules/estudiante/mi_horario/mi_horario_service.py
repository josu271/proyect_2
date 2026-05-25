from fastapi import HTTPException

from app.database import get_connection


DIAS = [
    {"id": 1, "nombre": "Lunes"},
    {"id": 2, "nombre": "Martes"},
    {"id": 3, "nombre": "Miércoles"},
    {"id": 4, "nombre": "Jueves"},
    {"id": 5, "nombre": "Viernes"},
    {"id": 6, "nombre": "Sábado"},
]


def obtener_semestre_activo(cursor):
    cursor.execute(
        """
        SELECT id, codigo, nombre, fecha_inicio, fecha_fin, estado
        FROM semestres_academicos
        WHERE estado = 'ACTIVO'
        ORDER BY fecha_inicio DESC
        LIMIT 1;
        """
    )

    semestre = cursor.fetchone()

    if not semestre:
        raise HTTPException(
            status_code=404,
            detail="No existe un semestre académico activo.",
        )

    return dict(semestre)


def obtener_estudiante(cursor, estudiante_id: int):
    cursor.execute(
        """
        SELECT
            e.id,
            e.codigo_estudiante,
            e.nombre_completo,
            e.ciclo,
            e.programa_id,
            p.nombre AS programa
        FROM estudiantes e
        INNER JOIN programas_academicos p ON p.id = e.programa_id
        WHERE e.id = %s
          AND e.activo = TRUE;
        """,
        (estudiante_id,),
    )

    estudiante = cursor.fetchone()

    if not estudiante:
        raise HTTPException(
            status_code=404,
            detail="El estudiante no existe o está inactivo.",
        )

    return dict(estudiante)


def obtener_estudiante_por_usuario(cursor, usuario_id: int):
    cursor.execute(
        """
        SELECT
            e.id,
            e.codigo_estudiante,
            e.nombre_completo,
            e.ciclo,
            e.programa_id,
            p.nombre AS programa
        FROM estudiantes e
        INNER JOIN usuarios u ON u.id = e.usuario_id
        INNER JOIN programas_academicos p ON p.id = e.programa_id
        WHERE e.usuario_id = %s
          AND e.activo = TRUE
          AND u.activo = TRUE
          AND u.rol = 'ESTUDIANTE';
        """,
        (usuario_id,),
    )

    estudiante = cursor.fetchone()

    if not estudiante:
        raise HTTPException(
            status_code=404,
            detail="No se encontró un estudiante activo asociado al usuario.",
        )

    return dict(estudiante)


def listar_bloques(cursor):
    cursor.execute(
        """
        SELECT
            id,
            nombre,
            hora_inicio::text AS hora_inicio,
            hora_fin::text AS hora_fin,
            turno
        FROM bloques_academicos
        WHERE hora_inicio >= '08:00'
        ORDER BY hora_inicio ASC;
        """
    )

    return [dict(row) for row in cursor.fetchall()]


def obtener_matricula(cursor, estudiante_id: int, semestre_id: int):
    cursor.execute(
        """
        SELECT id, estado, fecha_matricula
        FROM matriculas
        WHERE estudiante_id = %s
          AND semestre_id = %s
          AND estado <> 'ANULADA'
        ORDER BY fecha_matricula DESC
        LIMIT 1;
        """,
        (estudiante_id, semestre_id),
    )

    matricula = cursor.fetchone()

    if not matricula:
        return None

    return dict(matricula)


def listar_clases(cursor, estudiante_id: int, semestre_id: int):
    cursor.execute(
        """
        SELECT
            m.id AS matricula_id,
            m.estado AS estado_matricula,

            s.id AS seccion_id,
            s.nrc,

            c.id AS curso_id,
            c.codigo AS curso_codigo,
            c.nombre AS curso,
            c.creditos,
            c.ciclo,

            d.id AS docente_id,
            d.nombre_completo AS docente,

            a.id AS aula_id,
            a.codigo AS aula,

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
            ba.hora_inicio::text AS hora_inicio,
            ba.hora_fin::text AS hora_fin,
            ba.turno,

            md.estado AS estado_detalle
        FROM matriculas m
        INNER JOIN matricula_detalle md ON md.matricula_id = m.id
        INNER JOIN secciones s ON s.id = md.seccion_id
        INNER JOIN cursos c ON c.id = s.curso_id
        INNER JOIN docentes d ON d.id = s.docente_id
        INNER JOIN bloques_horario bh ON bh.seccion_id = s.id
        INNER JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
        INNER JOIN aulas a ON a.id = bh.aula_id
        WHERE m.estudiante_id = %s
          AND m.semestre_id = %s
          AND m.estado <> 'ANULADA'
          AND md.estado = 'ACTIVO'
        ORDER BY bh.dia_semana ASC, ba.hora_inicio ASC, c.nombre ASC;
        """,
        (estudiante_id, semestre_id),
    )

    clases = []

    for row in cursor.fetchall():
        clases.append(
            {
                "matricula_id": row["matricula_id"],
                "estado_matricula": row["estado_matricula"],
                "seccion_id": row["seccion_id"],
                "nrc": row["nrc"],
                "curso_id": row["curso_id"],
                "curso_codigo": row["curso_codigo"],
                "curso": row["curso"],
                "creditos": row["creditos"],
                "ciclo": row["ciclo"],
                "docente_id": row["docente_id"],
                "docente": row["docente"],
                "aula_id": row["aula_id"],
                "aula": row["aula"],
                "dia_semana": row["dia_semana"],
                "dia_nombre": row["dia_nombre"],
                "bloque_academico_id": row["bloque_academico_id"],
                "bloque": row["bloque"],
                "hora_inicio": row["hora_inicio"],
                "hora_fin": row["hora_fin"],
                "turno": row["turno"],
                "estado_detalle": row["estado_detalle"],
            }
        )

    return clases


def obtener_mi_horario(estudiante_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            estudiante = obtener_estudiante(cursor, estudiante_id)
            semestre = obtener_semestre_activo(cursor)
            bloques = listar_bloques(cursor)
            matricula = obtener_matricula(cursor, estudiante_id, semestre["id"])
            clases = listar_clases(cursor, estudiante_id, semestre["id"])

            total_creditos = sum(clase["creditos"] for clase in clases)
            cursos_ids = {clase["curso_id"] for clase in clases}

            return {
                "estudiante": estudiante,
                "semestre": semestre,
                "matricula": matricula,
                "dias": DIAS,
                "bloques": bloques,
                "clases": clases,
                "resumen": {
                    "total_cursos": len(cursos_ids),
                    "total_clases": len(clases),
                    "total_creditos": total_creditos,
                },
            }

    finally:
        conn.close()


def obtener_mi_horario_por_usuario(usuario_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            estudiante = obtener_estudiante_por_usuario(cursor, usuario_id)

        return obtener_mi_horario(estudiante["id"])

    finally:
        conn.close()