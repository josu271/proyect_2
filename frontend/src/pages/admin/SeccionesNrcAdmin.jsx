import { useEffect, useState } from "react";
import {
  listarOpcionesSeccion,
  buscarCursosSeccion,
  buscarDocentesSeccion,
  buscarAulasSeccion,
  listarSecciones,
  crearSeccion,
  actualizarSeccion,
  eliminarSeccion,
} from "../../api/admin/seccionesapi";

const FORM_INICIAL = {
  nrc: "",
  curso_id: "",
  docente_id: "",
  aula_id: "",
};

const estadoLabel = {
  BORRADOR: "Pendiente de horario",
  PROPUESTA: "Propuesta",
  PUBLICADA: "Publicada",
  CERRADA: "Cerrada",
  CANCELADA: "Cancelada",
};

export default function SeccionesNrcAdmin() {
  const [secciones, setSecciones] = useState([]);

  const [semestre, setSemestre] = useState(null);

  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);

  const [cursoTexto, setCursoTexto] = useState("");
  const [cursoResultados, setCursoResultados] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [buscandoCursos, setBuscandoCursos] = useState(false);

  const [docenteTexto, setDocenteTexto] = useState("");
  const [docenteResultados, setDocenteResultados] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [buscandoDocentes, setBuscandoDocentes] = useState(false);

  const [aulaTexto, setAulaTexto] = useState("");
  const [aulaResultados, setAulaResultados] = useState([]);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  const [buscandoAulas, setBuscandoAulas] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1,
  });

  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarOpciones = async () => {
    try {
      const data = await listarOpcionesSeccion();
      setSemestre(data.semestre || null);
    } catch (err) {
      setError(err.message);
    }
  };

  const cargarSecciones = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await listarSecciones({
        page,
        limit: 10,
        search: busqueda,
      });

      setSecciones(data.items || []);

      setPagination({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 10,
        total_pages: data.total_pages || 1,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOpciones();
  }, []);

  useEffect(() => {
    cargarSecciones();
  }, [page, busqueda]);

  useEffect(() => {
    const texto = cursoTexto.trim();

    if (texto.length < 2 || form.curso_id) {
      setCursoResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setBuscandoCursos(true);

        const data = await buscarCursosSeccion({
          search: texto,
          limit: 5,
        });

        setCursoResultados(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setBuscandoCursos(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cursoTexto, form.curso_id]);

  useEffect(() => {
    const texto = docenteTexto.trim();

    if (texto.length < 2 || form.docente_id) {
      setDocenteResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setBuscandoDocentes(true);

        const data = await buscarDocentesSeccion({
          search: texto,
          limit: 5,
        });

        setDocenteResultados(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setBuscandoDocentes(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [docenteTexto, form.docente_id]);

  useEffect(() => {
    const texto = aulaTexto.trim();

    if (texto.length < 1 || form.aula_id) {
      setAulaResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setBuscandoAulas(true);

        const data = await buscarAulasSeccion({
          search: texto,
          limit: 5,
        });

        setAulaResultados(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setBuscandoAulas(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [aulaTexto, form.aula_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const seleccionarCurso = (curso) => {
    setForm((prev) => ({
      ...prev,
      curso_id: String(curso.id),
    }));

    setCursoSeleccionado(curso);
    setCursoTexto(curso.nombre);
    setCursoResultados([]);
  };

  const limpiarCurso = () => {
    setForm((prev) => ({
      ...prev,
      curso_id: "",
    }));

    setCursoSeleccionado(null);
    setCursoTexto("");
    setCursoResultados([]);
  };

  const seleccionarDocente = (docente) => {
    setForm((prev) => ({
      ...prev,
      docente_id: String(docente.id),
    }));

    setDocenteSeleccionado(docente);
    setDocenteTexto(docente.nombre_completo);
    setDocenteResultados([]);
  };

  const limpiarDocente = () => {
    setForm((prev) => ({
      ...prev,
      docente_id: "",
    }));

    setDocenteSeleccionado(null);
    setDocenteTexto("");
    setDocenteResultados([]);
  };

  const seleccionarAula = (aula) => {
    setForm((prev) => ({
      ...prev,
      aula_id: String(aula.id),
    }));

    setAulaSeleccionada(aula);
    setAulaTexto(`${aula.codigo} - ${aula.tipo_aula} - Capacidad ${aula.capacidad}`);
    setAulaResultados([]);
  };

  const limpiarAula = () => {
    setForm((prev) => ({
      ...prev,
      aula_id: "",
    }));

    setAulaSeleccionada(null);
    setAulaTexto("");
    setAulaResultados([]);
  };

  const limpiarFormulario = () => {
    setForm(FORM_INICIAL);
    setEditandoId(null);

    setCursoTexto("");
    setCursoResultados([]);
    setCursoSeleccionado(null);

    setDocenteTexto("");
    setDocenteResultados([]);
    setDocenteSeleccionado(null);

    setAulaTexto("");
    setAulaResultados([]);
    setAulaSeleccionada(null);
  };

  const validarFormulario = () => {
    if (!form.nrc.trim()) return "Ingrese el NRC.";
    if (!form.curso_id) return "Seleccione un curso.";
    if (!form.docente_id) return "Seleccione un docente.";
    if (!form.aula_id) return "Seleccione un aula.";

    return "";
  };

  const crearPayload = () => {
    return {
      nrc: form.nrc.trim().toUpperCase(),
      curso_id: Number(form.curso_id),
      docente_id: Number(form.docente_id),
      aula_id: Number(form.aula_id),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validacion = validarFormulario();

    if (validacion) {
      setError(validacion);
      setMensaje("");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      const payload = crearPayload();

      if (editandoId) {
        await actualizarSeccion(editandoId, payload);
        setMensaje("Sección actualizada correctamente.");
      } else {
        await crearSeccion(payload);
        setMensaje("Sección registrada correctamente.");
      }

      limpiarFormulario();
      await cargarSecciones();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (seccion) => {
    if (seccion.tiene_horario) {
      setError("No se puede editar esta sección porque el docente ya asignó día y hora.");
      setMensaje("");
      return;
    }

    setEditandoId(seccion.id);

    setForm({
      nrc: seccion.nrc || "",
      curso_id: seccion.curso_id ? String(seccion.curso_id) : "",
      docente_id: seccion.docente_id ? String(seccion.docente_id) : "",
      aula_id: seccion.aula_id ? String(seccion.aula_id) : "",
    });

    setCursoTexto(seccion.curso || "");
    setCursoSeleccionado({
      id: seccion.curso_id,
      nombre: seccion.curso,
    });
    setCursoResultados([]);

    setDocenteTexto(seccion.docente || "");
    setDocenteSeleccionado({
      id: seccion.docente_id,
      nombre_completo: seccion.docente,
    });
    setDocenteResultados([]);

    setAulaTexto(
      `${seccion.aula || ""} - ${seccion.tipo_aula || ""} - Capacidad ${
        seccion.capacidad_aula || ""
      }`
    );
    setAulaSeleccionada({
      id: seccion.aula_id,
      codigo: seccion.aula,
      tipo_aula: seccion.tipo_aula,
      capacidad: seccion.capacidad_aula,
    });
    setAulaResultados([]);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (seccion) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas cancelar la sección ${seccion.nrc}?`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await eliminarSeccion(seccion.id);

      setMensaje("Sección cancelada correctamente.");
      await cargarSecciones();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPage(1);
    cargarSecciones();
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Secciones/NRC</h2>
        <p className="mt-2 text-slate-500">
          Asigna NRC, curso, docente y aula. El docente definirá el día y la hora.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {mensaje}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-6 text-lg font-bold text-slate-900">
            {editandoId ? "Editar sección" : "Crear sección"}
          </h3>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                NRC
              </label>
              <input
                type="text"
                name="nrc"
                value={form.nrc}
                onChange={handleChange}
                placeholder="Ej. NRC1001"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm uppercase outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Curso
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={cursoTexto}
                  onChange={(e) => {
                    setCursoTexto(e.target.value);
                    if (form.curso_id) limpiarCurso();
                  }}
                  placeholder="Escriba el nombre del curso..."
                  className="h-12 flex-1 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                />

                {form.curso_id && (
                  <button
                    type="button"
                    onClick={limpiarCurso}
                    className="h-12 rounded-xl border border-slate-300 px-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    ×
                  </button>
                )}
              </div>

              {buscandoCursos && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Buscando cursos...
                </p>
              )}

              {cursoResultados.length > 0 && (
                <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  {cursoResultados.map((curso) => (
                    <button
                      key={curso.id}
                      type="button"
                      onClick={() => seleccionarCurso(curso)}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-blue-50"
                    >
                      <span className="block font-bold text-slate-800">
                        {curso.nombre}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Ciclo {curso.ciclo || "-"} · {curso.creditos} créditos ·{" "}
                        {curso.tipo_aula_requerida}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {form.curso_id && (
                <p className="mt-2 text-xs font-bold text-green-700">
                  Curso seleccionado correctamente.
                </p>
              )}
            </div>

            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Docente
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={docenteTexto}
                  onChange={(e) => {
                    setDocenteTexto(e.target.value);
                    if (form.docente_id) limpiarDocente();
                  }}
                  placeholder="Escriba el nombre del docente..."
                  className="h-12 flex-1 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                />

                {form.docente_id && (
                  <button
                    type="button"
                    onClick={limpiarDocente}
                    className="h-12 rounded-xl border border-slate-300 px-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    ×
                  </button>
                )}
              </div>

              {buscandoDocentes && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Buscando docentes...
                </p>
              )}

              {docenteResultados.length > 0 && (
                <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  {docenteResultados.map((docente) => (
                    <button
                      key={docente.id}
                      type="button"
                      onClick={() => seleccionarDocente(docente)}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-blue-50"
                    >
                      <span className="block font-bold text-slate-800">
                        {docente.nombre_completo}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {docente.especialidad || "Sin especialidad"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {form.docente_id && (
                <p className="mt-2 text-xs font-bold text-green-700">
                  Docente seleccionado correctamente.
                </p>
              )}
            </div>

            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Aula
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aulaTexto}
                  onChange={(e) => {
                    setAulaTexto(e.target.value);
                    if (form.aula_id) limpiarAula();
                  }}
                  placeholder="Escriba código o tipo de aula..."
                  className="h-12 flex-1 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                />

                {form.aula_id && (
                  <button
                    type="button"
                    onClick={limpiarAula}
                    className="h-12 rounded-xl border border-slate-300 px-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    ×
                  </button>
                )}
              </div>

              {buscandoAulas && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Buscando aulas...
                </p>
              )}

              {aulaResultados.length > 0 && (
                <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  {aulaResultados.map((aula) => (
                    <button
                      key={aula.id}
                      type="button"
                      onClick={() => seleccionarAula(aula)}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-blue-50"
                    >
                      <span className="block font-bold text-slate-800">
                        {aula.codigo}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {aula.tipo_aula} · Capacidad {aula.capacidad} ·{" "}
                        {aula.ubicacion || "Sin ubicación"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {aulaSeleccionada && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Cupo máximo automático: {aulaSeleccionada.capacidad} estudiantes.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              Semestre automático:{" "}
              <span className="font-bold">{semestre?.codigo || "No definido"}</span>
              . El cupo se calcula con la capacidad del aula.
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              El día y el bloque horario no se asignan aquí. Esa acción corresponde
              al módulo del docente.
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={guardando}
                className="h-12 flex-1 rounded-xl bg-blue-800 text-sm font-bold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando
                  ? "Guardando..."
                  : editandoId
                  ? "Actualizar sección"
                  : "Guardar sección"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="h-12 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Secciones registradas
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Máximo 10 secciones por página.
              </p>
            </div>

            <form onSubmit={handleBuscar} className="flex w-full gap-2 md:w-auto">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar sección..."
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 md:w-72"
              />

              <button
                type="submit"
                className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800"
              >
                Buscar
              </button>
            </form>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">NRC</th>
                  <th className="px-4 py-3">Curso</th>
                  <th className="px-4 py-3">Docente</th>
                  <th className="px-4 py-3">Semestre</th>
                  <th className="px-4 py-3">Aula</th>
                  <th className="px-4 py-3">Cupo</th>
                  <th className="px-4 py-3">Horario</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-8 text-center font-semibold text-slate-500"
                    >
                      Cargando secciones...
                    </td>
                  </tr>
                ) : secciones.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-8 text-center font-semibold text-slate-500"
                    >
                      No hay secciones registradas.
                    </td>
                  </tr>
                ) : (
                  secciones.map((seccion) => (
                    <tr key={seccion.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-bold text-slate-900">
                        {seccion.nrc}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {seccion.curso}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {seccion.docente}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {seccion.semestre}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {seccion.aula}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {seccion.cupo_max}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            seccion.tiene_horario
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {seccion.tiene_horario
                            ? "Asignado por docente"
                            : "Pendiente"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-bold",
                            seccion.estado === "PUBLICADA"
                              ? "bg-green-100 text-green-700"
                              : seccion.estado === "CANCELADA"
                              ? "bg-red-100 text-red-700"
                              : seccion.estado === "CERRADA"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-amber-100 text-amber-700",
                          ].join(" ")}
                        >
                          {estadoLabel[seccion.estado] || seccion.estado}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditar(seccion)}
                            disabled={seccion.tiene_horario}
                            className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEliminar(seccion)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Total: <span className="font-bold">{pagination.total}</span>{" "}
              secciones
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              <span className="text-sm font-semibold text-slate-700">
                Página {pagination.page} de {pagination.total_pages}
              </span>

              <button
                type="button"
                disabled={page >= pagination.total_pages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.total_pages))
                }
                className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}