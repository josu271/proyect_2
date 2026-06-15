import assert from "node:assert/strict";
import test from "node:test";

import {
  loadFrontendModule,
  registerViteServer,
} from "../soporte/viteTestServer.mjs";

registerViteServer();

test("listarSecciones arma la consulta con pagina, limite y texto de busqueda", async () => {
  // Prueba de listado administrativo con todos los parametros visibles.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          items: [],
          total: 0,
          page: 2,
          limit: 15,
          total_pages: 0,
        };
      },
    };
  };

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-admin" : null;
    },
  };

  const { listarSecciones } = await loadFrontendModule("/src/api/admin/seccionesapi.js");
  await listarSecciones({
    page: 2,
    limit: 15,
    search: "BD",
  });

  // Comprobamos que el admin consulte exactamente la URL esperada.
  assert.equal(llamadasFetch.length, 1);
  assert.equal(
    llamadasFetch[0].url,
    "http://localhost:8000/admin/secciones?page=2&limit=15&search=BD",
  );
  assert.equal(
    llamadasFetch[0].options.headers.Authorization,
    "Bearer jwt-admin",
  );
});

test("crearSeccion envia el payload completo para registrar un nuevo NRC", async () => {
  // Prueba del alta de una seccion desde el modulo administrativo.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          id: 501,
          nrc: "NRC9001",
        };
      },
    };
  };

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-admin" : null;
    },
  };

  const { crearSeccion } = await loadFrontendModule("/src/api/admin/seccionesapi.js");
  await crearSeccion({
    nrc: "NRC9001",
    curso_id: 101,
    docente_id: 21,
    aula_id: 31,
  });

  // Revisamos metodo, URL y body para evitar altas mal construidas.
  assert.equal(llamadasFetch.length, 1);
  assert.equal(llamadasFetch[0].url, "http://localhost:8000/admin/secciones");
  assert.equal(llamadasFetch[0].options.method, "POST");
  assert.deepEqual(
    JSON.parse(llamadasFetch[0].options.body),
    {
      nrc: "NRC9001",
      curso_id: 101,
      docente_id: 21,
      aula_id: 31,
    },
  );
});

test("eliminarSeccion conserva el detalle del backend cuando la cancelacion falla", async () => {
  // Prueba del mensaje real cuando el backend rechaza la cancelacion.
  global.fetch = async () => ({
    ok: false,
    async json() {
      return {
        detail: "La seccion ya fue procesada por el docente.",
      };
    },
  });

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-admin" : null;
    },
  };

  const { eliminarSeccion } = await loadFrontendModule("/src/api/admin/seccionesapi.js");

  // La idea es asegurar que la UI pueda mostrar el motivo exacto del fallo.
  await assert.rejects(
    () => eliminarSeccion(501),
    (error) => {
      assert.equal(error.message, "La seccion ya fue procesada por el docente.");
      return true;
    },
  );
});
