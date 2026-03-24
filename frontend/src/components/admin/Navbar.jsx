import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <nav className="bg-blue-600 text-white w-full shadow-md relative">

      <div className="flex justify-between items-center px-6 py-4">

        <h1 className="text-xl font-bold">Turism</h1>

        <div className="flex gap-6 items-center">

          <Link to="/">Inicio</Link>

          {/* BOTÓN MENÚ SECCIONES */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="hover:text-gray-200"
          >
            Secciones ⌄
          </button>

          <Link to="/contact">Contacto</Link>

          <Link
            to="/login"
            className="bg-white text-blue-600 px-4 py-1 rounded-lg"
          >
            Login
          </Link>
        </div>
      </div>

      {/* DROPDOWN */}
      {openMenu && (
        <div className="absolute left-0 w-full bg-white text-black shadow-lg">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

            <Link
              to="/tours"
              className="p-4 rounded-lg hover:bg-gray-100"
            >
              🏝️ Tours
            </Link>

            <Link
              to="/destinos"
              className="p-4 rounded-lg hover:bg-gray-100"
            >
              🌍 Destinos
            </Link>

            <Link
              to="/ofertas"
              className="p-4 rounded-lg hover:bg-gray-100"
            >
              💸 Ofertas
            </Link>

          </div>

        </div>
      )}

    </nav>
  );
};

export default Navbar;