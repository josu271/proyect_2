import { apiRequest } from "../apiClient";

export function obtenerEstudiantes() {
  return apiRequest("/admin/estudiantes");
}

export function obtenerEstudiantePorId(id) {
  return apiRequest(`/admin/estudiantes/${id}`);
}

export function crearEstudiante(data) {
  return apiRequest("/admin/estudiantes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function actualizarEstudiante(id, data) {
  return apiRequest(`/admin/estudiantes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function obtenerProgramas() {
  return apiRequest("/admin/estudiantes/programas");
}