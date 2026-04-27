import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerCursos } from "../../api/admin/cursosApi";

function CursosAdmin() {
  const navigate = useNavigate();

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarCursos() {
      try {
        setLoading(true);
        setError("");

        const data = await obtenerCursos();

        if (activo) {
          setCursos(data);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || "Error al cargar cursos");
        }
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarCursos();

    return () => {
      activo = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando cursos...</p>
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
            Gestión de Cursos
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra cursos, créditos, nivel académico y programa asociado.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/cursos/crear")}
          className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          + Nuevo curso
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-100 text-sm text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Código</th>
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Créditos</th>
              <th className="px-6 py-4 font-semibold">Nivel</th>
              <th className="px-6 py-4 font-semibold">Programa</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-sm">
            {cursos.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                  No hay cursos registrados.
                </td>
              </tr>
            ) : (
              cursos.map((curso) => (
                <tr key={curso.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {curso.codigo}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {curso.nombre}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {curso.creditos}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {curso.nivel}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {curso.programa || "Sin programa"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        curso.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {curso.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/cursos/ver/${curso.id}`)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Ver
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/cursos/editar/${curso.id}`)
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

export default CursosAdmin;