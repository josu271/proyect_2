from fastapi import APIRouter, Query

from app.modules.admin.aulas.aulas_schemas import AulaCreate, AulaUpdate
from app.modules.admin.aulas.aulas_service import (
    listar_aulas,
    obtener_aula,
    crear_aula,
    actualizar_aula,
    eliminar_aula,
)

router = APIRouter(
    prefix="/admin/aulas",
    tags=["Admin - Aulas"],
)


@router.get("")
def route_listar_aulas(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    search: str = Query("", max_length=100),
):
    return listar_aulas(page=page, limit=limit, search=search)


@router.get("/{aula_id}")
def route_obtener_aula(aula_id: int):
    return obtener_aula(aula_id)


@router.post("")
def route_crear_aula(aula: AulaCreate):
    return crear_aula(aula)


@router.put("/{aula_id}")
def route_actualizar_aula(aula_id: int, aula: AulaUpdate):
    return actualizar_aula(aula_id, aula)


@router.delete("/{aula_id}")
def route_eliminar_aula(aula_id: int):
    return eliminar_aula(aula_id)