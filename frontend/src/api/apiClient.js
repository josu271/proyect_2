const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Error en la petición");
  }

  return data;
}