import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerCursoPorId,
  actualizarCurso,
  obtenerProgramasCursos,
} from "../../api/admin/cursosApi";

function EditarCurso() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [programas, setProgramas] = useState([]);
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    creditos: "",
    nivel: 1,
    programa_id: "",
    activo: true,
  });

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        const [curso, listaProgramas] = await Promise.all([
          obtenerCursoPorId(id),
          obtenerProgramasCursos(),
        ]);

        if (activo) {
          setProgramas(listaProgramas);
          setForm({
            codigo: curso.codigo || "",
            nombre: curso.nombre || "",
            descripcion: curso.descripcion || "",
            creditos: curso.creditos || "",
            nivel: curso.nivel || 1,
            programa_id: curso.programa_id || "",
            activo: curso.activo ?? true,
          });
        }
      } catch (err) {
        if (activo) setError(err.message || "Error al cargar curso");
      } finally {
        if (activo) setLoading(false);
      }
    }

    cargarDatos();

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
      await actualizarCurso(id, {
        ...form,
        creditos: Number(form.creditos),
        nivel: Number(form.nivel),
        programa_id: Number(form.programa_id),
      });

      navigate("/admin/cursos");
    } catch (err) {
      setError(err.message || "Error al actualizar curso");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p>Cargando curso...</p>;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Editar curso</h2>
        <p className="mt-1 text-sm text-slate-500">
          Actualiza los datos académicos del curso.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Campo label="Código">
            <input name="codigo" value={form.codigo} onChange={handleChange} className="input-admin" required />
          </Campo>

          <Campo label="Nombre">
            <input name="nombre" value={form.nombre} onChange={handleChange} className="input-admin" required />
          </Campo>

          <Campo label="Créditos">
            <input type="number" name="creditos" value={form.creditos} onChange={handleChange} className="input-admin" min="1" max="6" required />
          </Campo>

          <Campo label="Nivel">
            <input type="number" name="nivel" value={form.nivel} onChange={handleChange} className="input-admin" min="1" required />
          </Campo>

          <Campo label="Programa académico">
            <select name="programa_id" value={form.programa_id} onChange={handleChange} className="input-admin" required>
              <option value="">Seleccionar programa</option>
              {programas.map((programa) => (
                <option key={programa.id} value={programa.id}>
                  {programa.nombre}
                </option>
              ))}
            </select>
          </Campo>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
            <span className="text-sm font-semibold text-slate-700">Curso activo</span>
          </label>

          <div className="md:col-span-2">
            <Campo label="Descripción">
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="input-admin min-h-28" />
            </Campo>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => navigate("/admin/cursos")}
            className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

export default EditarCurso;