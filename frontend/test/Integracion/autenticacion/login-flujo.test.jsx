import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { expect, test } from "vitest";

import { apiUrl, authUsers } from "../../support/cypress/testData";
import { server, startMockServer } from "../../support/vitest/mswServer";
import { renderApp } from "../../support/vitest/renderHelpers";

startMockServer();

test("integra login, guardado de sesion y redireccion al panel del administrador", async () => {
  const usuario = userEvent.setup();
  const usuarioAdmin = authUsers.admin;

  server.use(
    http.post(`${apiUrl}/auth/login`, async ({ request }) => {
      // La prueba usa el backend simulado pero deja vivo el flujo real de rutas.
      const body = await request.json();

      expect(body).toEqual({
        correo: usuarioAdmin.correo,
        contrasena: usuarioAdmin.contrasena,
      });

      return HttpResponse.json({
        mensaje: "Login correcto",
        token: usuarioAdmin.token,
        redirect: usuarioAdmin.redirect,
        usuario: usuarioAdmin.usuario,
      });
    }),
  );

  renderApp("/login");

  // Prueba del camino exitoso completo desde el formulario hasta el dashboard.
  await usuario.type(screen.getByLabelText(/correo/i), usuarioAdmin.correo);
  await usuario.type(
    screen.getByLabelText(/contras/i),
    usuarioAdmin.contrasena,
  );
  await usuario.click(screen.getByRole("button", { name: /iniciar/i }));

  expect(
    await screen.findByRole("heading", { name: /dashboard administrador/i }),
  ).toBeInTheDocument();
  expect(localStorage.getItem("token")).toBe(usuarioAdmin.token);
});

test("integra el rechazo del backend y mantiene al usuario en la vista de login", async () => {
  const usuario = userEvent.setup();

  server.use(
    http.post(`${apiUrl}/auth/login`, async () => {
      // Forzamos el fallo para validar la integracion entre API, estado y vista.
      return HttpResponse.json(
        {
          detail: "Credenciales incorrectas",
        },
        { status: 401 },
      );
    }),
  );

  renderApp("/login");

  await usuario.type(screen.getByLabelText(/correo/i), "fallo@demo.com");
  await usuario.type(screen.getByLabelText(/contras/i), "incorrecta");
  await usuario.click(screen.getByRole("button", { name: /iniciar/i }));

  // La aplicacion no debe redirigir y debe mostrar el error exacto.
  expect(
    await screen.findByText("Credenciales incorrectas"),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /recuperar/i })).toBeInTheDocument();
});
