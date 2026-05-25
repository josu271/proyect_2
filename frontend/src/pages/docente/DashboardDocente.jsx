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
    color: "bg-cyan-600",
    footer: "bg-cyan-700",
  },
  {
    title: "Historial Académico",
    description: "Consultar cursos aprobados",
    icon: "🎓",
    path: "/estudiante/historial-academico",
    color: "bg-yellow-500",
    footer: "bg-yellow-600",
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
          Consulta tu matrícula, cursos, horario académico e historial.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Créditos</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">16 / 22</h3>
          <p className="mt-2 text-sm text-slate-500">Créditos matriculados</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Cursos</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">4</h3>
          <p className="mt-2 text-sm text-slate-500">Cursos seleccionados</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Semestre</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">2026-I</h3>
          <p className="mt-2 text-sm text-slate-500">Periodo actual</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Estado</p>
          <h3 className="mt-2 text-3xl font-bold text-green-700">Activo</h3>
          <p className="mt-2 text-sm text-slate-500">Matrícula habilitada</p>
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