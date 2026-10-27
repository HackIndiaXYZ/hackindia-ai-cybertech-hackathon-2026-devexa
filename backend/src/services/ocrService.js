import { createWorker } from 'tesseract.js';
import { env } from '../config/env.js';

export function sniffImage(buf) {
  if (buf.length > 12 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

export async function extractText(buffer) {
  const worker = await createWorker(env.ocrLangs);
  try {
    const { data } = await Promise.race([
      worker.recognize(buffer),
      new Promise((_, rej) => setTimeout(() => rej(new Error('OCR_TIMEOUT')), 90000)),
    ]);
    return { text: (data.text || '').trim(), confidence: Math.round(data.confidence || 0) };
  } finally {
    await worker.terminate().catch(() => {});
  }
}
