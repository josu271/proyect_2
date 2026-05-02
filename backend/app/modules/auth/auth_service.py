from fastapi import HTTPException
from app.database import get_connection


def login_usuario(correo: str, contrasena: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            u.id,
            u.correo,
            r.nombre AS rol
        FROM usuarios u
        INNER JOIN usuario_roles ur ON u.id = ur.usuario_id
        INNER JOIN roles r ON r.id = ur.rol_id
        WHERE u.correo = %s
        AND u.contrasena_hash = crypt(%s, u.contrasena_hash)
        AND u.activo = TRUE;
    """, (correo, contrasena))

    usuario = cursor.fetchone()

    if not usuario:
        cursor.close()
        conn.close()
        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña incorrectos"
        )

    usuario_id = usuario[0]
    rol = usuario[2]

    docente_id = None
    estudiante_id = None

    if rol == "DOCENTE":
        cursor.execute("""
            SELECT id
            FROM docentes
            WHERE usuario_id = %s
            LIMIT 1;
        """, (usuario_id,))

        docente = cursor.fetchone()

        if docente:
            docente_id = docente[0]

    if rol == "ESTUDIANTE":
        cursor.execute("""
            SELECT id
            FROM estudiantes
            WHERE usuario_id = %s
            LIMIT 1;
        """, (usuario_id,))

        estudiante = cursor.fetchone()

        if estudiante:
            estudiante_id = estudiante[0]

    cursor.close()
    conn.close()

    return {
        "id": str(usuario_id),
        "correo": usuario[1],
        "rol": rol,
        "docente_id": docente_id,
        "estudiante_id": estudiante_id
    }