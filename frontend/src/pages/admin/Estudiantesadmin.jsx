function Estudiantesadmin() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6">


        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Estudiantes
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra los estudiantes registrados en el sistema.
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg font-medium shadow-sm">
            + Agregar estudiante
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar estudiante por nombre, correo o programa..."
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
            
            {/* HEADER */}
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Programa</th>
                <th className="px-4 py-3 text-left">Semestre</th>
                <th className="px-4 py-3 text-left">Créditos</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y">
              
              {/* ROW */}
              <tr className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-4 py-3 font-medium text-gray-800">EST-001</td>
                <td className="px-4 py-3">Juan Pérez</td>
                <td className="px-4 py-3 text-gray-600">juan@uni.edu</td>
                <td className="px-4 py-3">Ing. Sistemas</td>
                <td className="px-4 py-3">VI</td>
                <td className="px-4 py-3 font-semibold">22</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Activo
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
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
                <td className="px-4 py-3 font-medium text-gray-800">EST-002</td>
                <td className="px-4 py-3">Ana Torres</td>
                <td className="px-4 py-3 text-gray-600">ana@uni.edu</td>
                <td className="px-4 py-3">Ing. Industrial</td>
                <td className="px-4 py-3">IV</td>
                <td className="px-4 py-3 font-semibold">20</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Activo
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
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
                <td className="px-4 py-3 font-medium text-gray-800">EST-003</td>
                <td className="px-4 py-3">Luis Ramírez</td>
                <td className="px-4 py-3 text-gray-600">luis@uni.edu</td>
                <td className="px-4 py-3">Administración</td>
                <td className="px-4 py-3">VIII</td>
                <td className="px-4 py-3 font-semibold">21</td>
                <td className="px-4 py-3">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Inactivo
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
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

export default Estudiantesadmin;