import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

import { renderApp } from "../../support/vitest/renderHelpers";

test("cubre las rutas de login y recuperar password desde la navegacion real", async () => {
  const usuario = userEvent.setup();

  renderApp("/login");

  // Esta prueba de cobertura recorre las dos rutas criticas de autenticacion.
  expect(screen.getByRole("button", { name: /iniciar/i })).toBeInTheDocument();

  await usuario.click(screen.getByRole("link", { name: /recuperar/i }));

  expect(
    await screen.findByRole("button", { name: /enviar enlace/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /volver al inicio/i })).toBeInTheDocument();
});
