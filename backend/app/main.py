from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.auth.auth_routes import router as auth_router
from app.modules.admin.estudiantes.estudiantes_routes import router as estudiantes_router
from app.modules.admin.docentes.docentes_routes import router as docentes_router

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
app.include_router( docentes_router,prefix="/admin/docentes",tags=["Admin - Docentes"]
)


@app.get("/")
def inicio():
    return {"mensaje": "Backend funcionando"}