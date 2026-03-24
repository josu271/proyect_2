import { Outlet } from "react-router-dom";
import Navbar from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";

const PrivateLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full">
        <Navbar />
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;