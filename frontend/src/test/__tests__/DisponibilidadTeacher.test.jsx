import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter";
import DisponibilidadTeacher from "../../pages/teacher/DisponibilidadTeacher";

vi.mock("../../api/teacher/disponibilidadApi.js", () => ({
  listarDisponibilidades: vi.fn(),
  obtenerDisponibilidades: vi.fn(),
  obtenerDisponibilidadDocente: vi.fn(),

  crearDisponibilidad: vi.fn(),
  registrarDisponibilidad: vi.fn(),
  crearDisponibilidadDocente: vi.fn(),

  listarCursosDocente: vi.fn(),
  obtenerCursosDocente: vi.fn(),
  obtenerMisCursosDocente: vi.fn(),

  listarSemestres: vi.fn(),
  obtenerSemestres: vi.fn(),
}));

import * as disponibilidadApi from "../../api/teacher/disponibilidadApi.js";

describe("Página Disponibilidad Docente", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.alert = vi.fn();

    localStorage.setItem(
      "usuario",
      JSON.stringify({
        id: 1,
        docente_id: 1,
        docenteId: 1,
        rol: "DOCENTE",
      })
    );

    const cursosMock = [
      {
        id: 1,
        curso_id: 1,
        nombre: "Programación I",
        curso: "Programación I",
      },
    ];

    const semestresMock = [
      {
        id: 1,
        semestre_id: 1,
        codigo: "2026-I",
        nombre: "2026-I",
      },
    ];

    disponibilidadApi.listarCursosDocente.mockResolvedValue(cursosMock);
    disponibilidadApi.obtenerCursosDocente.mockResolvedValue(cursosMock);
    disponibilidadApi.obtenerMisCursosDocente.mockResolvedValue(cursosMock);

    disponibilidadApi.listarSemestres.mockResolvedValue(semestresMock);
    disponibilidadApi.obtenerSemestres.mockResolvedValue(semestresMock);

    disponibilidadApi.listarDisponibilidades.mockResolvedValue([]);
    disponibilidadApi.obtenerDisponibilidades.mockResolvedValue([]);
    disponibilidadApi.obtenerDisponibilidadDocente.mockResolvedValue([]);

    const respuestaMock = {
      id: 1,
      docente_id: 1,
      curso_id: 1,
      semestre_id: 1,
      dia_semana: 1,
      hora_inicio: "07:00",
      hora_fin: "08:30",
      disponible: true,
    };

    disponibilidadApi.crearDisponibilidad.mockResolvedValue(respuestaMock);
    disponibilidadApi.registrarDisponibilidad.mockResolvedValue(respuestaMock);
    disponibilidadApi.crearDisponibilidadDocente.mockResolvedValue(respuestaMock);
  });

  test("TDD-10: debe mostrar calendario de disponibilidad docente", async () => {
    renderWithRouter(<DisponibilidadTeacher />);

    expect(
      await screen.findByText(/mi disponibilidad/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/curso/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/semestre/i).length).toBeGreaterThan(0);

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

    expect(
      screen.getAllByRole("button", { name: /seleccionar/i }).length
    ).toBeGreaterThan(0);
  });

  test("TDD-11: debe seleccionar una disponibilidad usando datos temporales", async () => {
    const user = userEvent.setup();

    const { container } = renderWithRouter(<DisponibilidadTeacher />);

    expect(
      await screen.findByText(/mi disponibilidad/i)
    ).toBeInTheDocument();

    const selects = container.querySelectorAll("select");

    expect(selects.length).toBeGreaterThanOrEqual(2);

    const selectCurso = selects[0];
    const selectSemestre = selects[1];

    selectCurso.innerHTML = `
      <option value="">Seleccione un curso</option>
      <option value="1">Programación I</option>
    `;

    selectSemestre.innerHTML = `
      <option value="">Seleccione un semestre</option>
      <option value="1">2026-I</option>
    `;

    fireEvent.change(selectCurso, {
      target: { value: "1" },
    });

    fireEvent.change(selectSemestre, {
      target: { value: "1" },
    });

    const botonesSeleccionar = screen.getAllByRole("button", {
      name: /seleccionar/i,
    });

    await user.click(botonesSeleccionar[0]);

    await waitFor(() => {
      const llamadas =
        disponibilidadApi.crearDisponibilidad.mock.calls.length +
        disponibilidadApi.registrarDisponibilidad.mock.calls.length +
        disponibilidadApi.crearDisponibilidadDocente.mock.calls.length;

      expect(llamadas).toBeGreaterThan(0);
    });
  });
});