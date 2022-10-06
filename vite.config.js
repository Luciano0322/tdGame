import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3003,
  },
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      }
    }
  }
})