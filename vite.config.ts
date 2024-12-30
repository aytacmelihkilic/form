import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // Tüm ağ arayüzlerinde dinlemek için
    port: 3000, // İstediğiniz bir port numarası
  },
});
