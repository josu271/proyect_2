import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

function TeacherLayout() {
  const [sidebarClosed, setSidebarClosed] = useState(() => {
    const saved = localStorage.getItem("sidebarClosed");
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarClosed", JSON.stringify(sidebarClosed));
  }, [sidebarClosed]);

  return (
    <div className="admin-layout app-shell">
      <Sidebar
        role="teacher"
        closed={sidebarClosed}
        onToggle={() => setSidebarClosed((prev) => !prev)}
      />

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