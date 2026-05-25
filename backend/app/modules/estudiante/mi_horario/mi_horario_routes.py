from fastapi import APIRouter

from app.modules.estudiante.mi_horario.mi_horario_service import (
    obtener_mi_horario,
    obtener_mi_horario_por_usuario,
)

router = APIRouter(
    prefix="/estudiante/mi-horario",
    tags=["Estudiante - Mi Horario"],
)


@router.get("/usuario/{usuario_id}")
def route_obtener_mi_horario_por_usuario(usuario_id: int):
    return obtener_mi_horario_por_usuario(usuario_id)


@router.get("/{estudiante_id}")
def route_obtener_mi_horario(estudiante_id: int):
    return obtener_mi_horario(estudiante_id)