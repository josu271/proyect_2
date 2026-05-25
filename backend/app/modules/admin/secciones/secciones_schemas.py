from pydantic import BaseModel, Field


class SeccionCreate(BaseModel):
    nrc: str = Field(..., min_length=2, max_length=30)
    curso_id: int = Field(..., gt=0)
    docente_id: int = Field(..., gt=0)
    aula_id: int = Field(..., gt=0)


class SeccionUpdate(BaseModel):
    nrc: str = Field(..., min_length=2, max_length=30)
    curso_id: int = Field(..., gt=0)
    docente_id: int = Field(..., gt=0)
    aula_id: int = Field(..., gt=0)