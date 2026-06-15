import {
  apiUrl,
  authUsers,
  buildStudentEnrollmentResponse,
  buildStudentScheduleResponse,
  createBaseAcademicState,
  createHorarioFromBlock,
  createSection,
} from "../../support/cypress/testData";

describe("E2E del golden path de matricula del estudiante", () => {
  it("permite iniciar sesion, elegir horario, confirmar y ver el curso en mi horario", () => {
    const estadoAcademico = createBaseAcademicState();

    estadoAcademico.secciones = [
      createSection({
        id: 950,
        nrc: "NRC-GOLDEN",
        codigo: "TDS601",
        curso: "Testing Aplicado",
        docente: "Marta Pineda",
        aula: "LAB-601",
        creditos: 4,
        tieneHorario: true,
        horario: createHorarioFromBlock(2, 2),
      }),
    ];

    // Este login reproduce el paso real de entrada del estudiante.
    cy.intercept("POST", `${apiUrl}/auth/login`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          mensaje: "Login correcto",
          token: authUsers.student.token,
          redirect: authUsers.student.redirect,
          usuario: authUsers.student.usuario,
        },
      });
    }).as("loginEstudiante");

    // Este mock cambia automaticamente cuando el alumno confirma su matricula.
    cy.intercept(
      "GET",
      `${apiUrl}/student/matricula/cursos-disponibles/31?page=1&limit=5`,
      (req) => {
        expect(req.headers.authorization).to.equal(
          `Bearer ${authUsers.student.token}`,
        );

        req.reply({
          statusCode: 200,
          body: buildStudentEnrollmentResponse(estadoAcademico),
        });
      },
    ).as("cargarMatricula");

    cy.intercept("POST", `${apiUrl}/student/matricula/confirmar`, (req) => {
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.student.token}`,
      );

      estadoAcademico.confirmedSectionIds = req.body.secciones_ids.map(Number);

      req.reply({
        statusCode: 200,
        body: {
          mensaje: "Matricula confirmada correctamente.",
          matricula_id: 700,
        },
      });
    }).as("confirmarMatricula");

    // Este ultimo paso comprueba que el horario final ya lee el estado confirmado.
    cy.intercept("GET", `${apiUrl}/estudiante/mi-horario/31`, (req) => {
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.student.token}`,
      );

      req.reply({
        statusCode: 200,
        body: buildStudentScheduleResponse(estadoAcademico),
      });
    }).as("cargarHorarioFinal");

    cy.visit("/login");

    // Prueba del golden path: login, seleccion, confirmacion y validacion final.
    cy.loginWithUi("student");
    cy.wait("@loginEstudiante");
    cy.url().should("include", "/estudiante");

    // Usamos el sidebar fijo del layout para no tomar otros aside de la pagina.
    cy.get('aside.fixed a[href="/estudiante/matricula"]').click();
    cy.wait("@cargarMatricula");
    // Seleccionamos el horario y recien cuando queda activo confirmamos la matricula.
    cy.contains("button", "Elegir horario").should("be.visible").click();
    cy.contains("button", "Seleccionado").should("be.visible");
    cy.contains("button", /^Confirmar/).should("not.be.disabled").click();
    cy.wait("@confirmarMatricula");
    cy.wait("@cargarMatricula");

    cy.contains("Matricula confirmada correctamente.").should("be.visible");
    cy.contains("Confirmada").should("be.visible");

    // Este acceso usa el sidebar fijo para que Cypress no choque con otros aside.
    cy.get('aside.fixed a[href="/estudiante/mi-horario"]').click();
    cy.wait("@cargarHorarioFinal");
    cy.contains("Testing Aplicado").should("be.visible");
    cy.contains("NRC-GOLDEN").should("be.visible");

    // Cerramos revisando que la sesion siga viva despues del flujo completo.
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.equal(
        authUsers.student.token,
      );
    });
  });
});
