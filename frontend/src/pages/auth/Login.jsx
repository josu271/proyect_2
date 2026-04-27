import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/authApi";

import loginBg from "../../assets/futuro del pais.jpg";
import logo from "../../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(correo, contrasena);

localStorage.setItem("token", data.token); // 🔥 IMPORTANTE
localStorage.setItem("usuario", JSON.stringify(data.usuario));

const usuario = data.usuario;

      // Redirección por rol
      if (usuario.rol === "ADMIN") {
        navigate("/admin");
      } else if (usuario.rol === "DOCENTE") {
        navigate("/teacher");
      } else if (usuario.rol === "ESTUDIANTE") {
        navigate("/student");
      } else {
        setError("Rol no reconocido");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="grid min-h-screen w-full grid-cols-[470px_1fr] bg-slate-100">

      <section className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-10 py-12">

        <img src={logo} alt="Logo" className="mb-8 h-28 w-auto" />

        <h1 className="text-3xl font-bold text-slate-900">
          Iniciar sesión
        </h1>

        <p className="mt-3 mb-8 max-w-[380px] text-center text-base text-slate-600">
          Accede al sistema académico con tu cuenta institucional.
        </p>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-[380px] flex flex-col gap-3"
        >

          {/* CORREO */}
          <div>
            <label className="mb-2 block text-base font-semibold text-slate-700">
              Correo electrónico
            </label>

            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="usuario@correo.com"
              className="w-full rounded-lg border border-slate-300 bg-white/70 px-5 py-4 text-lg outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="mb-2 block text-base font-semibold text-slate-700">
              Contraseña
            </label>

            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="w-full rounded-lg border border-slate-300 bg-white/70 px-5 py-4 text-lg outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-blue-900 py-3.5 text-base font-bold text-white transition hover:bg-blue-800"
          >
            Iniciar sesión
          </button>

          <Link
            to="/forgot-password"
            className="text-center text-base font-semibold text-blue-800 hover:underline"
          >
            Recuperar contraseña
          </Link>
        </form>

        <p className="mt-10 max-w-[380px] text-center text-xs text-slate-500">
          Sistema de Generación Óptima de Horarios Académicos
        </p>
      </section>

      {/* IMAGEN */}
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <img
          src={loginBg}
          alt="Estudiante universitario"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/25"></div>
      </section>
    </main>
  );
}

export default Login;