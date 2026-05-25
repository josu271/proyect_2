import { useEffect, useState } from "react";
import {
  listarDocentes,
  crearDocente,
  actualizarDocente,
  eliminarDocente,
} from "../../api/admin/docentesapi";

const FORM_INICIAL = {
  codigo_docente: "",
  dni: "",
  nombre_completo: "",
  correo: "",
  especialidad: "",
  contrasena: "123456",
  activo: true,
};

export default function DocentesAdmin() {
  const [docentes, setDocentes] = useState([]);
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

  const cargarDocentes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await listarDocentes({
        page,
        limit: 10,
        search: busqueda,
      });

      setDocentes(data.items || []);
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
    cargarDocentes();
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
    if (!form.codigo_docente.trim()) return "Ingrese el código del docente.";
    if (!form.nombre_completo.trim()) return "Ingrese el nombre completo.";
    if (!form.correo.trim()) return "Ingrese el correo institucional.";
    if (!editandoId && !form.contrasena.trim()) {
      return "Ingrese la contraseña inicial.";
    }
    if (!editandoId && form.contrasena.trim().length < 6) {
      return "La contraseña debe tener como mínimo 6 caracteres.";
    }
    if (editandoId && form.contrasena && form.contrasena.trim().length < 6) {
      return "La nueva contraseña debe tener como mínimo 6 caracteres.";
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
      codigo_docente: form.codigo_docente.trim().toUpperCase(),
      dni: form.dni.trim() || null,
      nombre_completo: form.nombre_completo.trim(),
      correo: form.correo.trim().toLowerCase(),
      especialidad: form.especialidad.trim() || null,
      activo: form.activo === true || form.activo === "true",
    };

    if (!editandoId) {
      payload.contrasena = form.contrasena.trim() || "123456";
    }

    if (editandoId && form.contrasena.trim()) {
      payload.contrasena = form.contrasena.trim();
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (editandoId) {
        await actualizarDocente(editandoId, payload);
        setMensaje("Docente actualizado correctamente.");
      } else {
        await crearDocente(payload);
        setMensaje("Docente registrado correctamente.");
      }

      limpiarFormulario();
      await cargarDocentes();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (docente) => {
    setEditandoId(docente.id);

    setForm({
      codigo_docente: docente.codigo_docente || "",
      dni: docente.dni || "",
      nombre_completo: docente.nombre_completo || "",
      correo: docente.correo || "",
      especialidad: docente.especialidad || "",
      contrasena: "",
      activo: docente.activo,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (docente) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas desactivar al docente ${docente.nombre_completo}?`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await eliminarDocente(docente.id);

      setMensaje("Docente desactivado correctamente.");
      await cargarDocentes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPage(1);
    cargarDocentes();
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Docentes</h2>
        <p className="mt-2 text-slate-500">
          Registra y consulta docentes activos para asignación académica.
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
            {editandoId ? "Editar docente" : "Registrar docente"}
          </h3>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Código docente
              </label>
              <input
                type="text"
                name="codigo_docente"
                value={form.codigo_docente}
                onChange={handleChange}
                placeholder="Ej. DOC001"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm uppercase outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                DNI
              </label>
              <input
                type="text"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                placeholder="Ej. 40000001"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre_completo"
                value={form.nombre_completo}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez Torres"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Correo institucional
              </label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="docente@demo.com"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Especialidad
              </label>
              <input
                type="text"
                name="especialidad"
                value={form.especialidad}
                onChange={handleChange}
                placeholder="Ej. Base de Datos"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {editandoId
                  ? "Nueva contraseña, opcional"
                  : "Contraseña inicial"}
              </label>
              <input
                type="password"
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
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
                  ? "Actualizar docente"
                  : "Guardar docente"}
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
                Docentes registrados
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Máximo 10 docentes por página.
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
                placeholder="Buscar docente..."
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
                    <th className="px-4 py-3">DNI</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Correo</th>
                    <th className="px-4 py-3">Especialidad</th>
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
                        Cargando docentes...
                      </td>
                    </tr>
                  ) : docentes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center font-semibold text-slate-500"
                      >
                        No hay docentes registrados.
                      </td>
                    </tr>
                  ) : (
                    docentes.map((docente) => (
                      <tr key={docente.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-bold text-slate-900">
                          {docente.codigo_docente}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {docente.dni || "-"}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {docente.nombre_completo}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {docente.correo}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {docente.especialidad || "-"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              docente.activo
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {docente.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditar(docente)}
                              className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEliminar(docente)}
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
              docentes
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