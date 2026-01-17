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