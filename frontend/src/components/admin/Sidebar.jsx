import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-60 bg-gray-200 h-screen p-4">
      <ul className="flex flex-col gap-3">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Usuarios</Link>
        <Link to="/admin/packages">Paquetes</Link>
      </ul>
    </div>
  );
};

export default Sidebar;