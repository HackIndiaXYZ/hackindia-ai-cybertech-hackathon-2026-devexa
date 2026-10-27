import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/ApiError.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { requireDb } from '../middleware/errorHandler.js';
import { imageUpload } from '../middleware/upload.js';
import { analyzeSchema, listQuerySchema, statsQuerySchema } from '../validators/schemas.js';
import * as scans from '../controllers/scanController.js';
import * as system from '../controllers/systemController.js';

const limiter = (limit, windowMs = 60_000) => rateLimit({
  windowMs, limit, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment and try again.' } },
});

const r = Router();
r.get('/health', system.health);
r.post('/scans/analyze', limiter(20), validateBody(analyzeSchema), asyncHandler(scans.analyze));
r.post('/ocr', limiter(10), imageUpload, asyncHandler(scans.ocr));
r.get('/scans', requireDb, validateQuery(listQuerySchema), asyncHandler(scans.list));
r.get('/scans/:id', requireDb, asyncHandler(scans.getOne));
r.delete('/scans/:id', requireDb, asyncHandler(scans.remove));
r.get('/stats', requireDb, validateQuery(statsQuerySchema), asyncHandler(system.stats));
export default r;
