import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  crearEstudiante,
  obtenerProgramas,
} from "../../api/admin/estudiantesApi";

function CrearEstudiante() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "",
    contrasena: "",
    nombre_completo: "",
    numero_identificacion: "",
    telefono: "",
    direccion: "",
    programa_id: "",
  });

  const [programas, setProgramas] = useState([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargarProgramas() {
      try {
        const data = await obtenerProgramas();

        if (activo) {
          setProgramas(data);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || "Error al cargar programas");
        }
      }
    }

    cargarProgramas();

    return () => {
      activo = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      await crearEstudiante({
        ...form,
        programa_id: Number(form.programa_id),
      });

      navigate("/admin/estudiantes");
    } catch (err) {
      setError(err.message || "Error al crear estudiante");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Crear estudiante
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Registra un nuevo estudiante y asígnalo a un programa académico.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="estudiante@correo.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="Contraseña inicial"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              required
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
              placeholder="Nombre completo"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Número de identificación
            </label>
            <input
              type="text"
              name="numero_identificacion"
              value={form.numero_identificacion}
              onChange={handleChange}
              placeholder="DNI o código"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="999999999"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">Seleccionar programa</option>
              {programas.map((programa) => (
                <option key={programa.id} value={programa.id}>
                  {programa.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección del estudiante"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => navigate("/admin/estudiantes")}
            className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar estudiante"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CrearEstudiante;