import { useParams, useNavigate } from "react-router-dom";

function EditarEstudiante() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí luego conectarás con tu API
    console.log("Editando estudiante con ID:", id);

    navigate("/admin/estudiantes");
  };

  return (
    <section>
      <h2>Editar Estudiante</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre completo</label>
          <input type="text" placeholder="Nombre completo" />
        </div>

        <div>
          <label>Correo</label>
          <input type="email" placeholder="Correo electrónico" />
        </div>

        <div>
          <label>Programa</label>
          <input type="text" placeholder="Programa académico" />
        </div>

        <button type="submit">Guardar cambios</button>

        <button
          type="button"
          onClick={() => navigate("/admin/estudiantes")}
        >
          Cancelar
        </button>
      </form>
    </section>
  );
}

export default EditarEstudiante;