import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/pb": {
        target: "http://127.0.0.1:8090",
        rewrite: (path) => path.replace(/^\/pb/, ""),
        changeOrigin: true,
      },
    },
  },
});
