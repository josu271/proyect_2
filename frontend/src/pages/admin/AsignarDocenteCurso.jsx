import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerCursoPorId,
  obtenerDocentesCursos,
  obtenerSemestresCursos,
  asignarDocenteCurso,
} from "../../api/admin/cursosApi";

function AsignarDocenteCurso() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    docente_id: "",
    semestre_id: "",
    numero_seccion: 1,
    capacidad: 30,
    tipo: "TEORICO",
  });

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        const [cursoData, docentesData, semestresData] = await Promise.all([
          obtenerCursoPorId(id),
          obtenerDocentesCursos(),
          obtenerSemestresCursos(),
        ]);

        if (activo) {
          setCurso(cursoData);
          setDocentes(docentesData);
          setSemestres(semestresData);
        }
      } catch (err) {
        if (activo) setError(err.message || "Error al cargar datos");
      }
    }

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [id]);

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
      await asignarDocenteCurso(id, {
        docente_id: Number(form.docente_id),
        semestre_id: Number(form.semestre_id),
        numero_seccion: Number(form.numero_seccion),
        capacidad: Number(form.capacidad),
        tipo: form.tipo,
      });

      navigate("/admin/cursos");
    } catch (err) {
      setError(err.message || "Error al asignar docente");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Asignar docente
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Curso: <strong>{curso?.codigo}</strong> {curso?.nombre}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Campo label="Docente">
            <select
              name="docente_id"
              value={form.docente_id}
              onChange={handleChange}
              className="input-admin"
              required
            >
              <option value="">Seleccionar docente</option>
              {docentes.map((docente) => (
                <option key={docente.id} value={docente.id}>
                  {docente.nombre_completo}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Semestre académico">
            <select
              name="semestre_id"
              value={form.semestre_id}
              onChange={handleChange}
              className="input-admin"
              required
            >
              <option value="">Seleccionar semestre</option>
              {semestres.map((semestre) => (
                <option key={semestre.id} value={semestre.id}>
                  {semestre.codigo}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Número de sección">
            <input
              type="number"
              name="numero_seccion"
              value={form.numero_seccion}
              onChange={handleChange}
              className="input-admin"
              min="1"
              required
            />
          </Campo>

          <Campo label="Capacidad">
            <input
              type="number"
              name="capacidad"
              value={form.capacidad}
              onChange={handleChange}
              className="input-admin"
              min="15"
              max="40"
              required
            />
          </Campo>

          <Campo label="Tipo">
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="input-admin"
              required
            >
              <option value="TEORICO">Teórico</option>
              <option value="PRACTICO">Práctico</option>
            </select>
          </Campo>
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
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {guardando ? "Asignando..." : "Asignar docente"}
          </button>
        </div>
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

export default AsignarDocenteCurso;