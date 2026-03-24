import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/admin");
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>
        Iniciar sesión (simulado)
      </button>
    </div>
  );
};

export default Login;