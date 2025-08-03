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
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        "~": path.resolve(__vite_injected_original_dirname, "./public"),
        "@shared": path.resolve(__vite_injected_original_dirname, "../../shared")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kb21pbnVzL1NPQ0xFX0NPREVYX1NBQ1JFL0UtQ29tbWVyY2UgUGxhdGZvcm1lL2FwcHMvd2VsY29tZS1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2RvbWludXMvU09DTEVfQ09ERVhfU0FDUkUvRS1Db21tZXJjZSBQbGF0Zm9ybWUvYXBwcy93ZWxjb21lLWFwcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kb21pbnVzL1NPQ0xFX0NPREVYX1NBQ1JFL0UtQ29tbWVyY2UlMjBQbGF0Zm9ybWUvYXBwcy93ZWxjb21lLWFwcC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gTG9hZCBlbnYgdmFyaWFibGVzIGJhc2VkIG9uIGBtb2RlYFxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgXG4gIGNvbnN0IGlzUHJvZHVjdGlvbiA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJztcbiAgY29uc3QgaXNEZXZlbG9wbWVudCA9IG1vZGUgPT09ICdkZXZlbG9wbWVudCc7XG4gIFxuICByZXR1cm4ge1xuICAgIC8vIEJhc2UgcHVibGljIHBhdGggd2hlbiBzZXJ2ZWQgaW4gcHJvZHVjdGlvblxuICAgIGJhc2U6IGlzUHJvZHVjdGlvbiA/ICcvd2VsY29tZS1hcHAvJyA6ICcvJyxcbiAgICBcbiAgICAvLyBEZXZlbG9wbWVudCBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogdHJ1ZSwgLy8gTGlzdGVuIG9uIGFsbCBuZXR3b3JrIGludGVyZmFjZXNcbiAgICAgIHBvcnQ6IDMwMDAsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgb3BlbjogIXByb2Nlc3MuZW52LkNJLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUElfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwMDAnLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgXG4gICAgLy8gQnVpbGQgY29uZmlndXJhdGlvblxuICAgIGJ1aWxkOiB7XG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgICAgbWluaWZ5OiBpc1Byb2R1Y3Rpb24gPyAnZXNidWlsZCcgOiBmYWxzZSxcbiAgICAgIHNvdXJjZW1hcDogaXNQcm9kdWN0aW9uID8gJ2hpZGRlbicgOiB0cnVlLFxuICAgICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGZhbHNlLFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNjAwLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0ByYWRpeC11aScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItcmFkaXgnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3QnKSB8fCBpZC5pbmNsdWRlcygncmVhY3QtZG9tJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1yZWFjdCc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIFxuICAgIC8vIFBsdWdpbnNcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCh7XG4gICAgICAgIGpzeEltcG9ydFNvdXJjZTogJ0BlbW90aW9uL3JlYWN0JyxcbiAgICAgICAgYmFiZWw6IHtcbiAgICAgICAgICBwbHVnaW5zOiBbJ0BlbW90aW9uL2JhYmVsLXBsdWdpbiddLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBcbiAgICAgIC8vIFZpc3VhbGl6ZSBidW5kbGUgc2l6ZVxuICAgICAgaXNQcm9kdWN0aW9uICYmIHZpc3VhbGl6ZXIoe1xuICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgICAgXG4gICAgICAvLyBQV0Egc3VwcG9ydFxuICAgICAgVml0ZVBXQSh7XG4gICAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uaWNvJywgJ3JvYm90cy50eHQnLCAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnXSxcbiAgICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgICBuYW1lOiAnRS1Db21tZXJjZSBXZWxjb21lIEFwcCcsXG4gICAgICAgICAgc2hvcnRfbmFtZTogJ1dlbGNvbWUgQXBwJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1dlbGNvbWUgdG8gb3VyIEUtQ29tbWVyY2UgUGxhdGZvcm0nLFxuICAgICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiAncHdhLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgXG4gICAgICAvLyBHemlwIGFuZCBCcm90bGkgY29tcHJlc3Npb25cbiAgICAgIGlzUHJvZHVjdGlvbiAmJiBjb21wcmVzc2lvbih7XG4gICAgICAgIGV4dDogJy5neicsXG4gICAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwMjQwLFxuICAgICAgfSksXG4gICAgICBcbiAgICAgIGlzUHJvZHVjdGlvbiAmJiBjb21wcmVzc2lvbih7XG4gICAgICAgIGV4dDogJy5icicsXG4gICAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0MCxcbiAgICAgIH0pLFxuICAgICAgXG4gICAgICAvLyBGb250IG9wdGltaXphdGlvbiAodXNpbmcgQ1NTIEBpbXBvcnQgaW5zdGVhZCBvZiBwbHVnaW4pXG4gICAgICAvLyBUaGlzIGlzIGEgbW9yZSBsaWdodHdlaWdodCBhcHByb2FjaCB0aGF0IHdvcmtzIHdpdGggVml0ZSA1XG4gICAgXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgXG4gICAgLy8gUmVzb2x2ZSBjb25maWd1cmF0aW9uXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICAgJ34nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9wdWJsaWMnKSxcbiAgICAgICAgJ0BzaGFyZWQnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vc2hhcmVkJyksXG4gICAgICB9LFxuICAgICAgZXh0ZW5zaW9uczogWycubWpzJywgJy5qcycsICcudHMnLCAnLmpzeCcsICcudHN4JywgJy5qc29uJywgJy5jc3MnLCAnLnNjc3MnXSxcbiAgICB9LFxuICAgIFxuICAgIC8vIENTUyBjb25maWd1cmF0aW9uXG4gICAgY3NzOiB7XG4gICAgICBkZXZTb3VyY2VtYXA6IGlzRGV2ZWxvcG1lbnQsXG4gICAgICBtb2R1bGVzOiB7XG4gICAgICAgIGdlbmVyYXRlU2NvcGVkTmFtZTogaXNEZXZlbG9wbWVudFxuICAgICAgICAgID8gJ1tuYW1lXV9fW2xvY2FsXV9fW2hhc2g6YmFzZTY0OjVdJ1xuICAgICAgICAgIDogJ1toYXNoOmJhc2U2NDo1XScsXG4gICAgICB9LFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcbiAgICAgICAgICAgIEBpbXBvcnQgXCJAL3N0eWxlcy9fdmFyaWFibGVzLnNjc3NcIjtcbiAgICAgICAgICAgIEBpbXBvcnQgXCJAL3N0eWxlcy9fbWl4aW5zLnNjc3NcIjtcbiAgICAgICAgICBgLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIFxuICAgIC8vIEVudmlyb25tZW50IHZhcmlhYmxlc1xuICAgIGRlZmluZToge1xuICAgICAgJ3Byb2Nlc3MuZW52Jzoge30sXG4gICAgICBfX0FQUF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24pLFxuICAgIH0sXG4gICAgXG4gICAgLy8gT3B0aW1pemUgZGVwZW5kZW5jaWVzXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICBleGNsdWRlOiBbJ2pzLWJpZy1kZWNpbWFsJ10sXG4gICAgfSxcbiAgICBcbiAgICAvLyBEZXZlbG9wbWVudC1zcGVjaWZpYyBzZXR0aW5nc1xuICAgIC4uLihpc0RldmVsb3BtZW50ICYmIHtcbiAgICAgIGxvZ0xldmVsOiAnaW5mbycsXG4gICAgICBjbGVhclNjcmVlbjogZmFsc2UsXG4gICAgfSksXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVksU0FBUyxjQUFjLGVBQWU7QUFDemEsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFVBQVU7QUFMakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFFBQU0sZUFBZSxTQUFTO0FBQzlCLFFBQU0sZ0JBQWdCLFNBQVM7QUFFL0IsU0FBTztBQUFBO0FBQUEsSUFFTCxNQUFNLGVBQWUsa0JBQWtCO0FB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
