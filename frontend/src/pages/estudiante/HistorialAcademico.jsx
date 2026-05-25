import { useEffect, useState } from "react";
import { obtenerHistorialAcademico } from "../../api/student/historialAcademicoApi";

function obtenerUsuarioStorage() {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "{}");
  } catch {
    return {};
  }
}

function formatearEstado(estado) {
  if (estado === "APROBADO") return "Aprobado";
  if (estado === "DESAPROBADO") return "Desaprobado";
  if (estado === "RETIRADO") return "Retirado";
  if (estado === "CONVALIDADO") return "Convalidado";

  return estado || "-";
}

function estadoClassName(estado) {
  if (estado === "APROBADO") {
    return "bg-green-100 text-green-700";
  }

  if (estado === "CONVALIDADO") {
    return "bg-blue-100 text-blue-700";
  }

  if (estado === "DESAPROBADO") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-200 text-slate-600";
}

function notaClassName(nota, estado) {
  if (estado === "CONVALIDADO") return "text-blue-700";
  if (nota === null || nota === undefined) return "text-slate-400";
  if (Number(nota) >= 11) return "text-green-700";

  return "text-red-700";
}

export default function HistorialAcademico() {
  const usuario = obtenerUsuarioStorage();

  const estudianteId =
    usuario.estudiante_id || usuario.estudianteId || usuario.estudiante?.id;

  const usuarioId = usuario.usuario_id || usuario.id;

  const [estudiante, setEstudiante] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [resumen, setResumen] = useState({
    total_cursos: 0,
    cursos_aprobados: 0,
    creditos_aprobados: 0,
    promedio_general: 0,
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

  const cargarHistorial = async () => {
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

      const data = await obtenerHistorialAcademico({
        estudianteId,
        usuarioId,
        page,
        limit: 10,
        semestreId,
      });

      setEstudiante(data.estudiante || null);
      setHistorial(data.items || []);
      setSemestres(data.semestres || []);
      setResumen(
        data.resumen || {
          total_cursos: 0,
          cursos_aprobados: 0,
          creditos_aprobados: 0,
          promedio_general: 0,
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
      setError(err.message || "No se pudo cargar el historial académico.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, semestreId]);

  const handleCambiarSemestre = (e) => {
    setSemestreId(e.target.value);
    setPage(1);
  };

  const exportarPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Historial Académico
          </h2>
          <p className="mt-2 text-slate-500">
            Cargando tu historial académico...
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Consultando cursos, notas y créditos.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Historial Académico
          </h2>
          <p className="mt-2 text-slate-500">
            No se pudo cargar tu historial académico.
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
        <h2 className="text-3xl font-bold text-slate-900">
          Historial Académico
        </h2>
        <p className="mt-2 text-slate-500">
          Consulta tus cursos cursados, notas, créditos y estado académico.
        </p>

        {estudiante && (
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Estudiante: {estudiante.nombre_completo} ·{" "}
            {estudiante.codigo_estudiante} · Ciclo {estudiante.ciclo || "-"}
          </p>
        )}
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Cursos aprobados
          </p>
          <p className="mt-3 text-3xl font-bold text-green-600">
            {resumen.cursos_aprobados}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Créditos aprobados
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {resumen.creditos_aprobados}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Promedio general
          </p>
          <p className="mt-3 text-3xl font-bold text-blue-700">
            {Number(resumen.promedio_general || 0).toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Cursos registrados
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {resumen.total_cursos}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Registro académico
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Máximo 10 registros por página.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 print:hidden">
            <select
              value={semestreId}
              onChange={handleCambiarSemestre}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
            >
              <option value="">Todos los semestres</option>
              {semestres.map((semestre) => (
                <option key={semestre.id} value={semestre.id}>
                  {semestre.codigo} - {semestre.nombre}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={exportarPDF}
              className="h-11 rounded-xl bg-blue-800 px-5 text-sm font-bold text-white hover:bg-blue-900"
            >
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Semestre</th>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Curso</th>
                  <th className="px-4 py-3">Ciclo</th>
                  <th className="px-4 py-3">Créditos</th>
                  <th className="px-4 py-3">Nota</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {historial.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center font-semibold text-slate-500"
                    >
                      No hay registros académicos para mostrar.
                    </td>
                  </tr>
                ) : (
                  historial.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-semibold text-slate-700">
                        {item.semestre}
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900">
                        {item.curso_codigo}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {item.curso}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {item.ciclo || "-"}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {item.creditos}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={[
                            "font-bold",
                            notaClassName(item.nota, item.estado),
                          ].join(" ")}
                        >
                          {item.nota !== null && item.nota !== undefined
                            ? Number(item.nota).toFixed(2)
                            : "-"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-bold",
                            estadoClassName(item.estado),
                          ].join(" ")}
                        >
                          {formatearEstado(item.estado)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-sm text-slate-500">
            Total: <span className="font-bold">{paginacion.total}</span>{" "}
            registros
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