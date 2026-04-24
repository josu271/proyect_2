import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import DashboardStudent from "../pages/student/DashboardStudent";
import StudentCourses from "../pages/student/MisCursos";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardTeacher from "../pages/teacher/DashboardTeacher";
import RecuperacionContra from "../pages/auth/ForgotPassword";

function AppRouter() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<RecuperacionContra />} />

      {/* Alumno */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<DashboardStudent />} />
        <Route path="courses" element={<StudentCourses />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
      </Route>

      {/* Docente */}
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<DashboardTeacher />} />
      </Route>

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;