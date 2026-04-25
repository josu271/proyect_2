import logo from "../../assets/logo.png";

function Header({ title = "Sistema de Horarios" }) {
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
        <span>Salir</span>
      </div>

    </header>
  );
}

export default Header;