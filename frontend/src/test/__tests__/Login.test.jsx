import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter";
import Login from "../../pages/auth/Login";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../api/authApi.js", () => ({
  loginUsuario: vi.fn(),
  login: vi.fn(),
  iniciarSesion: vi.fn(),
}));

vi.mock("../../api/apiClient.js", () => ({
  apiRequest: vi.fn(),
}));

import {
  loginUsuario,
  login,
  iniciarSesion,
} from "../../api/authApi.js";

import { apiRequest } from "../../api/apiClient.js";

describe("Página Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    const respuestaLogin = {
      mensaje: "Login correcto",
      usuario: {
        id: 1,
        correo: "admin@test.com",
        rol: "ADMIN",
      },
      token: "token-temporal",
    };

    loginUsuario.mockResolvedValue(respuestaLogin);
    login.mockResolvedValue(respuestaLogin);
    iniciarSesion.mockResolvedValue(respuestaLogin);
    apiRequest.mockResolvedValue(respuestaLogin);
  });

  test("TDD-01: debe mostrar el formulario de inicio de sesión", () => {
    renderWithRouter(<Login />);

    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/usuario@correo.com/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/ingrese su contraseña/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  test("TDD-02: debe permitir escribir correo y contraseña", async () => {
    const user = userEvent.setup();

    renderWithRouter(<Login />);

    const correo = screen.getByPlaceholderText(/usuario@correo.com/i);
    const contrasena = screen.getByPlaceholderText(/ingrese su contraseña/i);

    await user.type(correo, "admin@test.com");
    await user.type(contrasena, "123456");

    expect(correo).toHaveValue("admin@test.com");
    expect(contrasena).toHaveValue("123456");
  });

  test("TDD-03: si el usuario es ADMIN debe redirigir al dashboard admin", async () => {
    const user = userEvent.setup();

    renderWithRouter(<Login />);

    await user.type(
      screen.getByPlaceholderText(/usuario@correo.com/i),
      "admin@test.com"
    );

    await user.type(
      screen.getByPlaceholderText(/ingrese su contraseña/i),
      "123456"
    );

    await user.click(
      screen.getByRole("button", { name: /iniciar sesión/i })
    );

    await waitFor(() => {
      const llamadasLogin =
        loginUsuario.mock.calls.length +
        login.mock.calls.length +
        iniciarSesion.mock.calls.length +
        apiRequest.mock.calls.length;

      expect(llamadasLogin).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(localStorage.getItem("usuario")).not.toBeNull();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });
});