import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerDocentePorId } from "../../api/admin/docentesApi";

function VerDocente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [docente, setDocente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDocente() {
      try {
        const data = await obtenerDocentePorId(id);

        if (activo) {
          setDocente(data);
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

  if (loading) return <p>Cargando docente...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!docente) return <p>No se encontró el docente.</p>;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Detalle del docente
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Información registrada del docente.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Info label="ID" value={docente.id} />
          <Info label="Correo" value={docente.correo} />
          <Info label="Nombre completo" value={docente.nombre_completo} />
          <Info label="Identificación" value={docente.numero_identificacion} />
          <Info label="Teléfono" value={docente.telefono || "No registrado"} />
          <Info label="Especialidad" value={docente.especialidad || "No registrada"} />
          <Info label="Estado" value={docente.activo ? "Activo" : "Inactivo"} />
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => navigate("/admin/docentes")}
            className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={() => navigate(`/admin/docentes/editar/${docente.id}`)}
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

export default VerDocente;