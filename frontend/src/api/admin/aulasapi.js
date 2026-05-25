const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_URL}/admin/aulas`;

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

export function listarAulas({ page = 1, limit = 10, search = "" } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  return request(`${BASE_URL}?${params.toString()}`);
}

export function crearAula(payload) {
  return request(BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function actualizarAula(id, payload) {
  return request(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function eliminarAula(id) {
  return request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}