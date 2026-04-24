import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

function StudentLayout() {
  return (
    <div className="app-shell">
      <Sidebar role="student" />

      <div className="main-wrapper">
        <Header title="Panel del Alumno" />

        <main className="content">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default StudentLayout;