import { apiRequest } from "../apiClient";

export function obtenerHorarioDocente(docenteId) {
  return apiRequest(`/teacher/horario/docente/${docenteId}`);
}