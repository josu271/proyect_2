import { apiRequest } from "./apiClient";

export function login(correo, contrasena) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      correo,
      contrasena,
    }),
  });
}