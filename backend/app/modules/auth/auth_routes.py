from fastapi import APIRouter
from pydantic import BaseModel
from app.modules.auth.auth_service import login_usuario

router = APIRouter()


class LoginRequest(BaseModel):
    correo: str
    contrasena: str


@router.post("/login")
def login(data: LoginRequest):
    usuario = login_usuario(data.correo, data.contrasena)

    return {
        "mensaje": "Login correcto",
        "usuario": usuario
    }