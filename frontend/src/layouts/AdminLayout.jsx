import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const adminMenu = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "🏠",
    end: true,
  },
  {
    label: "Cursos",
    path: "/admin/cursos",
    icon: "📚",
  },
  {
    label: "Docentes",
    path: "/admin/docentes",
    icon: "👨‍🏫",
  },
  {
    label: "Estudiantes",
    path: "/admin/estudiantes",
    icon: "🎓",
  },
  {
    label: "Aulas",
    path: "/admin/aulas",
    icon: "🏫",
  },
  {
    label: "Secciones/NRC",
    path: "/admin/secciones-nrc",
    icon: "🧾",
  },
  {
    label: "Reportes",
    path: "/admin/reportes",
    icon: "📊",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("adminSidebarCollapsed") === "true";
  });

  const handleToggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("adminSidebarCollapsed", String(next));
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
        roleTitle="ADMIN"
        menuItems={adminMenu}
      />

      <div
        className={[
          "min-h-screen transition-all duration-300",
          collapsed ? "ml-20" : "ml-64",
        ].join(" ")}
      >
        <Header
          title="Panel del Administrador"
          subtitle="Gestión académica"
          onLogout={handleLogout}
        />

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}