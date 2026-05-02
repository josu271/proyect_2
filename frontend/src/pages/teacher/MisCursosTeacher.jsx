import { useEffect, useState } from "react";
import { obtenerCursosDelDocente } from "../../api/teacher/cursosApi";

function MisCursosTeacher() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const docenteId = usuario?.docente_id;

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarCursos() {
      if (!docenteId) return;

      try {
        setLoading(true);
        const data = await obtenerCursosDelDocente(docenteId);
        setCursos(data);
      } catch (error) {
        alert(error.message || "Error al cargar cursos");
      } finally {
        setLoading(false);
      }
    }

    cargarCursos();
  }, [docenteId]);

  if (!docenteId) {
    return (
      <section className="p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Mis cursos
        </h1>
        <p className="mt-2 text-red-600">
          No se encontró el docente_id del usuario logueado.
        </p>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Mis cursos
        </h1>
        <p className="mt-1 text-slate-600">
          Cursos asignados al docente.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Código</th>
              <th className="p-4">Curso</th>
              <th className="p-4">Créditos</th>
              <th className="p-4">Sección</th>
              <th className="p-4">Semestre</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Capacidad</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-slate-500">
                  Cargando cursos...
                </td>
              </tr>
            ) : cursos.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-slate-500">
                  No tienes cursos asignados.
                </td>
              </tr>
            ) : (
              cursos.map((item) => (
                <tr key={item.seccion_id} className="border-t border-slate-200">
                  <td className="p-4 font-semibold text-slate-800">
                    {item.codigo_curso}
                  </td>
                  <td className="p-4">{item.curso}</td>
                  <td className="p-4">{item.creditos}</td>
                  <td className="p-4">Sección {item.numero_seccion}</td>
                  <td className="p-4">{item.semestre}</td>
                  <td className="p-4">{item.tipo}</td>
                  <td className="p-4">
                    {item.matriculados_actuales}/{item.capacidad}
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {item.estado}
                    </span>
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

export default MisCursosTeacher;