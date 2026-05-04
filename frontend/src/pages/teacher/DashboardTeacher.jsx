import { Link } from "react-router-dom";

function DashboardTeacher() {
  const cards = [
    {
      title: "Disponibilidad",
      value: "⏰",
      description: "Registrar disponibilidad docente",
      path: "/teacher/disponibilidad",
      color: "bg-cyan-600",
    },
    {
      title: "Mi Horario",
      value: "📅",
      description: "Consultar horario semanal",
      path: "/teacher/mi-horario",
      color: "bg-green-600",
    },
    {
      title: "Mis Cursos",
      value: "📚",
      description: "Ver cursos asignados",
      path: "/teacher/mis-cursos",
      color: "bg-yellow-500",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Docente
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona tu disponibilidad, cursos asignados y horario académico.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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

export default DashboardTeacher;