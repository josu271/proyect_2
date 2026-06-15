import { authUsers } from "./testData";

// Este comando abre una ruta con una sesion ya guardada en localStorage.
Cypress.Commands.add("visitWithSession", (path, role) => {
  const user = authUsers[role];

  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("token", user.token);
      win.localStorage.setItem("usuario", JSON.stringify(user.usuario));
    },
  });
});

// Este comando completa el formulario de login como lo haria una persona real.
Cypress.Commands.add("loginWithUi", (role) => {
  const user = authUsers[role];

  cy.get('input[name="correo"]').clear().type(user.correo);
  cy.get('input[name="contrasena"]').clear().type(user.contrasena);
  cy.contains("button", "Iniciar").click();
});
