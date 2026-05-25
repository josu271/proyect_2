from fastapi import APIRouter, Query

from app.modules.docente.mi_horario.mi_horario_service import (
    obtener_mi_horario_docente,
)

router = APIRouter(
    prefix="/docente/mi-horario",
    tags=["Docente - Mi horario"],
)


@router.get("")
def listar_mi_horario_docente(
    docente_id: int = Query(..., gt=0),
    semestre_id: int | None = Query(default=None, gt=0),
):
    return obtener_mi_horario_docente(docente_id, semestre_id)


@router.get("/")
def listar_mi_horario_docente_con_slash(
    docente_id: int = Query(..., gt=0),
    semestre_id: int | None = Query(default=None, gt=0),
):
    return obtener_mi_horario_docente(docente_id, semestre_id)