from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class TipoAula(str, Enum):
    TEORICA = "TEORICA"
    LABORATORIO = "LABORATORIO"
    AUDITORIO = "AUDITORIO"
    VIRTUAL = "VIRTUAL"


class AulaCreate(BaseModel):
    codigo: str = Field(..., min_length=2, max_length=30)
    nombre: Optional[str] = Field(None, max_length=100)
    tipo_aula: TipoAula = TipoAula.TEORICA
    capacidad: int = Field(..., gt=0)
    ubicacion: Optional[str] = Field(None, max_length=150)
    activa: bool = True


class AulaUpdate(BaseModel):
    codigo: str = Field(..., min_length=2, max_length=30)
    nombre: Optional[str] = Field(None, max_length=100)
    tipo_aula: TipoAula = TipoAula.TEORICA
    capacidad: int = Field(..., gt=0)
    ubicacion: Optional[str] = Field(None, max_length=150)
    activa: bool = True