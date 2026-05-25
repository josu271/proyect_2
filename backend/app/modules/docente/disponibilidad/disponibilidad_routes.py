from fastapi import APIRouter

from app.modules.docente.disponibilidad.disponibilidad_schemas import (
    AsignarHorarioCreate,
)
from app.modules.docente.disponibilidad.disponibilidad_service import (
    listar_inicial,
    asignar_horario,
    quitar_horario,
)

router = APIRouter(
    prefix="/docente/disponibilidad",
    tags=["Docente - Disponibilidad"],
)


@router.get("/inicial/{usuario_id}")
def route_listar_inicial(usuario_id: int):
    return listar_inicial(usuario_id)


@router.post("/asignar-horario")
def route_asignar_horario(data: AsignarHorarioCreate):
    return asignar_horario(data)


@router.delete("/horario/{usuario_id}/{seccion_id}")
def route_quitar_horario(usuario_id: int, seccion_id: int):
    return quitar_horario(usuario_id, seccion_id)