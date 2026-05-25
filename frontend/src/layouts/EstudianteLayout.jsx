import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const estudianteMenu = [
  {
    label: "Dashboard",
    path: "/estudiante",
    icon: "🏠",
    end: true,
  },
  {
    label: "Matrícula",
    path: "/estudiante/matricula",
    icon: "📝",
  },
  {
    label: "Mi Horario",
    path: "/estudiante/mi-horario",
    icon: "🗓️",
  },
  {
    label: "Mis Cursos",
    path: "/estudiante/mis-cursos",
    icon: "📚",
  },
  {
    label: "Historial Académico",
    path: "/estudiante/historial-academico",
    icon: "🎓",
  },
];

export default function EstudianteLayout() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsedEstudiante") === "true";
  });

  const handleToggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("sidebarCollapsedEstudiante", String(next));
      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        roleTitle="STUDENT"
        menuItems={estudianteMenu}
      />

      <div
        className={[
          "min-h-screen transition-all duration-300",
          collapsed ? "ml-20" : "ml-64",
        ].join(" ")}
      >
        <Header
          title="Panel del Estudiante"
          subtitle="University"
          onLogout={handleLogout}
        />

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}