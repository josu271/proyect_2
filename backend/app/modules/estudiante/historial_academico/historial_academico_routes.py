from typing import Optional

from fastapi import APIRouter, Query

from app.modules.estudiante.historial_academico.historial_academico_service import (
    listar_historial,
    listar_historial_por_usuario,
)

router = APIRouter(
    prefix="/estudiante/historial-academico",
    tags=["Estudiante - Historial Académico"],
)


@router.get("/usuario/{usuario_id}")
def route_listar_historial_por_usuario(
    usuario_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    semestre_id: Optional[int] = Query(None, ge=1),
):
    return listar_historial_por_usuario(
        usuario_id=usuario_id,
        page=page,
        limit=limit,
        semestre_id=semestre_id,
    )


@router.get("/{estudiante_id}")
def route_listar_historial(
    estudiante_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    semestre_id: Optional[int] = Query(None, ge=1),
):
    return listar_historial(
        estudiante_id=estudiante_id,
        page=page,
        limit=limit,
        semestre_id=semestre_id,
    )