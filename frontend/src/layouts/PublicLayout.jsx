import { Outlet } from "react-router-dom";
import Navbar from "../components/client/Navbar";

const PublicLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="p-5">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;