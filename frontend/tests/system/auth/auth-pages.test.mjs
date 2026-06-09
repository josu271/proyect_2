import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import {
  loadFrontendModule,
  registerViteServer,
} from "../../support/viteTestServer.mjs";


registerViteServer();

async function renderRoute(pathname) {
  const { default: AppRoutes } = await loadFrontendModule("/src/routes/AppRoutes.jsx");

  return renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: [pathname] },
      React.createElement(AppRoutes),
    ),
  );
}


test("la ruta de login muestra los campos principales del formulario", async () => {
  const html = await renderRoute("/login");

  assert.match(html, /id="correo"/);
  assert.match(html, /name="correo"/);
  assert.match(html, /type="email"/);
  assert.match(html, /autoComplete="email"/);
  assert.match(html, /id="contrasena"/);
  assert.match(html, /name="contrasena"/);
  assert.match(html, /type="password"/);
  assert.match(html, /autoComplete="current-password"/);
  assert.match(html, /Iniciar sesi/);
});


test("la ruta de login ofrece el enlace hacia recuperar contraseña", async () => {
  const html = await renderRoute("/login");

  assert.match(html, /href="\/recuperar-password"/);
  assert.match(html, /Recuperar contrase/);
});


test("la ruta de recuperar contraseña muestra su campo de correo y botón", async () => {
  const html = await renderRoute("/recuperar-password");

  assert.match(html, /id="correo"/);
  assert.match(html, /name="correo"/);
  assert.match(html, /type="email"/);
  assert.match(html, /placeholder="usuario@correo\.com"/);
  assert.match(html, /Enviar enlace/);
});


test("la ruta de recuperar contraseña permite volver directamente a login", async () => {
  const html = await renderRoute("/recuperar-password");

  assert.match(html, /href="\/login"/);
  assert.match(html, /Volver al inicio de sesi/);
});
