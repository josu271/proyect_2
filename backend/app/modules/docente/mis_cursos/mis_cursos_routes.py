from fastapi import APIRouter, Query

from app.modules.docente.mis_cursos.mis_cursos_service import (
    listar_mis_cursos_docente,
)

router = APIRouter(
    prefix="/docente/mis-cursos",
    tags=["Docente - Mis cursos"],
)


@router.get("")
def obtener_mis_cursos_docente(
    docente_id: int = Query(..., gt=0),
    semestre_id: int | None = Query(default=None, gt=0),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=10),
):
    return listar_mis_cursos_docente(
        docente_id=docente_id,
        semestre_id=semestre_id,
        page=page,
        limit=limit,
    )


@router.get("/")
def obtener_mis_cursos_docente_con_slash(
    docente_id: int = Query(..., gt=0),
    semestre_id: int | None = Query(default=None, gt=0),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=10),
):
    return listar_mis_cursos_docente(
        docente_id=docente_id,
        semestre_id=semestre_id,
        page=page,
        limit=limit,
    )