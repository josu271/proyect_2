import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const docenteMenu = [
  {
    label: "Dashboard",
    path: "/docente",
    icon: "🏠",
    end: true,
  },
  {
    label: "Disponibilidad",
    path: "/docente/disponibilidad",
    icon: "⏰",
  },
  {
    label: "Mi Horario",
    path: "/docente/mi-horario",
    icon: "🗓️",
  },
  {
    label: "Mis Cursos",
    path: "/docente/mis-cursos",
    icon: "📚",
  },
];

export default function DocenteLayout() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  const handleToggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("sidebarCollapsed", String(next));
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
        roleTitle="TEACHER"
        menuItems={docenteMenu}
      />

      <div
        className={[
          "min-h-screen transition-all duration-300",
          collapsed ? "ml-20" : "ml-64",
        ].join(" ")}
      >
        <Header
          title="Panel del Docente"
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