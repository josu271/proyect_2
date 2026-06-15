import { screen } from "@testing-library/react";
import { HttpResponse, delay, http } from "msw";
import { expect, test } from "vitest";

import MiHorarioEstudiante from "../../../src/pages/estudiante/MiHorarioEstudiante";
import {
  apiUrl,
  authUsers,
  buildStudentScheduleResponse,
  createBaseAcademicState,
  createHorarioFromBlock,
  createSection,
} from "../../support/cypress/testData";
import { server, startMockServer } from "../../support/vitest/mswServer";
import { renderWithRouter } from "../../support/vitest/renderHelpers";

startMockServer();

function guardarSesionEstudiante() {
  // Simulamos una sesion normal del alumno para que la pagina pueda consultar.
  localStorage.setItem("token", authUsers.student.token);
  localStorage.setItem("usuario", JSON.stringify(authUsers.student.usuario));
}

test("muestra el estado de carga y luego el mensaje vacio cuando aun no hay horario", async () => {
  const estado = createBaseAcademicState();

  guardarSesionEstudiante();
  server.use(
    http.get(`${apiUrl}/estudiante/mi-horario/31`, async () => {
      // La demora nos deja comprobar visualmente el estado de carga.
      await delay(80);
      return HttpResponse.json(buildStudentScheduleResponse(estado));
    }),
  );

  renderWithRouter(<MiHorarioEstudiante />);

  // Prueba del comportamiento asincronico mientras el horario se consulta.
  expect(screen.getByText(/cargando tu horario/i)).toBeInTheDocument();

  // Cuando no hay clases confirmadas, la vista debe quedar clara para el alumno.
  expect(
    await screen.findByText(/no tienes cursos matriculados con horario asignado/i),
  ).toBeInTheDocument();
});

test("muestra un error entendible cuando la API no puede responder", async () => {
  guardarSesionEstudiante();
  server.use(
    http.get(`${apiUrl}/estudiante/mi-horario/31`, async () => {
      // Esta respuesta simula una caida del backend.
      return HttpResponse.json(
        {
          detail: "No se pudo cargar el horario del alumno.",
        },
        { status: 500 },
      );
    }),
  );

  renderWithRouter(<MiHorarioEstudiante />);

  // El alumno debe ver el detalle de error sin que la UI se rompa.
  expect(
    await screen.findByText("No se pudo cargar el horario del alumno."),
  ).toBeInTheDocument();
});

test("renderiza la clase confirmada y el resumen cuando el horario existe", async () => {
  const estado = createBaseAcademicState();

  estado.secciones = [
    createSection({
      id: 701,
      nrc: "NRC-TDS",
      codigo: "TDS501",
      curso: "Taller de Software",
      docente: "Marta Pineda",
      aula: "LAB-501",
      creditos: 4,
      tieneHorario: true,
      horario: createHorarioFromBlock(2, 2),
    }),
  ];
  estado.confirmedSectionIds = [701];

  guardarSesionEstudiante();
  server.use(
    http.get(`${apiUrl}/estudiante/mi-horario/31`, async () => {
      // Esta respuesta representa un horario ya confirmado por el sistema.
      return HttpResponse.json(buildStudentScheduleResponse(estado));
    }),
  );

  renderWithRouter(<MiHorarioEstudiante />);

  // Prueba del estado completo con clase visible, resumen y exportacion.
  expect((await screen.findAllByText("Taller de Software")).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/NRC-TDS/).length).toBeGreaterThan(0);
  expect(screen.getByText(/confirmada/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /exportar pdf/i }),
  ).toBeInTheDocument();
});
