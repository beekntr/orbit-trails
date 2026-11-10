import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
    // Lets scripts/prerender.mjs add <link rel="modulepreload"> for each page's chunk.
    manifest: true,
    rollupOptions: {
      output: {
        // Libraries change far less often than app code. Keeping them in their
        // own files means returning visitors re-download only what changed.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("lucide-react")) return "icons";
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return "motion";
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(id)) {
            return "react";
          }
          return undefined;
        },
      },
    },
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to handle all requests
      // Express app will handle API routes and pass through others
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api')) {
          (app as any)(req, res, next);
        } else {
          next();
        }
      });
    },
  };
}
