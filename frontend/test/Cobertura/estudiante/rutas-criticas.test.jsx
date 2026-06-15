import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { expect, test } from "vitest";

import {
  apiUrl,
  authUsers,
  buildStudentEnrollmentResponse,
  createBaseAcademicState,
} from "../../support/cypress/testData";
import { server, startMockServer } from "../../support/vitest/mswServer";
import { renderApp } from "../../support/vitest/renderHelpers";

startMockServer();

test("cubre la ruta de matricula del estudiante cuando aun no tiene cursos elegidos", async () => {
  // Esta prueba de cobertura confirma que la pantalla abre y maneja el estado vacio.
  localStorage.setItem("token", authUsers.student.token);
  localStorage.setItem("usuario", JSON.stringify(authUsers.student.usuario));

  server.use(
    http.get(
      `${apiUrl}/student/matricula/cursos-disponibles/31`,
      async () => HttpResponse.json(buildStudentEnrollmentResponse(createBaseAcademicState())),
    ),
  );

  renderApp("/estudiante/matricula");

  expect(
    await screen.findByRole("heading", { name: /matr/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/no hay cursos disponibles para matr/i),
  ).toBeInTheDocument();
});
