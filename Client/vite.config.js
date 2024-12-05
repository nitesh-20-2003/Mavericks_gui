import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all Express API routes to the Express server
      "/api": {
        target: "http://localhost:5100/api", // Express server running on port 5100
        changeOrigin: true, // Ensures proper handling of CORS
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: removes '/api' from the path before forwarding to Express
      },
      // Proxy all Flask video routes to the Flask server
      "/video": {
        target: "http://localhost:5000", // Flask server running on port 5000
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/video/, "/video"), // Optional: retain '/video' path prefix
      },
      // Proxy all Flask AI routes to the Flask server
      "/ai": {
        target: "http://localhost:5000", // Flask server running on port 5000
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, "/ai"), // Optional: retain '/ai' path prefix
      },
    },
  },
});
