import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { expect, test } from "vitest";

import {
  apiUrl,
  authUsers,
  sectionOptions,
} from "../../support/cypress/testData";
import { server, startMockServer } from "../../support/vitest/mswServer";
import { renderApp } from "../../support/vitest/renderHelpers";

startMockServer();

test("cubre la ruta administrativa de secciones con su estado vacio", async () => {
  // Esta prueba de cobertura valida que la ruta principal del modulo monte bien.
  localStorage.setItem("token", authUsers.admin.token);
  localStorage.setItem("usuario", JSON.stringify(authUsers.admin.usuario));

  server.use(
    http.get(`${apiUrl}/admin/secciones/opciones`, async () =>
      HttpResponse.json({
        semestre: sectionOptions.semester,
        cursos: [],
        docentes: [],
        aulas: [],
      }),
    ),
    http.get(`${apiUrl}/admin/secciones`, async () =>
      HttpResponse.json({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 1,
      }),
    ),
  );

  renderApp("/admin/secciones-nrc");

  expect(
    await screen.findByRole("heading", { name: /secciones\/nrc/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/no hay secciones registradas/i)).toBeInTheDocument();
});
