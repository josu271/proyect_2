import { useEffect, useState } from "react";
import { obtenerHorarioDocente } from "../../api/teacher/horarioApi";

const dias = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
];

const horas = [
  "07:00",
  "07:45",
  "08:30",
  "09:15",
  "10:00",
  "10:45",
  "11:30",
  "12:15",
  "13:00",
  "13:45",
  "14:30",
  "15:15",
  "16:00",
  "16:45",
  "17:30",
  "18:15",
  "19:00",
  "19:45",
  "20:30",
];

function MiHorarioTeacher() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const docenteId = usuario?.docente_id;

  const [horario, setHorario] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarHorario() {
      if (!docenteId) return;

      try {
        setLoading(true);
        const data = await obtenerHorarioDocente(docenteId);
        setHorario(data);
      } catch (error) {
        alert(error.message || "Error al cargar horario");
      } finally {
        setLoading(false);
      }
    }

    cargarHorario();
  }, [docenteId]);

  const buscarBloque = (dia, hora) => {
    return horario.find(
      (item) =>
        Number(item.dia_semana) === Number(dia) &&
        item.hora_inicio.slice(0, 5) === hora
    );
  };

  if (!docenteId) {
    return (
      <section className="p-6">
        <h1 className="text-2xl font-bold text-slate-900">Mi horario</h1>
        <p className="mt-2 text-red-600">
          No se encontró el docente_id del usuario logueado.
        </p>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mi horario</h1>
        <p className="mt-1 text-slate-600">
          Vista semanal de los cursos asignados al docente.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[1000px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="w-32 border border-slate-200 p-3 text-left">
                Hora
              </th>

              {dias.map((dia) => (
                <th
                  key={dia.id}
                  className="border border-slate-200 p-3 text-center"
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
                  className="border border-slate-200 p-6 text-center text-slate-500"
                >
                  Cargando horario...
                </td>
              </tr>
            ) : (
              horas.map((hora) => (
                <tr key={hora}>
                  <td className="border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700">
                    {hora}
                  </td>

                  {dias.map((dia) => {
                    const bloque = buscarBloque(dia.id, hora);

                    return (
                      <td
                        key={`${dia.id}-${hora}`}
                        className="h-28 border border-slate-200 p-2 align-top"
                      >
                        {bloque ? (
                          <div className="h-full rounded-xl bg-blue-600 p-3 text-white shadow-sm">
                            <p className="text-xs font-semibold opacity-90">
                              {bloque.codigo_curso}
                            </p>

                            <h3 className="mt-1 text-sm font-bold leading-tight">
                              {bloque.curso}
                            </h3>

                            <p className="mt-2 text-xs">
                              {bloque.hora_inicio.slice(0, 5)} -{" "}
                              {bloque.hora_fin.slice(0, 5)}
                            </p>

                            <p className="text-xs">
                              Aula: {bloque.aula || "Sin aula"}
                            </p>

                            <p className="text-xs">
                              Sección {bloque.numero_seccion} ·{" "}
                              {bloque.tipo_seccion}
                            </p>

                            <p className="mt-1 text-[11px] opacity-90">
                              {bloque.semestre}
                            </p>
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400">
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

      {!loading && horario.length === 0 && (
        <p className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          No tienes horario publicado todavía.
        </p>
      )}
    </section>
  );
}

export default MiHorarioTeacher;