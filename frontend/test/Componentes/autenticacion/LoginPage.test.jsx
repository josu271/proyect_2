import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, delay, http } from "msw";
import { Route, Routes } from "react-router-dom";
import { expect, test } from "vitest";

import LoginPage from "../../../src/pages/auth/LoginPage";
import { authUsers, apiUrl } from "../../support/cypress/testData";
import { server, startMockServer } from "../../support/vitest/mswServer";
import { renderWithRouter } from "../../support/vitest/renderHelpers";

startMockServer();

function renderizarPantallaLogin() {
  // Montamos solo las rutas necesarias para seguir el cambio de pantalla.
  return renderWithRouter(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<h1>Panel admin de prueba</h1>} />
    </Routes>,
    "/login",
  );
}

test("muestra estado de carga, guarda la sesion y redirige cuando el login sale bien", async () => {
  const usuario = userEvent.setup();
  const usuarioAdmin = authUsers.admin;

  server.use(
    http.post(`${apiUrl}/auth/login`, async ({ request }) => {
      // Simulamos un backend real que tarda un poco antes de responder.
      const body = await request.json();
      await delay(80);

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

  renderizarPantallaLogin();

  // Prueba del flujo normal de inicio de sesion del administrador.
  await usuario.type(screen.getByLabelText(/correo/i), usuarioAdmin.correo);
  await usuario.type(
    screen.getByLabelText(/contras/i),
    usuarioAdmin.contrasena,
  );
  await usuario.click(screen.getByRole("button", { name: /iniciar/i }));

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /ingresando/i }),
    ).toBeDisabled();
  });

  // Confirmamos que la sesion quede guardada y la UI cambie de ruta.
  expect(
    await screen.findByRole("heading", { name: /panel admin de prueba/i }),
  ).toBeInTheDocument();
  expect(localStorage.getItem("token")).toBe(usuarioAdmin.token);
  expect(JSON.parse(localStorage.getItem("usuario"))).toEqual(
    usuarioAdmin.usuario,
  );
});

test("muestra el error del backend y deja al usuario dentro del formulario", async () => {
  const usuario = userEvent.setup();

  server.use(
    http.post(`${apiUrl}/auth/login`, async () => {
      // Simulamos un rechazo de credenciales para validar el mensaje visible.
      return HttpResponse.json(
        {
          detail: "Credenciales incorrectas",
        },
        { status: 401 },
      );
    }),
  );

  renderizarPantallaLogin();

  await usuario.type(screen.getByLabelText(/correo/i), "fallo@demo.com");
  await usuario.type(screen.getByLabelText(/contras/i), "incorrecta");
  await usuario.click(screen.getByRole("button", { name: /iniciar/i }));

  // La persona debe seguir en login y entender por que no pudo entrar.
  expect(
    await screen.findByText("Credenciales incorrectas"),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /recuperar/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
});
