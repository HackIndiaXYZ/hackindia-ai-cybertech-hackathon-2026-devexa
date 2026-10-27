import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: { useDefaults: true, directives: { 'img-src': ["'self'", 'data:', 'blob:'] } } }));
  app.use(cors({ origin: env.clientOrigin.split(',').map((s) => s.trim()), methods: ['GET', 'POST', 'DELETE'] }));
  app.use(express.json({ limit: '100kb' }));

  // Safe logging: method, path (no query string), status, duration. Never bodies.
  app.use((req, res, next) => {
    const t = Date.now();
    res.on('finish', () => console.log(`${req.method} ${req.originalUrl.split('?')[0]} ${res.statusCode} ${Date.now() - t}ms`));
    next();
  });

  app.use('/api', rateLimit({
    windowMs: 15 * 60_000, limit: 600, standardHeaders: 'draft-7', legacyHeaders: false,
    message: { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a few minutes.' } },
  }), routes);

  // Optional: serve the built frontend (single-server deployment).
  const dist = fileURLToPath(new URL('../../frontend/dist', import.meta.url));
  if (fs.existsSync(path.join(dist, 'index.html'))) {
    app.use(express.static(dist));
    app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
