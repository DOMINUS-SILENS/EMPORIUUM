import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createAppAliases } from "../../packages/config-vite/vite.alias";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: createAppAliases(import.meta.url),
  },
});
