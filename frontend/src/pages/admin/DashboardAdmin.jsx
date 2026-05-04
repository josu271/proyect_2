import { Link } from "react-router-dom";

function DashboardAdmin() {
  const cards = [
    {
      title: "Cursos",
      value: "📚",
      description: "Gestionar cursos",
      path: "/admin/cursos",
      color: "bg-cyan-600",
    },
    {
      title: "Docentes",
      value: "👨‍🏫",
      description: "Gestionar docentes",
      path: "/admin/docentes",
      color: "bg-green-600",
    },
    {
      title: "Estudiantes",
      value: "🎓",
      description: "Gestionar estudiantes",
      path: "/admin/estudiantes",
      color: "bg-yellow-500",
    },
    {
      title: "Reportes",
      value: "📄",
      description: "Ver reportes",
      path: "/admin/reportes",
      color: "bg-rose-600",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Administrador
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Selecciona un módulo para administrar el sistema académico.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className={`${card.color} overflow-hidden rounded-md shadow-md transition hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="p-5 text-white">
              <div className="text-4xl font-bold">{card.value}</div>
              <p className="mt-2 text-sm font-medium">{card.title}</p>
              <p className="mt-1 text-xs text-white/80">{card.description}</p>
            </div>

            <div className="bg-black/15 px-5 py-2 text-center text-sm font-medium text-white">
              Ir al módulo →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default DashboardAdmin;