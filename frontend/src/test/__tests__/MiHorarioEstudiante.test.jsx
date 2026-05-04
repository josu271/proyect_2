import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "../renderWithRouter";
import MiHorarioEstudiante from "../../pages/student/MiHorariosestudiante";

vi.mock("../../api/student/horarioApi.js", () => ({
  obtenerHorarioEstudiante: vi.fn(),
  obtenerMiHorarioEstudiante: vi.fn(),
  obtenerHorarioSemanalEstudiante: vi.fn(),
}));

import * as horarioApi from "../../api/student/horarioApi.js";

describe("Página Mi Horario Estudiante", () => {
  beforeEach(() => {
    vi.clearAllMocks();

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
  });

  test("TDD-14: debe mostrar horario semanal con cursos matriculados", async () => {
    const horarioMock = [
      {
        curso: "Matemática I",
        nombre_curso: "Matemática I",
        docente: "Juan Perez",
        nombre_docente: "Juan Perez",
        aula: "A101",
        dia_semana: 1,
        dia: 1,
        hora_inicio: "08:00",
        hora_fin: "09:30",
      },
    ];

    horarioApi.obtenerHorarioEstudiante.mockResolvedValue(horarioMock);
    horarioApi.obtenerMiHorarioEstudiante.mockResolvedValue(horarioMock);
    horarioApi.obtenerHorarioSemanalEstudiante.mockResolvedValue(horarioMock);

    renderWithRouter(<MiHorarioEstudiante />);

    expect(
      await screen.findByText(/mi horario semanal/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/matemática i/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/juan perez/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/a101/i)
    ).toBeInTheDocument();
  });

  test("TDD-15: si no hay horario debe mostrar celdas libres", async () => {
    horarioApi.obtenerHorarioEstudiante.mockResolvedValue([]);
    horarioApi.obtenerMiHorarioEstudiante.mockResolvedValue([]);
    horarioApi.obtenerHorarioSemanalEstudiante.mockResolvedValue([]);

    renderWithRouter(<MiHorarioEstudiante />);

    expect(
      await screen.findByText(/mi horario semanal/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: /^hora$/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: /^lunes$/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: /^martes$/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: /^miércoles$/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: /^jueves$/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: /^viernes$/i })
    ).toBeInTheDocument();

    const celdasLibres = screen.getAllByText(/libre/i);

    expect(celdasLibres.length).toBeGreaterThan(0);
  });
});