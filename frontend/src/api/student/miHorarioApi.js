    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_URL}/estudiante/mi-horario`;

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

export function obtenerMiHorarioEstudiante({ estudianteId, usuarioId }) {
  if (estudianteId) {
    return request(`${BASE_URL}/${estudianteId}`);
  }

  return request(`${BASE_URL}/usuario/${usuarioId}`);
}