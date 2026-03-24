import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">

        <h1 className="text-xl md:text-2xl font-bold">
          Turism
        </h1>

        {/* BOTÓN MÓVIL */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* MENÚ NORMAL */}
        <div className="hidden md:flex gap-6 text-lg">
          <Link to="/">Inicio</Link>
          <Link to="/tours">Tours</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/login" className="bg-white text-blue-600 px-3 rounded">
            Login
          </Link>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="flex flex-col gap-4 mt-4 md:hidden">
          <Link to="/">Inicio</Link>
          <Link to="/tours">Tours</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;