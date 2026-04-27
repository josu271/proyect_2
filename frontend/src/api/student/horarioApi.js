import { apiRequest } from "../apiClient";

export function obtenerHorarioEstudiante(estudianteId) {
  return apiRequest(`/student/horario/${estudianteId}`);
}