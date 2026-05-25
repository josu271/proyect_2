from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class TipoAulaRequerida(str, Enum):
    CUALQUIERA = "CUALQUIERA"
    TEORICA = "TEORICA"
    LABORATORIO = "LABORATORIO"
    VIRTUAL = "VIRTUAL"


class CursoBase(BaseModel):
    programa_id: int = Field(..., gt=0)
    codigo: str = Field(..., min_length=2, max_length=30)
    nombre: str = Field(..., min_length=3, max_length=150)
    creditos: int = Field(..., ge=1, le=6)
    ciclo: Optional[int] = Field(None, ge=1, le=12)
    tipo_aula_requerida: TipoAulaRequerida = TipoAulaRequerida.CUALQUIERA
    activo: bool = True
    prerequisitos_ids: List[int] = []


class CursoCreate(CursoBase):
    pass


class CursoUpdate(CursoBase):
    pass