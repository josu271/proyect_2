import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

export const server = setupServer();

export function startMockServer() {
  beforeAll(() => {
    // Encendemos MSW una sola vez para interceptar fetch reales del frontend.
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    // Reseteamos handlers para que una prueba no ensucie a la siguiente.
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });
}
