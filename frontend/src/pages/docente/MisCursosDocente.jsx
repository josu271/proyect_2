import { useEffect, useState } from "react";
import { obtenerMisCursosDocente } from "../../api/docente/misCursosApi";

const obtenerEstadoVisual = (estado) => {
  const estadoNormalizado = String(estado || "").toUpperCase();

  if (estadoNormalizado === "ASIGNADO") {
    return "bg-blue-100 text-blue-700";
  }

  if (estadoNormalizado === "PUBLICADA") {
    return "bg-green-100 text-green-700";
  }

  if (estadoNormalizado === "BORRADOR") {
    return "bg-amber-100 text-amber-700";
  }

  if (estadoNormalizado === "RETIRADO" || estadoNormalizado === "CANCELADA") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
};

const formatearEstado = (estado) => {
  if (!estado) return "Asignado";

  const mapa = {
    ASIGNADO: "Asignado",
    RETIRADO: "Retirado",
    BORRADOR: "Borrador",
    PROPUESTA: "Propuesta",
    PUBLICADA: "Publicada",
    CERRADA: "Cerrada",
    CANCELADA: "Cancelada",
  };

  return mapa[String(estado).toUpperCase()] || estado;
};

export default function MisCursosDocente() {
  const [cursos, setCursos] = useState([]);
  const [semestre, setSemestre] = useState(null);
  const [semestres, setSemestres] = useState([]);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const docenteId = usuario?.docente_id;

  const cargarCursos = async ({
    semestreId = null,
    page = 1,
    limit = 10,
  } = {}) => {
    try {
      setCargando(true);
      setError("");

      if (!docenteId) {
        throw new Error(
          "No se encontró docente_id en el usuario logueado. Revisa la respuesta del login."
        );
      }

      const data = await obtenerMisCursosDocente({
        docenteId,
        semestreId,
        page,
        limit,
      });

      setCursos(data.cursos || []);
      setSemestre(data.semestre || null);
      setSemestres(data.semestres || []);
      setPagination(data.pagination || pagination);

      if (data.semestre?.id) {
        setSemestreSeleccionado(String(data.semestre.id));
      }
    } catch (err) {
      setError(err.message || "No se pudieron cargar los cursos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCursos({ page: 1, limit: 10 });
  }, []);

  const cambiarSemestre = (event) => {
    const nuevoSemestreId = event.target.value;
    setSemestreSeleccionado(nuevoSemestreId);

    cargarCursos({
      semestreId: nuevoSemestreId,
      page: 1,
      limit: pagination.limit,
    });
  };

  const cambiarPagina = (nuevaPagina) => {
    cargarCursos({
      semestreId: semestreSeleccionado,
      page: nuevaPagina,
      limit: pagination.limit,
    });
  };

  if (cargando) {
    return (
      <section>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">
            Cargando cursos asignados...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Mis Cursos</h2>

        <p className="mt-2 text-slate-500">
          Consulta los cursos asignados para el semestre académico.
        </p>

        {semestre && (
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Semestre actual: {semestre.codigo} - {semestre.nombre}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Cursos asignados
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Total encontrados:{" "}
              <span className="font-bold text-slate-800">
                {pagination.total}
              </span>
            </p>
          </div>

          <select
            value={semestreSeleccionado}
            onChange={cambiarSemestre}
            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
          >
            {semestres.length === 0 && semestre ? (
              <option value={semestre.id}>
                {semestre.codigo} - {semestre.nombre}
              </option>
            ) : (
              semestres.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.codigo} - {item.nombre}
                </option>
              ))
            )}
          </select>
        </div>

        {cursos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-600">
              No tienes cursos asignados en este semestre.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Curso</th>
                    <th className="px-4 py-3">NRC</th>
                    <th className="px-4 py-3">Semestre</th>
                    <th className="px-4 py-3">Créditos</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {cursos.map((curso) => {
                    const estadoMostrar =
                      curso.estado_seccion || curso.estado_asignacion;

                    return (
                      <tr
                        key={`${curso.curso_id}-${curso.seccion_id || "sin-nrc"}`}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {curso.codigo}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {curso.nombre}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {curso.nrc || "Sin NRC"}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {curso.semestre}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {curso.creditos}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-xs font-bold",
                              obtenerEstadoVisual(estadoMostrar),
                            ].join(" ")}
                          >
                            {formatearEstado(estadoMostrar)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Página{" "}
                <span className="font-bold text-slate-800">
                  {pagination.page}
                </span>{" "}
                de{" "}
                <span className="font-bold text-slate-800">
                  {pagination.total_pages}
                </span>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!pagination.has_prev}
                  onClick={() => cambiarPagina(pagination.page - 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>

                <button
                  type="button"
                  disabled={!pagination.has_next}
                  onClick={() => cambiarPagina(pagination.page + 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}