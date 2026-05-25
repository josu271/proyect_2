import { useEffect, useState } from "react";
import { obtenerMiHorarioDocente } from "../../api/docente/miHorarioApi";

const dias = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
];

const normalizarTurno = (turno) => {
  const mapa = {
    MANANA: "Mañana",
    TARDE: "Tarde",
    NOCHE: "Noche",
  };

  return mapa[turno] || turno;
};

export default function MiHorarioDocente() {
  const [semestre, setSemestre] = useState(null);
  const [semestres, setSemestres] = useState([]);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState("");
  const [bloques, setBloques] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const docenteId = usuario?.docente_id;

  const cargarHorario = async (semestreId = null) => {
    try {
      setCargando(true);
      setError("");

      if (!docenteId) {
        throw new Error(
          "No se encontró docente_id en el usuario logueado. Revisa la respuesta del login."
        );
      }

      const data = await obtenerMiHorarioDocente({
        docenteId,
        semestreId,
      });

      setSemestre(data.semestre || null);
      setSemestres(data.semestres || []);
      setBloques(data.bloques || []);
      setHorarios(data.horarios || []);

      if (data.semestre?.id) {
        setSemestreSeleccionado(String(data.semestre.id));
      }
    } catch (err) {
      setError(err.message || "No se pudo cargar el horario docente.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHorario();
  }, []);

  const obtenerClasesPorCelda = (diaSemana, bloqueAcademicoId) => {
    return horarios.filter(
      (item) =>
        Number(item.dia_semana) === Number(diaSemana) &&
        Number(item.bloque_academico_id) === Number(bloqueAcademicoId)
    );
  };

  const cambiarSemestre = (event) => {
    const nuevoSemestreId = event.target.value;
    setSemestreSeleccionado(nuevoSemestreId);
    cargarHorario(nuevoSemestreId);
  };

  if (cargando) {
    return (
      <section>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">
            Cargando horario docente...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Mi Horario</h2>

        <p className="mt-2 text-slate-500">
          Visualiza tus clases asignadas por día y bloque académico.
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
              Horario semanal
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Clases encontradas:{" "}
              <span className="font-bold text-slate-800">
                {horarios.length}
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

        {horarios.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-600">
              No tienes clases asignadas en este semestre.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-sm">
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
                    <td className="border border-slate-200 bg-slate-50 px-4 py-5 align-top">
                      <p className="font-bold text-slate-800">
                        {bloque.hora}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {normalizarTurno(bloque.turno)}
                      </p>
                    </td>

                    {dias.map((dia) => {
                      const clases = obtenerClasesPorCelda(dia.id, bloque.id);

                      return (
                        <td
                          key={`${dia.id}-${bloque.id}`}
                          className="h-28 border border-slate-200 px-3 py-3 align-top"
                        >
                          <div className="space-y-2">
                            {clases.map((clase) => (
                              <div
                                key={clase.seccion_id}
                                className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-blue-900"
                              >
                                <p className="font-bold">{clase.curso}</p>

                                <p className="mt-1 text-xs font-semibold text-blue-700">
                                  {clase.curso_codigo}
                                </p>

                                <p className="mt-1 text-xs">
                                  NRC: {clase.nrc}
                                </p>

                                <p className="mt-1 text-xs">
                                  Aula: {clase.aula}
                                </p>

                                <p className="mt-1 text-xs">
                                  Estado: {clase.estado_seccion}
                                </p>
                              </div>
                            ))}
                          </div>
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
    </section>
  );
}