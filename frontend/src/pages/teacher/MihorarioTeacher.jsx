function MihorarioTeacher() {
  const horarios = [
    "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "14:00", "15:00", "16:00", "17:00",
  ];

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const clases = {
    "Lunes-08:00": {
      curso: "Programación I",
      aula: "Aula 204",
      seccion: "A",
      tipo: "Teórico",
    },
    "Miércoles-10:00": {
      curso: "Base de Datos",
      aula: "Lab 301",
      seccion: "B",
      tipo: "Práctico",
    },
    "Viernes-15:00": {
      curso: "Arquitectura de Software",
      aula: "Aula 105",
      seccion: "A",
      tipo: "Teórico",
    },
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
          Módulo docente
        </p>

        <h1 className="mt-3 text-3xl font-bold">Mi horario</h1>

        <p className="mt-2 max-w-2xl text-blue-100">
          Consulta las clases asignadas por el sistema según tu disponibilidad registrada.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Cursos asignados</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">3</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Horas semanales</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">12</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Aulas asignadas</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">3</h3>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">Estado</p>
          <h3 className="mt-2 text-xl font-bold text-emerald-700">
            Sin conflictos
          </h3>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Horario semanal
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Vista semanal de tus cursos, aulas y secciones asignadas.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              <option>Semestre 2026-I</option>
              <option>Semestre 2026-II</option>
            </select>

            <button
              type="button"
              className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
            >
              Exportar horario
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-2">
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

                  {dias.map((dia) => {
                    const clase = clases[`${dia}-${hora}`];

                    return (
                      <td key={`${dia}-${hora}`} className="align-top">
                        {clase ? (
                          <div className="min-h-28 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-left shadow-sm">
                            <h3 className="text-sm font-bold text-blue-900">
                              {clase.curso}
                            </h3>

                            <p className="mt-2 text-xs font-semibold text-blue-700">
                              {clase.aula}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                                Sección {clase.seccion}
                              </span>

                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
                                {clase.tipo}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs font-medium text-slate-400">
                            Sin clase
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Detalle de clases asignadas
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-bold text-slate-900">Programación I</h3>
            <p className="mt-2 text-sm text-slate-500">
              Lunes · 08:00 - 09:00
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Aula 204 · Sección A
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-bold text-slate-900">Base de Datos</h3>
            <p className="mt-2 text-sm text-slate-500">
              Miércoles · 10:00 - 11:00
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Lab 301 · Sección B
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-bold text-slate-900">
              Arquitectura de Software
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Viernes · 15:00 - 16:00
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Aula 105 · Sección A
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MihorarioTeacher;