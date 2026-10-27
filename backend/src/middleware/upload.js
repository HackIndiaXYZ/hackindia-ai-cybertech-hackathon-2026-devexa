import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const ALLOWED = ['image/png', 'image/jpeg', 'image/webp'];

// Memory storage: the image is OCR'd and discarded. It is never written to disk or executed.
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadMb * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => (ALLOWED.includes(file.mimetype)
    ? cb(null, true)
    : cb(new ApiError(400, 'UNSUPPORTED_FILE', 'Only PNG, JPEG or WebP images are accepted.'))),
}).single('image');
