import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { expect, test } from "vitest";

import {
  apiUrl,
  authUsers,
  buildStudentEnrollmentResponse,
  createBaseAcademicState,
  createHorarioFromBlock,
  createSection,
} from "../../support/cypress/testData";
import { server, startMockServer } from "../../support/vitest/mswServer";
import { renderApp } from "../../support/vitest/renderHelpers";

startMockServer();

function guardarSesionEstudiante() {
  // Preparamos la sesion para entrar directo al modulo de matricula.
  localStorage.setItem("token", authUsers.student.token);
  localStorage.setItem("usuario", JSON.stringify(authUsers.student.usuario));
}

test("integra la seleccion de horario y la confirmacion de matricula del alumno", async () => {
  const usuario = userEvent.setup();
  const estado = createBaseAcademicState();

  estado.secciones = [
    createSection({
      id: 901,
      nrc: "NRC-MAT-01",
      codigo: "TDS501",
      curso: "Taller de Software",
      docente: "Marta Pineda",
      aula: "LAB-501",
      creditos: 4,
      tieneHorario: true,
      horario: createHorarioFromBlock(2, 2),
    }),
  ];

  guardarSesionEstudiante();

  server.use(
    http.get(
      `${apiUrl}/student/matricula/cursos-disponibles/31`,
      async () => {
        // La pantalla relee este endpoint antes y despues de confirmar.
        return HttpResponse.json(buildStudentEnrollmentResponse(estado));
      },
    ),
    http.post(`${apiUrl}/student/matricula/confirmar`, async ({ request }) => {
      // Esta confirmacion actualiza el estado compartido del alumno.
      const body = await request.json();
      estado.confirmedSectionIds = body.secciones_ids.map(Number);

      return HttpResponse.json({
        mensaje: "Matricula confirmada correctamente.",
        matricula_id: 700,
      });
    }),
  );

  renderApp("/estudiante/matricula");

  await screen.findByRole("heading", { name: /matr/i });

  // Prueba del flujo central del estudiante para elegir y confirmar su horario.
  await usuario.click(screen.getByRole("button", { name: /elegir horario/i }));
  await usuario.click(screen.getByRole("button", { name: /confirmar matr/i }));

  expect(
    await screen.findByText(/matricula confirmada correctamente/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/^Confirmada$/)).toBeInTheDocument();
  expect(screen.getAllByText("Taller de Software").length).toBeGreaterThan(0);
});
