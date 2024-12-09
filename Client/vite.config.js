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
     
      "/video": {
        target: "http://localhost:5000", 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/video/, "/video"), // 
      },
     
      "/ai": {
        target: "http://localhost:5000", 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, "/ai"), // Optional: retain '/ai' path prefix
      }
    },
  },
});
