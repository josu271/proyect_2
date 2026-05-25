from fastapi import HTTPException

from app.database import get_connection
from app.core.security import create_token


def obtener_redirect_por_rol(rol: str):
    rutas = {
        "ADMIN": "/admin",
        "DOCENTE": "/docente",
        "ESTUDIANTE": "/estudiante"
    }
    return rutas.get(rol)


def login_user(correo: str, contrasena: str):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT
                u.id,
                u.correo,
                u.rol,
                d.id AS docente_id,
                e.id AS estudiante_id
            FROM usuarios u
            LEFT JOIN docentes d ON d.usuario_id = u.id
            LEFT JOIN estudiantes e ON e.usuario_id = u.id
            WHERE u.correo = %s
              AND u.contrasena_hash = crypt(%s, u.contrasena_hash)
              AND u.activo = TRUE
        """, (correo, contrasena))

        usuario = cur.fetchone()

        cur.close()
        conn.close()

        if not usuario:
            return None

        redirect = obtener_redirect_por_rol(usuario["rol"])

        return {
            "mensaje": "Login correcto",
            "token": create_token(usuario),
            "redirect": redirect,
            "usuario": {
                "id": usuario["id"],
                "correo": usuario["correo"],
                "rol": usuario["rol"],
                "docente_id": usuario["docente_id"],
                "estudiante_id": usuario["estudiante_id"]
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en login: {str(e)}"
        )