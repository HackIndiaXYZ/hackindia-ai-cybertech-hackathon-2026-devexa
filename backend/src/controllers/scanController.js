import mongoose from 'mongoose';
import Scan from '../models/Scan.js';
import { dbState } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { analyzeInput } from '../services/analysisService.js';
import { extractText, sniffImage } from '../services/ocrService.js';

const ok = (res, data, status = 200) => res.status(status).json({ ok: true, data });
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function analyze(req, res) {
  const { inputType, text, language, actions } = req.body;
  const result = await analyzeInput({ inputType, text, language, actions });
  const inputPreview = text.slice(0, 600);
  let saved = false;
  let saveWarning = null;
  let doc = { ...result, inputPreview, createdAt: new Date().toISOString() };

  if (dbState().connected) {
    try {
      doc = (await Scan.create({ ...result, inputPreview })).toObject();
      saved = true;
    } catch (e) {
      console.error('[db] save failed:', e.name);
      saveWarning = 'The analysis finished but could not be saved to history.';
    }
  } else {
    saveWarning = 'MongoDB is not connected, so this scan was not saved to history or the dashboard.';
  }
  ok(res, { scan: doc, saved, saveWarning });
}

export async function list(req, res) {
  const { search, severity, mode, inputType, page, limit } = req.validatedQuery;
  const filter = {};
  if (severity) filter.severity = severity;
  if (mode) filter.mode = mode;
  if (inputType) filter.inputType = inputType;
  if (search) {
    const re = new RegExp(escapeRe(search), 'i');
    filter.$or = [{ inputPreview: re }, { summary: re }, { urls: re }];
  }
  const [items, total] = await Promise.all([
    Scan.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
      .select('inputType severity riskScore mode summary inputPreview createdAt').lean(),
    Scan.countDocuments(filter),
  ]);
  ok(res, { items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
}

const checkId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'INVALID_ID', 'That scan ID is not valid.');
};

export async function getOne(req, res) {
  checkId(req.params.id);
  const scan = await Scan.findById(req.params.id).lean();
  if (!scan) throw new ApiError(404, 'NOT_FOUND', 'Scan not found. It may have been deleted.');
  ok(res, { scan });
}

export async function remove(req, res) {
  checkId(req.params.id);
  const r = await Scan.findByIdAndDelete(req.params.id);
  if (!r) throw new ApiError(404, 'NOT_FOUND', 'Scan not found. It may have been deleted already.');
  ok(res, { deleted: true });
}

export async function ocr(req, res) {
  if (!req.file) throw new ApiError(400, 'NO_FILE', 'Attach an image in the "image" field.');
  if (!sniffImage(req.file.buffer)) throw new ApiError(400, 'UNSUPPORTED_FILE', 'The file is not a valid PNG, JPEG or WebP image.');
  let out;
  try {
    out = await extractText(req.file.buffer);
  } catch (e) {
    console.error('[ocr] failed:', e.message);
    throw new ApiError(503, 'OCR_UNAVAILABLE', 'Text extraction failed. The OCR engine downloads its language data on first use, so check your internet connection and try again, or paste the text manually.');
  }
  if (!out.text) throw new ApiError(422, 'NO_TEXT', 'No readable text was found. Try a clearer, higher-resolution screenshot or paste the text manually.');
  ok(res, { text: out.text.slice(0, 8000), confidence: out.confidence, truncated: out.text.length > 8000 });
}
