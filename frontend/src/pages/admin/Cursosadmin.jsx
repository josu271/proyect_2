import { useEffect, useState } from "react";
import {
  listarCursos,
  buscarProgramasCurso,
  buscarCursosPrerequisitos,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
} from "../../api/admin/cursoapi";

const FORM_INICIAL = {
  programa_id: "",
  codigo: "",
  nombre: "",
  creditos: "",
  ciclo: "",
  tipo_aula_requerida: "CUALQUIERA",
  activo: true,
  prerequisitos_ids: [],
};

const tipoAulaLabel = {
  CUALQUIERA: "Cualquiera",
  TEORICA: "Teórica",
  LABORATORIO: "Laboratorio",
  VIRTUAL: "Virtual",
};

export default function CursosAdmin() {
  const [cursos, setCursos] = useState([]);

  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);

  const [programaBusqueda, setProgramaBusqueda] = useState("");
  const [programasResultados, setProgramasResultados] = useState([]);
  const [buscandoProgramas, setBuscandoProgramas] = useState(false);

  const [prerequisitoBusqueda, setPrerequisitoBusqueda] = useState("");
  const [prerequisitosResultados, setPrerequisitosResultados] = useState([]);
  const [prerequisitosSeleccionados, setPrerequisitosSeleccionados] = useState([]);
  const [buscandoPrerequisitos, setBuscandoPrerequisitos] = useState(false);

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

  const cargarCursos = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await listarCursos({
        page,
        limit: 10,
        search: busqueda,
      });

      setCursos(data.items || []);

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
    cargarCursos();
  }, [page, busqueda]);

  useEffect(() => {
    const texto = programaBusqueda.trim();

    if (texto.length < 2) {
      setProgramasResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setBuscandoProgramas(true);
        const data = await buscarProgramasCurso({
          search: texto,
          limit: 6,
        });

        setProgramasResultados(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setBuscandoProgramas(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [programaBusqueda]);

  useEffect(() => {
    const texto = prerequisitoBusqueda.trim();

    if (texto.length < 2) {
      setPrerequisitosResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setBuscandoPrerequisitos(true);
        const data = await buscarCursosPrerequisitos({
          search: texto,
          excludeId: editandoId,
          limit: 6,
        });

        const seleccionadosIds = form.prerequisitos_ids.map(Number);

        setPrerequisitosResultados(
          (data || []).filter(
            (curso) => !seleccionadosIds.includes(Number(curso.id))
          )
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setBuscandoPrerequisitos(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [prerequisitoBusqueda, editandoId, form.prerequisitos_ids]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProgramaInput = (e) => {
    const value = e.target.value;

    setProgramaBusqueda(value);

    setForm((prev) => ({
      ...prev,
      programa_id: "",
    }));
  };

  const seleccionarPrograma = (programa) => {
    setForm((prev) => ({
      ...prev,
      programa_id: String(programa.id),
    }));

    setProgramaBusqueda(programa.nombre);
    setProgramasResultados([]);
  };

  const agregarPrerequisito = (curso) => {
    const id = Number(curso.id);

    if (editandoId && Number(editandoId) === id) {
      setError("Un curso no puede ser prerrequisito de sí mismo.");
      return;
    }

    if (form.prerequisitos_ids.includes(id)) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      prerequisitos_ids: [...prev.prerequisitos_ids, id],
    }));

    setPrerequisitosSeleccionados((prev) => [...prev, curso]);
    setPrerequisitoBusqueda("");
    setPrerequisitosResultados([]);
  };

  const quitarPrerequisito = (cursoId) => {
    const id = Number(cursoId);

    setForm((prev) => ({
      ...prev,
      prerequisitos_ids: prev.prerequisitos_ids.filter(
        (item) => Number(item) !== id
      ),
    }));

    setPrerequisitosSeleccionados((prev) =>
      prev.filter((curso) => Number(curso.id) !== id)
    );
  };

  const limpiarFormulario = () => {
    setForm(FORM_INICIAL);
    setEditandoId(null);

    setProgramaBusqueda("");
    setProgramasResultados([]);

    setPrerequisitoBusqueda("");
    setPrerequisitosResultados([]);
    setPrerequisitosSeleccionados([]);
  };

  const validarFormulario = () => {
    if (!form.programa_id) return "Seleccione un programa académico.";
    if (!form.codigo.trim()) return "Ingrese el código del curso.";
    if (!form.nombre.trim()) return "Ingrese el nombre del curso.";
    if (!form.creditos) return "Ingrese los créditos.";

    if (Number(form.creditos) < 1 || Number(form.creditos) > 6) {
      return "Los créditos deben estar entre 1 y 6.";
    }

    if (form.ciclo && (Number(form.ciclo) < 1 || Number(form.ciclo) > 12)) {
      return "El ciclo debe estar entre 1 y 12.";
    }

    if (
      editandoId &&
      form.prerequisitos_ids.some((id) => Number(id) === Number(editandoId))
    ) {
      return "Un curso no puede ser prerrequisito de sí mismo.";
    }

    return "";
  };

  const crearPayload = () => {
    return {
      programa_id: Number(form.programa_id),
      codigo: form.codigo.trim().toUpperCase(),
      nombre: form.nombre.trim(),
      creditos: Number(form.creditos),
      ciclo: form.ciclo ? Number(form.ciclo) : null,
      tipo_aula_requerida: form.tipo_aula_requerida,
      activo: form.activo === true || form.activo === "true",
      prerequisitos_ids: form.prerequisitos_ids.map(Number),
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
        await actualizarCurso(editandoId, payload);
        setMensaje("Curso actualizado correctamente.");
      } else {
        await crearCurso(payload);
        setMensaje("Curso registrado correctamente.");
      }

      limpiarFormulario();
      await cargarCursos();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (curso) => {
    setEditandoId(curso.id);

    setForm({
      programa_id: String(curso.programa_id),
      codigo: curso.codigo || "",
      nombre: curso.nombre || "",
      creditos: String(curso.creditos || ""),
      ciclo: curso.ciclo ? String(curso.ciclo) : "",
      tipo_aula_requerida: curso.tipo_aula_requerida || "CUALQUIERA",
      activo: curso.activo,
      prerequisitos_ids: (curso.prerequisitos_ids || []).map(Number),
    });

    setProgramaBusqueda(curso.programa || "");

    setPrerequisitosSeleccionados(
      (curso.prerequisitos || []).map((item) => ({
        id: Number(item.id),
        codigo: item.codigo,
        nombre: item.nombre,
        ciclo: item.ciclo,
        creditos: item.creditos,
      }))
    );

    setPrerequisitoBusqueda("");
    setPrerequisitosResultados([]);
    setProgramasResultados([]);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (curso) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas desactivar el curso ${curso.codigo}?`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await eliminarCurso(curso.id);

      setMensaje("Curso desactivado correctamente.");
      await cargarCursos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPage(1);
    cargarCursos();
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Cursos</h2>
        <p className="mt-2 text-slate-500">
          Administra cursos, créditos, ciclos, prerrequisitos, programa académico
          y tipo de aula requerida.
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

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-6 text-lg font-bold text-slate-900">
            {editandoId ? "Editar curso" : "Registrar curso"}
          </h3>

          <div className="space-y-5">
            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Programa académico
              </label>

              <input
                type="text"
                value={programaBusqueda}
                onChange={handleProgramaInput}
                placeholder="Escriba para buscar programa..."
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />

              {buscandoProgramas && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Buscando programas...
                </p>
              )}

              {programasResultados.length > 0 && (
                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  {programasResultados.map((programa) => (
                    <button
                      key={programa.id}
                      type="button"
                      onClick={() => seleccionarPrograma(programa)}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-blue-50"
                    >
                      <span className="block font-bold text-slate-800">
                        {programa.nombre}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {programa.codigo}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {form.programa_id && (
                <p className="mt-2 text-xs font-bold text-green-700">
                  Programa seleccionado correctamente.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Código
              </label>
              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                placeholder="Ej. MAT101"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm uppercase outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nombre del curso
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Cálculo 2"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Créditos
                </label>
                <input
                  type="number"
                  name="creditos"
                  value={form.creditos}
                  onChange={handleChange}
                  placeholder="4"
                  min="1"
                  max="6"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ciclo
                </label>
                <input
                  type="number"
                  name="ciclo"
                  value={form.ciclo}
                  onChange={handleChange}
                  placeholder="2"
                  min="1"
                  max="12"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tipo de aula requerida
              </label>
              <select
                name="tipo_aula_requerida"
                value={form.tipo_aula_requerida}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              >
                <option value="CUALQUIERA">Cualquiera</option>
                <option value="TEORICA">Teórica</option>
                <option value="LABORATORIO">Laboratorio</option>
                <option value="VIRTUAL">Virtual</option>
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-3 block text-sm font-bold text-slate-800">
                Prerrequisitos
              </label>

              <p className="mb-3 text-xs font-semibold text-slate-500">
                Escriba el nombre o código del curso. Se mostrarán máximo 6
                resultados.
              </p>

              <input
                type="text"
                value={prerequisitoBusqueda}
                onChange={(e) => setPrerequisitoBusqueda(e.target.value)}
                placeholder="Buscar prerrequisito..."
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />

              {buscandoPrerequisitos && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Buscando prerrequisitos...
                </p>
              )}

              {prerequisitosResultados.length > 0 && (
                <div className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                  {prerequisitosResultados.map((curso) => (
                    <button
                      key={curso.id}
                      type="button"
                      onClick={() => agregarPrerequisito(curso)}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-blue-50"
                    >
                      <span className="block font-bold text-slate-800">
                        {curso.nombre}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {curso.codigo} · Ciclo {curso.ciclo || "-"} ·{" "}
                        {curso.creditos} créditos
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {prerequisitoBusqueda.trim().length >= 2 &&
                !buscandoPrerequisitos &&
                prerequisitosResultados.length === 0 && (
                  <p className="mt-3 rounded-xl bg-white p-3 text-sm font-semibold text-slate-500">
                    No se encontraron cursos.
                  </p>
                )}

              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Seleccionados
                </p>

                {prerequisitosSeleccionados.length === 0 ? (
                  <p className="rounded-xl bg-white p-3 text-sm font-semibold text-slate-400">
                    Sin prerrequisitos seleccionados.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {prerequisitosSeleccionados.map((curso) => (
                      <span
                        key={curso.id}
                        className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-700"
                      >
                        {curso.nombre}
                        <button
                          type="button"
                          onClick={() => quitarPrerequisito(curso.id)}
                          className="rounded-full bg-amber-200 px-2 py-0.5 text-amber-800 hover:bg-amber-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Estado
              </label>
              <select
                name="activo"
                value={String(form.activo)}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
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
                  ? "Actualizar curso"
                  : "Guardar curso"}
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

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Cursos registrados
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Máximo 10 cursos por página.
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
                placeholder="Buscar curso..."
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

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full table-fixed text-left text-xs">
  <colgroup>
    <col className="w-[95px]" />
    <col className="w-[210px]" />
    <col className="w-[180px]" />
    <col className="w-[70px]" />
    <col className="w-[80px]" />
    <col className="w-[115px]" />
    <col className="w-[220px]" />
    <col className="w-[120px]" />
  </colgroup>

  <thead className="bg-slate-100 text-slate-700">
    <tr>
      <th className="px-3 py-3">Código</th>
      <th className="px-3 py-3">Curso</th>
      <th className="px-3 py-3">Programa</th>
      <th className="px-2 py-3">Ciclo</th>
      <th className="px-2 py-3">Créditos</th>
      <th className="px-3 py-3">Tipo aula</th>
      <th className="px-3 py-3">Prerrequisitos</th>
      <th className="px-3 py-3 text-right">Acciones</th>
    </tr>
  </thead>

  <tbody className="divide-y divide-slate-200">
    {loading ? (
      <tr>
        <td
          colSpan="8"
          className="px-4 py-8 text-center font-semibold text-slate-500"
        >
          Cargando cursos...
        </td>
      </tr>
    ) : cursos.length === 0 ? (
      <tr>
        <td
          colSpan="8"
          className="px-4 py-8 text-center font-semibold text-slate-500"
        >
          No hay cursos registrados.
        </td>
      </tr>
    ) : (
      cursos.map((curso) => (
        <tr key={curso.id} className="hover:bg-slate-50">
          <td className="px-3 py-4 font-bold text-slate-900">
            {curso.codigo}
          </td>

          <td className="px-3 py-4 text-slate-700">
            <span className="line-clamp-2">{curso.nombre}</span>
          </td>

          <td className="px-3 py-4 text-slate-700">
            <span className="line-clamp-2">{curso.programa}</span>
          </td>

          <td className="px-2 py-4 text-slate-700">
            {curso.ciclo || "-"}
          </td>

          <td className="px-2 py-4 text-slate-700">
            {curso.creditos}
          </td>

          <td className="px-3 py-4 text-slate-700">
            {tipoAulaLabel[curso.tipo_aula_requerida] ||
              curso.tipo_aula_requerida}
          </td>

          <td className="px-3 py-4 text-slate-700">
            {curso.prerequisitos?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {curso.prerequisitos.map((prerequisito) => (
                  <span
                    key={prerequisito.id}
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700"
                  >
                    {prerequisito.nombre}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-400">Sin prerrequisito</span>
            )}
          </td>

          <td className="px-3 py-4">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleEditar(curso)}
                className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => handleEliminar(curso)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Total: <span className="font-bold">{pagination.total}</span>{" "}
              cursos
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