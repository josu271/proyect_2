import { apiRequest } from "../apiClient";

export function obtenerDisponibilidades() {
  return apiRequest("/teacher/disponibilidad/");
}

export function obtenerDisponibilidadPorDocente(docenteId) {
  return apiRequest(`/teacher/disponibilidad/docente/${docenteId}`);
}

export function obtenerCursosDocente(docenteId) {
  return apiRequest(`/teacher/disponibilidad/docente/${docenteId}/cursos`);
}

export function obtenerSemestres() {
  return apiRequest("/teacher/disponibilidad/semestres");
}

export function crearDisponibilidad(data) {
  return apiRequest("/teacher/disponibilidad/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function eliminarDisponibilidad(id) {
  return apiRequest(`/teacher/disponibilidad/${id}`, {
    method: "DELETE",
  });
}