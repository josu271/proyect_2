import { apiRequest } from "../apiClient";

export async function obtenerMiHorarioDocente({ docenteId, semestreId }) {
  const params = new URLSearchParams();

  params.append("docente_id", docenteId);

  if (semestreId) {
    params.append("semestre_id", semestreId);
  }

  return apiRequest(`/docente/mi-horario?${params.toString()}`);
}