import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({command}) => {
  const isProd = command === 'build';

  return {
    base: isProd ? '/merge-game/' : '/',

    plugins: [
      react(),

      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',

        includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],

        manifest: {
          name: 'Stellar Merge',
          short_name: 'StellarMerge',
          description: 'Juego de fusiones cósmicas.',
          theme_color: '#0d0d12',
          background_color: '#0d0d12',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '.',
          scope: '.',

          icons: [
            {
              src: 'manifest-icon-192.maskable.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: 'manifest-icon-512.maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },

        workbox: {
          navigateFallback: 'index.html',
        },

        devOptions: {
          enabled: true,
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
