from fastapi import APIRouter
from app.modules.admin.cursos.cursos_schema import (
    CursoCreate,
    CursoUpdate,
    AsignarDocenteCurso
)
from app.modules.admin.cursos.cursos_service import (
    listar_cursos,
    obtener_curso,
    crear_curso,
    actualizar_curso,
    listar_programas,
    listar_docentes,
    listar_semestres,
    asignar_docente_a_curso
)

router = APIRouter()


@router.get("/")
def get_cursos():
    return listar_cursos()


@router.get("/programas")
def get_programas():
    return listar_programas()


@router.get("/docentes")
def get_docentes():
    return listar_docentes()


@router.get("/semestres")
def get_semestres():
    return listar_semestres()


@router.get("/{curso_id}")
def get_curso(curso_id: int):
    return obtener_curso(curso_id)


@router.post("/")
def post_curso(data: CursoCreate):
    return crear_curso(data)


@router.put("/{curso_id}")
def put_curso(curso_id: int, data: CursoUpdate):
    return actualizar_curso(curso_id, data)


@router.post("/{curso_id}/asignar-docente")
def post_asignar_docente(curso_id: int, data: AsignarDocenteCurso):
    return asignar_docente_a_curso(curso_id, data)