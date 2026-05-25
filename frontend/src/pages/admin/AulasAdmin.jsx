import { useEffect, useState } from "react";
import {
  listarAulas,
  crearAula,
  actualizarAula,
  eliminarAula,
} from "../../api/admin/aulasapi";

const FORM_INICIAL = {
  codigo: "",
  tipo_aula: "TEORICA",
  capacidad: "",
  ubicacion: "",
  activa: true,
};

const tipoAulaLabel = {
  TEORICA: "Teórica",
  LABORATORIO: "Laboratorio",
  PRACTICO: "PRACTICO",
  VIRTUAL: "Virtual",
};

export default function AulasAdmin() {
  const [aulas, setAulas] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);

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

  const cargarAulas = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await listarAulas({
        page,
        limit: 10,
        search: busqueda,
      });

      setAulas(data.items || []);
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
    cargarAulas();
  }, [page, busqueda]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setForm(FORM_INICIAL);
    setEditandoId(null);
  };

  const validarFormulario = () => {
    if (!form.codigo.trim()) return "Ingrese el código del aula.";
    if (!form.tipo_aula) return "Seleccione el tipo de aula.";
    if (!form.capacidad) return "Ingrese la capacidad.";
    if (Number(form.capacidad) <= 0) {
      return "La capacidad debe ser mayor a 0.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validacion = validarFormulario();

    if (validacion) {
      setError(validacion);
      setMensaje("");
      return;
    }

    const payload = {
  codigo: form.codigo.trim().toUpperCase(),
  nombre: form.codigo.trim().toUpperCase(),
  tipo_aula: form.tipo_aula,
  capacidad: Number(form.capacidad),
  ubicacion: form.ubicacion.trim() || null,
  activa: form.activa === true || form.activa === "true",
};

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (editandoId) {
        await actualizarAula(editandoId, payload);
        setMensaje("Aula actualizada correctamente.");
      } else {
        await crearAula(payload);
        setMensaje("Aula registrada correctamente.");
      }

      limpiarFormulario();
      await cargarAulas();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (aula) => {
    setEditandoId(aula.id);

    setForm({
      codigo: aula.codigo || "",
      tipo_aula: aula.tipo_aula || "TEORICA",
      capacidad: aula.capacidad ? String(aula.capacidad) : "",
      ubicacion: aula.ubicacion || "",
      activa: aula.activa,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (aula) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas desactivar el aula ${aula.codigo}?`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await eliminarAula(aula.id);

      setMensaje("Aula desactivada correctamente.");
      await cargarAulas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPage(1);
    cargarAulas();
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Aulas</h2>
        <p className="mt-2 text-slate-500">
          Gestiona aulas físicas, laboratorios, auditorios y aulas virtuales.
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
            {editandoId ? "Editar aula" : "Registrar aula"}
          </h3>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Código de aula
              </label>
              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                placeholder="Ej. G103"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm uppercase outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tipo de aula
              </label>
              <select
                name="tipo_aula"
                value={form.tipo_aula}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              >
                <option value="TEORICA">Teórica</option>
                <option value="LABORATORIO">Laboratorio</option>
                <option value="AUDITORIO">Auditorio</option>
                <option value="VIRTUAL">Virtual</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Capacidad
              </label>
              <input
                type="number"
                name="capacidad"
                value={form.capacidad}
                onChange={handleChange}
                placeholder="Ej. 40"
                min="1"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ubicación
              </label>
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ej. Pabellón G"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Estado
              </label>
              <select
                name="activa"
                value={String(form.activa)}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
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
                  ? "Actualizar aula"
                  : "Guardar aula"}
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
                Aulas registradas
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Máximo 10 aulas por página.
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
                placeholder="Buscar aula..."
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
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Capacidad</th>
                    <th className="px-4 py-3">Ubicación</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center font-semibold text-slate-500"
                      >
                        Cargando aulas...
                      </td>
                    </tr>
                  ) : aulas.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center font-semibold text-slate-500"
                      >
                        No hay aulas registradas.
                      </td>
                    </tr>
                  ) : (
                    aulas.map((aula) => (
                      <tr key={aula.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-bold text-slate-900">
                          {aula.codigo}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {tipoAulaLabel[aula.tipo_aula] || aula.tipo_aula}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {aula.capacidad}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {aula.ubicacion || "-"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              aula.activa
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {aula.activa ? "Activa" : "Inactiva"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditar(aula)}
                              className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEliminar(aula)}
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
              aulas
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