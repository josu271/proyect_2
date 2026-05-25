from fastapi import APIRouter, HTTPException

from app.modules.auth.auth_schemas import LoginRequest
from app.modules.auth.auth_service import login_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/login")
def login(data: LoginRequest):

    response = login_user(
        data.correo,
        data.contrasena
    )

    if not response:
        raise HTTPException(
            status_code=401,
            detail="Credenciales incorrectas"
        )

    return response