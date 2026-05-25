from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class DocenteCreate(BaseModel):
    codigo_docente: str = Field(..., min_length=2, max_length=30)
    dni: Optional[str] = Field(None, max_length=15)
    nombre_completo: str = Field(..., min_length=3, max_length=150)
    correo: EmailStr
    especialidad: Optional[str] = Field(None, max_length=150)
    contrasena: str = Field(default="123456", min_length=6, max_length=100)
    activo: bool = True


class DocenteUpdate(BaseModel):
    codigo_docente: str = Field(..., min_length=2, max_length=30)
    dni: Optional[str] = Field(None, max_length=15)
    nombre_completo: str = Field(..., min_length=3, max_length=150)
    correo: EmailStr
    especialidad: Optional[str] = Field(None, max_length=150)
    contrasena: Optional[str] = Field(None, min_length=6, max_length=100)
    activo: bool = True