import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between bg-gray-800 text-white p-4">
      <h1>Panel Admin</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </nav>
  );
};

export default Navbar;