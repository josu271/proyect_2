import assert from "node:assert/strict";
import test from "node:test";

import {
  loadFrontendModule,
  registerViteServer,
} from "../soporte/viteTestServer.mjs";

registerViteServer();

test("listarCursosDisponiblesMatricula arma la URL paginada del estudiante", async () => {
  // Prueba de consulta de cursos disponibles con paginacion real.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          cursos: [],
          paginacion: {
            page: 2,
            limit: 10,
          },
        };
      },
    };
  };

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-estudiante" : null;
    },
  };

  const { listarCursosDisponiblesMatricula } = await loadFrontendModule(
    "/src/api/student/matriculaApi.js",
  );

  await listarCursosDisponiblesMatricula(31, 2, 10);

  // Verificamos URL, token y tipo de contenido para la solicitud del alumno.
  assert.equal(
    llamadasFetch[0].url,
    "http://localhost:8000/student/matricula/cursos-disponibles/31?page=2&limit=10",
  );
  assert.equal(
    llamadasFetch[0].options.headers.Authorization,
    "Bearer jwt-estudiante",
  );
  assert.equal(
    llamadasFetch[0].options.headers["Content-Type"],
    "application/json",
  );
});

test("confirmarMatriculaEstudiante envia las secciones elegidas por el alumno", async () => {
  // Prueba del envio de la confirmacion final de matricula.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          mensaje: "Matricula confirmada correctamente.",
        };
      },
    };
  };

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-estudiante" : null;
    },
  };

  const { confirmarMatriculaEstudiante } = await loadFrontendModule(
    "/src/api/student/matriculaApi.js",
  );

  await confirmarMatriculaEstudiante({
    estudiante_id: 31,
    secciones_ids: [201, 204],
  });

  // Confirmamos que la seleccion se mande tal como la construyo la UI.
  assert.equal(
    llamadasFetch[0].url,
    "http://localhost:8000/student/matricula/confirmar",
  );
  assert.equal(llamadasFetch[0].options.method, "POST");
  assert.deepEqual(
    JSON.parse(llamadasFetch[0].options.body),
    {
      estudiante_id: 31,
      secciones_ids: [201, 204],
    },
  );
});

test("confirmarMatriculaEstudiante conserva el error del backend cuando la validacion falla", async () => {
  // Prueba del mensaje cuando el backend rechaza la confirmacion del alumno.
  global.fetch = async () => ({
    ok: false,
    async json() {
      return {
        detail: "No puede confirmar una seccion sin horario.",
      };
    },
  });

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-estudiante" : null;
    },
  };

  const { confirmarMatriculaEstudiante } = await loadFrontendModule(
    "/src/api/student/matriculaApi.js",
  );

  // Si esta prueba falla, la UI perderia el mensaje preciso del backend.
  await assert.rejects(
    () =>
      confirmarMatriculaEstudiante({
        estudiante_id: 31,
        secciones_ids: [999],
      }),
    (error) => {
      assert.equal(error.message, "No puede confirmar una seccion sin horario.");
      return true;
    },
  );
});
