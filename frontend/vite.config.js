import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5174,
    host: true,                // expose on LAN for mobile testing
    strictPort: false,
  },

  preview: {
    port: 5174,
    host: true,
  },

  build: {
    target: "es2019",
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,   // shaves build time
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Long-lived vendor splits = better browser cache hit rate.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-router"))  return "router";
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/"))
                                            return "react";
          if (id.includes("axios"))         return "axios";
          if (id.includes("sonner"))        return "sonner";
          if (id.includes("lucide-react"))  return "icons";
          return "vendor";
        },
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
});
