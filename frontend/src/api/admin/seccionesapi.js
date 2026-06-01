const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_URL}/admin/secciones`;

async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Error en la solicitud.");
  }

  return data;
}

export function listarOpcionesSeccion() {
  return request(`${BASE_URL}/opciones`);
}

export function buscarCursosSeccion({ search = "", limit = 5 } = {}) {
  const params = new URLSearchParams({
    search,
    limit: String(limit),
  });

  return request(`${BASE_URL}/opciones/cursos?${params.toString()}`);
}

export function buscarDocentesSeccion({ search = "", limit = 5 } = {}) {
  const params = new URLSearchParams({
    search,
    limit: String(limit),
  });

  return request(`${BASE_URL}/opciones/docentes?${params.toString()}`);
}

export function buscarAulasSeccion({ search = "", limit = 5 } = {}) {
  const params = new URLSearchParams({
    search,
    limit: String(limit),
  });

  return request(`${BASE_URL}/opciones/aulas?${params.toString()}`);
}

export function listarSecciones({ page = 1, limit = 10, search = "" } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  return request(`${BASE_URL}?${params.toString()}`);
}

export function crearSeccion(payload) {
  return request(BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function actualizarSeccion(id, payload) {
  return request(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function eliminarSeccion(id) {
  return request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}