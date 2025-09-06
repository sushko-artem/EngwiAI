import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },
});
