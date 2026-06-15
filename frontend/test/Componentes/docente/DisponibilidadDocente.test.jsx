import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, delay, http } from "msw";
import { expect, test } from "vitest";

import DisponibilidadDocente from "../../../src/pages/docente/DisponibilidadDocente";
import {
  apiUrl,
  authUsers,
  buildTeacherAvailabilityResponse,
  createBaseAcademicState,
  createHorarioFromBlock,
  createSection,
} from "../../support/cypress/testData";
import { server, startMockServer } from "../../support/vitest/mswServer";
import { renderWithRouter } from "../../support/vitest/renderHelpers";

startMockServer();

function guardarSesionDocente() {
  // Dejamos la sesion lista como si el docente ya hubiera iniciado.
  localStorage.setItem("token", authUsers.teacher.token);
  localStorage.setItem("usuario", JSON.stringify(authUsers.teacher.usuario));
}

function crearEstadoDocente() {
  const estado = createBaseAcademicState();

  estado.secciones = [
    createSection({
      id: 601,
      nrc: "NRC9002",
    }),
    createSection({
      id: 602,
      nrc: "NRC9003",
      codigo: "ARQ510",
      curso: "Arquitectura de Software",
      aula: "LAB-202",
      tieneHorario: true,
      horario: createHorarioFromBlock(1, 1),
    }),
  ];

  return estado;
}

function montarMocksDeDisponibilidad(estado, conDemora = false) {
  server.use(
    http.get(`${apiUrl}/docente/disponibilidad/inicial/2`, async () => {
      // Esta carga inicial mantiene vivo el calendario de la pantalla.
      if (conDemora) {
        await delay(80);
      }

      return HttpResponse.json(buildTeacherAvailabilityResponse(estado));
    }),
    http.post(`${apiUrl}/docente/disponibilidad/asignar-horario`, async ({ request }) => {
      // Este handler simula que el backend guarda el bloque elegido por el docente.
      const body = await request.json();
      const seccion = estado.secciones.find(
        (item) => item.id === Number(body.seccion_id),
      );

      if (seccion) {
        seccion.tieneHorario = true;
        seccion.horario = createHorarioFromBlock(
          body.dia_semana,
          body.bloque_academico_id,
        );
      }

      return HttpResponse.json({
        message: "Horario asignado correctamente. La seccion fue completada.",
      });
    }),
  );
}

test("muestra la carga inicial y orienta al docente si intenta elegir un bloque sin seccion", async () => {
  const usuario = userEvent.setup();
  const estado = crearEstadoDocente();

  guardarSesionDocente();
  montarMocksDeDisponibilidad(estado, true);
  renderWithRouter(<DisponibilidadDocente />);

  // Prueba del estado de carga asincronica antes de que aparezca el calendario.
  expect(screen.getByText(/cargando calendario/i)).toBeInTheDocument();

  await screen.findByRole("option", { name: /nrc9002 - base de datos i/i });

  // Luego validamos la guia de error cuando la persona se adelanta en el flujo.
  await usuario.click((await screen.findAllByRole("button", { name: /disponible/i }))[0]);
  expect(
    await screen.findByText(/primero seleccione una secci/i),
  ).toBeInTheDocument();
});

test("permite asignar un horario y deja visible el nuevo estado de la seccion", async () => {
  const usuario = userEvent.setup();
  const estado = crearEstadoDocente();

  guardarSesionDocente();
  montarMocksDeDisponibilidad(estado);
  renderWithRouter(<DisponibilidadDocente />);

  await screen.findByRole("option", { name: /nrc9002 - base de datos i/i });

  // Prueba del flujo principal donde el docente elige seccion, bloque y guarda.
  await usuario.selectOptions(
    screen.getByRole("combobox"),
    "601",
  );
  await usuario.click((await screen.findAllByRole("button", { name: /disponible/i }))[0]);
  await usuario.click(screen.getByRole("button", { name: /guardar horario/i }));

  expect(
    await screen.findByText(/horario asignado correctamente/i),
  ).toBeInTheDocument();

  // Cerramos confirmando que la tabla ya refleja la asignacion nueva.
  const fila = screen.getByRole("cell", { name: "NRC9002" }).closest("tr");
  await waitFor(() => {
    expect(within(fila).getByText(/horario asignado/i)).toBeInTheDocument();
  });
});
