import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1440,
  viewportHeight: 900,
  video: true,
  screenshotsFolder: "test/artifacts/screenshots",
  videosFolder: "test/artifacts/videos",
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "test/{Aceptacion,E2E}/**/*.cy.{js,jsx}",
    supportFile: "test/support/cypress/e2e.js",
  },
});
