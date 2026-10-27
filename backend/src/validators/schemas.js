import { z } from 'zod';
import { normalizeUrlInput } from '../utils/detectors.js';

const flag = z.boolean().default(false);

export const analyzeSchema = z.object({
  inputType: z.enum(['message', 'email', 'url', 'screenshot']),
  text: z.string().trim().min(3, 'Enter at least a few characters to analyze.').max(8000, 'Text is too long (maximum 8,000 characters).'),
  language: z.enum(['en', 'hinglish']).default('en'),
  actions: z.object({
    clicked: flag, downloaded: flag, sharedPassword: flag, sharedOtp: flag,
    sharedCardBank: flag, sharedPersonal: flag, lostMoney: flag,
  }).default({}),
}).superRefine((v, ctx) => {
  if (v.inputType === 'url' && !normalizeUrlInput(v.text)) {
    ctx.addIssue({ code: 'custom', path: ['text'], message: 'Enter a single valid http(s) URL without spaces.' });
  }
});

export const listQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  severity: z.enum(['low', 'moderate', 'high', 'critical']).optional(),
  mode: z.enum(['prevention', 'exposure', 'incident']).optional(),
  inputType: z.enum(['message', 'email', 'url', 'screenshot']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const statsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});
