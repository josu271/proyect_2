from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_connection

app = FastAPI(title="API Horarios")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------
# ROOT
# ----------------------------------------
@app.get("/")
def inicio():
    return {"mensaje": "Backend FastAPI conectado"}


# ----------------------------------------
# LISTAR TABLAS (SOLO PUBLIC)
# ----------------------------------------
@app.get("/tablas")
def listar_tablas():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """)

        tablas = [fila[0] for fila in cursor.fetchall()]

        cursor.close()
        conn.close()

        return {
            "cantidad": len(tablas),
            "tablas": tablas
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------------------
# OBTENER DATOS DE UNA TABLA
# ----------------------------------------
@app.get("/tablas/{nombre_tabla}")
def obtener_tabla(nombre_tabla: str):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Validar que la tabla exista
        cursor.execute("""
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = %s
            );
        """, (nombre_tabla,))

        existe = cursor.fetchone()[0]

        if not existe:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="La tabla no existe")

        # Obtener datos
        cursor.execute(f'SELECT * FROM public."{nombre_tabla}" ORDER BY 1;')

        columnas = [desc[0] for desc in cursor.description]
        datos = [dict(zip(columnas, fila)) for fila in cursor.fetchall()]

        cursor.close()
        conn.close()

        return {
            "tabla": nombre_tabla,
            "cantidad": len(datos),
            "datos": datos
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))