// vite.config.ts
import { defineConfig } from "file:///C:/Users/MOHAMED/Documents/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/apps/vendeur-app/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/MOHAMED/Documents/SOCLE_CODEX_SACRE/E-Commerce%20Platforme/apps/vendeur-app/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\MOHAMED\\Documents\\SOCLE_CODEX_SACRE\\E-Commerce Platforme\\apps\\vendeur-app";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__vite_injected_original_dirname, "./src")
      },
      {
        find: "@shared",
        replacement: path.resolve(__vite_injected_original_dirname, "../../shared")
      }
    ]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNT0hBTUVEXFxcXERvY3VtZW50c1xcXFxTT0NMRV9DT0RFWF9TQUNSRVxcXFxFLUNvbW1lcmNlIFBsYXRmb3JtZVxcXFxhcHBzXFxcXHZlbmRldXItYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNT0hBTUVEXFxcXERvY3VtZW50c1xcXFxTT0NMRV9DT0RFWF9TQUNSRVxcXFxFLUNvbW1lcmNlIFBsYXRmb3JtZVxcXFxhcHBzXFxcXHZlbmRldXItYXBwXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9NT0hBTUVEL0RvY3VtZW50cy9TT0NMRV9DT0RFWF9TQUNSRS9FLUNvbW1lcmNlJTIwUGxhdGZvcm1lL2FwcHMvdmVuZGV1ci1hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KClcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiBcIkBcIixcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaW5kOiBcIkBzaGFyZWRcIixcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vc2hhcmVkXCIpLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwYixTQUFTLG9CQUFvQjtBQUN2ZCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUM5QztBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUNyRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
