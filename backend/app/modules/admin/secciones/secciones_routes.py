from fastapi import APIRouter, Query

from app.modules.admin.secciones.secciones_schemas import SeccionCreate, SeccionUpdate
from app.modules.admin.secciones.secciones_service import (
    listar_opciones,
    buscar_cursos_opciones,
    buscar_docentes_opciones,
    buscar_aulas_opciones,
    listar_secciones,
    obtener_seccion,
    crear_seccion,
    actualizar_seccion,
    eliminar_seccion,
)

router = APIRouter(
    prefix="/admin/secciones",
    tags=["Admin - Secciones/NRC"],
)


@router.get("/opciones")
def route_listar_opciones():
    return listar_opciones()


@router.get("/opciones/cursos")
def route_buscar_cursos_opciones(
    search: str = Query("", max_length=100),
    limit: int = Query(5, ge=1, le=5),
):
    return buscar_cursos_opciones(search=search, limit=limit)


@router.get("/opciones/docentes")
def route_buscar_docentes_opciones(
    search: str = Query("", max_length=100),
    limit: int = Query(5, ge=1, le=5),
):
    return buscar_docentes_opciones(search=search, limit=limit)


@router.get("/opciones/aulas")
def route_buscar_aulas_opciones(
    search: str = Query("", max_length=100),
    limit: int = Query(5, ge=1, le=5),
):
    return buscar_aulas_opciones(search=search, limit=limit)


@router.get("")
def route_listar_secciones(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    search: str = Query("", max_length=100),
):
    return listar_secciones(page=page, limit=limit, search=search)


@router.get("/{seccion_id}")
def route_obtener_seccion(seccion_id: int):
    return obtener_seccion(seccion_id)


@router.post("")
def route_crear_seccion(seccion: SeccionCreate):
    return crear_seccion(seccion)


@router.put("/{seccion_id}")
def route_actualizar_seccion(seccion_id: int, seccion: SeccionUpdate):
    return actualizar_seccion(seccion_id, seccion)


@router.delete("/{seccion_id}")
def route_eliminar_seccion(seccion_id: int):
    return eliminar_seccion(seccion_id)