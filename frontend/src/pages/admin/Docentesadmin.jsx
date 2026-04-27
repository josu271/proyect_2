import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDocentes } from "../../api/admin/docentesApi";

function DocentesAdmin() {
  const navigate = useNavigate();

  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarDocentes() {
      try {
        setLoading(true);
        setError("");

        const data = await obtenerDocentes();

        if (activo) {
          setDocentes(data);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || "Error al cargar docentes");
        }
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarDocentes();

    return () => {
      activo = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando docentes...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="font-semibold text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Gestión de Docentes
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra los docentes registrados, sus datos y especialidades.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/docentes/crear")}
          className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          + Nuevo docente
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-100 text-sm text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Nombre completo</th>
              <th className="px-6 py-4 font-semibold">Correo</th>
              <th className="px-6 py-4 font-semibold">Identificación</th>
              <th className="px-6 py-4 font-semibold">Especialidad</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-sm">
            {docentes.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                  No hay docentes registrados.
                </td>
              </tr>
            ) : (
              docentes.map((docente) => (
                <tr key={docente.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {docente.id}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {docente.nombre_completo}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {docente.correo}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {docente.numero_identificacion}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {docente.especialidad || "Sin especialidad"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        docente.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {docente.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/docentes/ver/${docente.id}`)
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Ver
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/docentes/editar/${docente.id}`)
                        }
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DocentesAdmin;