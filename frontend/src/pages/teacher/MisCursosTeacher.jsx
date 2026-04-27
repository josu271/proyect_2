function MisCursosTeacher() {
  const cursos = [
    {
      codigo: "CS101",
      nombre: "Programación I",
      seccion: "A",
      tipo: "Teórico",
      creditos: 4,
      alumnos: 32,
      aula: "Aula 204",
      horario: "Lunes 08:00 - 09:00",
      estado: "Abierto",
    },
    {
      codigo: "BD202",
      nombre: "Base de Datos",
      seccion: "B",
      tipo: "Práctico",
      creditos: 4,
      alumnos: 28,
      aula: "Lab 301",
      horario: "Miércoles 10:00 - 11:00",
      estado: "Abierto",
    },
    {
      codigo: "AS303",
      nombre: "Arquitectura de Software",
      seccion: "A",
      tipo: "Teórico",
      creditos: 3,
      alumnos: 24,
      aula: "Aula 105",
      horario: "Viernes 15:00 - 16:00",
      estado: "Cerrado",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
          Módulo docente
        </p>

        <h1 className="mt-3 text-3xl font-bold">Mis cursos</h1>

        <p className="mt-2 max-w-2xl text-blue-100">
          Consulta los cursos asignados, secciones, aulas y cantidad de estudiantes matriculados.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Cursos asignados
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">3</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total alumnos
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">84</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Créditos dictados
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">11</h3>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">
            Estado general
          </p>
          <h3 className="mt-2 text-xl font-bold text-emerald-700">
            Sin conflictos
          </h3>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Cursos asignados
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Lista de cursos que el sistema académico te ha asignado para el semestre.
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
                  Sección
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Tipo
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Aula
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Horario
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Alumnos
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
              {cursos.map((curso) => (
                <tr key={curso.codigo} className="transition hover:bg-slate-50">
                  <td className="px-4 py-4 text-sm font-bold text-slate-700">
                    {curso.codigo}
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-slate-900">
                      {curso.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      {curso.creditos} créditos
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                    {curso.seccion}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      {curso.tipo}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                    {curso.aula}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {curso.horario}
                  </td>

                  <td className="px-4 py-4 text-sm font-bold text-slate-700">
                    {curso.alumnos}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        curso.estado === "Abierto"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {curso.estado}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {cursos.map((curso) => (
          <article
            key={curso.codigo}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  {curso.codigo}
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {curso.nombre}
                </h3>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  curso.estado === "Abierto"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {curso.estado}
              </span>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>
                <strong className="text-slate-800">Sección:</strong>{" "}
                {curso.seccion}
              </p>
              <p>
                <strong className="text-slate-800">Tipo:</strong>{" "}
                {curso.tipo}
              </p>
              <p>
                <strong className="text-slate-800">Aula:</strong>{" "}
                {curso.aula}
              </p>
              <p>
                <strong className="text-slate-800">Horario:</strong>{" "}
                {curso.horario}
              </p>
              <p>
                <strong className="text-slate-800">Alumnos:</strong>{" "}
                {curso.alumnos}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MisCursosTeacher;