function Matriculasestudiante() {
  const cursosDisponibles = [
    {
      codigo: "CS101",
      nombre: "Programación I",
      docente: "Luis Ramírez",
      seccion: "A",
      aula: "Aula 204",
      horario: "Lunes 08:00 - 09:00",
      creditos: 4,
      cupos: 8,
      estado: "Disponible",
    },
    {
      codigo: "BD202",
      nombre: "Base de Datos",
      docente: "Ana Torres",
      seccion: "B",
      aula: "Lab 301",
      horario: "Miércoles 10:00 - 11:00",
      creditos: 4,
      cupos: 5,
      estado: "Disponible",
    },
    {
      codigo: "AS303",
      nombre: "Arquitectura de Software",
      docente: "Carlos Medina",
      seccion: "A",
      aula: "Aula 105",
      horario: "Viernes 15:00 - 16:00",
      creditos: 3,
      cupos: 0,
      estado: "Sin cupos",
    },
  ];

  const cursosSeleccionados = [
    {
      codigo: "CS101",
      nombre: "Programación I",
      creditos: 4,
      horario: "Lunes 08:00 - 09:00",
    },
    {
      codigo: "BD202",
      nombre: "Base de Datos",
      creditos: 4,
      horario: "Miércoles 10:00 - 11:00",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
          Módulo estudiante
        </p>

        <h1 className="mt-3 text-3xl font-bold">Matrícula de cursos</h1>

        <p className="mt-2 max-w-2xl text-blue-100">
          Selecciona las secciones disponibles según los horarios generados por el sistema.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Créditos seleccionados
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">8</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Límite permitido
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">20 - 22</h3>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-amber-700">
            Estado de matrícula
          </p>
          <h3 className="mt-2 text-xl font-bold text-amber-700">
            Incompleta
          </h3>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">
            Conflictos detectados
          </p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-700">0</h3>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Cursos disponibles
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Elige cursos con cupos abiertos y sin cruce de horario.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Buscar curso..."
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option>Semestre 2026-I</option>
                <option>Semestre 2026-II</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Código
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Curso
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Docente
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Sección
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Horario
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Cupos
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Estado
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {cursosDisponibles.map((curso) => (
                  <tr key={curso.codigo} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm font-bold text-slate-700">
                      {curso.codigo}
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm font-bold text-slate-900">
                        {curso.nombre}
                      </p>
                      <p className="text-xs text-slate-500">
                        {curso.creditos} créditos · {curso.aula}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {curso.docente}
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                      {curso.seccion}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-500">
                      {curso.horario}
                    </td>

                    <td className="px-4 py-4 text-sm font-bold text-slate-700">
                      {curso.cupos}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          curso.estado === "Disponible"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {curso.estado}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                          curso.estado === "Disponible"
                            ? "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                        }`}
                      >
                        {curso.estado === "Disponible"
                          ? "Seleccionar"
                          : "Bloqueado"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Cursos seleccionados
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Revisa tu selección antes de confirmar matrícula.
            </p>

            <div className="mt-5 space-y-4">
              {cursosSeleccionados.map((curso) => (
                <div
                  key={curso.codigo}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-blue-600">
                        {curso.codigo}
                      </p>
                      <h3 className="mt-1 text-sm font-bold text-slate-900">
                        {curso.nombre}
                      </h3>
                    </div>

                    <button
                      type="button"
                      className="rounded-lg bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600"
                    >
                      Quitar
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {curso.horario}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {curso.creditos} créditos
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="text-lg font-bold text-blue-900">
              Validación
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Prerrequisitos</span>
                <strong className="text-emerald-600">Cumple</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-700">Cruce de horario</span>
                <strong className="text-emerald-600">Sin cruce</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-700">Créditos mínimos</span>
                <strong className="text-amber-600">Pendiente</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-700">Cupos</span>
                <strong className="text-emerald-600">Disponible</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            Confirmar matrícula
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Matriculasestudiante;