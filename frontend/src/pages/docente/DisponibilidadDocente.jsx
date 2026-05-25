import { useEffect, useMemo, useState } from "react";
import {
  obtenerInicialDisponibilidad,
  asignarHorarioDocente,
  quitarHorarioDocente,
} from "../../api/docente/disponibilidadapi";

const FORM_INICIAL = {
  seccion_id: "",
  dia_semana: "",
  bloque_academico_id: "",
};

const DIAS = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
];

const diaLabel = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

export default function DisponibilidadDocente() {
  const [docente, setDocente] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);

  const [form, setForm] = useState(FORM_INICIAL);

  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const usuarioId = usuario.usuario_id || usuario.id;

  const seccionSeleccionada = secciones.find(
    (seccion) => String(seccion.seccion_id) === String(form.seccion_id)
  );

  const bloquesOrdenados = useMemo(() => {
    return [...bloques]
      .filter((bloque) => bloque.hora_inicio >= "08:00")
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }, [bloques]);

  const horariosAsignados = useMemo(() => {
    return secciones.filter(
      (seccion) => seccion.dia_semana && seccion.bloque_academico_id
    );
  }, [secciones]);

  const obtenerSeccionEnCelda = (diaSemana, bloqueId) => {
    return horariosAsignados.find(
      (seccion) =>
        Number(seccion.dia_semana) === Number(diaSemana) &&
        Number(seccion.bloque_academico_id) === Number(bloqueId)
    );
  };

  const cargarDatos = async () => {
    if (!usuarioId) {
      setError("No se encontró el usuario en la sesión. Vuelva a iniciar sesión.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await obtenerInicialDisponibilidad(usuarioId);

      setDocente(data.docente || null);
      setSecciones(data.secciones || []);
      setBloques(data.bloques || []);
      setDisponibilidad(data.disponibilidad || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSeleccionarSeccion = (e) => {
    const seccionId = e.target.value;

    const seccion = secciones.find(
      (item) => String(item.seccion_id) === String(seccionId)
    );

    setForm({
      seccion_id: seccionId,
      dia_semana: seccion?.dia_semana ? String(seccion.dia_semana) : "",
      bloque_academico_id: seccion?.bloque_academico_id
        ? String(seccion.bloque_academico_id)
        : "",
    });

    setError("");
    setMensaje("");
  };

  const seleccionarCelda = (diaSemana, bloqueId) => {
    if (!form.seccion_id) {
      setError("Primero seleccione una sección.");
      setMensaje("");
      return;
    }

    const ocupada = obtenerSeccionEnCelda(diaSemana, bloqueId);

    const ocupadaPorOtraSeccion =
      ocupada && String(ocupada.seccion_id) !== String(form.seccion_id);

    if (ocupadaPorOtraSeccion) {
      setError("Ese bloque ya está ocupado por otra sección del docente.");
      setMensaje("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      dia_semana: String(diaSemana),
      bloque_academico_id: String(bloqueId),
    }));

    setError("");
    setMensaje("");
  };

  const limpiarSeleccion = () => {
    setForm(FORM_INICIAL);
    setError("");
    setMensaje("");
  };

  const validarFormulario = () => {
    if (!form.seccion_id) return "Seleccione una sección.";
    if (!form.dia_semana) return "Seleccione un día en el calendario.";
    if (!form.bloque_academico_id) return "Seleccione un bloque horario.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validacion = validarFormulario();

    if (validacion) {
      setError(validacion);
      setMensaje("");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await asignarHorarioDocente({
        usuario_id: Number(usuarioId),
        seccion_id: Number(form.seccion_id),
        dia_semana: Number(form.dia_semana),
        bloque_academico_id: Number(form.bloque_academico_id),
      });

      setMensaje("Horario asignado correctamente. La sección fue completada.");
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleQuitarHorario = async (seccion) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas retirar el horario de la sección ${seccion.nrc}?`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await quitarHorarioDocente(usuarioId, seccion.seccion_id);

      setMensaje("Horario retirado correctamente.");

      if (String(form.seccion_id) === String(seccion.seccion_id)) {
        setForm((prev) => ({
          ...prev,
          dia_semana: "",
          bloque_academico_id: "",
        }));
      }

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const estaSeleccionada = (diaSemana, bloqueId) => {
    return (
      String(form.dia_semana) === String(diaSemana) &&
      String(form.bloque_academico_id) === String(bloqueId)
    );
  };

  const getCeldaClassName = (diaSemana, bloqueId) => {
    const ocupada = obtenerSeccionEnCelda(diaSemana, bloqueId);

    const ocupadaPorOtraSeccion =
      ocupada && String(ocupada.seccion_id) !== String(form.seccion_id);

    const ocupadaPorLaMisma =
      ocupada && String(ocupada.seccion_id) === String(form.seccion_id);

    if (estaSeleccionada(diaSemana, bloqueId)) {
      return "border-blue-700 bg-blue-800 text-white";
    }

    if (ocupadaPorLaMisma) {
      return "border-green-300 bg-green-100 text-green-800";
    }

    if (ocupadaPorOtraSeccion) {
      return "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500";
    }

    return "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50";
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Disponibilidad docente
        </h2>

        <p className="mt-2 text-slate-500">
          Seleccione una sección asignada y elija su día y bloque horario en el
          calendario.
        </p>

        {docente && (
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Docente: {docente.nombre_completo}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {mensaje}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-6 text-lg font-bold text-slate-900">
            Sección a programar
          </h3>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Curso asignado
              </label>

              <select
                name="seccion_id"
                value={form.seccion_id}
                onChange={handleSeleccionarSeccion}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              >
                <option value="">Seleccione sección</option>
                {secciones.map((seccion) => (
                  <option key={seccion.seccion_id} value={seccion.seccion_id}>
                    {seccion.nrc} - {seccion.curso}
                  </option>
                ))}
              </select>
            </div>

            {seccionSeleccionada && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p>
                  <span className="font-bold">NRC:</span>{" "}
                  {seccionSeleccionada.nrc}
                </p>
                <p>
                  <span className="font-bold">Curso:</span>{" "}
                  {seccionSeleccionada.curso}
                </p>
                <p>
                  <span className="font-bold">Aula:</span>{" "}
                  {seccionSeleccionada.aula || "Sin aula asignada"}
                </p>
                <p>
                  <span className="font-bold">Cupo:</span>{" "}
                  {seccionSeleccionada.cupo_max}
                </p>
                <p>
                  <span className="font-bold">Semestre:</span>{" "}
                  {seccionSeleccionada.semestre}
                </p>
              </div>
            )}

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              Los bloques ocupados por otros cursos permanecen visibles aunque
              cambie la sección seleccionada. Esto evita cruces de horario.
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-bold text-slate-800">Selección actual</p>

              <p className="mt-2">
                Día:{" "}
                <span className="font-semibold">
                  {form.dia_semana ? diaLabel[form.dia_semana] : "Pendiente"}
                </span>
              </p>

              <p>
                Bloque:{" "}
                <span className="font-semibold">
                  {form.bloque_academico_id
                    ? bloques.find(
                        (bloque) =>
                          String(bloque.id) === String(form.bloque_academico_id)
                      )?.hora_inicio?.slice(0, 5) +
                      " - " +
                      bloques.find(
                        (bloque) =>
                          String(bloque.id) === String(form.bloque_academico_id)
                      )?.hora_fin?.slice(0, 5)
                    : "Pendiente"}
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={guardando}
                className="h-12 flex-1 rounded-xl bg-blue-800 text-sm font-bold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando ? "Guardando..." : "Guardar horario"}
              </button>

              <button
                type="button"
                onClick={limpiarSeleccion}
                className="h-12 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Limpiar
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Calendario semanal
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Haga clic en un bloque libre para asignarlo al curso
                seleccionado.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white px-3 py-1 text-slate-600 ring-1 ring-slate-200">
                Libre
              </span>
              <span className="rounded-full bg-blue-800 px-3 py-1 text-white">
                Seleccionado
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                Curso actual
              </span>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-600">
                Ocupado
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-[1050px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="w-36 border-b border-r border-slate-200 px-4 py-3 text-left">
                    Hora
                  </th>

                  {DIAS.map((dia) => (
                    <th
                      key={dia.id}
                      className="border-b border-r border-slate-200 px-4 py-3 text-center"
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
                      colSpan="7"
                      className="px-4 py-10 text-center font-semibold text-slate-500"
                    >
                      Cargando calendario...
                    </td>
                  </tr>
                ) : bloquesOrdenados.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-10 text-center font-semibold text-slate-500"
                    >
                      No hay bloques académicos registrados.
                    </td>
                  </tr>
                ) : (
                  bloquesOrdenados.map((bloque) => (
                    <tr key={bloque.id}>
                      <td className="border-b border-r border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-700">
                        {bloque.hora_inicio.slice(0, 5)} -{" "}
                        {bloque.hora_fin.slice(0, 5)}
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {bloque.turno}
                        </p>
                      </td>

                      {DIAS.map((dia) => {
                        const ocupada = obtenerSeccionEnCelda(dia.id, bloque.id);

                        const ocupadaPorOtraSeccion =
                          ocupada &&
                          String(ocupada.seccion_id) !== String(form.seccion_id);

                        return (
                          <td
                            key={`${dia.id}-${bloque.id}`}
                            className="border-b border-r border-slate-200 p-2 align-top"
                          >
                            <button
                              type="button"
                              disabled={ocupadaPorOtraSeccion}
                              onClick={() => seleccionarCelda(dia.id, bloque.id)}
                              className={[
                                "min-h-[76px] w-full rounded-xl border p-3 text-left text-xs font-semibold transition",
                                getCeldaClassName(dia.id, bloque.id),
                              ].join(" ")}
                            >
                              {ocupada ? (
                                <>
                                  <span className="block text-[11px] opacity-80">
                                    {ocupada.nrc}
                                  </span>
                                  <span className="mt-1 block leading-snug">
                                    {ocupada.curso}
                                  </span>
                                  <span className="mt-1 block text-[11px] opacity-80">
                                    {ocupada.aula}
                                  </span>
                                </>
                              ) : estaSeleccionada(dia.id, bloque.id) ? (
                                <>
                                  <span className="block text-[11px] opacity-80">
                                    Seleccionado
                                  </span>
                                  <span className="mt-1 block leading-snug">
                                    {seccionSeleccionada?.curso ||
                                      "Curso seleccionado"}
                                  </span>
                                </>
                              ) : (
                                <span className="block text-center text-xs">
                                  Disponible
                                </span>
                              )}
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

          <div className="mt-8">
            <h4 className="mb-3 text-sm font-bold text-slate-800">
              Secciones asignadas
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">NRC</th>
                    <th className="px-4 py-3">Curso</th>
                    <th className="px-4 py-3">Aula</th>
                    <th className="px-4 py-3">Cupo</th>
                    <th className="px-4 py-3">Día</th>
                    <th className="px-4 py-3">Bloque</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {secciones.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-8 text-center font-semibold text-slate-500"
                      >
                        No tienes secciones asignadas.
                      </td>
                    </tr>
                  ) : (
                    secciones.map((seccion) => (
                      <tr key={seccion.seccion_id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-bold text-slate-900">
                          {seccion.nrc}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {seccion.curso}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {seccion.aula || "Sin aula"}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {seccion.cupo_max}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {seccion.dia_semana
                            ? diaLabel[seccion.dia_semana]
                            : "Pendiente"}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {seccion.hora_inicio && seccion.hora_fin
                            ? `${seccion.hora_inicio.slice(
                                0,
                                5
                              )} - ${seccion.hora_fin.slice(0, 5)}`
                            : "Pendiente"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              seccion.horario_id
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {seccion.horario_id
                              ? "Horario asignado"
                              : "Pendiente"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setForm({
                                  seccion_id: String(seccion.seccion_id),
                                  dia_semana: seccion.dia_semana
                                    ? String(seccion.dia_semana)
                                    : "",
                                  bloque_academico_id:
                                    seccion.bloque_academico_id
                                      ? String(seccion.bloque_academico_id)
                                      : "",
                                })
                              }
                              className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                            >
                              {seccion.horario_id ? "Editar" : "Asignar"}
                            </button>

                            {seccion.horario_id && (
                              <button
                                type="button"
                                onClick={() => handleQuitarHorario(seccion)}
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                              >
                                Quitar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="mb-3 text-sm font-bold text-slate-800">
              Disponibilidad registrada
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Día</th>
                    <th className="px-4 py-3">Bloque</th>
                    <th className="px-4 py-3">Turno</th>
                    <th className="px-4 py-3">Semestre</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {disponibilidad.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-6 text-center font-semibold text-slate-500"
                      >
                        Aún no registraste disponibilidad.
                      </td>
                    </tr>
                  ) : (
                    disponibilidad.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 text-slate-700">
                          {item.dia_nombre}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {item.hora_inicio.slice(0, 5)} -{" "}
                          {item.hora_fin.slice(0, 5)}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {item.turno}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {item.semestre}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}