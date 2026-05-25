from typing import Optional

from fastapi import APIRouter, Query

from app.modules.admin.cursos.cursos_schemas import CursoCreate, CursoUpdate
from app.modules.admin.cursos.cursos_service import (
    listar_programas,
    listar_cursos,
    listar_cursos_prerequisitos,
    obtener_curso,
    crear_curso,
    actualizar_curso,
    eliminar_curso,
)

router = APIRouter(
    prefix="/admin/cursos",
    tags=["Admin - Cursos"]
)


@router.get("/programas")
def route_listar_programas(
    search: str = Query("", max_length=100),
    limit: int = Query(6, ge=1, le=6),
):
    return listar_programas(search=search, limit=limit)


@router.get("/prerequisitos/opciones")
def route_listar_cursos_prerequisitos(
    search: str = Query("", max_length=100),
    exclude_id: Optional[int] = Query(None, ge=1),
    limit: int = Query(6, ge=1, le=6),
):
    return listar_cursos_prerequisitos(
        search=search,
        exclude_id=exclude_id,
        limit=limit,
    )


@router.get("")
def route_listar_cursos(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    search: str = Query("", max_length=100),
):
    return listar_cursos(page=page, limit=limit, search=search)


@router.get("/{curso_id}")
def route_obtener_curso(curso_id: int):
    return obtener_curso(curso_id)


@router.post("")
def route_crear_curso(curso: CursoCreate):
    return crear_curso(curso)


@router.put("/{curso_id}")
def route_actualizar_curso(curso_id: int, curso: CursoUpdate):
    return actualizar_curso(curso_id, curso)


@router.delete("/{curso_id}")
def route_eliminar_curso(curso_id: int):
    return eliminar_curso(curso_id)