import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      port: 8080,
      proxy: {
        "/api": {
          target: process.env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
});
