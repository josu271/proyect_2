from fastapi import APIRouter, Query

from app.modules.admin.docentes.docentes_schemas import DocenteCreate, DocenteUpdate
from app.modules.admin.docentes.docentes_service import (
    listar_docentes,
    obtener_docente,
    crear_docente,
    actualizar_docente,
    eliminar_docente,
)

router = APIRouter(
    prefix="/admin/docentes",
    tags=["Admin - Docentes"],
)


@router.get("")
def route_listar_docentes(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    search: str = Query("", max_length=100),
):
    return listar_docentes(page=page, limit=limit, search=search)


@router.get("/{docente_id}")
def route_obtener_docente(docente_id: int):
    return obtener_docente(docente_id)


@router.post("")
def route_crear_docente(docente: DocenteCreate):
    return crear_docente(docente)


@router.put("/{docente_id}")
def route_actualizar_docente(docente_id: int, docente: DocenteUpdate):
    return actualizar_docente(docente_id, docente)


@router.delete("/{docente_id}")
def route_eliminar_docente(docente_id: int):
    return eliminar_docente(docente_id)