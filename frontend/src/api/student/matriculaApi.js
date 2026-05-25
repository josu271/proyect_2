const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
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

export function listarCursosDisponiblesMatricula(
  estudianteId,
  page = 1,
  limit = 5
) {
  return request(
    `/student/matricula/cursos-disponibles/${estudianteId}?page=${page}&limit=${limit}`
  );
}

export function confirmarMatriculaEstudiante(payload) {
  return request("/student/matricula/confirmar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}