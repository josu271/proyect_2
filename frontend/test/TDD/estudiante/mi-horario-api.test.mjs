import assert from "node:assert/strict";
import test from "node:test";

import {
  loadFrontendModule,
  registerViteServer,
} from "../soporte/viteTestServer.mjs";

registerViteServer();

test("obtenerMiHorarioEstudiante prioriza el endpoint por estudiante cuando existe estudianteId", async () => {
  // Prueba del caso mas comun: consultar el horario usando el id del estudiante.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          clases: [],
        };
      },
    };
  };

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-estudiante" : null;
    },
  };

  const { obtenerMiHorarioEstudiante } = await loadFrontendModule(
    "/src/api/student/miHorarioApi.js",
  );

  await obtenerMiHorarioEstudiante({
    estudianteId: 31,
    usuarioId: 3,
  });

  // Nos aseguramos de que tome la ruta correcta para no mezclar identidades.
  assert.equal(
    llamadasFetch[0].url,
    "http://localhost:8000/estudiante/mi-horario/31",
  );
  assert.equal(
    llamadasFetch[0].options.headers.Authorization,
    "Bearer jwt-estudiante",
  );
});

test("obtenerMiHorarioEstudiante usa la ruta por usuario cuando no hay estudianteId", async () => {
  // Prueba del fallback por usuario para sesiones que no traen estudiante_id.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          clases: [],
        };
      },
    };
  };

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-estudiante" : null;
    },
  };

  const { obtenerMiHorarioEstudiante } = await loadFrontendModule(
    "/src/api/student/miHorarioApi.js",
  );

  await obtenerMiHorarioEstudiante({
    estudianteId: null,
    usuarioId: 3,
  });

  // Esta verificacion protege el camino alterno que usa la pantalla.
  assert.equal(
    llamadasFetch[0].url,
    "http://localhost:8000/estudiante/mi-horario/usuario/3",
  );
});
