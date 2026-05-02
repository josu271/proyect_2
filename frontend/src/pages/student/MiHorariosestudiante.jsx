import { useEffect, useState } from "react";
import { obtenerHorarioEstudiante } from "../../api/student/horarioApi";

const dias = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
];

const horas = [
  "07:00",
  "08:00",
  "08:30",
  "09:30",
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
  "19:00",
];

function normalizarHora(hora) {
  if (!hora) return "";
  return hora.slice(0, 5);
}

function MiHorarioEstudiante() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const estudianteId = usuario?.estudiante_id;

  const [horario, setHorario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHorario = async () => {
      if (!estudianteId) {
        setError("No se encontró el estudiante_id del usuario logueado.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await obtenerHorarioEstudiante(estudianteId);
        setHorario(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message || "Error al cargar horario");
      } finally {
        setLoading(false);
      }
    };

    cargarHorario();
  }, [estudianteId]);

  const obtenerCursoPorBloque = (dia, hora) => {
    return horario.find(
      (item) =>
        Number(item.dia_semana) === Number(dia) &&
        normalizarHora(item.hora_inicio) === hora
    );
  };

  if (!estudianteId) {
    return (
      <section className="p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Mi horario semanal
        </h1>
        <p className="mt-2 text-red-600">
          No se encontró el estudiante_id del usuario logueado.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow">
        <h1 className="text-3xl font-bold">Mi horario semanal</h1>
        <p className="mt-2 text-blue-100">
          Consulta tus cursos matriculados organizados de lunes a viernes.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-3xl bg-white shadow">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="border border-slate-200 p-4 text-left">
                Hora
              </th>

              {dias.map((dia) => (
                <th
                  key={dia.id}
                  className="border border-slate-200 p-4 text-center"
                >
                  {dia.nombre}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="border border-slate-200 p-8 text-center text-slate-500"
                >
                  Cargando horario...
                </td>
              </tr>
            ) : (
              horas.map((hora) => (
                <tr key={hora}>
                  <td className="border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-700">
                    {hora}
                  </td>

                  {dias.map((dia) => {
                    const curso = obtenerCursoPorBloque(dia.id, hora);

                    return (
                      <td
                        key={`${dia.id}-${hora}`}
                        className="h-32 border border-slate-200 p-3 align-top"
                      >
                        {curso ? (
                          <div className="h-full rounded-2xl bg-blue-600 p-4 text-white shadow">
                            <p className="text-sm font-bold">
                              {curso.curso}
                            </p>

                            <p className="mt-1 text-xs text-blue-100">
                              {normalizarHora(curso.hora_inicio)} -{" "}
                              {normalizarHora(curso.hora_fin)}
                            </p>

                            <p className="mt-2 text-xs">
                              Docente: {curso.docente}
                            </p>

                            <p className="text-xs">
                              Aula: {curso.aula || "Sin aula"}
                            </p>

                            <p className="text-xs">
                              Código: {curso.codigo}
                            </p>
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                            Libre
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MiHorarioEstudiante;