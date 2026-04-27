import { useEffect, useState } from "react";
import {
  obtenerDisponibilidadPorDocente,
  obtenerCursosDocente,
  obtenerSemestres,
  crearDisponibilidad,
  eliminarDisponibilidad,
} from "../../api/teacher/disponibilidadApi";

const dias = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
];

const horas = [
  "07:00",
  "08:30",
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
  "19:00",
];

function sumar90Minutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  const fecha = new Date();
  fecha.setHours(h);
  fecha.setMinutes(m + 90);
  return fecha.toTimeString().slice(0, 5);
}

function Disponibilidad() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const docenteId = usuario?.docente_id;

  const [disponibilidades, setDisponibilidades] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [semestres, setSemestres] = useState([]);

  const [cursoId, setCursoId] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      if (!docenteId) return;

      try {
        setLoading(true);

        const [dispData, cursosData, semestresData] = await Promise.all([
          obtenerDisponibilidadPorDocente(docenteId),
          obtenerCursosDocente(docenteId),
          obtenerSemestres(),
        ]);

        setDisponibilidades(dispData);
        setCursos(cursosData);
        setSemestres(semestresData);
      } catch (error) {
        alert(error.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [docenteId]);

  const recargarDisponibilidad = async () => {
    const data = await obtenerDisponibilidadPorDocente(docenteId);
    setDisponibilidades(data);
  };

  const existeDisponibilidad = (dia, hora) => {
    return disponibilidades.find(
      (item) =>
        Number(item.dia_semana) === Number(dia) &&
        item.hora_inicio.slice(0, 5) === hora &&
        Number(item.curso_id) === Number(cursoId) &&
        Number(item.semestre_id) === Number(semestreId)
    );
  };

  const seleccionarHorario = async (dia, hora) => {
    if (!cursoId || !semestreId) {
      alert("Selecciona un curso y un semestre");
      return;
    }

    const existente = existeDisponibilidad(dia, hora);

    try {
      if (existente) {
        await eliminarDisponibilidad(existente.id);
      } else {
        await crearDisponibilidad({
          docente_id: Number(docenteId),
          curso_id: Number(cursoId),
          semestre_id: Number(semestreId),
          dia_semana: Number(dia),
          hora_inicio: hora,
          hora_fin: sumar90Minutos(hora),
          turno: hora < "13:00" ? "MANANA" : "TARDE",
          disponible: true,
        });
      }

      await recargarDisponibilidad();
    } catch (error) {
      alert(error.message || "Error al guardar disponibilidad");
    }
  };

  if (!docenteId) {
    return (
      <section className="p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Disponibilidad docente
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
          Mi disponibilidad
        </h1>
        <p className="mt-1 text-slate-600">
          Selecciona los bloques horarios disponibles.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Curso
          </label>
          <select
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-600"
          >
            <option value="">Seleccione un curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Semestre
          </label>
          <select
            value={semestreId}
            onChange={(e) => setSemestreId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-600"
          >
            <option value="">Seleccione un semestre</option>
            {semestres.map((semestre) => (
              <option key={semestre.id} value={semestre.id}>
                {semestre.codigo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[900px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="border border-slate-200 p-3 text-left">
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
                  Cargando disponibilidad...
                </td>
              </tr>
            ) : (
              horas.map((hora) => (
                <tr key={hora}>
                  <td className="border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700">
                    {hora} - {sumar90Minutos(hora)}
                  </td>

                  {dias.map((dia) => {
                    const activo = existeDisponibilidad(dia.id, hora);

                    return (
                      <td
                        key={`${dia.id}-${hora}`}
                        className="border border-slate-200 p-2 text-center"
                      >
                        <button
                          type="button"
                          onClick={() => seleccionarHorario(dia.id, hora)}
                          className={`w-full rounded-lg px-3 py-3 text-sm font-semibold transition ${
                            activo
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700"
                          }`}
                        >
                          {activo ? "Disponible" : "Seleccionar"}
                        </button>
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

export default Disponibilidad;