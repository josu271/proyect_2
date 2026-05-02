import { useEffect, useState } from "react";
import {
  obtenerCursosDisponiblesMatricula,
  registrarMatricula,
} from "../../api/student/matriculaApi";

const dias = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
};

function Matriculasestudiante() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const estudianteId = usuario?.estudiante_id;

  const [cursos, setCursos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarCursos = async () => {
      if (!estudianteId) {
        setError("No se encontró el estudiante_id del usuario logueado.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await obtenerCursosDisponiblesMatricula(estudianteId);
        setCursos(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message || "Error al cargar cursos disponibles");
      } finally {
        setLoading(false);
      }
    };

    cargarCursos();
  }, [estudianteId]);

  const recargarCursos = async () => {
    if (!estudianteId) return;

    try {
      const data = await obtenerCursosDisponiblesMatricula(estudianteId);
      setCursos(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || "Error al recargar cursos");
    }
  };

  const existeChoque = (cursoNuevo) => {
    return seleccionados.some(
      (curso) =>
        Number(curso.dia_semana) === Number(cursoNuevo.dia_semana) &&
        curso.hora_inicio === cursoNuevo.hora_inicio &&
        curso.hora_fin === cursoNuevo.hora_fin
    );
  };

  const seleccionarCurso = (curso) => {
    setMensaje("");
    setError("");

    const yaExiste = seleccionados.some(
      (item) => item.seccion_id === curso.seccion_id
    );

    if (yaExiste) {
      setSeleccionados(
        seleccionados.filter((item) => item.seccion_id !== curso.seccion_id)
      );
      return;
    }

    if (existeChoque(curso)) {
      setError("Este curso cruza con otro horario seleccionado.");
      return;
    }

    setSeleccionados([...seleccionados, curso]);
  };

  const totalCreditos = seleccionados.reduce(
    (total, curso) => total + Number(curso.creditos),
    0
  );

  const confirmarMatricula = async () => {
    if (!estudianteId) {
      setError("No se encontró el estudiante_id del usuario logueado.");
      return;
    }

    if (seleccionados.length === 0) {
      setError("Debes seleccionar al menos un curso.");
      return;
    }

    try {
      setMensaje("");
      setError("");

      const secciones = seleccionados.map((curso) => curso.seccion_id);
      const res = await registrarMatricula(estudianteId, secciones);

      setMensaje(res.mensaje || "Matrícula registrada correctamente.");
      setSeleccionados([]);
      await recargarCursos();
    } catch (error) {
      setError(error.message || "Error al registrar matrícula");
    }
  };

  if (!estudianteId) {
    return (
      <section className="p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Matrícula de cursos
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
        <h1 className="text-3xl font-bold">Matrícula de cursos</h1>
        <p className="mt-2 text-blue-100">
          Selecciona tus cursos disponibles y revisa tu horario antes de
          confirmar.
        </p>
      </div>

      {mensaje && (
        <div className="rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-700">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Cursos seleccionados</p>
          <h3 className="text-3xl font-bold">{seleccionados.length}</h3>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Créditos seleccionados</p>
          <h3 className="text-3xl font-bold">{totalCreditos}</h3>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Cursos disponibles</p>
          <h3 className="text-3xl font-bold">{cursos.length}</h3>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Cursos disponibles</h2>

        {loading ? (
          <p className="text-slate-500">Cargando cursos disponibles...</p>
        ) : cursos.length === 0 ? (
          <p className="text-slate-500">
            No hay cursos disponibles para matrícula.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-sm text-slate-500">
                  <th className="p-3">Código</th>
                  <th className="p-3">Curso</th>
                  <th className="p-3">Docente</th>
                  <th className="p-3">Horario</th>
                  <th className="p-3">Aula</th>
                  <th className="p-3">Créditos</th>
                  <th className="p-3">Cupos</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>

              <tbody>
                {cursos.map((curso) => {
                  const activo = seleccionados.some(
                    (item) => item.seccion_id === curso.seccion_id
                  );

                  return (
                    <tr
                      key={curso.seccion_id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="p-3 font-bold">{curso.codigo}</td>
                      <td className="p-3">{curso.curso}</td>
                      <td className="p-3">{curso.docente}</td>
                      <td className="p-3">
                        {dias[curso.dia_semana]} {curso.hora_inicio} -{" "}
                        {curso.hora_fin}
                      </td>
                      <td className="p-3">{curso.aula || "Sin aula"}</td>
                      <td className="p-3">{curso.creditos}</td>
                      <td className="p-3">
                        {curso.capacidad - curso.matriculados_actuales}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => seleccionarCurso(curso)}
                          className={`rounded-xl px-4 py-2 text-sm font-bold ${
                            activo
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          {activo ? "Quitar" : "Seleccionar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Vista previa del horario</h2>

        <div className="grid gap-3 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((dia) => (
            <div key={dia} className="rounded-2xl border bg-slate-50 p-3">
              <h3 className="mb-3 text-center font-bold text-slate-700">
                {dias[dia]}
              </h3>

              <div className="space-y-2">
                {seleccionados.filter(
                  (curso) => Number(curso.dia_semana) === Number(dia)
                ).length === 0 ? (
                  <p className="text-center text-sm text-slate-400">Libre</p>
                ) : (
                  seleccionados
                    .filter((curso) => Number(curso.dia_semana) === Number(dia))
                    .map((curso) => (
                      <div
                        key={curso.seccion_id}
                        className="rounded-xl bg-blue-600 p-3 text-white shadow"
                      >
                        <p className="text-sm font-bold">{curso.curso}</p>
                        <p className="text-xs">
                          {curso.hora_inicio} - {curso.hora_fin}
                        </p>
                        <p className="text-xs">{curso.docente}</p>
                        <p className="text-xs">{curso.aula || "Sin aula"}</p>
                      </div>
                    ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={confirmarMatricula}
          disabled={seleccionados.length === 0}
          className="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Confirmar matrícula
        </button>
      </div>
    </section>
  );
}

export default Matriculasestudiante;