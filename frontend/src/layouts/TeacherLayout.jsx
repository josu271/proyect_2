import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

function TeacherLayout() {
  return (
    <div className="app-shell">
      <Sidebar role="teacher" />

      <div className="main-wrapper">
        <Header title="Panel del Docente" />

        <main className="content">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default TeacherLayout;