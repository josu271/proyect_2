import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from app.services.environmental_store import environmental_store


class EnvironmentalMetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        path = request.url.path

        # Evita que el propio dashboard se mida a sí mismo
        if path.startswith("/environmental-impact"):
            return await call_next(request)

        start_time = time.perf_counter()

        response = await call_next(request)

        body_chunks = []
        async for chunk in response.body_iterator:
            body_chunks.append(chunk)

        body = b"".join(body_chunks)

        response_time_ms = round((time.perf_counter() - start_time) * 1000, 2)
        response_bytes = len(body)

        environmental_store.add_metric(
            method=request.method,
            path=path,
            status_code=response.status_code,
            response_time_ms=response_time_ms,
            response_bytes=response_bytes,
        )

        headers = dict(response.headers)
        headers.pop("content-length", None)

        return Response(
            content=body,
            status_code=response.status_code,
            headers=headers,
            media_type=response.media_type,
        )