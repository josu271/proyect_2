import {
  apiUrl,
  blocks,
  buildStudentEnrollmentResponse,
  buildStudentScheduleResponse,
  buildTeacherScheduleResponse,
  sectionOptions,
} from "../../support/cypress/testData";

describe("Aceptacion de la navegacion por roles", () => {
  it("permite moverse por las vistas principales del administrador", () => {
    // Prueba de navegacion basica del rol administrador.
    cy.intercept("GET", `${apiUrl}/admin/secciones/opciones`, {
      statusCode: 200,
      body: {
        semestre: sectionOptions.semester,
        cursos: [],
        docentes: [],
        aulas: [],
      },
    }).as("cargarOpcionesDeAdmin");

    cy.intercept("GET", `${apiUrl}/admin/secciones?page=*&limit=*&search=*`, {
      statusCode: 200,
      body: {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 1,
      },
    }).as("cargarSeccionesDeAdmin");

    cy.visitWithSession("/admin", "admin");
    cy.contains("Dashboard Administrador").should("be.visible");

    cy.contains("Secciones/NRC").click();
    cy.wait("@cargarOpcionesDeAdmin");
    cy.wait("@cargarSeccionesDeAdmin");
    cy.contains("Secciones/NRC").should("be.visible");

    cy.contains("Reportes").click();
    cy.contains("Conflictos detectados").should("be.visible");

    cy.contains("Dashboard").click();
    cy.contains("Dashboard Administrador").should("be.visible");
  });

  it("permite moverse por las vistas principales del docente", () => {
    // Prueba de navegacion basica del rol docente.
    cy.intercept("GET", `${apiUrl}/docente/disponibilidad/inicial/2`, {
      statusCode: 200,
      body: {
        docente: {
          docente_id: 21,
          usuario_id: 2,
          codigo_docente: "DOC-101",
          nombre_completo: sectionOptions.teacher.nombre_completo,
          especialidad: sectionOptions.teacher.especialidad,
          correo: "docente@demo.com",
        },
        secciones: [],
        bloques: blocks,
        disponibilidad: [],
      },
    }).as("cargarDisponibilidadDocente");

    cy.intercept("GET", `${apiUrl}/docente/mi-horario?docente_id=21`, {
      statusCode: 200,
      body: buildTeacherScheduleResponse({
        secciones: [],
      }),
    }).as("cargarHorarioDocente");

    cy.visitWithSession("/docente", "teacher");
    cy.contains("Panel del Docente").should("be.visible");

    cy.contains("Disponibilidad").click();
    cy.wait("@cargarDisponibilidadDocente");
    cy.contains("Disponibilidad docente").should("be.visible");

    cy.contains("Mi Horario").click();
    cy.wait("@cargarHorarioDocente");
    cy.contains("No tienes clases asignadas en este semestre.").should(
      "be.visible",
    );
  });

  it("permite navegar como estudiante y cerrar sesion", () => {
    // Prueba de navegacion y salida segura del rol estudiante.
    cy.intercept(
      "GET",
      `${apiUrl}/student/matricula/cursos-disponibles/31?page=1&limit=5`,
      {
        statusCode: 200,
        body: buildStudentEnrollmentResponse({
          secciones: [],
          confirmedSectionIds: [],
        }),
      },
    ).as("cargarMatriculaEstudiante");

    cy.intercept("GET", `${apiUrl}/estudiante/mi-horario/31`, {
      statusCode: 200,
      body: buildStudentScheduleResponse({
        secciones: [],
        confirmedSectionIds: [],
      }),
    }).as("cargarHorarioEstudiante");

    cy.visitWithSession("/estudiante", "student");
    cy.contains("Panel del Estudiante").should("be.visible");

    cy.get('a[href="/estudiante/matricula"]').click();
    cy.wait("@cargarMatriculaEstudiante");
    cy.contains("Cursos disponibles para ti").should("be.visible");

    cy.contains("Mi Horario").click();
    cy.wait("@cargarHorarioEstudiante");
    cy.contains("No tienes cursos matriculados con horario asignado").should(
      "be.visible",
    );

    cy.contains("button", "Salir").click();
    cy.url().should("include", "/login");

    // Confirmamos que la sesion quede limpia despues del logout.
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.equal(null);
      expect(win.localStorage.getItem("usuario")).to.equal(null);
    });
  });
});
