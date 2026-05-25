import { useEffect, useMemo, useState } from "react";
import {
  listarCursosDisponiblesMatricula,
  confirmarMatriculaEstudiante,
} from "../../api/student/matriculaApi";

const MAX_CREDITOS = 22;
const CURSOS_POR_PAGINA = 5;
const HORARIOS_POR_PAGINA = 4;

const dias = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
];

const bloques = [
  { id: 1, hora: "08:00 - 09:30", turno: "Mañana" },
  { id: 2, hora: "09:30 - 11:00", turno: "Mañana" },
  { id: 3, hora: "11:00 - 12:30", turno: "Mañana" },
  { id: 4, hora: "14:00 - 15:30", turno: "Tarde" },
  { id: 5, hora: "15:30 - 17:00", turno: "Tarde" },
  { id: 6, hora: "17:00 - 18:30", turno: "Tarde" },
  { id: 7, hora: "18:30 - 20:00", turno: "Noche" },
  { id: 8, hora: "20:00 - 21:30", turno: "Noche" },
];

function obtenerUsuarioStorage() {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "{}");
  } catch {
    return {};
  }
}

function obtenerDia(diaId) {
  return dias.find((dia) => dia.id === Number(diaId));
}

function obtenerBloque(bloqueId) {
  return bloques.find((bloque) => bloque.id === Number(bloqueId));
}

function formatearHora(valor) {
  if (!valor) return "";
  return String(valor).slice(0, 5);
}

function formatearTurno(turno) {
  if (!turno) return "";

  const normalizado = String(turno).toUpperCase();

  if (normalizado === "MANANA") return "Mañana";
  if (normalizado === "TARDE") return "Tarde";
  if (normalizado === "NOCHE") return "Noche";

  return turno;
}

function obtenerHoraSeccion(seccion) {
  if (seccion.horaInicio && seccion.horaFin) {
    return `${formatearHora(seccion.horaInicio)} - ${formatearHora(
      seccion.horaFin
    )}`;
  }

  const bloque = obtenerBloque(seccion.bloqueId);
  return bloque?.hora || "Horario no definido";
}

function obtenerTurnoSeccion(seccion) {
  if (seccion.turno) return formatearTurno(seccion.turno);

  const bloque = obtenerBloque(seccion.bloqueId);
  return bloque?.turno || "";
}

function formatearEstadoMatricula(estado) {
  if (!estado || estado === "SIN_MATRICULA") return "Sin matrícula";
  if (estado === "BORRADOR") return "Borrador";
  if (estado === "CONFIRMADA") return "Confirmada";
  if (estado === "ANULADA") return "Anulada";
  return estado;
}

export default function MatriculaEstudiante() {
  const usuario = obtenerUsuarioStorage();

  const estudianteId =
    usuario.estudiante_id || usuario.estudianteId || usuario.estudiante?.id;

  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState(null);
  const [seccionesElegidasIds, setSeccionesElegidasIds] = useState([]);
  const [seccionesCache, setSeccionesCache] = useState({});

  const [semestre, setSemestre] = useState(null);
  const [estadoMatricula, setEstadoMatricula] = useState("SIN_MATRICULA");

  const [pagina, setPagina] = useState(1);
  const [paginacion, setPaginacion] = useState(null);
  const [paginaHorarios, setPaginaHorarios] = useState(1);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const registrarSeccionesEnCache = (cursos, seccionesExtras = []) => {
    const seccionesDePagina = (cursos || []).flatMap((curso) =>
      (curso.secciones || []).map((seccion) => ({
        ...seccion,
        id: Number(seccion.id),
        cursoId: Number(curso.id),
        codigoCurso: curso.codigo,
        nombreCurso: curso.nombre,
        creditos: Number(curso.creditos || 0),
        ciclo: curso.ciclo,
      }))
    );

    const mapa = {};

    [...seccionesDePagina, ...(seccionesExtras || [])].forEach((seccion) => {
      const id = Number(seccion.id);

      mapa[id] = {
        ...seccion,
        id,
        cursoId: Number(seccion.cursoId),
        creditos: Number(seccion.creditos || 0),
        diaId: Number(seccion.diaId),
        bloqueId: Number(seccion.bloqueId),
        cuposDisponibles: Number(seccion.cuposDisponibles ?? 0),
      };
    });

    setSeccionesCache((actual) => ({
      ...actual,
      ...mapa,
    }));
  };

  const cargarMatricula = async () => {
    if (!estudianteId) {
      setLoading(false);
      setError(
        "No se encontró estudiante_id en localStorage. Revisa la respuesta del login."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await listarCursosDisponiblesMatricula(
        estudianteId,
        pagina,
        CURSOS_POR_PAGINA
      );

      const cursos = data.cursos || [];
      const idsSeleccionadas = (data.secciones_seleccionadas || []).map(Number);

      setCursosDisponibles(cursos);
      setSeccionesElegidasIds(idsSeleccionadas);
      setSemestre(data.semestre || null);
      setEstadoMatricula(data.estado_matricula || "SIN_MATRICULA");
      setPaginacion(data.paginacion || null);

      registrarSeccionesEnCache(
        cursos,
        data.secciones_seleccionadas_detalle || []
      );

      setCursoSeleccionadoId((actual) => {
        const existeEnPagina = cursos.some(
          (curso) => Number(curso.id) === Number(actual)
        );

        if (existeEnPagina) return actual;

        return cursos.length > 0 ? Number(cursos[0].id) : null;
      });

      setPaginaHorarios(1);
    } catch (err) {
      setError(err.message || "No se pudo cargar la matrícula.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMatricula();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  useEffect(() => {
    setPaginaHorarios(1);
  }, [cursoSeleccionadoId]);

  const cursoSeleccionado = useMemo(() => {
    return cursosDisponibles.find(
      (curso) => Number(curso.id) === Number(cursoSeleccionadoId)
    );
  }, [cursosDisponibles, cursoSeleccionadoId]);

  const seccionesElegidas = useMemo(() => {
    return seccionesElegidasIds
      .map((id) => seccionesCache[Number(id)])
      .filter(Boolean);
  }, [seccionesElegidasIds, seccionesCache]);

  const seccionesDelCursoSeleccionado = useMemo(() => {
    if (!cursoSeleccionado) return [];

    return (cursoSeleccionado.secciones || []).map((seccion) => ({
      ...seccion,
      id: Number(seccion.id),
      cursoId: Number(cursoSeleccionado.id),
      codigoCurso: cursoSeleccionado.codigo,
      nombreCurso: cursoSeleccionado.nombre,
      creditos: Number(cursoSeleccionado.creditos || 0),
      ciclo: cursoSeleccionado.ciclo,
      diaId: Number(seccion.diaId),
      bloqueId: Number(seccion.bloqueId),
      cuposDisponibles: Number(seccion.cuposDisponibles ?? 0),
    }));
  }, [cursoSeleccionado]);

  const totalPaginasHorarios = Math.max(
    1,
    Math.ceil(seccionesDelCursoSeleccionado.length / HORARIOS_POR_PAGINA)
  );

  const seccionesHorariosPaginadas = useMemo(() => {
    const inicio = (paginaHorarios - 1) * HORARIOS_POR_PAGINA;
    const fin = inicio + HORARIOS_POR_PAGINA;

    return seccionesDelCursoSeleccionado.slice(inicio, fin);
  }, [seccionesDelCursoSeleccionado, paginaHorarios]);

  const totalCreditos = seccionesElegidas.reduce(
    (total, seccion) => total + Number(seccion.creditos || 0),
    0
  );

  const cursoYaElegido = (cursoId) => {
    return seccionesElegidas.some(
      (seccion) => Number(seccion.cursoId) === Number(cursoId)
    );
  };

  const seccionYaElegida = (seccionId) => {
    return seccionesElegidasIds.includes(Number(seccionId));
  };

  const buscarChoqueHorario = (seccionNueva) => {
    return seccionesElegidas.find(
      (seccionElegida) =>
        Number(seccionElegida.cursoId) !== Number(seccionNueva.cursoId) &&
        Number(seccionElegida.diaId) === Number(seccionNueva.diaId) &&
        Number(seccionElegida.bloqueId) === Number(seccionNueva.bloqueId)
    );
  };

  const calcularCreditosSiElige = (seccionNueva) => {
    const yaTieneEseCurso = cursoYaElegido(seccionNueva.cursoId);

    if (yaTieneEseCurso) return totalCreditos;

    return totalCreditos + Number(seccionNueva.creditos || 0);
  };

  const obtenerEstadoSeccion = (seccion) => {
    const seleccionada = seccionYaElegida(seccion.id);
    const choque = buscarChoqueHorario(seccion);
    const creditosFinales = calcularCreditosSiElige(seccion);
    const yaTieneEseCurso = cursoYaElegido(seccion.cursoId);

    if (seleccionada) return "seleccionada";
    if (Number(seccion.cuposDisponibles || 0) <= 0) return "sin-cupos";
    if (choque) return "choque";
    if (creditosFinales > MAX_CREDITOS) return "creditos";
    if (yaTieneEseCurso) return "cambio";

    return "disponible";
  };

  const elegirSeccion = (seccion) => {
    const estado = obtenerEstadoSeccion(seccion);
    const seccionId = Number(seccion.id);

    setMensajeOk("");

    if (estado === "sin-cupos" || estado === "choque" || estado === "creditos") {
      return;
    }

    if (estado === "seleccionada") {
      setSeccionesElegidasIds((actual) =>
        actual.filter((id) => Number(id) !== seccionId)
      );
      return;
    }

    setSeccionesElegidasIds((actual) => {
      const idsSinEseCurso = actual.filter((id) => {
        const seccionActual = seccionesCache[Number(id)];

        return Number(seccionActual?.cursoId) !== Number(seccion.cursoId);
      });

      return [...idsSinEseCurso, seccionId];
    });

    setSeccionesCache((actual) => ({
      ...actual,
      [seccionId]: {
        ...seccion,
        id: seccionId,
        cursoId: Number(seccion.cursoId),
        creditos: Number(seccion.creditos || 0),
        diaId: Number(seccion.diaId),
        bloqueId: Number(seccion.bloqueId),
        cuposDisponibles: Number(seccion.cuposDisponibles ?? 0),
      },
    }));
  };

  const confirmarMatricula = async () => {
    if (seccionesElegidasIds.length === 0 || guardando) return;

    try {
      setGuardando(true);
      setError("");
      setMensajeOk("");

      const response = await confirmarMatriculaEstudiante({
        estudiante_id: Number(estudianteId),
        secciones_ids: seccionesElegidasIds,
      });

      setMensajeOk(response.mensaje || "Matrícula confirmada correctamente.");
      await cargarMatricula();
    } catch (err) {
      setError(err.message || "No se pudo confirmar la matrícula.");
    } finally {
      setGuardando(false);
    }
  };

  const obtenerTextoEstado = (estado) => {
    if (estado === "seleccionada") return "Seleccionado";
    if (estado === "sin-cupos") return "Sin cupos";
    if (estado === "choque") return "Cruce horario";
    if (estado === "creditos") return "Excede créditos";
    if (estado === "cambio") return "Cambiar horario";

    return "Elegir horario";
  };

  const obtenerClaseBoton = (estado) => {
    if (estado === "seleccionada") {
      return "bg-green-600 text-white hover:bg-green-700";
    }

    if (estado === "sin-cupos" || estado === "choque" || estado === "creditos") {
      return "cursor-not-allowed bg-slate-100 text-slate-400";
    }

    if (estado === "cambio") {
      return "bg-amber-500 text-white hover:bg-amber-600";
    }

    return "bg-blue-800 text-white hover:bg-blue-900";
  };

  if (loading) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Matrícula</h2>
          <p className="mt-2 text-slate-500">
            Cargando cursos disponibles para matrícula...
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Consultando información del estudiante.
          </p>
        </div>
      </section>
    );
  }

  if (error && !cursosDisponibles.length) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Matrícula</h2>
          <p className="mt-2 text-slate-500">
            No se pudo cargar la información de matrícula.
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Matrícula</h2>
        <p className="mt-2 text-slate-500">
          Selecciona un curso disponible, elige una sección/NRC y revisa tu
          horario antes de confirmar.
        </p>
      </div>

      {mensajeOk && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          {mensajeOk}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Créditos seleccionados
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {totalCreditos}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Máximo permitido: {MAX_CREDITOS}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Cursos inscritos
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {seccionesElegidas.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {semestre?.codigo || "Semestre activo"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Estado de matrícula
          </p>
          <p className="mt-3 text-3xl font-bold text-blue-700">
            {formatearEstadoMatricula(estadoMatricula)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {estadoMatricula === "CONFIRMADA"
              ? "Matrícula registrada"
              : "Pendiente de confirmación"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Cursos disponibles para ti
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Se muestran 5 cursos por página.
            </p>
          </div>

          {cursosDisponibles.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
              No hay cursos disponibles para matrícula.
            </div>
          ) : (
            <div className="space-y-3">
              {cursosDisponibles.map((curso) => {
                const activo = Number(curso.id) === Number(cursoSeleccionadoId);
                const yaElegido = cursoYaElegido(curso.id);

                return (
                  <button
                    key={curso.id}
                    type="button"
                    onClick={() => {
                      setCursoSeleccionadoId(Number(curso.id));
                      setPaginaHorarios(1);
                    }}
                    className={[
                      "w-full rounded-2xl border p-4 text-left transition",
                      activo
                        ? "border-blue-700 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {curso.codigo}
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {curso.nombre}
                        </p>
                      </div>

                      {yaElegido && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Inscrito
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
                        {curso.creditos} créditos
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
                        Ciclo {curso.ciclo || "-"}
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">
                        {(curso.secciones || []).length} horarios
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {paginacion && paginacion.total_pages > 1 && (
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={!paginacion.has_prev}
                onClick={() => setPagina((actual) => Math.max(actual - 1, 1))}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-bold",
                  paginacion.has_prev
                    ? "bg-slate-800 text-white hover:bg-slate-900"
                    : "cursor-not-allowed bg-slate-100 text-slate-400",
                ].join(" ")}
              >
                Anterior
              </button>

              <span className="text-sm font-semibold text-slate-600">
                Página {paginacion.page} de {paginacion.total_pages}
              </span>

              <button
                type="button"
                disabled={!paginacion.has_next}
                onClick={() => setPagina((actual) => actual + 1)}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-bold",
                  paginacion.has_next
                    ? "bg-slate-800 text-white hover:bg-slate-900"
                    : "cursor-not-allowed bg-slate-100 text-slate-400",
                ].join(" ")}
              >
                Siguiente
              </button>
            </div>
          )}
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Horarios disponibles
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Se muestran 4 horarios por página.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Curso seleccionado:{" "}
                <span className="font-bold text-slate-800">
                  {cursoSeleccionado
                    ? `${cursoSeleccionado.codigo} - ${cursoSeleccionado.nombre}`
                    : "Ninguno"}
                </span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              {cursoSeleccionado && (
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                  {cursoSeleccionado.creditos} créditos
                </span>
              )}

              <button
                type="button"
                onClick={confirmarMatricula}
                disabled={seccionesElegidasIds.length === 0 || guardando}
                className={[
                  "h-11 rounded-xl px-6 text-sm font-bold transition",
                  seccionesElegidasIds.length === 0 || guardando
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-blue-800 text-white hover:bg-blue-900",
                ].join(" ")}
              >
                {guardando ? "Confirmando..." : "Confirmar matrícula"}
              </button>
            </div>
          </div>

          {seccionesDelCursoSeleccionado.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
              Este curso no tiene secciones disponibles.
            </div>
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                {seccionesHorariosPaginadas.map((seccion) => {
                  const dia = obtenerDia(seccion.diaId);
                  const estado = obtenerEstadoSeccion(seccion);
                  const choque = buscarChoqueHorario(seccion);

                  return (
                    <article
                      key={seccion.id}
                      className={[
                        "rounded-2xl border p-5",
                        estado === "seleccionada"
                          ? "border-green-300 bg-green-50"
                          : estado === "choque"
                          ? "border-red-200 bg-red-50"
                          : estado === "sin-cupos"
                          ? "border-slate-200 bg-slate-50"
                          : "border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {seccion.nrc}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Docente: {seccion.docente}
                          </p>
                        </div>

                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-bold",
                            Number(seccion.cuposDisponibles || 0) > 0
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700",
                          ].join(" ")}
                        >
                          {seccion.cuposDisponibles} cupos
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-100 p-4">
                        <p className="text-sm font-bold text-slate-900">
                          {dia?.nombre || "Día no definido"}
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {obtenerHoraSeccion(seccion)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {obtenerTurnoSeccion(seccion)} · Aula{" "}
                          {seccion.aula || "-"}
                        </p>
                      </div>

                      {estado === "choque" && choque && (
                        <p className="mt-3 rounded-xl bg-red-100 px-4 py-3 text-xs font-semibold text-red-700">
                          Cruza con {choque.codigoCurso} - {choque.nombreCurso}
                        </p>
                      )}

                      {estado === "creditos" && (
                        <p className="mt-3 rounded-xl bg-amber-100 px-4 py-3 text-xs font-semibold text-amber-700">
                          Supera el límite máximo de créditos permitidos.
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => elegirSeccion(seccion)}
                        className={[
                          "mt-5 h-11 w-full rounded-xl text-sm font-bold transition",
                          obtenerClaseBoton(estado),
                        ].join(" ")}
                      >
                        {obtenerTextoEstado(estado)}
                      </button>
                    </article>
                  );
                })}
              </div>

              {totalPaginasHorarios > 1 && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={paginaHorarios <= 1}
                    onClick={() =>
                      setPaginaHorarios((actual) => Math.max(actual - 1, 1))
                    }
                    className={[
                      "rounded-xl px-4 py-2 text-sm font-bold",
                      paginaHorarios > 1
                        ? "bg-slate-800 text-white hover:bg-slate-900"
                        : "cursor-not-allowed bg-slate-100 text-slate-400",
                    ].join(" ")}
                  >
                    Anterior
                  </button>

                  <span className="text-sm font-semibold text-slate-600">
                    Horarios {paginaHorarios} de {totalPaginasHorarios}
                  </span>

                  <button
                    type="button"
                    disabled={paginaHorarios >= totalPaginasHorarios}
                    onClick={() =>
                      setPaginaHorarios((actual) =>
                        Math.min(actual + 1, totalPaginasHorarios)
                      )
                    }
                    className={[
                      "rounded-xl px-4 py-2 text-sm font-bold",
                      paginaHorarios < totalPaginasHorarios
                        ? "bg-slate-800 text-white hover:bg-slate-900"
                        : "cursor-not-allowed bg-slate-100 text-slate-400",
                    ].join(" ")}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Horario inscrito
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Aquí aparecen los cursos elegidos distribuidos por día y hora.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 border border-slate-200 bg-slate-100 px-4 py-3 text-left font-bold text-slate-700">
                  Hora
                </th>

                {dias.map((dia) => (
                  <th
                    key={dia.id}
                    className="border border-slate-200 bg-slate-100 px-4 py-3 text-left font-bold text-slate-700"
                  >
                    {dia.nombre}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {bloques.map((bloque) => (
                <tr key={bloque.id}>
                  <td className="border border-slate-200 bg-slate-50 px-4 py-4 align-top">
                    <p className="font-bold text-slate-800">{bloque.hora}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {bloque.turno}
                    </p>
                  </td>

                  {dias.map((dia) => {
                    const seccion = seccionesElegidas.find(
                      (item) =>
                        Number(item.diaId) === Number(dia.id) &&
                        Number(item.bloqueId) === Number(bloque.id)
                    );

                    return (
                      <td
                        key={`${dia.id}-${bloque.id}`}
                        className="h-28 border border-slate-200 p-3 align-top"
                      >
                        {seccion ? (
                          <div className="h-full rounded-xl bg-blue-100 p-3 text-blue-900">
                            <p className="text-sm font-bold">
                              {seccion.codigoCurso}
                            </p>
                            <p className="mt-1 text-sm">
                              {seccion.nombreCurso}
                            </p>
                            <p className="mt-2 text-xs">{seccion.nrc}</p>
                            <p className="mt-1 text-xs">
                              Aula {seccion.aula || "-"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">
                            Sin curso
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {seccionesElegidas.length > 0 && (
          <div className="mt-6 rounded-2xl bg-slate-100 p-5">
            <h4 className="mb-4 text-sm font-bold text-slate-800">
              Resumen de cursos inscritos
            </h4>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {seccionesElegidas.map((seccion) => {
                const dia = obtenerDia(seccion.diaId);

                return (
                  <div
                    key={seccion.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <p className="font-bold text-slate-900">
                      {seccion.codigoCurso} - {seccion.nombreCurso}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {seccion.nrc}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {dia?.nombre} · {obtenerHoraSeccion(seccion)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Docente: {seccion.docente}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}