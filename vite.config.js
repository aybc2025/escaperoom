import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/escaperoom/space/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
