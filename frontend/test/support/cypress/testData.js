export const apiUrl = "http://127.0.0.1:8000";

export const semester = {
  id: 1,
  codigo: "2026-I",
  nombre: "Semestre 2026-I",
  estado: "ACTIVO",
};

export const blocks = [
  {
    id: 1,
    nombre: "Bloque 1",
    hora_inicio: "08:00:00",
    hora_fin: "09:30:00",
    turno: "MANANA",
    hora: "08:00 - 09:30",
  },
  {
    id: 2,
    nombre: "Bloque 2",
    hora_inicio: "09:30:00",
    hora_fin: "11:00:00",
    turno: "MANANA",
    hora: "09:30 - 11:00",
  },
  {
    id: 3,
    nombre: "Bloque 3",
    hora_inicio: "11:00:00",
    hora_fin: "12:30:00",
    turno: "MANANA",
    hora: "11:00 - 12:30",
  },
  {
    id: 4,
    nombre: "Bloque 4",
    hora_inicio: "14:00:00",
    hora_fin: "15:30:00",
    turno: "TARDE",
    hora: "14:00 - 15:30",
  },
  {
    id: 5,
    nombre: "Bloque 5",
    hora_inicio: "15:30:00",
    hora_fin: "17:00:00",
    turno: "TARDE",
    hora: "15:30 - 17:00",
  },
  {
    id: 6,
    nombre: "Bloque 6",
    hora_inicio: "17:00:00",
    hora_fin: "18:30:00",
    turno: "TARDE",
    hora: "17:00 - 18:30",
  },
  {
    id: 7,
    nombre: "Bloque 7",
    hora_inicio: "18:30:00",
    hora_fin: "20:00:00",
    turno: "NOCHE",
    hora: "18:30 - 20:00",
  },
  {
    id: 8,
    nombre: "Bloque 8",
    hora_inicio: "20:00:00",
    hora_fin: "21:30:00",
    turno: "NOCHE",
    hora: "20:00 - 21:30",
  },
];

export const days = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miercoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sabado" },
];

export const authUsers = {
  admin: {
    correo: "admin@demo.com",
    contrasena: "Admin123*",
    token: "jwt-admin",
    redirect: "/admin",
    usuario: {
      id: 1,
      usuario_id: 1,
      correo: "admin@demo.com",
      rol: "ADMIN",
      docente_id: null,
      estudiante_id: null,
    },
  },
  teacher: {
    correo: "docente@demo.com",
    contrasena: "Docente123*",
    token: "jwt-docente",
    redirect: "/docente",
    usuario: {
      id: 2,
      usuario_id: 2,
      correo: "docente@demo.com",
      rol: "DOCENTE",
      docente_id: 21,
      estudiante_id: null,
    },
  },
  student: {
    correo: "alumno@demo.com",
    contrasena: "Alumno123*",
    token: "jwt-estudiante",
    redirect: "/estudiante",
    usuario: {
      id: 3,
      usuario_id: 3,
      correo: "alumno@demo.com",
      rol: "ESTUDIANTE",
      docente_id: null,
      estudiante_id: 31,
    },
  },
};

export const sectionOptions = {
  semester,
  course: {
    id: 101,
    codigo: "SIS501",
    nombre: "Base de Datos I",
    creditos: 4,
    ciclo: 5,
    tipo_aula_requerida: "LABORATORIO",
  },
  teacher: {
    id: 21,
    nombre_completo: "Ana Perez",
    especialidad: "Bases de Datos",
  },
  classroom: {
    id: 31,
    codigo: "LAB-201",
    tipo_aula: "LABORATORIO",
    capacidad: 30,
    ubicacion: "Pabellon B",
  },
  student: {
    id: 31,
    codigo_estudiante: "20261234",
    nombre_completo: "Luis Ramos",
    ciclo: 5,
    programa: "Ingenieria de Sistemas",
  },
};

export function createSection({
  id,
  nrc,
  estado = "PUBLICADA",
  tieneHorario = false,
  horario = null,
  creditos = sectionOptions.course.creditos,
  codigo = sectionOptions.course.codigo,
  curso = sectionOptions.course.nombre,
  ciclo = sectionOptions.course.ciclo,
  docente = sectionOptions.teacher.nombre_completo,
  aula = sectionOptions.classroom.codigo,
  cupoMax = sectionOptions.classroom.capacidad,
  cuposDisponibles = sectionOptions.classroom.capacidad,
} = {}) {
  return {
    id,
    nrc,
    estado,
    cursoId: sectionOptions.course.id,
    cursoCodigo: codigo,
    curso,
    creditos,
    ciclo,
    docenteId: sectionOptions.teacher.id,
    docente,
    aulaId: sectionOptions.classroom.id,
    aula,
    tipoAula: sectionOptions.classroom.tipo_aula,
    capacidadAula: sectionOptions.classroom.capacidad,
    cupoMax,
    cuposDisponibles,
    tieneHorario,
    horario,
  };
}

export function createBaseAcademicState() {
  return {
    nextSectionId: 600,
    confirmedSectionIds: [],
    secciones: [],
  };
}

export function buildAdminSectionRow(section) {
  return {
    id: section.id,
    nrc: section.nrc,
    curso_id: section.cursoId,
    curso: section.curso,
    docente_id: section.docenteId,
    docente: section.docente,
    aula_id: section.aulaId,
    aula: section.aula,
    tipo_aula: section.tipoAula,
    capacidad_aula: section.capacidadAula,
    semestre_id: semester.id,
    semestre: semester.codigo,
    cupo_max: section.cupoMax,
    estado: section.estado,
    fecha_creacion: "2026-06-14T08:00:00",
    tiene_horario: section.tieneHorario,
  };
}

export function buildAdminSectionsResponse(state) {
  return {
    items: state.secciones.map(buildAdminSectionRow),
    total: state.secciones.length,
    page: 1,
    limit: 10,
    total_pages: 1,
  };
}

export function buildTeacherAvailabilityResponse(state) {
  return {
    docente: {
      docente_id: sectionOptions.teacher.id,
      usuario_id: authUsers.teacher.usuario.id,
      codigo_docente: "DOC-101",
      nombre_completo: sectionOptions.teacher.nombre_completo,
      especialidad: sectionOptions.teacher.especialidad,
      correo: authUsers.teacher.correo,
    },
    secciones: state.secciones.map((section) => ({
      seccion_id: section.id,
      nrc: section.nrc,
      curso: section.curso,
      docente: section.docente,
      aula_id: section.aulaId,
      aula: section.aula,
      tipo_aula: section.tipoAula,
      capacidad_aula: section.capacidadAula,
      semestre_id: semester.id,
      semestre: semester.codigo,
      cupo_max: section.cupoMax,
      estado: section.estado,
      horario_id: section.tieneHorario ? 900 + section.id : null,
      dia_semana: section.horario?.dia_semana ?? null,
      bloque_academico_id: section.horario?.bloque_academico_id ?? null,
      hora_inicio: section.horario?.hora_inicio ?? null,
      hora_fin: section.horario?.hora_fin ?? null,
      turno: section.horario?.turno ?? null,
    })),
    bloques: blocks,
    disponibilidad: state.secciones
      .filter((section) => section.tieneHorario && section.horario)
      .map((section) => ({
        id: 900 + section.id,
        docente_id: sectionOptions.teacher.id,
        semestre_id: semester.id,
        semestre: semester.codigo,
        dia_semana: section.horario.dia_semana,
        dia_nombre: section.horario.dia_nombre,
        bloque_academico_id: section.horario.bloque_academico_id,
        hora_inicio: section.horario.hora_inicio,
        hora_fin: section.horario.hora_fin,
        turno: section.horario.turno,
        disponible: true,
      })),
  };
}

export function buildTeacherScheduleResponse(state) {
  return {
    semestre: semester,
    semestres: [semester],
    bloques: blocks,
    horarios: state.secciones
      .filter((section) => section.tieneHorario && section.horario)
      .map((section) => ({
        seccion_id: section.id,
        nrc: section.nrc,
        estado_seccion: section.estado,
        curso_codigo: section.cursoCodigo,
        curso: section.curso,
        aula: section.aula,
        aula_nombre: section.aula,
        dia_semana: section.horario.dia_semana,
        dia_nombre: section.horario.dia_nombre,
        bloque_academico_id: section.horario.bloque_academico_id,
        bloque: section.horario.bloque,
        hora_inicio: section.horario.hora_inicio,
        hora_fin: section.horario.hora_fin,
        hora: `${section.horario.hora_inicio.slice(0, 5)} - ${section.horario.hora_fin.slice(0, 5)}`,
        turno: section.horario.turno,
      })),
  };
}

export function buildStudentEnrollmentResponse(state) {
  const groupedCourses = [];
  const selectedIds = state.confirmedSectionIds;

  state.secciones.forEach((section) => {
    if (!section.tieneHorario || !section.horario || section.estado === "CANCELADA") {
      return;
    }

    groupedCourses.push({
      id: section.cursoId,
      codigo: section.cursoCodigo,
      nombre: section.curso,
      creditos: section.creditos,
      ciclo: section.ciclo,
      estado: "Disponible",
      secciones: [
        {
          id: section.id,
          nrc: section.nrc,
          docente: section.docente,
          aula: section.aula,
          diaId: section.horario.dia_semana,
          diaNombre: section.horario.dia_nombre,
          bloqueId: section.horario.bloque_academico_id,
          bloque: section.horario.bloque,
          horaInicio: section.horario.hora_inicio,
          horaFin: section.horario.hora_fin,
          turno: section.horario.turno,
          cuposDisponibles: section.cuposDisponibles,
          cupoMax: section.cupoMax,
          seleccionada: selectedIds.includes(section.id),
        },
      ],
    });
  });

  const selectedSections = state.secciones
    .filter((section) => selectedIds.includes(section.id))
    .map((section) => ({
      id: section.id,
      nrc: section.nrc,
      cursoId: section.cursoId,
      codigoCurso: section.cursoCodigo,
      nombreCurso: section.curso,
      creditos: section.creditos,
      ciclo: section.ciclo,
      docente: section.docente,
      aula: section.aula,
      diaId: section.horario.dia_semana,
      diaNombre: section.horario.dia_nombre,
      bloqueId: section.horario.bloque_academico_id,
      bloque: section.horario.bloque,
      horaInicio: section.horario.hora_inicio,
      horaFin: section.horario.hora_fin,
      turno: section.horario.turno,
      cuposDisponibles: section.cuposDisponibles,
    }));

  return {
    estudiante: {
      id: sectionOptions.student.id,
      programa_id: 10,
      codigo_estudiante: sectionOptions.student.codigo_estudiante,
      nombre_completo: sectionOptions.student.nombre_completo,
      ciclo: sectionOptions.student.ciclo,
    },
    semestre: {
      id: semester.id,
      codigo: semester.codigo,
      nombre: semester.nombre,
    },
    estado_matricula: selectedIds.length > 0 ? "CONFIRMADA" : "SIN_MATRICULA",
    cursos: groupedCourses,
    secciones_seleccionadas: selectedIds,
    secciones_seleccionadas_detalle: selectedSections,
    total_creditos: selectedSections.reduce(
      (total, section) => total + Number(section.creditos || 0),
      0,
    ),
    reglas_matricula: {
      ciclo_estudiante: sectionOptions.student.ciclo,
      ciclo_maximo_permitido: sectionOptions.student.ciclo + 1,
      max_creditos: 22,
    },
    paginacion: {
      page: 1,
      limit: 5,
      total: groupedCourses.length,
      total_pages: groupedCourses.length ? 1 : 0,
      has_next: false,
      has_prev: false,
    },
  };
}

export function buildStudentScheduleResponse(state) {
  const selectedSections = state.secciones.filter((section) =>
    state.confirmedSectionIds.includes(section.id),
  );

  return {
    estudiante: {
      id: sectionOptions.student.id,
      codigo_estudiante: sectionOptions.student.codigo_estudiante,
      nombre_completo: sectionOptions.student.nombre_completo,
      ciclo: sectionOptions.student.ciclo,
      programa: sectionOptions.student.programa,
    },
    semestre: semester,
    matricula: selectedSections.length
      ? {
          id: 700,
          estado: "CONFIRMADA",
          fecha_matricula: "2026-06-14T10:00:00",
        }
      : null,
    dias: days,
    bloques: blocks,
    clases: selectedSections.map((section) => ({
      matricula_id: 700,
      estado_matricula: "CONFIRMADA",
      seccion_id: section.id,
      nrc: section.nrc,
      curso_id: section.cursoId,
      curso_codigo: section.cursoCodigo,
      curso: section.curso,
      creditos: section.creditos,
      ciclo: section.ciclo,
      docente_id: section.docenteId,
      docente: section.docente,
      aula_id: section.aulaId,
      aula: section.aula,
      dia_semana: section.horario.dia_semana,
      dia_nombre: section.horario.dia_nombre,
      bloque_academico_id: section.horario.bloque_academico_id,
      bloque: section.horario.bloque,
      hora_inicio: section.horario.hora_inicio,
      hora_fin: section.horario.hora_fin,
      turno: section.horario.turno,
      estado_detalle: "ACTIVO",
    })),
    resumen: {
      total_cursos: selectedSections.length,
      total_clases: selectedSections.length,
      total_creditos: selectedSections.reduce(
        (total, section) => total + Number(section.creditos || 0),
        0,
      ),
    },
  };
}

export function createHorarioFromBlock(diaSemana, bloqueId) {
  const day = days.find((item) => item.id === Number(diaSemana));
  const block = blocks.find((item) => item.id === Number(bloqueId));

  return {
    dia_semana: Number(diaSemana),
    dia_nombre: day?.nombre || "Pendiente",
    bloque_academico_id: Number(bloqueId),
    bloque: block?.nombre || "Bloque",
    hora_inicio: block?.hora_inicio || "08:00:00",
    hora_fin: block?.hora_fin || "09:30:00",
    turno: block?.turno || "MANANA",
  };
}
