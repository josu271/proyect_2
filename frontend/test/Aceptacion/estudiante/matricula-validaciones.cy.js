import { apiUrl } from "../../support/cypress/testData";

describe("Aceptacion del modulo de matricula del estudiante", () => {
  function crearRespuestaDeMatricula(idsSeleccionados = []) {
    const detalleSeleccionado = [];

    if (idsSeleccionados.includes(201)) {
      detalleSeleccionado.push({
        id: 201,
        nrc: "NRC-BD1",
        cursoId: 101,
        codigoCurso: "BDI101",
        nombreCurso: "Base de Datos I",
        creditos: 10,
        ciclo: 5,
        docente: "Ana Perez",
        aula: "LAB-201",
        diaId: 1,
        diaNombre: "Lunes",
        bloqueId: 1,
        bloque: "Bloque 1",
        horaInicio: "08:00:00",
        horaFin: "09:30:00",
        turno: "MANANA",
        cuposDisponibles: 5,
      });
    }

    return {
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
          codigo: "BDI101",
          nombre: "Base de Datos I",
          creditos: 10,
          ciclo: 5,
          estado: "Disponible",
          secciones: [
            {
              id: 201,
              nrc: "NRC-BD1",
              docente: "Ana Perez",
              aula: "LAB-201",
              diaId: 1,
              diaNombre: "Lunes",
              bloqueId: 1,
              bloque: "Bloque 1",
              horaInicio: "08:00:00",
              horaFin: "09:30:00",
              turno: "MANANA",
              cuposDisponibles: 5,
              cupoMax: 30,
              seleccionada: idsSeleccionados.includes(201),
            },
          ],
        },
        {
          id: 102,
          codigo: "ISW210",
          nombre: "Ingenieria de Software",
          creditos: 13,
          ciclo: 5,
          estado: "Disponible",
          secciones: [
            {
              id: 202,
              nrc: "NRC-ISW",
              docente: "Mario Diaz",
              aula: "A-301",
              diaId: 1,
              diaNombre: "Lunes",
              bloqueId: 1,
              bloque: "Bloque 1",
              horaInicio: "08:00:00",
              horaFin: "09:30:00",
              turno: "MANANA",
              cuposDisponibles: 10,
              cupoMax: 30,
              seleccionada: false,
            },
          ],
        },
        {
          id: 103,
          codigo: "RED310",
          nombre: "Redes I",
          creditos: 3,
          ciclo: 5,
          estado: "Disponible",
          secciones: [
            {
              id: 203,
              nrc: "NRC-RED",
              docente: "Carlos Rios",
              aula: "LAB-101",
              diaId: 2,
              diaNombre: "Martes",
              bloqueId: 2,
              bloque: "Bloque 2",
              horaInicio: "09:30:00",
              horaFin: "11:00:00",
              turno: "MANANA",
              cuposDisponibles: 0,
              cupoMax: 25,
              seleccionada: false,
            },
          ],
        },
        {
          id: 104,
          codigo: "IA410",
          nombre: "IA Aplicada",
          creditos: 13,
          ciclo: 6,
          estado: "Disponible",
          secciones: [
            {
              id: 204,
              nrc: "NRC-IA",
              docente: "Lucia Vega",
              aula: "LAB-401",
              diaId: 3,
              diaNombre: "Miercoles",
              bloqueId: 3,
              bloque: "Bloque 3",
              horaInicio: "11:00:00",
              horaFin: "12:30:00",
              turno: "MANANA",
              cuposDisponibles: 8,
              cupoMax: 30,
              seleccionada: false,
            },
          ],
        },
      ],
      secciones_seleccionadas: idsSeleccionados,
      secciones_seleccionadas_detalle: detalleSeleccionado,
      total_creditos: detalleSeleccionado.reduce(
        (acumulado, seccion) => acumulado + Number(seccion.creditos || 0),
        0,
      ),
      reglas_matricula: {
        ciclo_estudiante: 5,
        ciclo_maximo_permitido: 6,
        max_creditos: 22,
      },
      paginacion: {
        page: 1,
        limit: 5,
        total: 4,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      },
    };
  }

  function prepararPantallaDeMatricula(estadoActual) {
    // Este mock devuelve la lista de cursos y cambia segun lo que el estudiante confirme.
    cy.intercept(
      "GET",
      `${apiUrl}/student/matricula/cursos-disponibles/31?page=1&limit=5`,
      (req) => {
        req.reply({
          statusCode: 200,
          body: crearRespuestaDeMatricula(estadoActual.idsSeleccionados),
        });
      },
    ).as("cargarMatricula");

    // Este mock guarda la seleccion como si el backend la hubiera confirmado.
    cy.intercept("POST", `${apiUrl}/student/matricula/confirmar`, (req) => {
      estadoActual.idsSeleccionados = req.body.secciones_ids;

      req.reply({
        statusCode: 200,
        body: {
          mensaje: "Matricula confirmada correctamente.",
          matricula_id: 700,
        },
      });
    }).as("confirmarMatricula");
  }

  it("muestra las restricciones de cruce, cupos y creditos", () => {
    const estadoActual = {
      idsSeleccionados: [],
    };

    prepararPantallaDeMatricula(estadoActual);
    cy.visitWithSession("/estudiante/matricula", "student");
    cy.wait("@cargarMatricula");

    // Prueba de reglas funcionales que el estudiante debe ver antes de confirmar.
    cy.contains("button", "Elegir horario").click();
    cy.contains("10").should("be.visible");

    cy.contains("Ingenieria de Software").click();
    cy.contains("button", "Cruce horario").should("be.disabled");

    cy.contains("Redes I").click();
    cy.contains("button", "Sin cupos").should("be.disabled");

    cy.contains("IA Aplicada").click();
    cy.contains("button", /^Excede/).should("be.disabled");
  });

  it("permite confirmar la matricula cuando la seleccion es valida", () => {
    const estadoActual = {
      idsSeleccionados: [],
    };

    prepararPantallaDeMatricula(estadoActual);
    cy.visitWithSession("/estudiante/matricula", "student");
    cy.wait("@cargarMatricula");

    // Prueba del camino exitoso donde la seleccion cumple todas las reglas.
    cy.contains("button", "Elegir horario").click();
    cy.contains("button", /^Confirmar/).click();
    cy.wait("@confirmarMatricula");
    cy.wait("@cargarMatricula");

    // Confirmamos que la UI refleja el estado final esperado.
    cy.contains("confirmada correctamente").should("be.visible");
    cy.contains("Confirmada").should("be.visible");
    cy.contains("Base de Datos I").should("be.visible");
  });
});
