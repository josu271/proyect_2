import os
import jwt

from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import get_connection

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_key").strip()
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256").strip()
JWT_EXPIRE_HOURS = int(os.getenv("JWT_EXPIRE_HOURS", "8"))

security = HTTPBearer()


def create_token(usuario):
    payload = {
        "sub": str(usuario["id"]),
        "correo": usuario["correo"],
        "rol": usuario["rol"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS),
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )


def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token ha expirado."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido."
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = decode_token(token)

    usuario_id = payload.get("sub")

    if not usuario_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token sin usuario válido."
        )

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, correo, rol, activo
            FROM usuarios
            WHERE id = %s
              AND activo = TRUE
        """, (usuario_id,))

        usuario = cur.fetchone()

        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado o inactivo."
            )

        return usuario

    finally:
        cur.close()
        conn.close()


def require_docente(usuario=Depends(get_current_user)):
    if usuario["rol"] != "DOCENTE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso permitido solo para docentes."
        )

    return usuario


def get_current_docente(usuario=Depends(require_docente)):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                id,
                usuario_id,
                codigo_docente,
                nombre_completo,
                especialidad,
                activo
            FROM docentes
            WHERE usuario_id = %s
              AND activo = TRUE
        """, (usuario["id"],))

        docente = cur.fetchone()

        if not docente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No existe un docente activo asociado a este usuario."
            )

        return docente

    finally:
        cur.close()
        conn.close()