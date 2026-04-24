import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function ForgotPassword() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 flex justify-center">
          <img
            src={logo}
            alt="Logo del sistema"
            className="h-20 w-auto object-contain"
          />
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Recuperar contraseña
        </h1>

        <p className="mb-8 text-center text-sm text-gray-500">
          Ingresa tu correo y te enviaremos instrucciones para restablecer tu acceso.
        </p>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@correo.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Enviar instrucciones
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-blue-800 hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;