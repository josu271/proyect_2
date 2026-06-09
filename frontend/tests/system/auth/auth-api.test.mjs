import assert from "node:assert/strict";
import test from "node:test";

import {
  loadFrontendModule,
  registerViteServer,
} from "../../support/viteTestServer.mjs";


registerViteServer();

test("login envía correo y contraseña al endpoint esperado", async () => {
  const fetchCalls = [];

  global.fetch = async (url, options) => {
    fetchCalls.push({ url, options });

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

  global.localStorage = {
    getItem() {
      return null;
    },
  };

  const { login } = await loadFrontendModule("/src/api/auth/authApi.js");

  const response = await login("admin@demo.com", "secreto123");

  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].url, "http://localhost:8000/auth/login");
  assert.equal(fetchCalls[0].options.method, "POST");
  assert.equal(
    fetchCalls[0].options.headers["Content-Type"],
    "application/json",
  );
  assert.deepEqual(
    JSON.parse(fetchCalls[0].options.body),
    {
      correo: "admin@demo.com",
      contrasena: "secreto123",
    },
  );
  assert.equal(response.redirect, "/admin");
});


test("apiRequest reutiliza el detalle del backend cuando la petición falla", async () => {
  global.fetch = async () => ({
    ok: false,
    async json() {
      return {
        detail: "Credenciales incorrectas",
      };
    },
  });

  global.localStorage = {
    getItem() {
      return "jwt-demo";
    },
  };

  const { apiRequest } = await loadFrontendModule("/src/api/apiClient.js");

  await assert.rejects(
    () => apiRequest("/auth/login", { method: "POST", body: "{}" }),
    (error) => {
      assert.equal(error.message, "Credenciales incorrectas");
      return true;
    },
  );
});
