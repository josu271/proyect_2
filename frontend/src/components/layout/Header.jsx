import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Header({ title = "Sistema de Horarios" }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="admin-layout header">
      <div className="header-center">
        <img src={logo} alt="JOSU University" className="logo" />

        <div className="header-text">
          <h1>{title}</h1>
          <span>University</span>
        </div>
      </div>

      <div className="header-right">
        <button type="button" className="logout-header" onClick={cerrarSesion}>
          Salir
        </button>
      </div>
    </header>
  );
}

export default Header;