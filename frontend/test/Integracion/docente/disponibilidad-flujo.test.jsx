import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { expect, test } from "vitest";

import {
  apiUrl,
  authUsers,
  buildTeacherAvailabilityResponse,
  createBaseAcademicState,
  createHorarioFromBlock,
  createSection,
} from "../../support/cypress/testData";
import { server, startMockServer } from "../../support/vitest/mswServer";
import { renderApp } from "../../support/vitest/renderHelpers";

startMockServer();

function guardarSesionDocente() {
  // La integracion necesita la misma sesion que usa la app en produccion.
  localStorage.setItem("token", authUsers.teacher.token);
  localStorage.setItem("usuario", JSON.stringify(authUsers.teacher.usuario));
}

test("integra carga, asignacion y retiro de horario dentro del modulo docente", async () => {
  const usuario = userEvent.setup();
  const estado = createBaseAcademicState();

  estado.secciones = [
    createSection({
      id: 801,
      nrc: "NRC-DOC-01",
    }),
  ];

  guardarSesionDocente();

  server.use(
    http.get(`${apiUrl}/docente/disponibilidad/inicial/2`, async () => {
      // La carga inicial siempre devuelve el estado vivo del docente.
      return HttpResponse.json(buildTeacherAvailabilityResponse(estado));
    }),
    http.post(`${apiUrl}/docente/disponibilidad/asignar-horario`, async ({ request }) => {
      // Aqui el backend simulado actualiza la seccion igual que en el flujo real.
      const body = await request.json();
      const seccion = estado.secciones.find(
        (item) => item.id === Number(body.seccion_id),
      );

      seccion.tieneHorario = true;
      seccion.horario = createHorarioFromBlock(
        body.dia_semana,
        body.bloque_academico_id,
      );

      return HttpResponse.json({
        message: "Horario asignado correctamente. La seccion fue completada.",
      });
    }),
    http.delete(
      `${apiUrl}/docente/disponibilidad/horario/2/:seccionId`,
      async ({ params }) => {
        // Este retiro nos deja validar la recuperacion del estado dentro del modulo.
        const seccion = estado.secciones.find(
          (item) => item.id === Number(params.seccionId),
        );

        seccion.tieneHorario = false;
        seccion.horario = null;

        return HttpResponse.json({
          message: "Horario retirado correctamente.",
        });
      },
    ),
  );

  renderApp("/docente/disponibilidad");

  await screen.findByRole("option", { name: /nrc-doc-01 - base de datos i/i });

  // Prueba del flujo real de seleccionar, guardar y luego quitar una asignacion.
  await usuario.selectOptions(screen.getByRole("combobox"), "801");
  await usuario.click((await screen.findAllByRole("button", { name: /disponible/i }))[0]);
  await usuario.click(screen.getByRole("button", { name: /guardar horario/i }));

  expect(
    await screen.findByText(/horario asignado correctamente/i),
  ).toBeInTheDocument();

  const filaConHorario = screen.getByRole("cell", { name: "NRC-DOC-01" }).closest("tr");
  expect(within(filaConHorario).getByText(/horario asignado/i)).toBeInTheDocument();

  await usuario.click(within(filaConHorario).getByRole("button", { name: /quitar/i }));

  expect(
    await screen.findByText(/horario retirado correctamente/i),
  ).toBeInTheDocument();

  const filaSinHorario = screen.getByRole("cell", { name: "NRC-DOC-01" }).closest("tr");
  expect(within(filaSinHorario).getAllByText(/pendiente/i).length).toBeGreaterThan(0);
});
