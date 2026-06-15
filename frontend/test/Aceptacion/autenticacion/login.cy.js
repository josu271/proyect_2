import { apiUrl, authUsers } from "../../support/cypress/testData";

describe("Aceptacion del modulo de autenticacion", () => {
  it("deja iniciar sesion y entrar al panel del administrador", () => {
    const usuarioAdmin = authUsers.admin;

    // Prueba de sesion de inicio correcta para un usuario administrador.
    cy.intercept("POST", `${apiUrl}/auth/login`, (req) => {
      expect(req.body).to.deep.equal({
        correo: usuarioAdmin.correo,
        contrasena: usuarioAdmin.contrasena,
      });

      req.reply({
        statusCode: 200,
        body: {
          mensaje: "Login correcto",
          token: usuarioAdmin.token,
          redirect: usuarioAdmin.redirect,
          usuario: usuarioAdmin.usuario,
        },
      });
    }).as("loginExitoso");

    // Simulamos lo que haria una persona al abrir la pantalla y enviar el formulario.
    cy.visit("/login");
    cy.loginWithUi("admin");
    cy.wait("@loginExitoso");

    // Confirmamos que la app redirige y guarda la sesion.
    cy.url().should("include", "/admin");
    cy.contains("Panel del Administrador").should("be.visible");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.equal(usuarioAdmin.token);
      expect(JSON.parse(win.localStorage.getItem("usuario"))).to.deep.equal(
        usuarioAdmin.usuario,
      );
    });
  });

  it("muestra un mensaje claro cuando las credenciales son invalidas", () => {
    // Prueba del error visible cuando el backend rechaza el inicio de sesion.
    cy.intercept("POST", `${apiUrl}/auth/login`, {
      statusCode: 401,
      body: {
        detail: "Credenciales incorrectas",
      },
    }).as("loginFallido");

    cy.visit("/login");
    cy.get('input[name="correo"]').type("error@demo.com");
    cy.get('input[name="contrasena"]').type("incorrecta");
    cy.contains("button", "Iniciar").click();
    cy.wait("@loginFallido");

    // Confirmamos que el usuario se queda en login y ve el motivo del error.
    cy.contains("Credenciales incorrectas").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("permite ir a recuperar password desde la pantalla de login", () => {
    // Prueba del enlace de recuperacion para no dejar al usuario bloqueado.
    cy.visit("/login");
    cy.contains("Recuperar").click();

    cy.url().should("include", "/recuperar-password");
    cy.get('input[name="correo"]').should("be.visible");
    cy.contains("button", "Enviar enlace").should("be.visible");
  });
});
