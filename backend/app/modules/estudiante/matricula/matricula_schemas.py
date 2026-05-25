from typing import List
from pydantic import BaseModel


class ConfirmarMatriculaRequest(BaseModel):
    estudiante_id: int
    secciones_ids: List[int]