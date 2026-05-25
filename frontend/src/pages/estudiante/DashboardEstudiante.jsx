import { Link } from "react-router-dom";

const cards = [
  {
    title: "Matrícula",
    description: "Seleccionar cursos disponibles",
    icon: "📝",
    path: "/estudiante/matricula",
    color: "bg-blue-600",
    footer: "bg-blue-700",
  },
  {
    title: "Mi Horario",
    description: "Consultar horario semanal",
    icon: "🗓️",
    path: "/estudiante/mi-horario",
    color: "bg-green-600",
    footer: "bg-green-700",
  },
  {
    title: "Mis Cursos",
    description: "Ver cursos matriculados",
    icon: "📚",
    path: "/estudiante/mis-cursos",
    color: "bg-yellow-500",
    footer: "bg-yellow-600",
  },
  {
    title: "Historial Académico",
    description: "Revisar notas y cursos aprobados",
    icon: "🎓",
    path: "/estudiante/historial-academico",
    color: "bg-purple-600",
    footer: "bg-purple-700",
  },
];

export default function DashboardEstudiante() {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Dashboard Estudiante
        </h2>
        <p className="mt-2 text-slate-500">
          Gestiona tu matrícula, horario, cursos inscritos e historial académico.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Créditos matriculados
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">12</p>
          <p className="mt-1 text-sm text-slate-500">Máximo permitido: 22</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Cursos matriculados
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">3</p>
          <p className="mt-1 text-sm text-slate-500">Semestre 2026-I</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Estado de matrícula
          </p>
          <p className="mt-3 text-3xl font-bold text-green-600">Activa</p>
          <p className="mt-1 text-sm text-slate-500">Última actualización hoy</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className={[
              "overflow-hidden rounded-lg text-white shadow-md",
              card.color,
            ].join(" ")}
          >
            <div className="p-6">
              <div className="mb-6 text-4xl">{card.icon}</div>

              <h3 className="text-lg font-bold">{card.title}</h3>
              <p className="mt-2 text-sm text-white/90">{card.description}</p>
            </div>

            <Link
              to={card.path}
              className={[
                "block px-6 py-3 text-center text-sm font-semibold text-white",
                card.footer,
              ].join(" ")}
            >
              Ir al módulo →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}