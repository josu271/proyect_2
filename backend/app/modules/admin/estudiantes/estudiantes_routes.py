from fastapi import APIRouter, Query

from app.modules.admin.estudiantes.estudiantes_schemas import (
    EstudianteCreate,
    EstudianteUpdate,
)
from app.modules.admin.estudiantes.estudiantes_service import (
    listar_programas,
    listar_estudiantes,
    obtener_estudiante,
    crear_estudiante,
    actualizar_estudiante,
    eliminar_estudiante,
)

router = APIRouter(
    prefix="/admin/estudiantes",
    tags=["Admin - Estudiantes"],
)


@router.get("/programas")
def route_listar_programas():
    return listar_programas()


@router.get("")
def route_listar_estudiantes(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    search: str = Query("", max_length=100),
):
    return listar_estudiantes(page=page, limit=limit, search=search)


@router.get("/{estudiante_id}")
def route_obtener_estudiante(estudiante_id: int):
    return obtener_estudiante(estudiante_id)


@router.post("")
def route_crear_estudiante(estudiante: EstudianteCreate):
    return crear_estudiante(estudiante)


@router.put("/{estudiante_id}")
def route_actualizar_estudiante(estudiante_id: int, estudiante: EstudianteUpdate):
    return actualizar_estudiante(estudiante_id, estudiante)


@router.delete("/{estudiante_id}")
def route_eliminar_estudiante(estudiante_id: int):
    return eliminar_estudiante(estudiante_id)