from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class EstudianteCreate(BaseModel):
    programa_id: int = Field(..., gt=0)
    codigo_estudiante: str = Field(..., min_length=2, max_length=30)
    dni: Optional[str] = Field(None, max_length=15)
    nombre_completo: str = Field(..., min_length=3, max_length=150)
    correo: EmailStr
    ciclo: Optional[int] = Field(None, ge=1, le=12)
    contrasena: str = Field(default="123456", min_length=6, max_length=100)
    activo: bool = True


class EstudianteUpdate(BaseModel):
    programa_id: int = Field(..., gt=0)
    codigo_estudiante: str = Field(..., min_length=2, max_length=30)
    dni: Optional[str] = Field(None, max_length=15)
    nombre_completo: str = Field(..., min_length=3, max_length=150)
    correo: EmailStr
    ciclo: Optional[int] = Field(None, ge=1, le=12)
    contrasena: Optional[str] = Field(None, min_length=6, max_length=100)
    activo: bool = True