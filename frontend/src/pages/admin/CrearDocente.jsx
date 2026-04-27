import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearDocente } from "../../api/admin/docentesApi";

function CrearDocente() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "",
    contrasena: "",
    nombre_completo: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await crearDocente(form);

    navigate("/admin/docentes");
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Crear docente</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="correo" placeholder="Correo" onChange={handleChange} />
        <input
          name="contrasena"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />
        <input
          name="nombre_completo"
          placeholder="Nombre completo"
          onChange={handleChange}
        />

        <button className="bg-blue-700 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </section>
  );
}

export default CrearDocente;