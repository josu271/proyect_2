from fastapi import APIRouter
from app.modules.admin.docentes.docentes_schema import (
    DocenteCreate,
    DocenteUpdate
)
from app.modules.admin.docentes.docentes_service import (
    listar_docentes,
    obtener_docente,
    crear_docente,
    actualizar_docente
)

router = APIRouter()


@router.get("/")
def get_docentes():
    return listar_docentes()


@router.get("/{docente_id}")
def get_docente(docente_id: int):
    return obtener_docente(docente_id)


@router.post("/")
def post_docente(data: DocenteCreate):
    return crear_docente(data)


@router.put("/{docente_id}")
def put_docente(docente_id: int, data: DocenteUpdate):
    return actualizar_docente(docente_id, data)