import { useEffect, useState } from "react";
import { obtenerMisCursosEstudiante } from "../../api/student/misCursosApi";

function obtenerUsuarioStorage() {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "{}");
  } catch {
    return {};
  }
}

function formatearTurno(turno) {
  if (!turno) return "";

  const normalizado = String(turno).toUpperCase();

  if (normalizado === "MANANA") return "Mañana";
  if (normalizado === "TARDE") return "Tarde";
  if (normalizado === "NOCHE") return "Noche";

  return turno;
}

function estadoClassName(estado) {
  if (estado === "Matriculado" || estado === "CONFIRMADA") {
    return "bg-green-100 text-green-700";
  }

  if (estado === "BORRADOR") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-200 text-slate-600";
}

export default function MisCursosEstudiante() {
  const usuario = obtenerUsuarioStorage();

  const estudianteId =
    usuario.estudiante_id || usuario.estudianteId || usuario.estudiante?.id;

  const usuarioId = usuario.usuario_id || usuario.id;

  const [estudiante, setEstudiante] = useState(null);
  const [semestres, setSemestres] = useState([]);
  const [semestre, setSemestre] = useState(null);
  const [matricula, setMatricula] = useState(null);
  const [cursos, setCursos] = useState([]);

  const [resumen, setResumen] = useState({
    total_cursos: 0,
    total_creditos: 0,
  });

  const [semestreId, setSemestreId] = useState("");
  const [page, setPage] = useState(1);
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarMisCursos = async () => {
    if (!estudianteId && !usuarioId) {
      setLoading(false);
      setError(
        "No se encontró estudiante_id ni usuario_id en la sesión. Vuelva a iniciar sesión."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await obtenerMisCursosEstudiante({
        estudianteId,
        usuarioId,
        page,
        limit: 10,
        semestreId,
      });

      setEstudiante(data.estudiante || null);
      setSemestres(data.semestres || []);
      setSemestre(data.semestre || null);
      setMatricula(data.matricula || null);
      setCursos(data.items || []);
      setResumen(
        data.resumen || {
          total_cursos: 0,
          total_creditos: 0,
        }
      );

      setPaginacion(
        data.paginacion || {
          page: 1,
          limit: 10,
          total: 0,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        }
      );
    } catch (err) {
      setError(err.message || "No se pudo cargar tus cursos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMisCursos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, semestreId]);

  const handleCambiarSemestre = (e) => {
    setSemestreId(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Mis Cursos</h2>
          <p className="mt-2 text-slate-500">
            Cargando tus cursos matriculados...
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Consultando matrícula activa.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Mis Cursos</h2>
          <p className="mt-2 text-slate-500">
            No se pudo cargar la información.
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Mis Cursos</h2>
        <p className="mt-2 text-slate-500">
          Consulta los cursos en los que estás matriculado actualmente.
        </p>

        {estudiante && (
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Estudiante: {estudiante.nombre_completo} ·{" "}
            {estudiante.codigo_estudiante} · Ciclo {estudiante.ciclo || "-"}
          </p>
        )}
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Cursos actuales
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {resumen.total_cursos}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Créditos actuales
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {resumen.total_creditos}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Semestre académico
          </p>
          <p className="mt-3 text-3xl font-bold text-blue-700">
            {semestre?.codigo || "-"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {matricula
              ? `Estado: ${matricula.estado}`
              : "Sin matrícula activa"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Cursos matriculados
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Máximo 10 cursos por página.
            </p>
          </div>

          <select
            value={semestreId}
            onChange={handleCambiarSemestre}
            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
          >
            <option value="">Semestre actual o último registrado</option>
            {semestres.map((item) => (
              <option key={item.id} value={item.id}>
                {item.codigo} - {item.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-[950px] w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Curso</th>
                  <th className="px-4 py-3">NRC</th>
                  <th className="px-4 py-3">Docente</th>
                  <th className="px-4 py-3">Horario</th>
                  <th className="px-4 py-3">Créditos</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {cursos.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center font-semibold text-slate-500"
                    >
                      No tienes cursos matriculados en este semestre.
                    </td>
                  </tr>
                ) : (
                  cursos.map((curso) => (
                    <tr key={curso.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-bold text-slate-900">
                        {curso.codigo}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        <p className="font-semibold">{curso.nombre}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Ciclo {curso.ciclo || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {curso.nrc}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {curso.docente}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        <p>{curso.horario}</p>
                        <p className="text-xs text-slate-500">
                          Aula {curso.aula} · {formatearTurno(curso.turno)}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {curso.creditos}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-bold",
                            estadoClassName(curso.estado),
                          ].join(" ")}
                        >
                          {curso.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Total: <span className="font-bold">{paginacion.total}</span>{" "}
            cursos
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!paginacion.has_prev}
              onClick={() => setPage((actual) => Math.max(actual - 1, 1))}
              className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm font-semibold text-slate-700">
              Página {paginacion.page} de {paginacion.total_pages}
            </span>

            <button
              type="button"
              disabled={!paginacion.has_next}
              onClick={() =>
                setPage((actual) =>
                  Math.min(actual + 1, paginacion.total_pages)
                )
              }
              className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}