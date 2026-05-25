import { Link } from "react-router-dom";

const stats = [
  {
    title: "Cursos",
    value: "24",
    description: "Cursos registrados",
    icon: "📚",
    color: "bg-blue-600",
    path: "/admin/cursos",
  },
  {
    title: "Docentes",
    value: "18",
    description: "Docentes activos",
    icon: "👨‍🏫",
    color: "bg-green-600",
    path: "/admin/docentes",
  },
  {
    title: "Estudiantes",
    value: "320",
    description: "Estudiantes activos",
    icon: "🎓",
    color: "bg-cyan-600",
    path: "/admin/estudiantes",
  },
  {
    title: "Aulas",
    value: "15",
    description: "Aulas disponibles",
    icon: "🏫",
    color: "bg-yellow-500",
    path: "/admin/aulas",
  },
];

const quickLinks = [
  {
    title: "Secciones/NRC",
    description: "Crear y revisar secciones académicas",
    path: "/admin/secciones-nrc",
  },

  {
    title: "Reportes",
    description: "Revisar métricas y conflictos del sistema",
    path: "/admin/reportes",
  },
];

export default function DashboardAdmin() {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Dashboard Administrador
        </h2>

        <p className="mt-2 text-slate-500">
          Vista general de la gestión académica, recursos y planificación de
          horarios.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="p-6">
              <div
                className={[
                  "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl text-white",
                  item.color,
                ].join(" ")}
              >
                {item.icon}
              </div>

              <p className="text-sm font-semibold text-slate-500">
                {item.title}
              </p>

              <p className="mt-2 text-4xl font-bold text-slate-900">
                {item.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Estado de planificación
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Seguimiento general del semestre académico 2026-I.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  Cursos asignados a docentes
                </span>
                <span className="font-bold text-slate-900">80%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[80%] rounded-full bg-blue-700" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  Secciones con horario
                </span>
                <span className="font-bold text-slate-900">65%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[65%] rounded-full bg-green-600" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  Aulas ocupadas
                </span>
                <span className="font-bold text-slate-900">52%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[52%] rounded-full bg-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Accesos rápidos
          </h3>

          <div className="mt-5 space-y-3">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <p className="text-sm font-bold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}