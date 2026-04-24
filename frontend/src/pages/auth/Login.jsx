import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Por ahora no hay backend.
    // Cualquier dato redirige al layout del alumno.
    if (form.email.trim() && form.password.trim()) {
      navigate("/student");
    } else {
      alert("Completa los campos");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Iniciar sesión</h1>
        <p>Prueba temporal sin conexión a datos</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;