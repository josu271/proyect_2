import { Outlet } from "react-router-dom";
import Navbar from "../components/client/Navbar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 w-full">

      <Navbar />

      {/* CONTENIDO FULL WIDTH */}
      <main className="w-full p-4 md:p-8">
        <div className="bg-white shadow-md rounded-xl p-6 md:p-10 w-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default PublicLayout;