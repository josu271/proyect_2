from typing import Optional

from fastapi import APIRouter, Query

from app.modules.estudiante.mis_cursos.mis_cursos_service import (
    listar_mis_cursos,
    listar_mis_cursos_por_usuario,
)

router = APIRouter(
    prefix="/estudiante/mis-cursos",
    tags=["Estudiante - Mis Cursos"],
)


@router.get("/usuario/{usuario_id}")
def route_listar_mis_cursos_por_usuario(
    usuario_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    semestre_id: Optional[int] = Query(None, ge=1),
):
    return listar_mis_cursos_por_usuario(
        usuario_id=usuario_id,
        page=page,
        limit=limit,
        semestre_id=semestre_id,
    )


@router.get("/{estudiante_id}")
def route_listar_mis_cursos(
    estudiante_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    semestre_id: Optional[int] = Query(None, ge=1),
):
    return listar_mis_cursos(
        estudiante_id=estudiante_id,
        page=page,
        limit=limit,
        semestre_id=semestre_id,
    )