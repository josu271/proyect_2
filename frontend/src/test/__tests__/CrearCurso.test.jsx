import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter";
import CrearCurso from "../../pages/admin/CrearCurso";

vi.mock("../../api/admin/cursosApi.js", () => ({
  crearCurso: vi.fn(),
  obtenerProgramasCursos: vi.fn(),

  // Los dejo por si otros componentes los usan,
  // pero para este formulario parece que no son necesarios.
  listarProgramas: vi.fn(),
  listarDocentes: vi.fn(),
}));

import {
  crearCurso,
  obtenerProgramasCursos,
  listarProgramas,
  listarDocentes,
} from "../../api/admin/cursosApi.js";

describe("Formulario Crear Curso", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const programasMock = [
      {
        id: 1,
        nombre: "Ingeniería de Sistemas",
      },
    ];

    obtenerProgramasCursos.mockResolvedValue(programasMock);
    listarProgramas.mockResolvedValue(programasMock);

    listarDocentes.mockResolvedValue([
      {
        id: 1,
        nombre_completo: "Docente Temporal",
      },
    ]);

    crearCurso.mockResolvedValue({
      id: 20,
      codigo: "TEST101",
      nombre: "Curso Temporal",
      creditos: 3,
      nivel: 1,
      programa_id: 1,
      descripcion: "Curso de prueba temporal",
    });
  });

  test("TDD-08: debe mostrar formulario de curso", async () => {
    const { container } = renderWithRouter(<CrearCurso />);

    expect(
      await screen.findByText(/crear curso|agregar curso/i)
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/ej: mat101/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nombre del curso/i)).toBeInTheDocument();

    expect(container.querySelector('input[name="creditos"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="nivel"]')).toBeInTheDocument();
    expect(container.querySelector('select[name="programa_id"]')).toBeInTheDocument();

    expect(
      await screen.findByRole("option", { name: /ingeniería de sistemas/i })
    ).toBeInTheDocument();
  });

  test("TDD-09: debe crear curso con datos temporales", async () => {
    const user = userEvent.setup();

    const { container } = renderWithRouter(<CrearCurso />);

    const inputCodigo = screen.getByPlaceholderText(/ej: mat101/i);
    const inputNombre = screen.getByPlaceholderText(/nombre del curso/i);
    const inputCreditos = container.querySelector('input[name="creditos"]');
    const inputNivel = container.querySelector('input[name="nivel"]');
    const selectPrograma = container.querySelector('select[name="programa_id"]');
    const inputDescripcion = screen.getByPlaceholderText(/descripción del curso/i);

    await screen.findByRole("option", { name: /ingeniería de sistemas/i });

    await user.type(inputCodigo, "TEST101");
    await user.type(inputNombre, "Curso Temporal");
    await user.clear(inputCreditos);
    await user.type(inputCreditos, "3");

    await user.clear(inputNivel);
    await user.type(inputNivel, "1");

    await user.selectOptions(selectPrograma, "1");
    await user.type(inputDescripcion, "Curso de prueba temporal");

    await user.click(
      screen.getByRole("button", { name: /guardar curso/i })
    );

    expect(crearCurso).toHaveBeenCalledTimes(1);

    expect(crearCurso).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: "TEST101",
        nombre: "Curso Temporal",
        creditos: 3,
        nivel: 1,
        programa_id: 1,
        descripcion: "Curso de prueba temporal",
      })
    );
  });
});