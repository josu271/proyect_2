import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter";
import CrearDocente from "../../pages/admin/CrearDocente";

vi.mock("../../api/admin/docentesApi.js", () => ({
  crearDocente: vi.fn(),
}));

import { crearDocente } from "../../api/admin/docentesApi.js";

describe("Formulario Crear Docente", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    crearDocente.mockResolvedValue({
      id: 50,
      nombre_completo: "Docente Temporal",
      correo: "docente@test.com",
      numero_identificacion: "99999999",
      telefono: "987654321",
      especialidad: "Programación",
    });
  });

  test("TDD-06: debe mostrar campos para crear docente", () => {
    const { container } = renderWithRouter(<CrearDocente />);

    expect(
      screen.getByText(/crear docente|agregar docente/i)
    ).toBeInTheDocument();

    expect(container.querySelector('input[name="correo"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="contrasena"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="nombre_completo"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="numero_identificacion"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="telefono"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="especialidad"]')).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /guardar docente/i })
    ).toBeInTheDocument();
  });

  test("TDD-07: debe llamar a crearDocente sin tocar la base de datos real", async () => {
    const user = userEvent.setup();

    const { container } = renderWithRouter(<CrearDocente />);

    const inputCorreo = container.querySelector('input[name="correo"]');
    const inputContrasena = container.querySelector('input[name="contrasena"]');
    const inputNombre = container.querySelector('input[name="nombre_completo"]');
    const inputIdentificacion = container.querySelector(
      'input[name="numero_identificacion"]'
    );
    const inputTelefono = container.querySelector('input[name="telefono"]');
    const inputEspecialidad = container.querySelector('input[name="especialidad"]');

    await user.type(inputCorreo, "docente@test.com");
    await user.type(inputContrasena, "123456");
    await user.type(inputNombre, "Docente Temporal");
    await user.type(inputIdentificacion, "99999999");
    await user.type(inputTelefono, "987654321");
    await user.type(inputEspecialidad, "Programación");

    await user.click(
      screen.getByRole("button", { name: /guardar docente/i })
    );

    await waitFor(() => {
      expect(crearDocente).toHaveBeenCalledTimes(1);
    });

    expect(crearDocente).toHaveBeenCalledWith(
      expect.objectContaining({
        correo: "docente@test.com",
        contrasena: "123456",
        nombre_completo: "Docente Temporal",
        numero_identificacion: "99999999",
        telefono: "987654321",
        especialidad: "Programación",
      })
    );
  });
});