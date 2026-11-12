// Astro builds static pages; React components hydrate as islands where they need to be interactive.
// Vercel serves the functions in /api alongside the static build, exactly as before.
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import rehypeFigures from './src/lib/rehype-figures.mjs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const API_TARGET = process.env.API_PROXY_TARGET || 'https://northernnationalmusic.com';

// Dev only: serve Keystatic's local-mode API (saves straight to the repo files)
// and let /keystatic/* deep links load the editor page.
function keystaticDev() {
  let handler;
  const getHandler = async (root) => {
    if (!handler) {
      const [{ makeGenericAPIRouteHandler }, configModule] = await Promise.all([
        import('@keystatic/core/api/generic'),
        import(pathToFileURL(path.join(root, 'src/keystatic.config.mjs')).href),
      ]);
      handler = makeGenericAPIRouteHandler({ config: configModule.default, localBaseDirectory: root });
    }
    return handler;
  };
  const readBody = (req) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

  return {
    name: 'keystatic-dev',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root;
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/keystatic/')) {
          req.url = '/keystatic'; // single editor page; Keystatic routes on the client
          return next();
        }
        if (!url.startsWith('/api/keystatic')) return next();
        try {
          const h = await getHandler(root);
          const body = await readBody(req);
          const result = await h({
            method: req.method,
            url: `http://${req.headers.host}${url}`,
            headers: { get: (name) => req.headers[name.toLowerCase()] ?? null },
            json: async () => JSON.parse(body.toString('utf8') || 'null'),
          });
          res.statusCode = result.status || 200;
          const headers = result.headers;
          if (headers) {
            const pairs =
              typeof headers.forEach === 'function' && !Array.isArray(headers)
                ? (() => {
                    const p = [];
                    headers.forEach((v, k) => p.push([k, v]));
                    return p;
                  })()
                : Array.isArray(headers)
                ? headers
                : Object.entries(headers);
            for (const [k, v] of pairs) res.setHeader(k, v);
          }
          res.end(result.body == null ? undefined : Buffer.from(result.body));
        } catch (err) {
          console.error('keystatic:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Keystatic API failed', details: err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  site: 'https://northernnationalmusic.com',
  integrations: [react()],
  markdown: { rehypePlugins: [rehypeFigures] },
  vite: {
    // Keep the existing Vercel variable names (REACT_APP_*) working in the browser.
    envPrefix: ['PUBLIC_', 'REACT_APP_'],
    plugins: [keystaticDev()],
    server: {
      // `npm run dev`: forward /api to the deployed Vercel functions (merch, checkout).
      proxy: { '/api': { target: API_TARGET, changeOrigin: true, secure: true } },
    },
  },
});
