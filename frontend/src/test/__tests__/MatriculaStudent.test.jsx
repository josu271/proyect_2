import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter";
import MatriculaStudent from "../../pages/student/Matriculasestudiante";

vi.mock("../../api/student/matriculaApi.js", () => ({
  obtenerCursosDisponiblesMatricula: vi.fn(),
  listarCursosDisponibles: vi.fn(),

  matricularCurso: vi.fn(),
  confirmarMatricula: vi.fn(),
  registrarMatricula: vi.fn(),
  crearMatricula: vi.fn(),
  confirmarCursosMatricula: vi.fn(),
}));

import * as matriculaApi from "../../api/student/matriculaApi.js";

describe("Página Matrícula Estudiante", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.alert = vi.fn();

    localStorage.setItem(
      "usuario",
      JSON.stringify({
        id: 3,
        estudiante_id: 3,
        estudianteId: 3,
        rol: "ESTUDIANTE",
        correo: "75473846@gmail.com",
      })
    );

    const cursosMock = [
      {
        id: 10,
        seccion_id: 10,
        seccion_curso_id: 10,

        curso: "Matemática I",
        nombre: "Matemática I",
        nombre_curso: "Matemática I",

        codigo: "MAT101",
        curso_codigo: "MAT101",

        docente: "Juan Perez",
        nombre_docente: "Juan Perez",

        aula: "A101",
        dia_semana: 1,
        dia: 1,
        hora_inicio: "08:00",
        hora_fin: "09:30",
        creditos: 3,
      },
      {
        id: 11,
        seccion_id: 11,
        seccion_curso_id: 11,

        curso: "Programación I",
        nombre: "Programación I",
        nombre_curso: "Programación I",

        codigo: "PRO101",
        curso_codigo: "PRO101",

        docente: "Maria Lopez",
        nombre_docente: "Maria Lopez",

        aula: "A102",
        dia_semana: 2,
        dia: 2,
        hora_inicio: "08:00",
        hora_fin: "09:30",
        creditos: 4,
      },
    ];

    matriculaApi.obtenerCursosDisponiblesMatricula.mockResolvedValue(cursosMock);
    matriculaApi.listarCursosDisponibles.mockResolvedValue(cursosMock);

    const respuestaMock = {
      mensaje: "Matrícula registrada correctamente",
      estado: "MATRICULADO",
    };

    matriculaApi.matricularCurso.mockResolvedValue(respuestaMock);
    matriculaApi.confirmarMatricula.mockResolvedValue(respuestaMock);
    matriculaApi.registrarMatricula.mockResolvedValue(respuestaMock);
    matriculaApi.crearMatricula.mockResolvedValue(respuestaMock);
    matriculaApi.confirmarCursosMatricula.mockResolvedValue(respuestaMock);
  });

  test("TDD-12: debe mostrar cursos disponibles para matrícula", async () => {
    renderWithRouter(<MatriculaStudent />);

    expect(
      await screen.findByText(/matemática i/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/programación i/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/mat101/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/pro101/i)
    ).toBeInTheDocument();
  });

  test("TDD-13: debe seleccionar y confirmar matrícula usando mock temporal", async () => {
    const user = userEvent.setup();

    renderWithRouter(<MatriculaStudent />);

    expect(
      await screen.findByText(/matemática i/i)
    ).toBeInTheDocument();

    const botonesSeleccion =
      screen.queryAllByRole("button", {
        name: /seleccionar|agregar|matricular|inscribir/i,
      });

    expect(botonesSeleccion.length).toBeGreaterThan(0);

    await user.click(botonesSeleccion[0]);

    const botonConfirmar = screen.getByRole("button", {
      name: /confirmar matrícula/i,
    });

    expect(botonConfirmar).not.toBeDisabled();

    await user.click(botonConfirmar);

    await waitFor(() => {
      const totalLlamadas =
        matriculaApi.matricularCurso.mock.calls.length +
        matriculaApi.confirmarMatricula.mock.calls.length +
        matriculaApi.registrarMatricula.mock.calls.length +
        matriculaApi.crearMatricula.mock.calls.length +
        matriculaApi.confirmarCursosMatricula.mock.calls.length;

      expect(totalLlamadas).toBeGreaterThan(0);
    });
  });
});