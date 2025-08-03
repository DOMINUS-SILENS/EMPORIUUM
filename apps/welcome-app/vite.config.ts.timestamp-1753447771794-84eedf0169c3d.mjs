// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/MOHAMED/Documents/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/apps/welcome-app/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/MOHAMED/Documents/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/apps/welcome-app/node_modules/@vitejs/plugin-react/dist/index.js";
import { visualizer } from "file:///C:/Users/MOHAMED/Documents/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/apps/welcome-app/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { VitePWA } from "file:///C:/Users/MOHAMED/Documents/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/apps/welcome-app/node_modules/vite-plugin-pwa/dist/index.js";
import compression from "file:///C:/Users/MOHAMED/Documents/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/apps/welcome-app/node_modules/vite-plugin-compression/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\MOHAMED\\Documents\\SOCLE_CODEX_SACRE\\E-Commerce Platforme\\apps\\welcome-app";
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
        "~": path.resolve(__vite_injected_original_dirname, "./public")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNT0hBTUVEXFxcXERvY3VtZW50c1xcXFxTT0NMRV9DT0RFWF9TQUNSRVxcXFxFLUNvbW1lcmNlIFBsYXRmb3JtZVxcXFxhcHBzXFxcXHdlbGNvbWUtYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNT0hBTUVEXFxcXERvY3VtZW50c1xcXFxTT0NMRV9DT0RFWF9TQUNSRVxcXFxFLUNvbW1lcmNlIFBsYXRmb3JtZVxcXFxhcHBzXFxcXHdlbGNvbWUtYXBwXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9NT0hBTUVEL0RvY3VtZW50cy9TT0NMRV9DT0RFWF9TQUNSRS9FLUNvbW1lcmNlJTIwUGxhdGZvcm1lL2FwcHMvd2VsY29tZS1hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIExvYWQgZW52IHZhcmlhYmxlcyBiYXNlZCBvbiBgbW9kZWBcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIFxuICBjb25zdCBpc1Byb2R1Y3Rpb24gPSBtb2RlID09PSAncHJvZHVjdGlvbic7XG4gIGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBtb2RlID09PSAnZGV2ZWxvcG1lbnQnO1xuICBcbiAgcmV0dXJuIHtcbiAgICAvLyBCYXNlIHB1YmxpYyBwYXRoIHdoZW4gc2VydmVkIGluIHByb2R1Y3Rpb25cbiAgICBiYXNlOiBpc1Byb2R1Y3Rpb24gPyAnL3dlbGNvbWUtYXBwLycgOiAnLycsXG4gICAgXG4gICAgLy8gRGV2ZWxvcG1lbnQgc2VydmVyIGNvbmZpZ3VyYXRpb25cbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6IHRydWUsIC8vIExpc3RlbiBvbiBhbGwgbmV0d29yayBpbnRlcmZhY2VzXG4gICAgICBwb3J0OiAzMDAwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIG9wZW46ICFwcm9jZXNzLmVudi5DSSxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogZW52LlZJVEVfQVBJX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDo4MDAwJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIFxuICAgIC8vIEJ1aWxkIGNvbmZpZ3VyYXRpb25cbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICAgIG1pbmlmeTogaXNQcm9kdWN0aW9uID8gJ2VzYnVpbGQnIDogZmFsc2UsXG4gICAgICBzb3VyY2VtYXA6IGlzUHJvZHVjdGlvbiA/ICdoaWRkZW4nIDogdHJ1ZSxcbiAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSxcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTYwMCxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAcmFkaXgtdWknKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXJhZGl4JztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0JykgfHwgaWQuaW5jbHVkZXMoJ3JlYWN0LWRvbScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItcmVhY3QnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgICB0cmFuc2Zvcm1NaXhlZEVzTW9kdWxlczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBcbiAgICAvLyBQbHVnaW5zXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3Qoe1xuICAgICAgICBqc3hJbXBvcnRTb3VyY2U6ICdAZW1vdGlvbi9yZWFjdCcsXG4gICAgICAgIGJhYmVsOiB7XG4gICAgICAgICAgcGx1Z2luczogWydAZW1vdGlvbi9iYWJlbC1wbHVnaW4nXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgXG4gICAgICAvLyBWaXN1YWxpemUgYnVuZGxlIHNpemVcbiAgICAgIGlzUHJvZHVjdGlvbiAmJiB2aXN1YWxpemVyKHtcbiAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgZ3ppcFNpemU6IHRydWUsXG4gICAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgICB9KSxcbiAgICAgIFxuICAgICAgLy8gUFdBIHN1cHBvcnRcbiAgICAgIFZpdGVQV0Eoe1xuICAgICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLmljbycsICdyb2JvdHMudHh0JywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJ10sXG4gICAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgICAgbmFtZTogJ0UtQ29tbWVyY2UgV2VsY29tZSBBcHAnLFxuICAgICAgICAgIHNob3J0X25hbWU6ICdXZWxjb21lIEFwcCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdXZWxjb21lIHRvIG91ciBFLUNvbW1lcmNlIFBsYXRmb3JtJyxcbiAgICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgIGljb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogJ3B3YS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiAncHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFxuICAgICAgLy8gR3ppcCBhbmQgQnJvdGxpIGNvbXByZXNzaW9uXG4gICAgICBpc1Byb2R1Y3Rpb24gJiYgY29tcHJlc3Npb24oe1xuICAgICAgICBleHQ6ICcuZ3onLFxuICAgICAgICBhbGdvcml0aG06ICdnemlwJyxcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0MCxcbiAgICAgIH0pLFxuICAgICAgXG4gICAgICBpc1Byb2R1Y3Rpb24gJiYgY29tcHJlc3Npb24oe1xuICAgICAgICBleHQ6ICcuYnInLFxuICAgICAgICBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycsXG4gICAgICAgIHRocmVzaG9sZDogMTAyNDAsXG4gICAgICB9KSxcbiAgICAgIFxuICAgICAgLy8gRm9udCBvcHRpbWl6YXRpb24gKHVzaW5nIENTUyBAaW1wb3J0IGluc3RlYWQgb2YgcGx1Z2luKVxuICAgICAgLy8gVGhpcyBpcyBhIG1vcmUgbGlnaHR3ZWlnaHQgYXBwcm9hY2ggdGhhdCB3b3JrcyB3aXRoIFZpdGUgNVxuICAgIF0uZmlsdGVyKEJvb2xlYW4pLFxuICAgIFxuICAgIC8vIFJlc29sdmUgY29uZmlndXJhdGlvblxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgICd+JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcHVibGljJyksXG4gICAgICB9LFxuICAgICAgZXh0ZW5zaW9uczogWycubWpzJywgJy5qcycsICcudHMnLCAnLmpzeCcsICcudHN4JywgJy5qc29uJywgJy5jc3MnLCAnLnNjc3MnXSxcbiAgICB9LFxuICAgIFxuICAgIC8vIENTUyBjb25maWd1cmF0aW9uXG4gICAgY3NzOiB7XG4gICAgICBkZXZTb3VyY2VtYXA6IGlzRGV2ZWxvcG1lbnQsXG4gICAgICBtb2R1bGVzOiB7XG4gICAgICAgIGdlbmVyYXRlU2NvcGVkTmFtZTogaXNEZXZlbG9wbWVudFxuICAgICAgICAgID8gJ1tuYW1lXV9fW2xvY2FsXV9fW2hhc2g6YmFzZTY0OjVdJ1xuICAgICAgICAgIDogJ1toYXNoOmJhc2U2NDo1XScsXG4gICAgICB9LFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcbiAgICAgICAgICAgIEBpbXBvcnQgXCJAL3N0eWxlcy9fdmFyaWFibGVzLnNjc3NcIjtcbiAgICAgICAgICAgIEBpbXBvcnQgXCJAL3N0eWxlcy9fbWl4aW5zLnNjc3NcIjtcbiAgICAgICAgICBgLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIFxuICAgIC8vIEVudmlyb25tZW50IHZhcmlhYmxlc1xuICAgIGRlZmluZToge1xuICAgICAgJ3Byb2Nlc3MuZW52Jzoge30sXG4gICAgICBfX0FQUF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24pLFxuICAgIH0sXG4gICAgXG4gICAgLy8gT3B0aW1pemUgZGVwZW5kZW5jaWVzXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICBleGNsdWRlOiBbJ2pzLWJpZy1kZWNpbWFsJ10sXG4gICAgfSxcbiAgICBcbiAgICAvLyBEZXZlbG9wbWVudC1zcGVjaWZpYyBzZXR0aW5nc1xuICAgIC4uLihpc0RldmVsb3BtZW50ICYmIHtcbiAgICAgIGxvZ0xldmVsOiAnaW5mbycsXG4gICAgICBjbGVhclNjcmVlbjogZmFsc2UsXG4gICAgfSksXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMGIsU0FBUyxjQUFjLGVBQWU7QUFDaGUsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFVBQVU7QUFMakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFFBQU0sZUFBZSxTQUFTO0FBQzlCLFFBQU0sZ0JBQWdCLFNBQVM7QUFFL0IsU0FBTztBQUFBO0FBQUEs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
