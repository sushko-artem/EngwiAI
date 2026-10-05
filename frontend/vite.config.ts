/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: false, quality: 75 },
      avif: { quality: 50 },
      svg: { multipass: true },
      logStats: true,
    }),
  ],
  build: {
    outDir: "dist",
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    port: 3000,
    strictPort: true,
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },
  optimizeDeps: {
    include: [
      "@reduxjs/toolkit",
      "@reduxjs/toolkit/query",
      "@reduxjs/toolkit/query/react",
      "react-redux",
      "react-router-dom",
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
