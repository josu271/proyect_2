import {
  apiUrl,
  buildAdminSectionsResponse,
  createSection,
  sectionOptions,
} from "../../support/cypress/testData";

describe("Aceptacion del modulo de administracion de secciones", () => {
  function prepararMocksDeSecciones(estadoActual) {
    // Este bloque prepara los datos base que necesita la pantalla del administrador.
    cy.intercept("GET", `${apiUrl}/admin/secciones/opciones`, {
      statusCode: 200,
      body: {
        semestre: sectionOptions.semester,
        cursos: [],
        docentes: [],
        aulas: [],
      },
    }).as("cargarOpciones");

    cy.intercept("GET", `${apiUrl}/admin/secciones/opciones/cursos?*`, {
      statusCode: 200,
      body: [sectionOptions.course],
    }).as("buscarCursos");

    cy.intercept("GET", `${apiUrl}/admin/secciones/opciones/docentes?*`, {
      statusCode: 200,
      body: [sectionOptions.teacher],
    }).as("buscarDocentes");

    cy.intercept("GET", `${apiUrl}/admin/secciones/opciones/aulas?*`, {
      statusCode: 200,
      body: [sectionOptions.classroom],
    }).as("buscarAulas");

    cy.intercept("GET", `${apiUrl}/admin/secciones?page=*&limit=*&search=*`, (req) => {
      req.reply({
        statusCode: 200,
        body: buildAdminSectionsResponse(estadoActual),
      });
    }).as("cargarSecciones");

    // Este mock agrega una seccion nueva al estado compartido de la prueba.
    cy.intercept("POST", `${apiUrl}/admin/secciones`, (req) => {
      const nuevaSeccion = createSection({
        id: estadoActual.secciones.length + 500,
        nrc: req.body.nrc,
      });

      estadoActual.secciones.push(nuevaSeccion);

      req.reply({
        statusCode: 200,
        body: {
          ...buildAdminSectionsResponse({
            secciones: [nuevaSeccion],
          }).items[0],
        },
      });
    }).as("crearSeccion");

    // Este mock marca una seccion como cancelada para simular el cambio del backend.
    cy.intercept("DELETE", `${apiUrl}/admin/secciones/*`, (req) => {
      const idSeccion = Number(req.url.split("/").pop());
      const seccionObjetivo = estadoActual.secciones.find(
        (item) => item.id === idSeccion,
      );

      if (seccionObjetivo) {
        seccionObjetivo.estado = "CANCELADA";
      }

      req.reply({
        statusCode: 200,
        body: {
          message: "Seccion cancelada correctamente.",
          id: idSeccion,
        },
      });
    }).as("cancelarSeccion");
  }

  it("permite crear una nueva seccion desde el formulario", () => {
    const estadoActual = {
      secciones: [],
    };

    prepararMocksDeSecciones(estadoActual);
    cy.visitWithSession("/admin/secciones-nrc", "admin");
    cy.wait("@cargarOpciones");
    cy.wait("@cargarSecciones");

    // Prueba de alta de una seccion con curso, docente y aula elegidos por el admin.
    cy.get('input[name="nrc"]').type("NRC9001");

    cy.get('input[placeholder*="curso"]').type("Base");
    cy.wait("@buscarCursos");
    cy.contains("button", sectionOptions.course.nombre).click();

    cy.get('input[placeholder*="docente"]').type("Ana");
    cy.wait("@buscarDocentes");
    cy.contains("button", sectionOptions.teacher.nombre_completo).click();

    cy.get('input[placeholder*="aula"]').type("LAB");
    cy.wait("@buscarAulas");
    cy.contains("button", sectionOptions.classroom.codigo).click();

    cy.contains("button", "Guardar").click();
    cy.wait("@crearSeccion");
    cy.wait("@cargarSecciones");

    // Aqui confirmamos que el alta se refleja tanto en el mensaje como en la tabla.
    cy.contains("registrada correctamente").should("be.visible");
    cy.contains("NRC9001").should("be.visible");
  });

  it("bloquea la edicion cuando la seccion ya tiene horario asignado", () => {
    const estadoActual = {
      secciones: [
        createSection({
          id: 501,
          nrc: "NRC-BLOQUEADA",
          tieneHorario: true,
        }),
      ],
    };

    prepararMocksDeSecciones(estadoActual);
    cy.visitWithSession("/admin/secciones-nrc", "admin");
    cy.wait("@cargarOpciones");
    cy.wait("@cargarSecciones");

    // Prueba de proteccion para no cambiar una seccion que ya fue programada por el docente.
    cy.contains("tr", "NRC-BLOQUEADA").within(() => {
      cy.contains("Asignado por docente").should("be.visible");
      cy.contains("button", "Editar").should("be.disabled");
    });
  });

  it("permite cancelar una seccion desde la tabla", () => {
    const estadoActual = {
      secciones: [
        createSection({
          id: 502,
          nrc: "NRC-CANCELAR",
        }),
      ],
    };

    prepararMocksDeSecciones(estadoActual);
    cy.visitWithSession("/admin/secciones-nrc", "admin");
    cy.wait("@cargarOpciones");
    cy.wait("@cargarSecciones");

    // Prueba de cancelacion con confirmacion del navegador incluida.
    cy.on("window:confirm", () => true);

    cy.contains("tr", "NRC-CANCELAR").within(() => {
      cy.contains("button", "Cancelar").click();
    });

    cy.wait("@cancelarSeccion");
    cy.wait("@cargarSecciones");

    // Aqui revisamos que el cambio de estado quede visible para el usuario.
    cy.contains("cancelada correctamente").should("be.visible");
    cy.contains("tr", "NRC-CANCELAR").within(() => {
      cy.contains("Cancelada").should("be.visible");
    });
  });
});
