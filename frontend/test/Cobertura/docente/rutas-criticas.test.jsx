import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { expect, test } from "vitest";

import {
  apiUrl,
  authUsers,
  buildTeacherAvailabilityResponse,
  createBaseAcademicState,
} from "../../support/cypress/testData";
import { server, startMockServer } from "../../support/vitest/mswServer";
import { renderApp } from "../../support/vitest/renderHelpers";

startMockServer();

test("cubre la ruta del docente con sus tablas vacias pero funcionales", async () => {
  // Esta prueba deja registrada la cobertura del modulo docente sin datos previos.
  localStorage.setItem("token", authUsers.teacher.token);
  localStorage.setItem("usuario", JSON.stringify(authUsers.teacher.usuario));

  server.use(
    http.get(`${apiUrl}/docente/disponibilidad/inicial/2`, async () =>
      HttpResponse.json(
        buildTeacherAvailabilityResponse(createBaseAcademicState()),
      ),
    ),
  );

  renderApp("/docente/disponibilidad");

  expect(await screen.findByText(/disponibilidad docente/i)).toBeInTheDocument();
  expect(screen.getByText(/no tienes secciones asignadas/i)).toBeInTheDocument();
});
