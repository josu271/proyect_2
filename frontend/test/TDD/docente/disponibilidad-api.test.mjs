import assert from "node:assert/strict";
import test from "node:test";

import {
  loadFrontendModule,
  registerViteServer,
} from "../soporte/viteTestServer.mjs";

registerViteServer();

test("obtenerInicialDisponibilidad consulta la carga base del docente autenticado", async () => {
  // Prueba de la lectura inicial del calendario y las secciones del docente.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          docente: {
            docente_id: 21,
          },
          secciones: [],
          bloques: [],
          disponibilidad: [],
        };
      },
    };
  };

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-docente" : null;
    },
  };

  const { obtenerInicialDisponibilidad } = await loadFrontendModule(
    "/src/api/docente/disponibilidadapi.js",
  );

  await obtenerInicialDisponibilidad(2);

  // Verificamos la URL protegida y el token de sesion.
  assert.equal(llamadasFetch.length, 1);
  assert.equal(
    llamadasFetch[0].url,
    "http://localhost:8000/docente/disponibilidad/inicial/2",
  );
  assert.equal(
    llamadasFetch[0].options.headers.Authorization,
    "Bearer jwt-docente",
  );
});

test("asignarHorarioDocente envia el bloque y el dia elegidos por el docente", async () => {
  // Prueba del guardado del horario seleccionado en el calendario.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          message: "Horario asignado correctamente.",
        };
      },
    };
  };

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-docente" : null;
    },
  };

  const { asignarHorarioDocente } = await loadFrontendModule(
    "/src/api/docente/disponibilidadapi.js",
  );

  await asignarHorarioDocente({
    usuario_id: 2,
    seccion_id: 501,
    dia_semana: 2,
    bloque_academico_id: 3,
  });

  // Asi evitamos que el backend reciba datos incompletos o en otra forma.
  assert.equal(
    llamadasFetch[0].url,
    "http://localhost:8000/docente/disponibilidad/asignar-horario",
  );
  assert.equal(llamadasFetch[0].options.method, "POST");
  assert.deepEqual(
    JSON.parse(llamadasFetch[0].options.body),
    {
      usuario_id: 2,
      seccion_id: 501,
      dia_semana: 2,
      bloque_academico_id: 3,
    },
  );
});

test("quitarHorarioDocente apunta al endpoint correcto para retirar una asignacion", async () => {
  // Prueba de la accion de quitar horario desde la tabla del docente.
  const llamadasFetch = [];

  global.fetch = async (url, options) => {
    llamadasFetch.push({ url, options });

    return {
      ok: true,
      async json() {
        return {
          message: "Horario retirado correctamente.",
        };
      },
    };
  };

  global.localStorage = {
    getItem(clave) {
      return clave === "token" ? "jwt-docente" : null;
    },
  };

  const { quitarHorarioDocente } = await loadFrontendModule(
    "/src/api/docente/disponibilidadapi.js",
  );

  await quitarHorarioDocente(2, 501);

  // Confirmamos que la accion se resuelva con un DELETE a la ruta esperada.
  assert.equal(
    llamadasFetch[0].url,
    "http://localhost:8000/docente/disponibilidad/horario/2/501",
  );
  assert.equal(llamadasFetch[0].options.method, "DELETE");
});
