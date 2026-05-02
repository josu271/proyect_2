from pydantic import BaseModel
from typing import Optional


class DocenteCreate(BaseModel):
    correo: str
    contrasena: str
    nombre_completo: str
    numero_identificacion: str
    telefono: Optional[str] = None
    especialidad: Optional[str] = None


class DocenteUpdate(BaseModel):
    nombre_completo: str
    numero_identificacion: str
    telefono: Optional[str] = None
    especialidad: Optional[str] = None
    activo: Optional[bool] = True