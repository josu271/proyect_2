import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify("http://127.0.0.1:8000"),
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/support/vitest/setup.js"],
    include: [
      "test/**/*.test.js",
      "test/**/*.test.jsx",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "test/artifacts/coverage",
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/main.jsx"],
    },
  },
});
