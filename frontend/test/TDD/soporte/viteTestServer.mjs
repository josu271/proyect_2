import { after, before } from "node:test";
import { createServer } from "vite";

let viteServer;

export function registerViteServer() {
  // Este hook levanta un servidor Vite liviano para importar modulos del frontend.
  before(async () => {
    viteServer = await createServer({
      root: process.cwd(),
      logLevel: "error",
      appType: "custom",
      optimizeDeps: {
        noDiscovery: true,
      },
      server: {
        middlewareMode: true,
        hmr: false,
      },
      define: {
        "import.meta.env.VITE_API_URL": JSON.stringify("http://localhost:8000"),
      },
    });
  });

  // Este hook cierra el servidor de pruebas cuando termina la suite.
  after(async () => {
    if (viteServer) {
      await viteServer.close();
    }
  });
}


export async function loadFrontendModule(modulePath) {
  // Esta funcion deja cargar un modulo real del frontend dentro de una prueba Node.
  if (!viteServer) {
    throw new Error("Vite test server no inicializado.");
  }

  return viteServer.ssrLoadModule(modulePath);
}
