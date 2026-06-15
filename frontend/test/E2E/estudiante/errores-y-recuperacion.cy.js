import { apiUrl, authUsers } from "../../support/cypress/testData";

describe("E2E del estudiante con errores y recuperacion", () => {
  it("deja recuperarse de un login fallido y de un error al confirmar matricula", () => {
    let totalIntentosDeConfirmacion = 0;
    let idsSeleccionados = [];

    // Prueba de autenticacion primero fallida y luego exitosa.
    cy.intercept("POST", `${apiUrl}/auth/login`, (req) => {
      if (
        req.body.correo === authUsers.student.correo &&
        req.body.contrasena === authUsers.student.contrasena
      ) {
        req.reply({
          statusCode: 200,
          body: {
            mensaje: "Login correcto",
            token: authUsers.student.token,
            redirect: authUsers.student.redirect,
            usuario: authUsers.student.usuario,
          },
        });
        return;
      }

      req.reply({
        statusCode: 401,
        body: {
          detail: "Credenciales incorrectas",
        },
      });
    }).as("login");

    // Este mock mantiene la misma pantalla de matricula y cambia cuando el alumno confirma.
    cy.intercept(
      "GET",
      `${apiUrl}/student/matricula/cursos-disponibles/31?page=1&limit=5`,
      (req) => {
        expect(req.headers.authorization).to.equal(
          `Bearer ${authUsers.student.token}`,
        );

        req.reply({
          statusCode: 200,
          body: {
            estudiante: {
              id: 31,
              programa_id: 10,
              codigo_estudiante: "20261234",
              nombre_completo: "Luis Ramos",
              ciclo: 5,
            },
            semestre: {
              id: 1,
              codigo: "2026-I",
              nombre: "Semestre 2026-I",
            },
            estado_matricula: idsSeleccionados.length > 0 ? "CONFIRMADA" : "SIN_MATRICULA",
            cursos: [
              {
                id: 101,
                codigo: "TDS501",
                nombre: "Taller de Software",
                creditos: 4,
                ciclo: 5,
                estado: "Disponible",
                secciones: [
                  {
                    id: 301,
                    nrc: "NRC-TDS",
                    docente: "Marta Pineda",
                    aula: "LAB-501",
                    diaId: 2,
                    diaNombre: "Martes",
                    bloqueId: 2,
                    bloque: "Bloque 2",
                    horaInicio: "09:30:00",
                    horaFin: "11:00:00",
                    turno: "MANANA",
                    cuposDisponibles: 10,
                    cupoMax: 30,
                    seleccionada: idsSeleccionados.includes(301),
                  },
                ],
              },
            ],
            secciones_seleccionadas: idsSeleccionados,
            secciones_seleccionadas_detalle: idsSeleccionados.includes(301)
              ? [
                  {
                    id: 301,
                    nrc: "NRC-TDS",
                    cursoId: 101,
                    codigoCurso: "TDS501",
                    nombreCurso: "Taller de Software",
                    creditos: 4,
                    ciclo: 5,
                    docente: "Marta Pineda",
                    aula: "LAB-501",
                    diaId: 2,
                    diaNombre: "Martes",
                    bloqueId: 2,
                    bloque: "Bloque 2",
                    horaInicio: "09:30:00",
                    horaFin: "11:00:00",
                    turno: "MANANA",
                    cuposDisponibles: 10,
                  },
                ]
              : [],
            total_creditos: idsSeleccionados.includes(301) ? 4 : 0,
            reglas_matricula: {
              ciclo_estudiante: 5,
              ciclo_maximo_permitido: 6,
              max_creditos: 22,
            },
            paginacion: {
              page: 1,
              limit: 5,
              total: 1,
              total_pages: 1,
              has_next: false,
              has_prev: false,
            },
          },
        });
      },
    ).as("cargarMatricula");

    // Esta primera confirmacion falla a proposito y la segunda permite recuperarse.
    cy.intercept("POST", `${apiUrl}/student/matricula/confirmar`, (req) => {
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.student.token}`,
      );

      totalIntentosDeConfirmacion += 1;

      if (totalIntentosDeConfirmacion === 1) {
        req.reply({
          statusCode: 500,
          body: {
            detail: "Error del servidor al confirmar la matricula.",
          },
        });
        return;
      }

      idsSeleccionados = req.body.secciones_ids.map(Number);

      req.reply({
        statusCode: 200,
        body: {
          mensaje: "Matricula confirmada correctamente.",
          matricula_id: 701,
        },
      });
    }).as("confirmarMatricula");

    // Este ultimo mock confirma que el horario ya se ve bien despues de la recuperacion.
    cy.intercept("GET", `${apiUrl}/estudiante/mi-horario/31`, {
      statusCode: 200,
      body: {
        estudiante: {
          id: 31,
          codigo_estudiante: "20261234",
          nombre_completo: "Luis Ramos",
          ciclo: 5,
          programa: "Ingenieria de Sistemas",
        },
        semestre: {
          id: 1,
          codigo: "2026-I",
          nombre: "Semestre 2026-I",
          estado: "ACTIVO",
        },
        matricula: {
          id: 701,
          estado: "CONFIRMADA",
          fecha_matricula: "2026-06-14T12:00:00",
        },
        dias: [
          { id: 1, nombre: "Lunes" },
          { id: 2, nombre: "Martes" },
          { id: 3, nombre: "Miercoles" },
          { id: 4, nombre: "Jueves" },
          { id: 5, nombre: "Viernes" },
          { id: 6, nombre: "Sabado" },
        ],
        bloques: [
          {
            id: 2,
            nombre: "Bloque 2",
            hora_inicio: "09:30:00",
            hora_fin: "11:00:00",
            turno: "MANANA",
          },
        ],
        clases: [
          {
            matricula_id: 701,
            estado_matricula: "CONFIRMADA",
            seccion_id: 301,
            nrc: "NRC-TDS",
            curso_id: 101,
            curso_codigo: "TDS501",
            curso: "Taller de Software",
            creditos: 4,
            ciclo: 5,
            docente_id: 80,
            docente: "Marta Pineda",
            aula_id: 91,
            aula: "LAB-501",
            dia_semana: 2,
            dia_nombre: "Martes",
            bloque_academico_id: 2,
            bloque: "Bloque 2",
            hora_inicio: "09:30:00",
            hora_fin: "11:00:00",
            turno: "MANANA",
            estado_detalle: "ACTIVO",
          },
        ],
        resumen: {
          total_cursos: 1,
          total_clases: 1,
          total_creditos: 4,
        },
      },
    }).as("cargarHorarioFinal");

    cy.visit("/login");

    // Primero revisamos que un dato errado muestre el error de autenticacion.
    cy.get('input[name="correo"]').type("fallo@demo.com");
    cy.get('input[name="contrasena"]').type("123456");
    cy.contains("button", "Iniciar").click();
    cy.wait("@login");
    cy.contains("Credenciales incorrectas").should("be.visible");

    // Luego el estudiante entra bien y avanza hasta la matricula.
    cy.get('input[name="correo"]').clear().type(authUsers.student.correo);
    cy.get('input[name="contrasena"]').clear().type(authUsers.student.contrasena);
    cy.contains("button", "Iniciar").click();
    cy.wait("@login");
    cy.url().should("include", "/estudiante");

    // Entramos por el sidebar fijo del layout para no mezclarlo con otros aside de la pantalla.
    cy.get('aside.fixed a[href="/estudiante/matricula"]').click();
    cy.wait("@cargarMatricula");
    // Marcamos el horario y esperamos a que el boton cambie de estado antes de confirmar.
    cy.contains("button", "Elegir horario").should("be.visible").click();
    cy.contains("button", "Seleccionado").should("be.visible");

    // La primera confirmacion falla y debe mostrarse el mensaje del servidor.
    cy.contains("button", /^Confirmar/).should("not.be.disabled").click();
    cy.wait("@confirmarMatricula");
    cy.contains("Error del servidor al confirmar la matricula.").should(
      "be.visible",
    );

    // La segunda confirmacion funciona y el alumno puede seguir con normalidad.
    cy.contains("button", /^Confirmar/).should("not.be.disabled").click();
    cy.wait("@confirmarMatricula");
    cy.wait("@cargarMatricula");
    cy.contains("confirmada correctamente").should("be.visible");

    // Cerramos comprobando que el horario final ya muestra la clase confirmada.
    // Cerramos desde el sidebar fijo para mantener el selector en un solo lugar.
    cy.get('aside.fixed a[href="/estudiante/mi-horario"]').click();
    cy.wait("@cargarHorarioFinal");
    cy.contains("Taller de Software").should("be.visible");
    cy.contains("NRC-TDS").should("be.visible");
  });
});
