import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import {
  loadFrontendModule,
  registerViteServer,
} from "../soporte/viteTestServer.mjs";

registerViteServer();

async function renderRoute(pathname) {
  // Esta ayuda renderiza una ruta real del frontend sin abrir el navegador.
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
  // Prueba visual basica del formulario de inicio de sesion.
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

test("la ruta de login ofrece el enlace hacia recuperar contrasena", async () => {
  // Prueba del enlace para recuperar acceso desde la pantalla principal.
  const html = await renderRoute("/login");

  assert.match(html, /href="\/recuperar-password"/);
  assert.match(html, /Recuperar contrase/);
});

test("la ruta de recuperar contrasena muestra su campo de correo y boton", async () => {
  // Prueba del formulario minimo que usa el usuario para pedir recuperacion.
  const html = await renderRoute("/recuperar-password");

  assert.match(html, /id="correo"/);
  assert.match(html, /name="correo"/);
  assert.match(html, /type="email"/);
  assert.match(html, /placeholder="usuario@correo\.com"/);
  assert.match(html, /Enviar enlace/);
});

test("la ruta de recuperar contrasena permite volver directamente a login", async () => {
  // Prueba del enlace para regresar rapido a la pantalla de login.
  const html = await renderRoute("/recuperar-password");

  assert.match(html, /href="\/login"/);
  assert.match(html, /Volver al inicio de sesi/);
});
