import { env, aiConfigured } from './config/env.js';
import { connectDb } from './config/db.js';
import { createApp } from './app.js';

createApp().listen(env.port, () => {
  console.log(`[nova] API listening on http://localhost:${env.port}`);
  if (!aiConfigured()) console.warn('[nova] GEMINI_API_KEY is not set: AI analysis disabled (rule-based checks still work).');
});
connectDb(); // non-blocking: the API starts even if MongoDB is down

process.on('unhandledRejection', (e) => console.error('[nova] unhandled rejection:', e?.name));
