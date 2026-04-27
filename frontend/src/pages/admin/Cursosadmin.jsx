function Cursosadmin() {
  const cursos = [
    {
      codigo: "CS101",
      nombre: "Programación I",
      creditos: 4,
      nivel: 1,
      programa: "Ingeniería de Sistemas",
      estado: "Activo",
    },
    {
      codigo: "BD202",
      nombre: "Base de Datos",
      creditos: 4,
      nivel: 2,
      programa: "Ingeniería de Sistemas",
      estado: "Activo",
    },
  ];

  return (
    <section className="space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de Cursos
          </h1>
          <p className="text-sm text-slate-500">
            Administra los cursos del sistema académico
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700">
          + Nuevo curso
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Buscar curso..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
        />

        <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
          <option>Todos los programas</option>
        </select>

        <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
          <option>Estado</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>

      {/* TABLA */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Créditos</th>
              <th className="px-4 py-3">Nivel</th>
              <th className="px-4 py-3">Programa</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {cursos.map((curso) => (
              <tr key={curso.codigo} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold">
                  {curso.codigo}
                </td>

                <td className="px-4 py-3">
                  {curso.nombre}
                </td>

                <td className="px-4 py-3">
                  {curso.creditos}
                </td>

                <td className="px-4 py-3">
                  {curso.nivel}
                </td>

                <td className="px-4 py-3">
                  {curso.programa}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {curso.estado}
                  </span>
                </td>

                <td className="px-4 py-3 text-right space-x-2">
                  <button className="rounded-lg bg-blue-50 px-3 py-1 text-xs text-blue-600">
                    Editar
                  </button>

                  <button className="rounded-lg bg-red-50 px-3 py-1 text-xs text-red-600">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORMULARIO (SIMULADO) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Registrar Curso</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Código"
            className="rounded-xl border px-4 py-3"
          />

          <input
            type="text"
            placeholder="Nombre del curso"
            className="rounded-xl border px-4 py-3"
          />

          <input
            type="number"
            placeholder="Créditos"
            className="rounded-xl border px-4 py-3"
          />

          <input
            type="number"
            placeholder="Nivel"
            className="rounded-xl border px-4 py-3"
          />

          <select className="rounded-xl border px-4 py-3">
            <option>Programa</option>
          </select>

          <select className="rounded-xl border px-4 py-3">
            <option>Estado</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>

        <button className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold">
          Guardar curso
        </button>
      </div>

    </section>
  );
}

export default Cursosadmin;