// vite.config.ts
import { defineConfig, loadEnv } from "file:///home/dominus/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/node_modules/.pnpm/vite@5.4.19_@types+node@22.17.0_terser@5.43.1/node_modules/vite/dist/node/index.js";
import react from "file:///home/dominus/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.19_@types+node@22.17.0_terser@5.43.1_/node_modules/@vitejs/plugin-react/dist/index.js";
import { visualizer } from "file:///home/dominus/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/node_modules/.pnpm/rollup-plugin-visualizer@6.0.3_rollup@2.79.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { VitePWA } from "file:///home/dominus/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/node_modules/.pnpm/vite-plugin-pwa@1.0.2_vite@5.4.19_@types+node@22.17.0_terser@5.43.1__workbox-build@7.3.0_@typ_7qgcaes6iy27sn5t3fdh3jzwqy/node_modules/vite-plugin-pwa/dist/index.js";
import compression from "file:///home/dominus/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.4.19_@types+node@22.17.0_terser@5.43.1_/node_modules/vite-plugin-compression/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/dominus/SOCLE_CODEX_SACRE/E-Commerce Platforme/apps/welcome-app";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";
  const isDevelopment = mode === "development";
  return {
    // Base public path when served in production
    base: isProduction ? "/welcome-app/" : "/",
    // Development server configuration
    server: {
      host: true,
      // Listen on all network interfaces
      port: 3e3,
      strictPort: true,
      open: !process.env.CI,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
          secure: false,
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      }
    },
    // Build configuration
    build: {
      target: "esnext",
      minify: isProduction ? "esbuild" : false,
      sourcemap: isProduction ? "hidden" : true,
      cssCodeSplit: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("@radix-ui")) {
                return "vendor-radix";
              }
              if (id.includes("react") || id.includes("react-dom")) {
                return "vendor-react";
              }
              return "vendor";
            }
          }
        }
      },
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    // Plugins
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"]
        }
      }),
      // Visualize bundle size
      isProduction && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
      // PWA support
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
        manifest: {
          name: "E-Commerce Welcome App",
          short_name: "Welcome App",
          description: "Welcome to our E-Commerce Platform",
          theme_color: "#ffffff",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png"
            }
          ]
        }
      }),
      // Gzip and Brotli compression
      isProduction && compression({
        ext: ".gz",
        algorithm: "gzip",
        threshold: 10240
      }),
      isProduction && compression({
        ext: ".br",
        algorithm: "brotliCompress",
        threshold: 10240
      })
      // Font optimization (using CSS @import instead of plugin)
      // This is a more lightweight approach that works with Vite 5
    ].filter(Boolean),
    // Resolve configuration
    resolve: {
      alias: {
        "@ui-core": path.resolve(__vite_injected_original_dirname, "../../packages/ui-core"),
        "@services": path.resolve(__vite_injected_original_dirname, "../../packages/services"),
        "@shared": path.resolve(__vite_injected_original_dirname, "../../packages/shared"),
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".css", ".scss"]
    },
    // CSS configuration
    css: {
      devSourcemap: isDevelopment,
      modules: {
        generateScopedName: isDevelopment ? "[name]__[local]__[hash:base64:5]" : "[hash:base64:5]"
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/_variables.scss";
            @import "@/styles/_mixins.scss";
          `
        }
      }
    },
    // Environment variables
    define: {
      "process.env": {},
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
      exclude: ["js-big-decimal"]
    },
    // Development-specific settings
    ...isDevelopment && {
      logLevel: "info",
      clearScreen: false
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kb21pbnVzL1NPQ0xFX0NPREVYX1NBQ1JFL0UtQ29tbWVyY2UgUGxhdGZvcm1lL2FwcHMvd2VsY29tZS1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2RvbWludXMvU09DTEVfQ09ERVhfU0FDUkUvRS1Db21tZXJjZSBQbGF0Zm9ybWUvYXBwcy93ZWxjb21lLWFwcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kb21pbnVzL1NPQ0xFX0NPREVYX1NBQ1JFL0UtQ29tbWVyY2UlMjBQbGF0Zm9ybWUvYXBwcy93ZWxjb21lLWFwcC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gTG9hZCBlbnYgdmFyaWFibGVzIGJhc2VkIG9uIGBtb2RlYFxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgXG4gIGNvbnN0IGlzUHJvZHVjdGlvbiA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJztcbiAgY29uc3QgaXNEZXZlbG9wbWVudCA9IG1vZGUgPT09ICdkZXZlbG9wbWVudCc7XG4gIFxuICByZXR1cm4ge1xuICAgIC8vIEJhc2UgcHVibGljIHBhdGggd2hlbiBzZXJ2ZWQgaW4gcHJvZHVjdGlvblxuICAgIGJhc2U6IGlzUHJvZHVjdGlvbiA/ICcvd2VsY29tZS1hcHAvJyA6ICcvJyxcbiAgICBcbiAgICAvLyBEZXZlbG9wbWVudCBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogdHJ1ZSwgLy8gTGlzdGVuIG9uIGFsbCBuZXR3b3JrIGludGVyZmFjZXNcbiAgICAgIHBvcnQ6IDMwMDAsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgb3BlbjogIXByb2Nlc3MuZW52LkNJLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUElfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwMDAnLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgXG4gICAgLy8gQnVpbGQgY29uZmlndXJhdGlvblxuICAgIGJ1aWxkOiB7XG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgICAgbWluaWZ5OiBpc1Byb2R1Y3Rpb24gPyAnZXNidWlsZCcgOiBmYWxzZSxcbiAgICAgIHNvdXJjZW1hcDogaXNQcm9kdWN0aW9uID8gJ2hpZGRlbicgOiB0cnVlLFxuICAgICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGZhbHNlLFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNjAwLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0ByYWRpeC11aScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItcmFkaXgnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3QnKSB8fCBpZC5pbmNsdWRlcygncmVhY3QtZG9tJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1yZWFjdCc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIFxuICAgIC8vIFBsdWdpbnNcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCh7XG4gICAgICAgIGpzeEltcG9ydFNvdXJjZTogJ0BlbW90aW9uL3JlYWN0JyxcbiAgICAgICAgYmFiZWw6IHtcbiAgICAgICAgICBwbHVnaW5zOiBbJ0BlbW90aW9uL2JhYmVsLXBsdWdpbiddLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBcbiAgICAgIC8vIFZpc3VhbGl6ZSBidW5kbGUgc2l6ZVxuICAgICAgaXNQcm9kdWN0aW9uICYmIHZpc3VhbGl6ZXIoe1xuICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgICAgXG4gICAgICAvLyBQV0Egc3VwcG9ydFxuICAgICAgVml0ZVBXQSh7XG4gICAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uaWNvJywgJ3JvYm90cy50eHQnLCAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnXSxcbiAgICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgICBuYW1lOiAnRS1Db21tZXJjZSBXZWxjb21lIEFwcCcsXG4gICAgICAgICAgc2hvcnRfbmFtZTogJ1dlbGNvbWUgQXBwJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1dlbGNvbWUgdG8gb3VyIEUtQ29tbWVyY2UgUGxhdGZvcm0nLFxuICAgICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiAncHdhLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgXG4gICAgICAvLyBHemlwIGFuZCBCcm90bGkgY29tcHJlc3Npb25cbiAgICAgIGlzUHJvZHVjdGlvbiAmJiBjb21wcmVzc2lvbih7XG4gICAgICAgIGV4dDogJy5neicsXG4gICAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwMjQwLFxuICAgICAgfSksXG4gICAgICBcbiAgICAgIGlzUHJvZHVjdGlvbiAmJiBjb21wcmVzc2lvbih7XG4gICAgICAgIGV4dDogJy5icicsXG4gICAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0MCxcbiAgICAgIH0pLFxuICAgICAgXG4gICAgICAvLyBGb250IG9wdGltaXphdGlvbiAodXNpbmcgQ1NTIEBpbXBvcnQgaW5zdGVhZCBvZiBwbHVnaW4pXG4gICAgICAvLyBUaGlzIGlzIGEgbW9yZSBsaWdodHdlaWdodCBhcHByb2FjaCB0aGF0IHdvcmtzIHdpdGggVml0ZSA1XG4gICAgXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgXG4gICAgLy8gUmVzb2x2ZSBjb25maWd1cmF0aW9uXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0B1aS1jb3JlJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3BhY2thZ2VzL3VpLWNvcmUnKSxcbiAgICAgICAgJ0BzZXJ2aWNlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9wYWNrYWdlcy9zZXJ2aWNlcycpLFxuICAgICAgICAnQHNoYXJlZCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9wYWNrYWdlcy9zaGFyZWQnKSxcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIH0sXG4gICAgICBleHRlbnNpb25zOiBbJy5tanMnLCAnLmpzJywgJy50cycsICcuanN4JywgJy50c3gnLCAnLmpzb24nLCAnLmNzcycsICcuc2NzcyddLFxuICAgIH0sXG4gICAgXG4gICAgLy8gQ1NTIGNvbmZpZ3VyYXRpb25cbiAgICBjc3M6IHtcbiAgICAgIGRldlNvdXJjZW1hcDogaXNEZXZlbG9wbWVudCxcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgZ2VuZXJhdGVTY29wZWROYW1lOiBpc0RldmVsb3BtZW50XG4gICAgICAgICAgPyAnW25hbWVdX19bbG9jYWxdX19baGFzaDpiYXNlNjQ6NV0nXG4gICAgICAgICAgOiAnW2hhc2g6YmFzZTY0OjVdJyxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYFxuICAgICAgICAgICAgQGltcG9ydCBcIkAvc3R5bGVzL192YXJpYWJsZXMuc2Nzc1wiO1xuICAgICAgICAgICAgQGltcG9ydCBcIkAvc3R5bGVzL19taXhpbnMuc2Nzc1wiO1xuICAgICAgICAgIGAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgXG4gICAgLy8gRW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAgZGVmaW5lOiB7XG4gICAgICAncHJvY2Vzcy5lbnYnOiB7fSxcbiAgICAgIF9fQVBQX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYubnBtX3BhY2thZ2VfdmVyc2lvbiksXG4gICAgfSxcbiAgICBcbiAgICAvLyBPcHRpbWl6ZSBkZXBlbmRlbmNpZXNcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgIGV4Y2x1ZGU6IFsnanMtYmlnLWRlY2ltYWwnXSxcbiAgICB9LFxuICAgIFxuICAgIC8vIERldmVsb3BtZW50LXNwZWNpZmljIHNldHRpbmdzXG4gICAgLi4uKGlzRGV2ZWxvcG1lbnQgJiYge1xuICAgICAgbG9nTGV2ZWw6ICdpbmZvJyxcbiAgICAgIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgICB9KSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtWSxTQUFTLGNBQWMsZUFBZTtBQUN6YSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUyxlQUFlO0FBQ3hCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sVUFBVTtBQUxqQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEs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
