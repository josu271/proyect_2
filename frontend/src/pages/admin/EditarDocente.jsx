import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerDocentePorId,
  actualizarDocente,
} from "../../api/admin/docentesApi";

function EditarDocente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre_completo: "",
    numero_identificacion: "",
    telefono: "",
    especialidad: "",
    activo: true,
  });

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDocente() {
      try {
        const data = await obtenerDocentePorId(id);

        if (activo) {
          setForm({
            nombre_completo: data.nombre_completo || "",
            numero_identificacion: data.numero_identificacion || "",
            telefono: data.telefono || "",
            especialidad: data.especialidad || "",
            activo: data.activo ?? true,
          });
        }
      } catch (err) {
        if (activo) {
          setError(err.message || "Error al cargar docente");
        }
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarDocente();

    return () => {
      activo = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      await actualizarDocente(id, form);
      navigate("/admin/docentes");
    } catch (err) {
      setError(err.message || "Error al actualizar docente");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p>Cargando docente...</p>;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Editar docente
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Actualiza los datos del docente seleccionado.
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
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre_completo"
              value={form.nombre_completo}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            <span className="text-sm font-semibold text-slate-700">
              Docente activo
            </span>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => navigate("/admin/docentes")}
            className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditarDocente;