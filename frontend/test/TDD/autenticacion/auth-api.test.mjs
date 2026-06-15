import assert from "node:assert/strict";
import test from "node:test";

import {
  loadFrontendModule,
  registerViteServer,
} from "../soporte/viteTestServer.mjs";

registerViteServer();

test("login envia correo y contrasena al endpoint esperado", async () => {
  // Prueba del envio correcto de credenciales en el inicio de sesion.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          mensaje: "Login correcto",
          token: "jwt-demo",
          redirect: "/admin",
          usuario: {
            id: 1,
            correo: "admin@demo.com",
            rol: "ADMIN",
          },
        };
      },
    };
  };

  // Esta sesion vacia representa a un usuario que aun no esta autenticado.
  global.localStorage = {
    getItem() {
      return null;
    },
  };

  const { login } = await loadFrontendModule("/src/api/auth/authApi.js");
  const respuesta = await login("admin@demo.com", "secreto123");

  // Aqui verificamos que la peticion salga con la URL, metodo y body correctos.
  assert.equal(llamadasFetch.length, 1);
  assert.equal(llamadasFetch[0].url, "http://localhost:8000/auth/login");
  assert.equal(llamadasFetch[0].options.method, "POST");
  assert.equal(
    llamadasFetch[0].options.headers["Content-Type"],
    "application/json",
  );
  assert.deepEqual(
    JSON.parse(llamadasFetch[0].options.body),
    {
      correo: "admin@demo.com",
      contrasena: "secreto123",
    },
  );
  assert.equal(respuesta.redirect, "/admin");
});

test("apiRequest reutiliza el detalle del backend cuando la peticion falla", async () => {
  // Prueba del mensaje de error cuando el backend responde con una falla controlada.
  global.fetch = async () => ({
    ok: false,
    async json() {
      return {
        detail: "Credenciales incorrectas",
      };
    },
  });

  // Esta sesion ya tiene token para simular una llamada protegida.
  global.localStorage = {
    getItem() {
      return "jwt-demo";
    },
  };

  const { apiRequest } = await loadFrontendModule("/src/api/apiClient.js");

  // Aqui comprobamos que el helper conserva el detalle real del backend.
  await assert.rejects(
    () => apiRequest("/auth/login", { method: "POST", body: "{}" }),
    (error) => {
      assert.equal(error.message, "Credenciales incorrectas");
      return true;
    },
  );
});
