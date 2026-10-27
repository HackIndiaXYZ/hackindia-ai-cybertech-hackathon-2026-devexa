import mongoose from 'mongoose';
import { env } from './env.js';

// Fail fast instead of silently queueing queries while MongoDB is down.
mongoose.set('bufferCommands', false);

let lastError = null;
let timer = null;

export const dbState = () => ({
  configured: Boolean(env.mongoUri),
  connected: mongoose.connection.readyState === 1,
  error: lastError,
});

export async function connectDb() {
  if (!env.mongoUri) {
    lastError = 'MONGODB_URI is not set in backend/.env';
    console.warn('[db] ' + lastError);
    return;
  }
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    lastError = null;
    console.log('[db] connected');
  } catch (e) {
    lastError = 'Could not connect to MongoDB. Is it running and is MONGODB_URI correct?';
    console.error('[db] connection failed:', e.name);
    clearTimeout(timer);
    timer = setTimeout(connectDb, 10000); // keep retrying in the background
  }
}
