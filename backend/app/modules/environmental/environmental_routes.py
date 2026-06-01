from fastapi import APIRouter, Query
from fastapi.responses import HTMLResponse, JSONResponse
from app.services.environmental_store import environmental_store


router = APIRouter(
    prefix="/environmental-impact",
    tags=["Impacto Ambiental"]
)


@router.get("", response_class=HTMLResponse)
def environmental_dashboard(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10)
):
    data = environmental_store.get_paginated_metrics(page=page, limit=limit)
    summary = environmental_store.get_summary()

    total_pages = max((data["total"] + limit - 1) // limit, 1)

    rows = ""

    for metric in data["metrics"]:
        rows += f"""
        <tr>
            <td>{metric["created_at"]}</td>
            <td>{metric["method"]}</td>
            <td>{metric["path"]}</td>
            <td>{metric["status_code"]}</td>
            <td>{metric["response_time_ms"]} ms</td>
            <td>{metric["response_bytes"]} bytes</td>
            <td>{metric["co2_estimated"]:.8f} g CO₂</td>
        </tr>
        """

    if not rows:
        rows = """
        <tr>
            <td colspan="7" class="empty">Todavía no hay solicitudes medidas.</td>
        </tr>
        """

    prev_page = max(page - 1, 1)
    next_page = min(page + 1, total_pages)

    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Impacto Ambiental del Proyecto</title>
        <style>
            body {{
                margin: 0;
                font-family: Arial, sans-serif;
                background: #f4f7f6;
                color: #1f2937;
            }}

            .container {{
                padding: 24px;
            }}

            h1 {{
                margin-bottom: 8px;
                color: #14532d;
            }}

            .subtitle {{
                color: #4b5563;
                margin-bottom: 24px;
            }}

            .cards {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }}

            .card {{
                background: white;
                border-radius: 12px;
                padding: 18px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }}

            .card h3 {{
                margin: 0;
                font-size: 14px;
                color: #6b7280;
            }}

            .card p {{
                margin: 8px 0 0;
                font-size: 22px;
                font-weight: bold;
                color: #14532d;
            }}

            .table-wrapper {{
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                overflow: auto;
                max-height: 460px;
            }}

            table {{
                width: 100%;
                border-collapse: collapse;
                min-width: 900px;
            }}

            th, td {{
                padding: 12px 14px;
                border-bottom: 1px solid #e5e7eb;
                text-align: left;
                font-size: 14px;
            }}

            th {{
                background: #14532d;
                color: white;
                position: sticky;
                top: 0;
            }}

            tr:hover {{
                background: #f0fdf4;
            }}

            .empty {{
                text-align: center;
                color: #6b7280;
                padding: 24px;
            }}

            .pagination {{
                margin-top: 18px;
                display: flex;
                gap: 12px;
                align-items: center;
            }}

            .pagination a {{
                text-decoration: none;
                background: #14532d;
                color: white;
                padding: 10px 14px;
                border-radius: 8px;
            }}

            .pagination span {{
                color: #374151;
            }}

            .note {{
                margin-top: 18px;
                font-size: 13px;
                color: #6b7280;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Impacto Ambiental del Proyecto</h1>
            <p class="subtitle">
                Monitoreo temporal de solicitudes HTTP, bytes transferidos y CO₂ estimado.
            </p>

            <div class="cards">
                <div class="card">
                    <h3>Total de solicitudes</h3>
                    <p>{summary["total_requests"]}</p>
                </div>

                <div class="card">
                    <h3>Bytes transferidos</h3>
                    <p>{summary["total_bytes"]}</p>
                </div>

                <div class="card">
                    <h3>CO₂ total estimado</h3>
                    <p>{summary["total_co2"]:.8f} g</p>
                </div>

                <div class="card">
                    <h3>CO₂ promedio</h3>
                    <p>{summary["avg_co2"]:.8f} g</p>
                </div>

                <div class="card">
                    <h3>Tiempo promedio</h3>
                    <p>{summary["avg_response_time"]:.2f} ms</p>
                </div>

                <div class="card">
                    <h3>Endpoint más usado</h3>
                    <p>{summary["most_used_endpoint"]}</p>
                </div>

                <div class="card">
                    <h3>Endpoint más pesado</h3>
                    <p>{summary["heaviest_endpoint"]}</p>
                </div>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha y hora</th>
                            <th>Método</th>
                            <th>Ruta</th>
                            <th>Estado HTTP</th>
                            <th>Tiempo</th>
                            <th>Bytes</th>
                            <th>CO₂ estimado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>

            <div class="pagination">
                <a href="/environmental-impact?page={prev_page}&limit=10">Anterior</a>
                <span>Página {page} de {total_pages}</span>
                <a href="/environmental-impact?page={next_page}&limit=10">Siguiente</a>
            </div>

            <p class="note">
                Las métricas no se guardan en base de datos. Se eliminan automáticamente cuando se reinicia el backend.
            </p>
        </div>
    </body>
    </html>
    """

    return HTMLResponse(content=html)


@router.get("/data")
def environmental_data(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10)
):
    return JSONResponse({
        "summary": environmental_store.get_summary(),
        "data": environmental_store.get_paginated_metrics(page=page, limit=limit),
    })