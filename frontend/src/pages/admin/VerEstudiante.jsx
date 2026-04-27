import { useParams, useNavigate } from "react-router-dom";

function VerEstudiante() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <section>
      <h2>Detalle del Estudiante</h2>

      <p>ID del estudiante: {id}</p>

      <button onClick={() => navigate("/admin/estudiantes")}>
        Volver
      </button>
    </section>
  );
}

export default VerEstudiante;