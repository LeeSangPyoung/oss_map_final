import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5174,
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    include: ['proj4'],
  },
  build: {
    rollupOptions: {
      external: ['proj4'], // Không include proj4 vào trong bundle
      output: {
        globals: {
          proj4: 'proj4',
        },
        format: 'iife', // hoặc 'umd' tùy theo nhu cầu
        name: 'MyApp', // tên global variable để truy cập các class và function trong file
      },
    },
  },
});
