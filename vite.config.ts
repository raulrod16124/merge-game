import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {VitePWA} from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({command}) => {
  const isProd = command === 'build';
  return {
    base: isProd ? '/merge-game/' : '/',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],

        manifest: {
          name: 'Stellar Merge',
          short_name: 'StellarMerge',
          description: 'Juego de fusiones cósmicas y estrategia espacial.',
          theme_color: '#0d0d12',
          background_color: '#0d0d12',
          display: 'standalone',
          orientation: 'portrait',
          start_url: isProd ? '/merge-game/' : '/',
          scope: isProd ? '/merge-game/' : '/',
          icons: [
            {
              src: `${isProd ? '/merge-game/' : '/'}/pwa-192.png`,
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: `${isProd ? '/merge-game/' : '/'}/pwa-512.png`,
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
