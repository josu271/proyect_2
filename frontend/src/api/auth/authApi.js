    import { apiRequest } from "../apiClient";

export async function login(correo, contrasena) {

  return await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      correo,
      contrasena,
    }),
  });

}