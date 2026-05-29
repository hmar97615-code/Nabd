import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        workbox: {
          maximumFileSizeToCacheInBytes: 5000000 // 5MB
        },
        manifest: {
          name: 'NABD',
          short_name: 'NABD',
          description: 'NABD Nutrition & Health Tracker',
          theme_color: '#ffffff',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          icons: [
            {
              src: 'https://cdn.iconscout.com/icon/free/png-256/free-activity-icon-download-in-svg-png-gif-file-formats--healthy-heartbeat-rhythm-sign-pack-medical-icons-1175658.png',
              sizes: '256x256',
              type: 'image/png'
            },
            {
              src: 'https://cdn.iconscout.com/icon/free/png-512/free-activity-icon-download-in-svg-png-gif-file-formats--healthy-heartbeat-rhythm-sign-pack-medical-icons-1175658.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || ""),
      'process.env.USER_GEMINI_API_KEY': JSON.stringify(process.env.USER_GEMINI_API_KEY || env.USER_GEMINI_API_KEY || ""),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || ""),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
