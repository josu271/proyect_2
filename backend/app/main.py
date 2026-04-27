from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.auth.auth_routes import router as auth_router
from app.modules.admin.estudiantes.estudiantes_routes import router as estudiantes_router
from app.modules.admin.docentes.docentes_routes import router as docentes_router
from app.modules.admin.cursos.cursos_routes import router as cursos_router
from app.modules.teacher.disponibilidad.disponibilidad_routes import router as disponibilidad_router
from app.modules.teacher.cursos.cursos_routes import router as teacher_cursos_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(estudiantes_router, prefix="/admin/estudiantes", tags=["Admin - Estudiantes"])
app.include_router(docentes_router,prefix="/admin/docentes",tags=["Admin - Docentes"])
app.include_router(cursos_router,prefix="/admin/cursos",tags=["Admin - Cursos"])
app.include_router(disponibilidad_router, prefix="/teacher/disponibilidad", tags=["Teacher - Disponibilidad"])
app.include_router(teacher_cursos_router, prefix="/teacher/cursos", tags=["Teacher - Cursos"])

@app.get("/")
def inicio():
    return {"mensaje": "Backend funcionando"}