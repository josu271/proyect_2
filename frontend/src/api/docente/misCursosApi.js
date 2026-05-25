import { apiRequest } from "../apiClient";

export async function obtenerMisCursosDocente({
  docenteId,
  semestreId,
  page = 1,
  limit = 10,
}) {
  const params = new URLSearchParams();

  params.append("docente_id", docenteId);
  params.append("page", page);
  params.append("limit", limit);

  if (semestreId) {
    params.append("semestre_id", semestreId);
  }

  return apiRequest(`/docente/mis-cursos?${params.toString()}`);
}