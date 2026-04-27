import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import RecuperacionContra from "../pages/auth/ForgotPassword";

import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";

import DashboardAdmin from "../pages/admin/DashboardAdmin";
import CursosAdmin from "../pages/admin/Cursosadmin";
import DocentesAdmin from "../pages/admin/Docentesadmin";
import CrearDocente from "../pages/admin/CrearDocente";
import VerDocente from "../pages/admin/VerDocente";
import EditarDocente from "../pages/admin/EditarDocente";
import EstudiantesAdmin from "../pages/admin/Estudiantesadmin";
import Reportes from "../pages/admin/Reportes";
import VerEstudiante from "../pages/admin/VerEstudiante";
import EditarEstudiante from "../pages/admin/EditarEstudiante";
import CrearEstudiante from "../pages/admin/CrearEstudiante";

import DashboardStudent from "../pages/student/DashboardStudent";
import HistorialEstudiante from "../pages/student/HistorialEstudiante";
import MatriculasEstudiante from "../pages/student/Matriculasestudiante";
import MiHorarioEstudiante from "../pages/student/MiHorariosestudiante";
import MisCursosEstudiante from "../pages/student/MisCursosEstudiante";

import DashboardTeacher from "../pages/teacher/DashboardTeacher";
import DisponibilidadTeacher from "../pages/teacher/DisponibilidadTeacher";
import MiHorarioTeacher from "../pages/teacher/MihorarioTeacher";
import MisCursosTeacher from "../pages/teacher/MisCursosTeacher";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<RecuperacionContra />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="cursos" element={<CursosAdmin />} />
        <Route path="docentes" element={<DocentesAdmin />} />
        <Route path="docentes/crear" element={<CrearDocente />} />
        <Route path="docentes/ver/:id" element={<VerDocente />} />
        <Route path="docentes/editar/:id" element={<EditarDocente />} />
        <Route path="estudiantes" element={<EstudiantesAdmin />} />
        <Route path="estudiantes/ver/:id" element={<VerEstudiante />} />
        <Route path="estudiantes/editar/:id" element={<EditarEstudiante />} />
        <Route path="estudiantes/crear" element={<CrearEstudiante />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>

      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<DashboardStudent />} />
        <Route path="historial" element={<HistorialEstudiante />} />
        <Route path="matricula" element={<MatriculasEstudiante />} />
        <Route path="mi-horario" element={<MiHorarioEstudiante />} />
        <Route path="mis-cursos" element={<MisCursosEstudiante />} />
      </Route>

      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<DashboardTeacher />} />
        <Route path="disponibilidad" element={<DisponibilidadTeacher />} />
        <Route path="mi-horario" element={<MiHorarioTeacher />} />
        <Route path="mis-cursos" element={<MisCursosTeacher />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;