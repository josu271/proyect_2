import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearDocente } from "../../api/admin/docentesApi";

function CrearDocente() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "",
    contrasena: "",
    nombre_completo: "",
    numero_identificacion: "",
    telefono: "",
    especialidad: "",
  });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      await crearDocente(form);
      navigate("/admin/docentes");
    } catch (err) {
      setError(err.message || "Error al crear docente");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Crear docente</h2>
        <p className="mt-1 text-sm text-slate-500">
          Registra un nuevo docente en el sistema académico.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Campo label="Correo electrónico">
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="docente@gmail.com"
              className="input-admin"
              required
            />
          </Campo>

          <Campo label="Contraseña">
            <input
              type="password"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="Contraseña inicial"
              className="input-admin"
              required
            />
          </Campo>

          <Campo label="Nombre completo">
            <input
              type="text"
              name="nombre_completo"
              value={form.nombre_completo}
              onChange={handleChange}
              placeholder="Nombre completo"
              className="input-admin"
              required
            />
          </Campo>

          <Campo label="Número de identificación">
            <input
              type="text"
              name="numero_identificacion"
              value={form.numero_identificacion}
              onChange={handleChange}
              placeholder="DNI o código"
              className="input-admin"
              required
            />
          </Campo>

          <Campo label="Teléfono">
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="999999999"
              className="input-admin"
            />
          </Campo>

          <Campo label="Especialidad">
            <input
              type="text"
              name="especialidad"
              value={form.especialidad}
              onChange={handleChange}
              placeholder="Ej: Matemática, Programación, Base de Datos"
              className="input-admin"
            />
          </Campo>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => navigate("/admin/docentes")}
            className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar docente"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export default CrearDocente;