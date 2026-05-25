import { useEffect, useState } from "react";
import {
  listarEstudiantes,
  listarProgramasEstudiante,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
} from "../../api/admin/estudiantesapi";

const FORM_INICIAL = {
  programa_id: "",
  codigo_estudiante: "",
  dni: "",
  nombre_completo: "",
  correo: "",
  ciclo: "",
  contrasena: "123456",
  activo: true,
};

export default function EstudiantesAdmin() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [programas, setProgramas] = useState([]);
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

  const cargarProgramas = async () => {
    try {
      const data = await listarProgramasEstudiante();
      setProgramas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await listarEstudiantes({
        page,
        limit: 10,
        search: busqueda,
      });

      setEstudiantes(data.items || []);
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
    cargarProgramas();
  }, []);

  useEffect(() => {
    cargarEstudiantes();
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
    if (!form.codigo_estudiante.trim()) {
      return "Ingrese el código del estudiante.";
    }

    if (!form.nombre_completo.trim()) {
      return "Ingrese el nombre completo.";
    }

    if (!form.correo.trim()) {
      return "Ingrese el correo institucional.";
    }

    if (!form.programa_id) {
      return "Seleccione un programa académico.";
    }

    if (form.ciclo && (Number(form.ciclo) < 1 || Number(form.ciclo) > 12)) {
      return "El ciclo debe estar entre 1 y 12.";
    }

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
      programa_id: Number(form.programa_id),
      codigo_estudiante: form.codigo_estudiante.trim().toUpperCase(),
      dni: form.dni.trim() || null,
      nombre_completo: form.nombre_completo.trim(),
      correo: form.correo.trim().toLowerCase(),
      ciclo: form.ciclo ? Number(form.ciclo) : null,
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
        await actualizarEstudiante(editandoId, payload);
        setMensaje("Estudiante actualizado correctamente.");
      } else {
        await crearEstudiante(payload);
        setMensaje("Estudiante registrado correctamente.");
      }

      limpiarFormulario();
      await cargarEstudiantes();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (estudiante) => {
    setEditandoId(estudiante.id);

    setForm({
      programa_id: String(estudiante.programa_id),
      codigo_estudiante: estudiante.codigo_estudiante || "",
      dni: estudiante.dni || "",
      nombre_completo: estudiante.nombre_completo || "",
      correo: estudiante.correo || "",
      ciclo: estudiante.ciclo ? String(estudiante.ciclo) : "",
      contrasena: "",
      activo: estudiante.activo,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (estudiante) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas desactivar al estudiante ${estudiante.nombre_completo}?`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await eliminarEstudiante(estudiante.id);

      setMensaje("Estudiante desactivado correctamente.");
      await cargarEstudiantes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPage(1);
    cargarEstudiantes();
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Estudiantes</h2>
        <p className="mt-2 text-slate-500">
          Administra los estudiantes, programa académico y ciclo actual.
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
            {editandoId ? "Editar estudiante" : "Registrar estudiante"}
          </h3>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Código estudiante
              </label>
              <input
                type="text"
                name="codigo_estudiante"
                value={form.codigo_estudiante}
                onChange={handleChange}
                placeholder="Ej. EST001"
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
                placeholder="Ej. 70000001"
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
                placeholder="Ej. Luis Ramos Quispe"
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
                placeholder="estudiante@demo.com"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Programa académico
              </label>
              <select
                name="programa_id"
                value={form.programa_id}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              >
                <option value="">Seleccione programa académico</option>
                {programas.map((programa) => (
                  <option key={programa.id} value={programa.id}>
                    {programa.nombre}
                  </option>
                ))}
              </select>
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
                placeholder="Ej. 5"
                min="1"
                max="12"
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
                  ? "Actualizar estudiante"
                  : "Guardar estudiante"}
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
                Estudiantes registrados
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Máximo 10 estudiantes por página.
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
                placeholder="Buscar estudiante..."
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
                    <th className="px-4 py-3">Programa</th>
                    <th className="px-4 py-3">Ciclo</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-8 text-center font-semibold text-slate-500"
                      >
                        Cargando estudiantes...
                      </td>
                    </tr>
                  ) : estudiantes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-8 text-center font-semibold text-slate-500"
                      >
                        No hay estudiantes registrados.
                      </td>
                    </tr>
                  ) : (
                    estudiantes.map((estudiante) => (
                      <tr key={estudiante.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-bold text-slate-900">
                          {estudiante.codigo_estudiante}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {estudiante.dni || "-"}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {estudiante.nombre_completo}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {estudiante.correo}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {estudiante.programa}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {estudiante.ciclo || "-"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              estudiante.activo
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {estudiante.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditar(estudiante)}
                              className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEliminar(estudiante)}
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
              estudiantes
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