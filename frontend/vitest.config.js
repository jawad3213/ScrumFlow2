import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

// Simulation de __dirname pour les ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Utilise maintenant la variable __dirname simulée plus haut
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // Charge directement les matchers DOM sans fichier setup intermédiaire
    setupFiles: ['@testing-library/jest-dom/vitest'],
  },
});