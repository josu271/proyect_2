import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-5 flex flex-col gap-4">

      <h2 className="text-xl font-bold mb-4">
        Admin
      </h2>

      <Link to="/admin" className="hover:bg-gray-700 p-2 rounded">
        Dashboard
      </Link>

      <Link to="/admin/users" className="hover:bg-gray-700 p-2 rounded">
        Usuarios
      </Link>

      <Link to="/admin/packages" className="hover:bg-gray-700 p-2 rounded">
        Paquetes
      </Link>

    </div>
  );
};

export default Sidebar;