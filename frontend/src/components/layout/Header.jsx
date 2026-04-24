import logo from "../../assets/logo.png";

function Header({ title = "Sistema de Horarios" }) {
  return (
    <header className="header">
      
      <div className="header-left">
        <img src={logo} alt="JOSU University" className="logo" />
        <div className="header-text">
          <h1>{title}</h1>
          <span>University</span>
        </div>
      </div>

      <div className="header-right">
        <span>Usuario</span>
      </div>

    </header>
  );
}

export default Header;