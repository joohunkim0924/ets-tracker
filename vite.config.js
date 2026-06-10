import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';

function registerAiAnalysisApi(middlewares) {
  middlewares.use('/api/ai-analysis', async (req, res) => {
    if (req.method !== 'POST' && req.method !== 'OPTIONS') {
      res.statusCode = 405;
      res.setHeader('Allow', 'POST, OPTIONS');
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    res.status = (statusCode) => {
      res.statusCode = statusCode;
      return res;
    };
    res.json = (payload) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(payload));
    };

    const { default: handler } = await import('./api/ai-analysis.js');
    await handler(req, res);
  });
}

function registerAftAnalysisApi(middlewares) {
  middlewares.use('/api/aft-analysis', async (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Allow', 'POST');
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    res.status = (statusCode) => {
      res.statusCode = statusCode;
      return res;
    };
    res.json = (payload) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(payload));
    };

    const { default: handler } = await import('./api/aft-analysis.js');
    await handler(req, res);
  });
}

function aiApiServer() {
  return {
    name: 'ai-api-server',
    configureServer(server) {
      registerAiAnalysisApi(server.middlewares);
      registerAftAnalysisApi(server.middlewares);
    },
    configurePreviewServer(server) {
      registerAiAnalysisApi(server.middlewares);
      registerAftAnalysisApi(server.middlewares);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.GROQ_API_KEY ||= env.GROQ_API_KEY;
  process.env.GROQ_AFT_ANALYSIS_MODEL ||= env.GROQ_AFT_ANALYSIS_MODEL;
  process.env.VITE_AI_ANALYSIS_KEY ||= env.VITE_AI_ANALYSIS_KEY;
  process.env.VITE_AI_ANALYSIS_MODEL ||= env.VITE_AI_ANALYSIS_MODEL;
  process.env.VITE_AI_GATEWAY_BASE_URL ||= env.VITE_AI_GATEWAY_BASE_URL;

  return {
    base: '/',
    plugins: [
      react(),
      aiApiServer(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        minify: false,
        workbox: {
          // Avoid Workbox's terser-minification path that can fail in some sandboxed builds.
          mode: 'development',
        },
        manifestFilename: 'manifest.json',
        manifest: {
          name: 'Hooah!',
          short_name: 'Hooah!',
          description: 'Track ETS, AFT, weapons, and Army benefits.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#0f0f0f',
          theme_color: '#0f0f0f',
          icons: [
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        includeAssets: ['icons/icon-512x512.png', 'icons/icon-192x192.png', 'icons/icon-180x180.png'],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      watch: {
        // This tells Vite: "Don't restart if THESE files change"
        // It ignores the hidden git, cache, and node folders
        ignored: ['**/node_modules/**', '**/.vite/**', '**/.git/**'],
        usePolling: true,
        interval: 1000,
      },
    },
  };
});
