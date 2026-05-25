const conflictos = [
  {
    id: 1,
    tipo: "TEACHER_OVERLAP",
    severidad: "Alta",
    descripcion: "Docente asignado a dos secciones en el mismo bloque.",
  },
  {
    id: 2,
    tipo: "CLASSROOM_OVERLAP",
    severidad: "Alta",
    descripcion: "Aula G103 ocupada por dos cursos el lunes 08:00.",
  },
  {
    id: 3,
    tipo: "CAPACITY_EXCEEDED",
    severidad: "Media",
    descripcion: "La sección excede la capacidad del aula asignada.",
  },
];

export default function ReportesAdmin() {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Reportes</h2>

        <p className="mt-2 text-slate-500">
          Revisa indicadores de planificación, uso de recursos y conflictos.
        </p>
      </div>

      <div className="mb-6 grid gap-5 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Secciones publicadas
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">18</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Cursos asignados
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">24</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Aulas utilizadas
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-red-600">
            Conflictos detectados
          </p>
          <p className="mt-2 text-3xl font-bold text-red-700">3</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-slate-900">
            Conflictos encontrados
          </h3>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Severidad</th>
                  <th className="px-4 py-3">Descripción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {conflictos.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-bold text-slate-900">
                      {item.tipo}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-bold",
                          item.severidad === "Alta"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700",
                        ].join(" ")}
                      >
                        {item.severidad}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {item.descripcion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Calidad del horario
          </h3>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  Sin cruce docente
                </span>
                <span className="font-bold text-slate-900">85%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[85%] rounded-full bg-green-600" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  Uso de aulas
                </span>
                <span className="font-bold text-slate-900">72%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[72%] rounded-full bg-blue-700" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  Secciones publicadas
                </span>
                <span className="font-bold text-slate-900">65%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[65%] rounded-full bg-yellow-500" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}