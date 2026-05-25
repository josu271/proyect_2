const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_URL}/admin/cursos`;

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

export function listarCursos({ page = 1, limit = 10, search = "" } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  return request(`${BASE_URL}?${params.toString()}`);
}

export function buscarProgramasCurso({ search = "", limit = 6 } = {}) {
  const params = new URLSearchParams({
    search,
    limit: String(limit),
  });

  return request(`${BASE_URL}/programas?${params.toString()}`);
}

export function buscarCursosPrerequisitos({
  search = "",
  excludeId = null,
  limit = 6,
} = {}) {
  const params = new URLSearchParams({
    search,
    limit: String(limit),
  });

  if (excludeId) {
    params.append("exclude_id", String(excludeId));
  }

  return request(`${BASE_URL}/prerequisitos/opciones?${params.toString()}`);
}

export function crearCurso(payload) {
  return request(BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function actualizarCurso(id, payload) {
  return request(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function eliminarCurso(id) {
  return request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}