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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-700">
        Iniciar Sesión
      </h1>

      <input
        type="text"
        placeholder="Usuario"
        className="border p-2 rounded-lg"
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="border p-2 rounded-lg"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Ingresar
      </button>
    </div>
  );
};

export default Login;