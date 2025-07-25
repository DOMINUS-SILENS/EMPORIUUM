import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: [
      { find: '@shared', replacement: path.resolve(__dirname, '../../shared') },
      { find: '@', replacement: path.resolve(__dirname, './src') }
    ],
  },
}));
