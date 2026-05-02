import { apiRequest } from "../apiClient";

export function obtenerCursosDisponiblesMatricula(estudianteId) {
  return apiRequest(`/student/matricula/cursos-disponibles/${estudianteId}`);
}

export function registrarMatricula(estudianteId, secciones) {
  return apiRequest("/student/matricula/registrar", {
    method: "POST",
    body: JSON.stringify({
      estudiante_id: estudianteId,
      secciones,
    }),
  });
}