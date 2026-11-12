// Dev-server hooks (Create React App runs this file automatically with `npm start`; it is not part of the site build).
//  1. /api/keystatic/*  -> Keystatic's API, saving edits straight to the files in this repo.
//  2. /api/*            -> the deployed Vercel functions, so merch and checkout work locally.
//  3. Rebuilds public/content/blog/index.json whenever a post changes.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { buildIndex, BLOG_DIR } = require('../scripts/build-content-index');

const ROOT = path.join(__dirname, '..');
const API_TARGET = process.env.API_PROXY_TARGET || 'https://northernnationalmusic.com';

let keystaticHandler;
async function getKeystaticHandler() {
  if (!keystaticHandler) {
    const [{ makeGenericAPIRouteHandler }, configModule] = await Promise.all([
      import('@keystatic/core/api/generic'),
      import(pathToFileURL(path.join(__dirname, 'keystatic.config.mjs')).href),
    ]);
    keystaticHandler = makeGenericAPIRouteHandler({ config: configModule.default, localBaseDirectory: ROOT });
  }
  return keystaticHandler;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function toHeaderPairs(headers) {
  if (!headers) return [];
  if (typeof headers.forEach === 'function' && !Array.isArray(headers)) {
    const pairs = [];
    headers.forEach((value, key) => pairs.push([key, value]));
    return pairs;
  }
  return Array.isArray(headers) ? headers : Object.entries(headers);
}

module.exports = function setupProxy(app) {
  // Keep the news index in sync with the post files while editing.
  try {
    buildIndex();
    let timer;
    fs.watch(BLOG_DIR, (event, file) => {
      if (!file || !file.endsWith('.md')) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          buildIndex();
        } catch (err) {
          console.warn('content: could not rebuild the news index:', err.message);
        }
      }, 150);
    });
  } catch (err) {
    console.warn('content: could not watch posts:', err.message);
  }

  app.use('/api/keystatic', async (req, res) => {
    try {
      const handler = await getKeystaticHandler();
      const body = await readBody(req);
      const url = `http://${req.headers.host}${req.originalUrl}`;
      const result = await handler({
        method: req.method,
        url,
        headers: { get: (name) => req.headers[name.toLowerCase()] ?? null },
        json: async () => JSON.parse(body.toString('utf8') || 'null'),
      });
      res.status(result.status || 200);
      for (const [key, value] of toHeaderPairs(result.headers)) res.append(key, value);
      res.end(result.body == null ? undefined : Buffer.from(result.body));
    } catch (err) {
      console.error('keystatic:', err);
      res.status(500).json({ error: 'Keystatic API failed', details: err.message });
    }
  });

  app.use(
    '/api',
    createProxyMiddleware({
      target: API_TARGET,
      changeOrigin: true,
      logLevel: 'warn',
    })
  );
};
