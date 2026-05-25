const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_URL}/docente/disponibilidad`;

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

export function obtenerInicialDisponibilidad(usuarioId) {
  return request(`${BASE_URL}/inicial/${usuarioId}`);
}

export function asignarHorarioDocente(payload) {
  return request(`${BASE_URL}/asignar-horario`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function quitarHorarioDocente(usuarioId, seccionId) {
  return request(`${BASE_URL}/horario/${usuarioId}/${seccionId}`, {
    method: "DELETE",
  });
}