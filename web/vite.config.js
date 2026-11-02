import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

//TODO: add aliases support for better code readability
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const apiTarget = env.VITE_API_URL || "http://localhost:3000";

  return {
    plugins: [react()],
    build: {
      cssMinify: false,
    },
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/avatars": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
