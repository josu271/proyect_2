function Docentes() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <div className="bg-white rounded-2xl shadow-md p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Docentes
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra la información básica de los docentes registrados.
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg font-medium shadow-sm">
            + Agregar docente
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar docente por nombre, correo o código..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button className="bg-gray-900 hover:bg-gray-800 transition text-white px-5 rounded-lg text-sm font-medium">
            Filtrar
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Especialidad</th>
                <th className="px-4 py-3 text-left">Disponibilidad</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {/* ROW */}
              <tr className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-4 py-3 font-medium text-gray-800">DOC-001</td>
                <td className="px-4 py-3">María López Ramos</td>
                <td className="px-4 py-3 text-gray-600">maria.lopez@uni.edu</td>
                <td className="px-4 py-3">Matemática</td>
                <td className="px-4 py-3 text-gray-600">Lun - Mié / Mañana</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Activo
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button className="text-blue-600 hover:underline text-xs">
                    Ver
                  </button>
                  <button className="text-gray-700 hover:underline text-xs">
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline text-xs">
                    Eliminar
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-4 py-3 font-medium text-gray-800">DOC-002</td>
                <td className="px-4 py-3">Carlos Medina</td>
                <td className="px-4 py-3 text-gray-600">carlos@uni.edu</td>
                <td className="px-4 py-3">Programación</td>
                <td className="px-4 py-3 text-gray-600">Mar - Jue / Tarde</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Activo
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button className="text-blue-600 hover:underline text-xs">
                    Ver
                  </button>
                  <button className="text-gray-700 hover:underline text-xs">
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline text-xs">
                    Eliminar
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-4 py-3 font-medium text-gray-800">DOC-003</td>
                <td className="px-4 py-3">Lucía Fernández</td>
                <td className="px-4 py-3 text-gray-600">lucia@uni.edu</td>
                <td className="px-4 py-3">Base de Datos</td>
                <td className="px-4 py-3 text-gray-600">Viernes / Mañana</td>
                <td className="px-4 py-3">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Inactivo
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button className="text-blue-600 hover:underline text-xs">
                    Ver
                  </button>
                  <button className="text-gray-700 hover:underline text-xs">
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline text-xs">
                    Eliminar
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Docentes;