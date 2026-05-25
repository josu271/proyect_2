import { useEffect, useMemo, useState } from "react";
import { obtenerMiHorarioEstudiante } from "../../api/student/miHorarioApi";

const DIAS_DEFAULT = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
];

function obtenerUsuarioStorage() {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "{}");
  } catch {
    return {};
  }
}

function formatearHora(valor) {
  if (!valor) return "";
  return String(valor).slice(0, 5);
}

function formatearTurno(turno) {
  if (!turno) return "";

  const normalizado = String(turno).toUpperCase();

  if (normalizado === "MANANA") return "Mañana";
  if (normalizado === "TARDE") return "Tarde";
  if (normalizado === "NOCHE") return "Noche";

  return turno;
}

function formatearEstadoMatricula(estado) {
  if (!estado) return "Sin matrícula";
  if (estado === "BORRADOR") return "Borrador";
  if (estado === "CONFIRMADA") return "Confirmada";
  if (estado === "ANULADA") return "Anulada";
  return estado;
}

export default function MiHorarioEstudiante() {
  const usuario = obtenerUsuarioStorage();

  const estudianteId =
    usuario.estudiante_id || usuario.estudianteId || usuario.estudiante?.id;

  const usuarioId = usuario.usuario_id || usuario.id;

  const [estudiante, setEstudiante] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [matricula, setMatricula] = useState(null);
  const [dias, setDias] = useState(DIAS_DEFAULT);
  const [bloques, setBloques] = useState([]);
  const [clases, setClases] = useState([]);
  const [resumen, setResumen] = useState({
    total_cursos: 0,
    total_clases: 0,
    total_creditos: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarHorario = async () => {
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

      const data = await obtenerMiHorarioEstudiante({
        estudianteId,
        usuarioId,
      });

      setEstudiante(data.estudiante || null);
      setSemestre(data.semestre || null);
      setMatricula(data.matricula || null);
      setDias(data.dias || DIAS_DEFAULT);
      setBloques(data.bloques || []);
      setClases(data.clases || []);
      setResumen(
        data.resumen || {
          total_cursos: 0,
          total_clases: 0,
          total_creditos: 0,
        }
      );
    } catch (err) {
      setError(err.message || "No se pudo cargar el horario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHorario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clasesPorCelda = useMemo(() => {
    const mapa = {};

    clases.forEach((clase) => {
      const key = `${clase.dia_semana}-${clase.bloque_academico_id}`;

      if (!mapa[key]) {
        mapa[key] = [];
      }

      mapa[key].push(clase);
    });

    return mapa;
  }, [clases]);

  const obtenerClasesCelda = (diaId, bloqueId) => {
    return clasesPorCelda[`${diaId}-${bloqueId}`] || [];
  };

  const exportarPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Mi Horario</h2>
          <p className="mt-2 text-slate-500">
            Cargando tu horario académico...
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Consultando cursos matriculados.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Mi Horario</h2>
          <p className="mt-2 text-slate-500">
            No se pudo cargar tu horario académico.
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
        <h2 className="text-3xl font-bold text-slate-900">Mi Horario</h2>
        <p className="mt-2 text-slate-500">
          Visualiza tus cursos matriculados por día y bloque académico.
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
          <p className="text-sm font-semibold text-slate-500">Semestre</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {semestre?.codigo || "-"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {semestre?.nombre || "Semestre académico activo"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Cursos matriculados
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {resumen.total_cursos}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Créditos: {resumen.total_creditos}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Estado matrícula
          </p>
          <p className="mt-3 text-3xl font-bold text-blue-700">
            {formatearEstadoMatricula(matricula?.estado)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {matricula
              ? "Matrícula encontrada"
              : "No registra matrícula activa"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Horario semanal
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Semestre académico {semestre?.codigo || "-"}
            </p>
          </div>

          <button
            type="button"
            onClick={exportarPDF}
            className="h-11 rounded-xl bg-blue-800 px-5 text-sm font-bold text-white hover:bg-blue-900 print:hidden"
          >
            Exportar PDF
          </button>
        </div>

        {clases.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
            No tienes cursos matriculados con horario asignado para el semestre
            activo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-40 border border-slate-200 bg-slate-100 px-4 py-3 text-left font-bold text-slate-700">
                    Hora
                  </th>

                  {dias.map((dia) => (
                    <th
                      key={dia.id}
                      className="border border-slate-200 bg-slate-100 px-4 py-3 text-left font-bold text-slate-700"
                    >
                      {dia.nombre}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {bloques.map((bloque) => (
                  <tr key={bloque.id}>
                    <td className="border border-slate-200 bg-slate-50 px-4 py-4 align-top">
                      <p className="font-bold text-slate-800">
                        {formatearHora(bloque.hora_inicio)} -{" "}
                        {formatearHora(bloque.hora_fin)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {formatearTurno(bloque.turno)}
                      </p>
                    </td>

                    {dias.map((dia) => {
                      const clasesCelda = obtenerClasesCelda(dia.id, bloque.id);

                      return (
                        <td
                          key={`${dia.id}-${bloque.id}`}
                          className="h-28 border border-slate-200 p-3 align-top"
                        >
                          {clasesCelda.length > 0 ? (
                            <div className="space-y-2">
                              {clasesCelda.map((clase) => (
                                <div
                                  key={clase.seccion_id}
                                  className="h-full rounded-xl bg-blue-100 p-3 text-blue-900"
                                >
                                  <p className="font-bold">{clase.curso}</p>
                                  <p className="mt-1 text-xs">
                                    {clase.nrc} · {clase.curso_codigo}
                                  </p>
                                  <p className="mt-1 text-xs">
                                    Docente: {clase.docente}
                                  </p>
                                  <p className="mt-1 text-xs">
                                    Aula: {clase.aula}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300">
                              Sin clase
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {clases.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Cursos en mi horario
          </h3>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clases.map((clase) => (
              <article
                key={clase.seccion_id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="font-bold text-slate-900">{clase.curso}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {clase.nrc} · {clase.curso_codigo}
                </p>

                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p>
                    <span className="font-bold">Día:</span>{" "}
                    {clase.dia_nombre}
                  </p>
                  <p>
                    <span className="font-bold">Hora:</span>{" "}
                    {formatearHora(clase.hora_inicio)} -{" "}
                    {formatearHora(clase.hora_fin)}
                  </p>
                  <p>
                    <span className="font-bold">Docente:</span>{" "}
                    {clase.docente}
                  </p>
                  <p>
                    <span className="font-bold">Aula:</span> {clase.aula}
                  </p>
                  <p>
                    <span className="font-bold">Créditos:</span>{" "}
                    {clase.creditos}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}