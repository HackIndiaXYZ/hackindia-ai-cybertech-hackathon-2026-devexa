import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { dbState } from '../config/db.js';

export const notFound = (req, res, next) => next(new ApiError(404, 'NOT_FOUND', `No route for ${req.method} ${req.path}`));

export function requireDb(req, res, next) {
  if (!dbState().connected) {
    return next(new ApiError(503, 'DB_UNAVAILABLE', 'MongoDB is not connected. Start MongoDB or fix MONGODB_URI in backend/.env, then restart the server.'));
  }
  next();
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const send = (status, code, message, details) => res.status(status).json({ ok: false, error: { code, message, details } });
  if (err instanceof ApiError) return send(err.status, err.code, err.message, err.details);
  if (err?.name === 'MulterError') {
    return send(400, 'UPLOAD_ERROR', err.code === 'LIMIT_FILE_SIZE' ? `Image is too large (maximum ${env.maxUploadMb} MB).` : 'The upload could not be processed.');
  }
  if (err?.type === 'entity.parse.failed') return send(400, 'INVALID_JSON', 'Request body is not valid JSON.');
  if (err?.type === 'entity.too.large') return send(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');
  console.error('[error]', req.method, req.path, err?.name, err?.message); // never log bodies or stacks to clients
  send(500, 'INTERNAL', 'Something went wrong on the server. Please try again.');
}
