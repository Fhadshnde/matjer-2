import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // matjer-2 uses port 5175
    port: 5175,
    host: true,
    hmr: {
      port: 5176,
    },
    watch: {
      usePolling: true,
    },
    // Increase timeout settings
    timeout: 30000,
    // Optimize for development
    fs: {
      strict: false,
    },
  },
  build: {
    // Optimize build performance
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          charts: ['recharts', 'chart.js'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-icons',
      'recharts',
      'chart.js',
      'axios',
      'lucide-react',
      '@heroicons/react',
    ],
  },
})
