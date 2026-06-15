import {
  apiUrl,
  authUsers,
  buildAdminSectionRow,
  buildAdminSectionsResponse,
  buildStudentEnrollmentResponse,
  buildStudentScheduleResponse,
  buildTeacherAvailabilityResponse,
  buildTeacherScheduleResponse,
  createBaseAcademicState,
  createHorarioFromBlock,
  createSection,
  sectionOptions,
} from "../../support/cypress/testData";

describe("E2E del flujo academico multiusuario", () => {
  function prepararBackendDelFlujo(estadoAcademico) {
    // Este login sirve para que cada rol entre con el flujo real de la UI.
    cy.intercept("POST", `${apiUrl}/auth/login`, (req) => {
      const usuarioEncontrado = Object.values(authUsers).find(
        (usuario) =>
          usuario.correo === req.body.correo &&
          usuario.contrasena === req.body.contrasena,
      );

      if (!usuarioEncontrado) {
        req.reply({
          statusCode: 401,
          body: {
            detail: "Credenciales incorrectas",
          },
        });
        return;
      }

      req.reply({
        statusCode: 200,
        body: {
          mensaje: "Login correcto",
          token: usuarioEncontrado.token,
          redirect: usuarioEncontrado.redirect,
          usuario: usuarioEncontrado.usuario,
        },
      });
    }).as("login");

    // Aqui vive la parte administrativa del flujo: crear la seccion academica.
    cy.intercept("GET", `${apiUrl}/admin/secciones/opciones`, (req) => {
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.admin.token}`,
      );

      req.reply({
        statusCode: 200,
        body: {
          semestre: sectionOptions.semester,
          cursos: [],
          docentes: [],
          aulas: [],
        },
      });
    }).as("cargarOpcionesAdmin");

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
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.admin.token}`,
      );

      req.reply({
        statusCode: 200,
        body: buildAdminSectionsResponse(estadoAcademico),
      });
    }).as("cargarSeccionesAdmin");

    cy.intercept("POST", `${apiUrl}/admin/secciones`, (req) => {
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.admin.token}`,
      );

      const nuevaSeccion = createSection({
        id: estadoAcademico.nextSectionId,
        nrc: req.body.nrc,
      });

      estadoAcademico.nextSectionId += 1;
      estadoAcademico.secciones.push(nuevaSeccion);

      req.reply({
        statusCode: 200,
        body: buildAdminSectionRow(nuevaSeccion),
      });
    }).as("crearSeccion");

    // Aqui vive la parte docente del flujo: elegir dia y bloque para la seccion.
    cy.intercept(
      "GET",
      `${apiUrl}/docente/disponibilidad/inicial/${authUsers.teacher.usuario.id}`,
      (req) => {
        expect(req.headers.authorization).to.equal(
          `Bearer ${authUsers.teacher.token}`,
        );

        req.reply({
          statusCode: 200,
          body: buildTeacherAvailabilityResponse(estadoAcademico),
        });
      },
    ).as("cargarDisponibilidadDocente");

    cy.intercept("POST", `${apiUrl}/docente/disponibilidad/asignar-horario`, (req) => {
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.teacher.token}`,
      );

      const seccionElegida = estadoAcademico.secciones.find(
        (item) => item.id === Number(req.body.seccion_id),
      );

      if (!seccionElegida) {
        req.reply({
          statusCode: 404,
          body: {
            detail: "Seccion no encontrada.",
          },
        });
        return;
      }

      seccionElegida.tieneHorario = true;
      seccionElegida.horario = createHorarioFromBlock(
        req.body.dia_semana,
        req.body.bloque_academico_id,
      );

      req.reply({
        statusCode: 200,
        body: {
          message: "Horario asignado correctamente. La seccion fue completada.",
          seccion_id: seccionElegida.id,
        },
      });
    }).as("asignarHorario");

    cy.intercept("GET", `${apiUrl}/docente/mi-horario?docente_id=21`, (req) => {
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.teacher.token}`,
      );

      req.reply({
        statusCode: 200,
        body: buildTeacherScheduleResponse(estadoAcademico),
      });
    }).as("cargarHorarioDocente");

    // Aqui vive la parte estudiante del flujo: matricula y consulta del horario final.
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
    ).as("cargarMatriculaEstudiante");

    cy.intercept("POST", `${apiUrl}/student/matricula/confirmar`, (req) => {
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.student.token}`,
      );

      const seccionesValidas = req.body.secciones_ids.every((id) =>
        estadoAcademico.secciones.some(
          (seccion) => seccion.id === Number(id) && seccion.tieneHorario,
        ),
      );

      if (!seccionesValidas) {
        req.reply({
          statusCode: 400,
          body: {
            detail: "No puede confirmar una seccion sin horario.",
          },
        });
        return;
      }

      estadoAcademico.confirmedSectionIds = req.body.secciones_ids.map(Number);

      req.reply({
        statusCode: 200,
        body: {
          mensaje: "Matricula confirmada correctamente.",
          matricula_id: 700,
        },
      });
    }).as("confirmarMatricula");

    cy.intercept("GET", `${apiUrl}/estudiante/mi-horario/31`, (req) => {
      expect(req.headers.authorization).to.equal(
        `Bearer ${authUsers.student.token}`,
      );

      req.reply({
        statusCode: 200,
        body: buildStudentScheduleResponse(estadoAcademico),
      });
    }).as("cargarHorarioEstudiante");
  }

  it("une el trabajo de admin, docente y estudiante en un solo flujo", () => {
    const estadoAcademico = createBaseAcademicState();

    prepararBackendDelFlujo(estadoAcademico);
    cy.visit("/login");

    // Prueba del paso 1: el admin crea la seccion que sera usada por el resto del flujo.
    cy.loginWithUi("admin");
    cy.wait("@login");
    cy.url().should("include", "/admin");

    // Entramos desde el sidebar fijo del layout para no caer en el aside de accesos rapidos.
    cy.get('aside.fixed a[href="/admin/secciones-nrc"]').click();
    cy.wait("@cargarOpcionesAdmin");
    cy.wait("@cargarSeccionesAdmin");

    cy.get('input[name="nrc"]').type("NRC9002");
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
    cy.wait("@cargarSeccionesAdmin");
    cy.contains("NRC9002").should("be.visible");

    cy.contains("button", "Salir").click();
    cy.url().should("include", "/login");

    // Prueba del paso 2: el docente programa la seccion que creo el admin.
    cy.loginWithUi("teacher");
    cy.wait("@login");
    cy.url().should("include", "/docente");

    // Entramos por el sidebar fijo para no toparnos con otros aside de la vista.
    cy.get('aside.fixed a[href="/docente/disponibilidad"]').click();
    cy.wait("@cargarDisponibilidadDocente");
    cy.contains("Disponibilidad docente").should("be.visible");

    cy.get('select[name="seccion_id"]').select("NRC9002 - Base de Datos I");
    cy.contains("button", "Disponible").first().click();
    cy.contains("button", "Guardar horario").click();
    cy.wait("@asignarHorario");
    cy.wait("@cargarDisponibilidadDocente");
    cy.contains("Horario asignado correctamente.").should("be.visible");

    // Este enlace usa el sidebar fijo y evita ambiguedad con otros textos de la pagina.
    cy.get('aside.fixed a[href="/docente/mi-horario"]').click();
    cy.wait("@cargarHorarioDocente");
    cy.contains("NRC: NRC9002").should("be.visible");
    cy.contains("Base de Datos I").should("be.visible");

    cy.contains("button", "Salir").click();
    cy.url().should("include", "/login");

    // Prueba del paso 3: el estudiante ve la seccion disponible y confirma su matricula.
    cy.loginWithUi("student");
    cy.wait("@login");
    cy.url().should("include", "/estudiante");

    // Entramos desde el sidebar fijo para no tocar tambien otros aside del layout.
    cy.get('aside.fixed a[href="/estudiante/matricula"]').click();
    cy.wait("@cargarMatriculaEstudiante");
    cy.contains("Cursos disponibles para ti").should("be.visible");
    // Marcamos el horario y esperamos a que el boton de confirmar quede habilitado.
    cy.contains("button", "Elegir horario").should("be.visible").click();
    cy.contains("button", "Seleccionado").should("be.visible");
    cy.contains("button", /^Confirmar/).should("not.be.disabled").click();
    cy.wait("@confirmarMatricula");
    cy.wait("@cargarMatriculaEstudiante");
    cy.contains("confirmada correctamente").should("be.visible");

    // Cerramos el flujo revisando que el horario final del alumno ya tenga la clase matriculada.
    // El sidebar fijo deja este paso con un unico target claro para Cypress.
    cy.get('aside.fixed a[href="/estudiante/mi-horario"]').click();
    cy.wait("@cargarHorarioEstudiante");
    cy.contains("Horario semanal").should("be.visible");
    cy.contains("Base de Datos I").should("be.visible");
    cy.contains("NRC9002").should("be.visible");
  });
});
