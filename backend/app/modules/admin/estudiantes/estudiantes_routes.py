from fastapi import APIRouter
from app.modules.admin.estudiantes.estudiantes_schema import (
    EstudianteCreate,
    EstudianteUpdate
)
from app.modules.admin.estudiantes.estudiantes_service import (
    listar_estudiantes,
    obtener_estudiante,
    crear_estudiante,
    actualizar_estudiante,
    listar_programas
)

router = APIRouter()


@router.get("/")
def get_estudiantes():
    return listar_estudiantes()


@router.get("/programas")
def get_programas():
    return listar_programas()


@router.get("/{estudiante_id}")
def get_estudiante(estudiante_id: int):
    return obtener_estudiante(estudiante_id)


@router.post("/")
def post_estudiante(data: EstudianteCreate):
    return crear_estudiante(data)


@router.put("/{estudiante_id}")
def put_estudiante(estudiante_id: int, data: EstudianteUpdate):
    return actualizar_estudiante(estudiante_id, data)