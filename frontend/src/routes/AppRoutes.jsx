import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import DocenteLayout from "../layouts/DocenteLayout";
import EstudianteLayout from "../layouts/EstudianteLayout";

import LoginPage from "../pages/auth/LoginPage";
import RecuperarPasswordPage from "../pages/auth/RecuperarPasswordPage";

import DashboardAdmin from "../pages/admin/DashboardAdmin";
import CursosAdmin from "../pages/admin/CursosAdmin";
import DocentesAdmin from "../pages/admin/DocentesAdmin";
import EstudiantesAdmin from "../pages/admin/EstudiantesAdmin";
import AulasAdmin from "../pages/admin/AulasAdmin";
import SeccionesNrcAdmin from "../pages/admin/SeccionesNrcAdmin";
import ReportesAdmin from "../pages/admin/ReportesAdmin";

import DashboardDocente from "../pages/docente/DashboardDocente";
import MisCursosDocente from "../pages/docente/MisCursosDocente";
import DisponibilidadDocente from "../pages/docente/DisponibilidadDocente";
import MiHorarioDocente from "../pages/docente/MiHorarioDocente";

import DashboardEstudiante from "../pages/estudiante/DashboardEstudiante";
import MatriculaEstudiante from "../pages/estudiante/MatriculaEstudiante";
import MiHorarioEstudiante from "../pages/estudiante/MiHorarioEstudiante";
import MisCursosEstudiante from "../pages/estudiante/MisCursosEstudiante";
import HistorialAcademico from "../pages/estudiante/HistorialAcademico";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar-password" element={<RecuperarPasswordPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="cursos" element={<CursosAdmin />} />
        <Route path="docentes" element={<DocentesAdmin />} />
        <Route path="estudiantes" element={<EstudiantesAdmin />} />
        <Route path="aulas" element={<AulasAdmin />} />
        <Route path="secciones-nrc" element={<SeccionesNrcAdmin />} />
        <Route path="reportes" element={<ReportesAdmin />} />
      </Route>

      <Route path="/docente" element={<DocenteLayout />}>
        <Route index element={<DashboardDocente />} />
        <Route path="mis-cursos" element={<MisCursosDocente />} />
        <Route path="disponibilidad" element={<DisponibilidadDocente />} />
        <Route path="mi-horario" element={<MiHorarioDocente />} />
      </Route>

      <Route path="/estudiante" element={<EstudianteLayout />}>
        <Route index element={<DashboardEstudiante />} />
        <Route path="matricula" element={<MatriculaEstudiante />} />
        <Route path="mi-horario" element={<MiHorarioEstudiante />} />
        <Route path="mis-cursos" element={<MisCursosEstudiante />} />
        <Route path="historial-academico" element={<HistorialAcademico />} />
      </Route>

      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  );
}