import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { VitePWA } from 'vite-plugin-pwa'

function aiApiDevServer() {
  return {
    name: 'ai-api-dev-server',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/aft-analysis', async (req, res) => {
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
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.GROQ_API_KEY ||= env.GROQ_API_KEY;
  process.env.GROQ_AFT_ANALYSIS_MODEL ||= env.GROQ_AFT_ANALYSIS_MODEL;

  return {
    base: '/',
    plugins: [
      react(),
      aiApiDevServer(),
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
          name: 'ETS Tracker',
          short_name: 'ETS Tracker',
          description: 'Track and manage ETS progress.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#0f172a',
          theme_color: '#0f172a',
          icons: [
            {
              src: '/icons/icon-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        includeAssets: ['icons/icon-512x512.svg'],
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
})
