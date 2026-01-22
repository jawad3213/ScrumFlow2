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
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // Importez le plugin
import path from 'path';

export default defineConfig({
  plugins: [react()], // Ajoutez-le ici
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      "motion/react": "framer-motion",
      '@': path.resolve(__dirname, './src'),
    },
  },
});