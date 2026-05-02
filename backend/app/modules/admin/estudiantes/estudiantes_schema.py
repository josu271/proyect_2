from pydantic import BaseModel
from typing import Optional


class EstudianteCreate(BaseModel):
    correo: str
    contrasena: str
    nombre_completo: str
    numero_identificacion: str
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    programa_id: int


class EstudianteUpdate(BaseModel):
    nombre_completo: str
    numero_identificacion: str
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    programa_id: Optional[int] = None
    activo: Optional[bool] = True