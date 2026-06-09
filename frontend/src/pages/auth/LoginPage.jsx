import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../api/auth/authApi";

import logo from "../../assets/img/logo.png";
import heroImage from "../../assets/img/futuro del pais.jpg";

export default function LoginPage() {

  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const data = await login(
        correo,
        contrasena
      );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(data.usuario)
      );

      navigate(data.redirect);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-100">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[430px_minmax(0,1fr)]">

        <section className="flex min-h-screen flex-col justify-between bg-slate-100 px-10 py-8">

          <div />

          <div className="w-full">

            <div className="mb-12 flex justify-center">
              <img
                src={logo}
                alt="Logo"
                className="h-28 w-auto object-contain"
              />
            </div>

            <div className="mb-9 text-center">

              <h1 className="mb-5 text-3xl font-bold tracking-tight text-slate-950">
                Iniciar sesión
              </h1>

            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >

              <div>

                <label
                  htmlFor="correo"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Correo electrónico
                </label>

                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="email"
                  className="h-14 w-full rounded-md border border-slate-300 bg-white px-5"
                />

              </div>

              <div>

                <label
                  htmlFor="contrasena"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Contraseña
                </label>

                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  autoComplete="current-password"
                  className="h-14 w-full rounded-md border border-slate-300 bg-white px-5"
                />

              </div>

              {
                error && (
                  <div className="rounded bg-red-100 p-3 text-red-700">
                    {error}
                  </div>
                )
              }

              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-md bg-blue-800 font-bold text-white"
              >
                {
                  loading
                    ? "Ingresando..."
                    : "Iniciar sesión"
                }
              </button>

            </form>

            <div className="mt-5 text-center">

              <Link
                to="/recuperar-password"
                className="font-bold text-slate-950"
              >
                Recuperar contraseña
              </Link>

            </div>

          </div>

        </section>

        <section className="relative hidden min-h-screen overflow-hidden lg:block">

          <img
            src={heroImage}
            alt="Imagen institucional"
            className="h-screen w-full object-cover"
          />

        </section>

      </div>
    </main>
  );
}
