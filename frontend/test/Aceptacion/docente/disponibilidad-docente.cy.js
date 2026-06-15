import {
  apiUrl,
  buildTeacherAvailabilityResponse,
  createBaseAcademicState,
  createHorarioFromBlock,
  createSection,
} from "../../support/cypress/testData";

describe("Aceptacion del modulo de disponibilidad docente", () => {
  function prepararPantallaDocente(estadoActual) {
    // Este mock deja vivo el calendario y refleja cada cambio del docente.
    cy.intercept("GET", `${apiUrl}/docente/disponibilidad/inicial/2`, (req) => {
      req.reply({
        statusCode: 200,
        body: buildTeacherAvailabilityResponse(estadoActual),
      });
    }).as("cargarDisponibilidad");

    cy.intercept("POST", `${apiUrl}/docente/disponibilidad/asignar-horario`, (req) => {
      const seccion = estadoActual.secciones.find(
        (item) => item.id === Number(req.body.seccion_id),
      );

      if (seccion) {
        seccion.tieneHorario = true;
        seccion.horario = createHorarioFromBlock(
          req.body.dia_semana,
          req.body.bloque_academico_id,
        );
      }

      req.reply({
        statusCode: 200,
        body: {
          message: "Horario asignado correctamente. La seccion fue completada.",
        },
      });
    }).as("asignarHorario");

    cy.intercept("DELETE", `${apiUrl}/docente/disponibilidad/horario/2/*`, (req) => {
      const seccionId = Number(req.url.split("/").pop());
      const seccion = estadoActual.secciones.find((item) => item.id === seccionId);

      if (seccion) {
        seccion.tieneHorario = false;
        seccion.horario = null;
      }

      req.reply({
        statusCode: 200,
        body: {
          message: "Horario retirado correctamente.",
        },
      });
    }).as("quitarHorario");
  }

  it("muestra una guia clara si el docente intenta guardar sin haber elegido seccion", () => {
    const estadoActual = createBaseAcademicState();

    estadoActual.secciones = [
      createSection({
        id: 801,
        nrc: "NRC-DOC-01",
      }),
    ];

    prepararPantallaDocente(estadoActual);
    cy.visitWithSession("/docente/disponibilidad", "teacher");
    cy.wait("@cargarDisponibilidad");

    // Prueba del mensaje que orienta al docente cuando se salta el orden del flujo.
    cy.contains("button", "Guardar horario").click();
    cy.contains("Seleccione una seccion.").should("be.visible");
  });

  it("permite asignar y luego retirar un horario desde la misma pantalla", () => {
    const estadoActual = createBaseAcademicState();

    estadoActual.secciones = [
      createSection({
        id: 802,
        nrc: "NRC-DOC-02",
      }),
    ];

    prepararPantallaDocente(estadoActual);
    cy.visitWithSession("/docente/disponibilidad", "teacher");
    cy.wait("@cargarDisponibilidad");

    // Prueba del camino funcional principal del docente.
    cy.get('select[name="seccion_id"]').select("802");
    cy.contains("button", "Disponible").first().click();
    cy.contains("button", "Guardar horario").click();
    cy.wait("@asignarHorario");
    cy.wait("@cargarDisponibilidad");

    cy.contains("Horario asignado correctamente.").should("be.visible");
    cy.contains("tr", "NRC-DOC-02").within(() => {
      cy.contains("Horario asignado").should("be.visible");
      cy.contains("button", "Quitar").should("be.visible");
    });

    // Cerramos el caso validando que la misma pantalla permita recuperar el estado.
    cy.on("window:confirm", () => true);
    cy.contains("tr", "NRC-DOC-02").within(() => {
      cy.contains("button", "Quitar").click();
    });

    cy.wait("@quitarHorario");
    cy.wait("@cargarDisponibilidad");
    cy.contains("Horario retirado correctamente.").should("be.visible");
    cy.contains("tr", "NRC-DOC-02").within(() => {
      cy.contains("Pendiente").should("be.visible");
    });
  });
});
