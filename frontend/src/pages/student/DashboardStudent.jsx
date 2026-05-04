import { Link } from "react-router-dom";

function DashboardStudent() {
  const cards = [
    {
      title: "Historial",
      value: "🕘",
      description: "Ver historial académico",
      path: "/student/historial",
      color: "bg-cyan-600",
    },
    {
      title: "Matrícula",
      value: "📝",
      description: "Matricular cursos disponibles",
      path: "/student/matricula",
      color: "bg-green-600",
    },
    {
      title: "Mi Horario",
      value: "📅",
      description: "Consultar horario semanal",
      path: "/student/mi-horario",
      color: "bg-yellow-500",
    },
    {
      title: "Mis Cursos",
      value: "📚",
      description: "Ver cursos matriculados",
      path: "/student/mis-cursos",
      color: "bg-rose-600",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Estudiante
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Accede rápidamente a tus cursos, matrícula, historial y horario.
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

export default DashboardStudent;