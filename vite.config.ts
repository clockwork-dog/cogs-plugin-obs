import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "./build/dog.clockwork.obs",
    emptyOutDir: true,
  },
});
