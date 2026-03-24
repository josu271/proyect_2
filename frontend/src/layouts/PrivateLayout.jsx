import { Outlet } from "react-router-dom";
import Navbar from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";

const PrivateLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">



      <div className="flex-1">
        <Navbar />

        <main className="p-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default PrivateLayout;