import { after, before } from "node:test";
import { createServer } from "vite";


let viteServer;

export function registerViteServer() {
  before(async () => {
    viteServer = await createServer({
      root: process.cwd(),
      logLevel: "error",
      appType: "custom",
      server: {
        middlewareMode: true,
      },
      define: {
        "import.meta.env.VITE_API_URL": JSON.stringify("http://localhost:8000"),
      },
    });
  });

  after(async () => {
    if (viteServer) {
      await viteServer.close();
    }
  });
}


export async function loadFrontendModule(modulePath) {
  if (!viteServer) {
    throw new Error("Vite test server no inicializado.");
  }

  return viteServer.ssrLoadModule(modulePath);
}
