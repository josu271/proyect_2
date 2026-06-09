import { Link } from "react-router-dom";

import logo from "../../assets/img/logo.png";
import heroImage from "../../assets/img/futuro del pais.jpg";

export default function RecoverPasswordPage() {
  return (
    <main className="min-h-screen w-full bg-slate-100">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[430px_minmax(0,1fr)]">
        {/* PANEL IZQUIERDO */}
        <section className="flex min-h-screen flex-col justify-between bg-slate-100 px-10 py-8">
          <div />

          <div className="w-full">
            {/* LOGO */}
            <div className="mb-12 flex justify-center">
              <img
                src={logo}
                alt="Logo JOSU University"
                className="h-28 w-auto object-contain"
              />
            </div>

            {/* TITULO */}
            <div className="mb-9 text-center">
              <h1 className="mb-5 text-3xl font-bold tracking-tight text-slate-950">
                Recuperar contraseña
              </h1>

              <p className="mx-auto max-w-xs text-base leading-7 text-slate-700">
                Ingresa tu correo institucional para recuperar el acceso al
                sistema.
              </p>
            </div>

            {/* FORM */}
            <form className="space-y-5">
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
                  placeholder="usuario@correo.com"
                  className="h-14 w-full rounded-md border border-slate-300 bg-white px-5 text-base text-slate-900 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/20"
                />
              </div>

              <button
                type="submit"
                className="h-14 w-full rounded-md bg-blue-800 text-base font-bold text-white transition hover:bg-blue-900"
              >
                Enviar enlace
              </button>
            </form>

            {/* VOLVER */}
            <div className="mt-5 text-center">
              <Link
                to="/login"
                className="text-base font-bold text-slate-950 hover:text-blue-800"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </div>

          {/* FOOTER */}
          <p className="text-center text-xs text-slate-500">
            Sistema de Generación Óptima de Horarios Académicos
          </p>
        </section>

        {/* IMAGEN */}
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
