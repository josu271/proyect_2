import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  crearCurso,
  obtenerProgramasCursos,
} from "../../api/admin/cursosApi";

function CrearCurso() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    creditos: "",
    nivel: 1,
    programa_id: "",
  });

  const [programas, setProgramas] = useState([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargarProgramas() {
      try {
        const data = await obtenerProgramasCursos();
        if (activo) setProgramas(data);
      } catch (err) {
        if (activo) setError(err.message || "Error al cargar programas");
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
      await crearCurso({
        ...form,
        creditos: Number(form.creditos),
        nivel: Number(form.nivel),
        programa_id: Number(form.programa_id),
      });

      navigate("/admin/cursos");
    } catch (err) {
      setError(err.message || "Error al crear curso");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Crear curso</h2>
        <p className="mt-1 text-sm text-slate-500">
          Registra un curso académico asociado a un programa.
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
            <input
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              className="input-admin"
              placeholder="Ej: MAT101"
              required
            />
          </Campo>

          <Campo label="Nombre">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="input-admin"
              placeholder="Nombre del curso"
              required
            />
          </Campo>

          <Campo label="Créditos">
            <input
              type="number"
              name="creditos"
              value={form.creditos}
              onChange={handleChange}
              className="input-admin"
              min="1"
              max="6"
              required
            />
          </Campo>

          <Campo label="Nivel">
            <input
              type="number"
              name="nivel"
              value={form.nivel}
              onChange={handleChange}
              className="input-admin"
              min="1"
              required
            />
          </Campo>

          <Campo label="Programa académico">
            <select
              name="programa_id"
              value={form.programa_id}
              onChange={handleChange}
              className="input-admin"
              required
            >
              <option value="">Seleccionar programa</option>
              {programas.map((programa) => (
                <option key={programa.id} value={programa.id}>
                  {programa.nombre}
                </option>
              ))}
            </select>
          </Campo>

          <div className="md:col-span-2">
            <Campo label="Descripción">
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="input-admin min-h-28"
                placeholder="Descripción del curso"
              />
            </Campo>
          </div>
        </div>

        <Botones
          guardando={guardando}
          onCancelar={() => navigate("/admin/cursos")}
          texto="Guardar curso"
        />
      </form>
    </section>
  );
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Botones({ guardando, onCancelar, texto }) {
  return (
    <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
      <button
        type="button"
        onClick={onCancelar}
        className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300"
      >
        Cancelar
      </button>

      <button
        type="submit"
        disabled={guardando}
        className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {guardando ? "Guardando..." : texto}
      </button>
    </div>
  );
}

export default CrearCurso;