import { Link, useLocation } from "react-router-dom";

function Sidebar({ role = "student", closed = false, onToggle }) {
  const location = useLocation();

  const menuItems = {
    admin: [
      { label: "Dashboard", path: "/admin", icon: "📊" },
      { label: "Cursos", path: "/admin/cursos", icon: "📚" },
      { label: "Docentes", path: "/admin/docentes", icon: "👨‍🏫" },
      { label: "Estudiantes", path: "/admin/estudiantes", icon: "🎓" },
      { label: "Reportes", path: "/admin/reportes", icon: "📄" },
    ],
    student: [
      { label: "Dashboard", path: "/student", icon: "🏠" },
      { label: "Historial", path: "/student/historial", icon: "🕘" },
      { label: "Matrícula", path: "/student/matricula", icon: "📝" },
      { label: "Mi Horario", path: "/student/mi-horario", icon: "📅" },
      { label: "Mis Cursos", path: "/student/mis-cursos", icon: "📚" },
    ],
    teacher: [
      { label: "Dashboard", path: "/teacher", icon: "🏠" },
      { label: "Disponibilidad", path: "/teacher/disponibilidad", icon: "⏰" },
      { label: "Mi Horario", path: "/teacher/mi-horario", icon: "📅" },
      { label: "Mis Cursos", path: "/teacher/mis-cursos", icon: "📚" },
    ],
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`admin-layout sidebar ${closed ? "closed" : ""}`}>
      <div className="sidebar-toggle">
        <button onClick={() => onToggle && onToggle()}>☰</button>
      </div>

      <div className="sidebar-header">
        <h2>{role.toUpperCase()}</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems[role].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={item.label}
            className={isActive(item.path) ? "active" : ""}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}

        <Link to="/" title="Cerrar sesión">
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Cerrar sesión</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;