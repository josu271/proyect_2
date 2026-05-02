import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerEstudiantes } from "../../api/admin/estudiantesApi";

function EstudiantesAdmin() {
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarEstudiantes = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await obtenerEstudiantes();

        if (activo) {
          setEstudiantes(data);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || "Error al cargar estudiantes");
        }
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    };

    cargarEstudiantes();

    return () => {
      activo = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando estudiantes...</p>
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
            Gestión de Estudiantes
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra la información académica de los estudiantes registrados.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          onClick={() => navigate("/admin/estudiantes/crear")}
        >
          + Nuevo estudiante
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-100 text-sm text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Nombre completo</th>
              <th className="px-6 py-4 font-semibold">Correo</th>
              <th className="px-6 py-4 font-semibold">Programa</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-sm">
            {estudiantes.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                  No hay estudiantes registrados.
                </td>
              </tr>
            ) : (
              estudiantes.map((estudiante) => (
                <tr key={estudiante.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {estudiante.id}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {estudiante.nombre_completo}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {estudiante.correo}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {estudiante.programa || "Sin programa"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {estudiante.estado || "Sin estado"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/estudiantes/ver/${estudiante.id}`)
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Ver
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/estudiantes/editar/${estudiante.id}`)
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

export default EstudiantesAdmin;