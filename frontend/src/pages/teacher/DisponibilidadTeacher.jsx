function DisponibilidadTeacher() {
  const cursos = [
    "Programación I",
    "Base de Datos",
    "Arquitectura de Software",
  ];

  const horarios = [
    "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "14:00", "15:00", "16:00", "17:00",
  ];

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
          Módulo docente
        </p>

        <h1 className="mt-3 text-3xl font-bold">Mi disponibilidad</h1>

        <p className="mt-2 max-w-2xl text-blue-100">
          Selecciona un curso asignado y marca los días y bloques horarios en los que puedes dictarlo.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Datos de disponibilidad
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Curso asignado
            </label>

            <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              <option>Seleccionar curso</option>
              {cursos.map((curso) => (
                <option key={curso}>{curso}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Semestre
            </label>

            <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              <option>Semestre 2026-I</option>
              <option>Semestre 2026-II</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Tipo de clase
            </label>

            <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              <option>Teórico</option>
              <option>Práctico</option>
              <option>Teórico y práctico</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Bloques disponibles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Marca los horarios en los que puedes dictar el curso seleccionado.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-2">
              <thead>
                <tr>
                  <th className="rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-bold text-slate-600">
                    Hora
                  </th>

                  {dias.map((dia) => (
                    <th
                      key={dia}
                      className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-bold text-slate-600"
                    >
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {horarios.map((hora) => (
                  <tr key={hora}>
                    <td className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                      {hora}
                    </td>

                    {dias.map((dia, index) => (
                      <td key={`${dia}-${hora}`} className="text-center">
                        <button
                          type="button"
                          className={`h-12 w-full rounded-2xl border text-sm font-semibold transition ${
                            index % 2 === 0
                              ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                              : "border-slate-200 bg-white text-slate-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          {index % 2 === 0 ? "Disponible" : "Libre"}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="text-lg font-bold text-blue-900">
              Resumen
            </h3>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Curso</span>
                <strong className="text-blue-950">Programación I</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-700">Turno</span>
                <strong className="text-blue-950">Mañana</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-700">Días seleccionados</span>
                <strong className="text-blue-950">5</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-700">Bloques disponibles</span>
                <strong className="text-blue-950">25</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-700">Estado</span>
                <strong className="text-emerald-600">Pendiente</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            Guardar disponibilidad
          </button>
        </aside>
      </div>
    </section>
  );
}

export default DisponibilidadTeacher;