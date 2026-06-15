import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AppRoutes from "../../../src/routes/AppRoutes";

export function renderApp(route = "/") {
  // Esta ayuda monta el enrutador real para probar flujos completos del frontend.
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

export function renderWithRouter(ui, route = "/") {
  // Esta ayuda monta un componente aislado dentro de un router liviano.
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>,
  );
}
