import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between bg-blue-600 text-white p-4">
      <h1 className="font-bold">Turism</h1>

      <div className="flex gap-4">
        <Link to="/">Inicio</Link>
        <Link to="/tours">Tours</Link>
        <Link to="/contact">Contacto</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;