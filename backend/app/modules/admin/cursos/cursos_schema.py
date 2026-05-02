from pydantic import BaseModel
from typing import Optional


class CursoCreate(BaseModel):
    codigo: str
    nombre: str
    descripcion: Optional[str] = None
    creditos: int
    nivel: int = 1
    programa_id: int


class CursoUpdate(BaseModel):
    codigo: str
    nombre: str
    descripcion: Optional[str] = None
    creditos: int
    nivel: int = 1
    programa_id: int
    activo: bool = True


class AsignarDocenteCurso(BaseModel):
    docente_id: int
    semestre_id: int
    numero_seccion: int
    capacidad: int
    tipo: str = "TEORICO"