import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter";
import CrearEstudiante from "../../pages/admin/CrearEstudiante";

vi.mock("../../api/admin/estudiantesApi.js", () => ({
  crearEstudiante: vi.fn(),

  // Tu componente usa este:
  obtenerProgramas: vi.fn(),

  // Lo dejo por compatibilidad, por si otro componente lo usa:
  listarProgramas: vi.fn(),
}));

import {
  crearEstudiante,
  obtenerProgramas,
  listarProgramas,
} from "../../api/admin/estudiantesApi.js";

describe("Formulario Crear Estudiante", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const programasMock = [
      {
        id: 1,
        nombre: "Ingeniería de Sistemas",
      },
    ];

    obtenerProgramas.mockResolvedValue(programasMock);
    listarProgramas.mockResolvedValue(programasMock);

    crearEstudiante.mockResolvedValue({
      id: 100,
      nombre_completo: "Estudiante Temporal",
      correo: "temporal@test.com",
      numero_identificacion: "99999999",
      telefono: "987654321",
      direccion: "Dirección temporal",
      programa_id: 1,
    });
  });

  test("TDD-04: debe mostrar los campos principales del estudiante", async () => {
    const { container } = renderWithRouter(<CrearEstudiante />);

    expect(
      await screen.findByText(/crear estudiante|agregar estudiante/i)
    ).toBeInTheDocument();

    expect(container.querySelector('input[name="nombre_completo"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="correo"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="contrasena"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="numero_identificacion"]')).toBeInTheDocument();
    expect(container.querySelector('select[name="programa_id"]')).toBeInTheDocument();

    expect(
      await screen.findByRole("option", { name: /ingeniería de sistemas/i })
    ).toBeInTheDocument();
  });

  test("TDD-05: debe registrar estudiante usando datos temporales mockeados", async () => {
    const user = userEvent.setup();

    const { container } = renderWithRouter(<CrearEstudiante />);

    const inputNombre = container.querySelector('input[name="nombre_completo"]');
    const inputCorreo = container.querySelector('input[name="correo"]');
    const inputContrasena = container.querySelector('input[name="contrasena"]');
    const inputIdentificacion = container.querySelector(
      'input[name="numero_identificacion"]'
    );
    const inputTelefono = container.querySelector('input[name="telefono"]');
    const inputDireccion = container.querySelector('input[name="direccion"]');
    const selectPrograma = container.querySelector('select[name="programa_id"]');

    await user.type(inputNombre, "Estudiante Temporal");
    await user.type(inputCorreo, "temporal@test.com");
    await user.type(inputContrasena, "123456");
    await user.type(inputIdentificacion, "99999999");
    await user.type(inputTelefono, "987654321");
    await user.type(inputDireccion, "Dirección temporal");

    await screen.findByRole("option", {
      name: /ingeniería de sistemas/i,
    });

    await user.selectOptions(selectPrograma, "1");

    await user.click(
      screen.getByRole("button", {
        name: /guardar estudiante/i,
      })
    );

    await waitFor(() => {
      expect(crearEstudiante).toHaveBeenCalledTimes(1);
    });

    expect(crearEstudiante).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre_completo: "Estudiante Temporal",
        correo: "temporal@test.com",
        contrasena: "123456",
        numero_identificacion: "99999999",
        telefono: "987654321",
        direccion: "Dirección temporal",
      })
    );
  });
});