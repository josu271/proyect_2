import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  // Dejamos limpio el DOM y la sesion para que cada prueba arranque de cero.
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

if (!window.scrollTo) {
  // Algunos modulos hacen scroll al editar o recargar vistas.
  window.scrollTo = vi.fn();
}

if (!window.print) {
  // El horario del estudiante expone esta accion para exportar a PDF.
  window.print = vi.fn();
}

// Las pruebas que quitan horarios o cancelan secciones usan esta confirmacion.
Object.defineProperty(window, "confirm", {
  writable: true,
  value: vi.fn(() => true),
});

if (!window.matchMedia) {
  // Este mock evita fallos cuando un componente consulta media queries.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
