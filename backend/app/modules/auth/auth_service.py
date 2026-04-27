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

    cursor.close()
    conn.close()

    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña incorrectos"
        )

    return {
        "id": str(usuario[0]),
        "correo": usuario[1],
        "rol": usuario[2]
    }