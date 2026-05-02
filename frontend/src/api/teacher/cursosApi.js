import { apiRequest } from "../apiClient";

export function obtenerCursosDelDocente(docenteId) {
  return apiRequest(`/teacher/cursos/docente/${docenteId}`);
}