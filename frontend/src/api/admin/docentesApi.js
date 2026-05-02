import { apiRequest } from "../apiClient";

export function obtenerDocentes() {
  return apiRequest("/admin/docentes");
}

export function obtenerDocentePorId(id) {
  return apiRequest(`/admin/docentes/${id}`);
}

export function crearDocente(data) {
  return apiRequest("/admin/docentes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function actualizarDocente(id, data) {
  return apiRequest(`/admin/docentes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}