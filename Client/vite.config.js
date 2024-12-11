import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5100/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/py": {
        target: "http://localhost:5102",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/py/, ""), // Remove /api/py prefix
      },
    },
  },
});
