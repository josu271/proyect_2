from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.auth.auth_routes import router as auth_router
from app.modules.admin.cursos.cursos_routes import router as cursos_router
from app.modules.admin.docentes.docentes_routes import router as docentes_router
from app.modules.admin.estudiantes.estudiantes_routes import router as estudiantes_router
from app.modules.admin.aulas.aulas_routes import router as aulas_router
from app.modules.admin.secciones.secciones_routes import router as secciones_router
from app.modules.docente.disponibilidad.disponibilidad_routes import router as disponibilidad_docente_router
from app.modules.docente.mi_horario.mi_horario_routes import (router as mi_horario_docente_router,)
from app.modules.docente.mis_cursos.mis_cursos_routes import (router as mis_cursos_docente_router,)
from app.modules.estudiante.matricula.matricula_routes import router as estudiante_matricula_router
from app.modules.estudiante.mi_horario.mi_horario_routes import router as mi_horario_estudiante_router
from app.modules.estudiante.historial_academico.historial_academico_routes import router as historial_academico_router
from app.modules.estudiante.mis_cursos.mis_cursos_routes import router as mis_cursos_estudiante_router
from app.middleware.environmental_metrics import EnvironmentalMetricsMiddleware
from app.modules.environmental.environmental_routes import router as environmental_router
app = FastAPI(title="Sistema de Horarios Académicos")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(cursos_router)
app.include_router(docentes_router)
app.include_router(estudiantes_router)
app.include_router(aulas_router)
app.include_router(secciones_router)
app.include_router(disponibilidad_docente_router)
app.include_router(mi_horario_docente_router)
app.include_router(mis_cursos_docente_router)
app.include_router(estudiante_matricula_router)
app.include_router(mi_horario_estudiante_router)
app.include_router(historial_academico_router)
app.include_router(mis_cursos_estudiante_router)
app.include_router(environmental_router)
app.add_middleware(EnvironmentalMetricsMiddleware)

@app.get("/")
def root():
    return {"message": "API funcionando"}