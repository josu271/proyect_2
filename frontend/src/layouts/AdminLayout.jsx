import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

function AdminLayout() {
  return (
    <div className="app-shell">
      <Sidebar role="admin" />

      <div className="main-wrapper">
        <Header title="Panel del Administrador" />

        <main className="content">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default AdminLayout;