import { Link, useLocation } from "react-router-dom";

function Sidebar({ role = "student" }) {
  const location = useLocation();

  // Helper para resaltar ruta activa (opcional pero útil)
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>{role.toUpperCase()}</h2>
      </div>

      <nav className="sidebar-nav">
        {/* ===== MENÚ ALUMNO ===== */}
        {role === "student" && (
          <>
            <Link
              to="/student"
              className={isActive("/student") ? "active" : ""}
            >
              Inicio
            </Link>

            <Link
              to="/student/courses"
              className={isActive("/student/courses") ? "active" : ""}
            >
              Mis cursos
            </Link>
          </>
        )}

        {/* ===== MENÚ ADMIN ===== */}
        {role === "admin" && (
          <>
            <Link
              to="/admin"
              className={isActive("/admin") ? "active" : ""}
            >
              Dashboard
            </Link>

            <Link
              to="/admin/students"
              className={isActive("/admin/students") ? "active" : ""}
            >
              Estudiantes
            </Link>

            <Link
              to="/admin/teachers"
              className={isActive("/admin/teachers") ? "active" : ""}
            >
              Docentes
            </Link>
          </>
        )}

        {/* ===== MENÚ DOCENTE ===== */}
        {role === "teacher" && (
          <>
            <Link
              to="/teacher"
              className={isActive("/teacher") ? "active" : ""}
            >
              Inicio
            </Link>

            <Link
              to="/teacher/classes"
              className={isActive("/teacher/classes") ? "active" : ""}
            >
              Mis clases
            </Link>
          </>
        )}

        {/* ===== CERRAR SESIÓN (TEMPORAL) ===== */}
        <Link to="/">Cerrar sesión</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;