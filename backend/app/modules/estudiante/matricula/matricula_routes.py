from fastapi import APIRouter, Query

from app.modules.estudiante.matricula.matricula_schemas import ConfirmarMatriculaRequest
from app.modules.estudiante.matricula.matricula_service import (
    listar_cursos_disponibles,
    confirmar_matricula,
)

router = APIRouter(
    prefix="/student/matricula",
    tags=["Estudiante - Matrícula"]
)


@router.get("/cursos-disponibles/{estudiante_id}")
def obtener_cursos_disponibles(
    estudiante_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
):
    return listar_cursos_disponibles(
        estudiante_id=estudiante_id,
        page=page,
        limit=limit
    )


@router.post("/confirmar")
def registrar_matricula(payload: ConfirmarMatriculaRequest):
    return confirmar_matricula(
        estudiante_id=payload.estudiante_id,
        secciones_ids=payload.secciones_ids
    )