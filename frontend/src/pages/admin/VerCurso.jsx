import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerCursoPorId } from "../../api/admin/cursosApi";

function VerCurso() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarCurso() {
      try {
        const data = await obtenerCursoPorId(id);
        if (activo) setCurso(data);
      } catch (err) {
        if (activo) setError(err.message || "Error al cargar curso");
      } finally {
        if (activo) setLoading(false);
      }
    }

    cargarCurso();

    return () => {
      activo = false;
    };
  }, [id]);

  if (loading) return <p>Cargando curso...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!curso) return <p>No se encontró el curso.</p>;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Detalle del curso</h2>
        <p className="mt-1 text-sm text-slate-500">
          Información académica del curso seleccionado.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Info label="Código" value={curso.codigo} />
          <Info label="Nombre" value={curso.nombre} />
          <Info label="Créditos" value={curso.creditos} />
          <Info label="Nivel" value={curso.nivel} />
          <Info label="Programa" value={curso.programa || "Sin programa"} />
          <Info label="Estado" value={curso.activo ? "Activo" : "Inactivo"} />
          <div className="md:col-span-2">
            <Info label="Descripción" value={curso.descripcion || "Sin descripción"} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => navigate("/admin/cursos")}
            className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300"
          >
            Volver
          </button>

          <button
            type="button"
           onClick={() => navigate(`/admin/cursos/asignar-docente/${curso.id}`)}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Asignar docente
          </button>

          <button
            type="button"
            onClick={() => navigate(`/admin/cursos/editar/${curso.id}`)}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Editar
          </button>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default VerCurso;