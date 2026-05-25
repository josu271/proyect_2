from pydantic import BaseModel, Field


class AsignarHorarioCreate(BaseModel):
    usuario_id: int = Field(..., gt=0)
    seccion_id: int = Field(..., gt=0)
    dia_semana: int = Field(..., ge=1, le=6)
    bloque_academico_id: int = Field(..., gt=0)