import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const num = (v, d) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: num(process.env.PORT, 4000),
  mongoUri: (process.env.MONGODB_URI || '').trim(),
  geminiKey: (process.env.GEMINI_API_KEY || '').trim(),
  geminiModel: (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim(),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  maxUploadMb: num(process.env.MAX_UPLOAD_MB, 5),
  ocrLangs: process.env.OCR_LANGS || 'eng',
};

export const aiConfigured = () => Boolean(env.geminiKey) && !env.geminiKey.toLowerCase().startsWith('your_');
