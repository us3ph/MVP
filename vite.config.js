import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Fixed ports so this app never shares a browser origin (and its cached data) with another project.
  server: { port: 5180, strictPort: true },
  preview: { port: 4180, strictPort: true },
});
