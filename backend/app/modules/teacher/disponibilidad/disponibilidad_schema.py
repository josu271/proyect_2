from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import time


class DisponibilidadBase(BaseModel):
    dia_semana: int = Field(..., ge=1, le=5)
    hora_inicio: time
    hora_fin: time
    turno: Optional[Literal["MANANA", "TARDE"]] = None
    disponible: bool = True

    @field_validator("hora_fin")
    def validar_horas(cls, v, values):
        hora_inicio = values.data.get("hora_inicio")
        if hora_inicio and v <= hora_inicio:
            raise ValueError("hora_fin debe ser mayor que hora_inicio")
        return v


class DisponibilidadCreate(DisponibilidadBase):
    docente_id: int
    curso_id: int
    semestre_id: int


class DisponibilidadUpdate(DisponibilidadBase):
    pass