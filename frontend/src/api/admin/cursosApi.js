import { apiRequest } from "../apiClient";

export function obtenerCursos() {
  return apiRequest("/admin/cursos/");
}

export function obtenerCursoPorId(id) {
  return apiRequest(`/admin/cursos/${id}`);
}

export function crearCurso(data) {
  return apiRequest("/admin/cursos/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function actualizarCurso(id, data) {
  return apiRequest(`/admin/cursos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function obtenerProgramasCursos() {
  return apiRequest("/admin/cursos/programas");
}

export function obtenerDocentesCursos() {
  return apiRequest("/admin/cursos/docentes");
}

export function obtenerSemestresCursos() {
  return apiRequest("/admin/cursos/semestres");
}

export function asignarDocenteCurso(cursoId, data) {
  return apiRequest(`/admin/cursos/${cursoId}/asignar-docente`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}