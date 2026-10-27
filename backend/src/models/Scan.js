import mongoose from 'mongoose';

const indicatorSchema = new mongoose.Schema({
  title: String,
  evidence: String,
  explanation: String,
  severity: { type: String, enum: ['low', 'medium', 'high'] },
  source: { type: String, enum: ['rules', 'ai'] },
  evidenceVerified: Boolean,
}, { _id: false });

const stepSchema = new mongoose.Schema({
  priority: { type: String, enum: ['now', 'next', 'later'] },
  title: String,
  detail: String,
}, { _id: false });

const scanSchema = new mongoose.Schema({
  inputType: { type: String, enum: ['message', 'email', 'url', 'screenshot'], required: true },
  language: { type: String, enum: ['en', 'hinglish'], default: 'en' },
  // Only a short excerpt is stored (privacy). Screenshots themselves are never stored.
  inputPreview: { type: String, maxlength: 600 },
  urls: [String], // hostnames only
  actions: {
    clicked: Boolean, downloaded: Boolean, sharedPassword: Boolean, sharedOtp: Boolean,
    sharedCardBank: Boolean, sharedPersonal: Boolean, lostMoney: Boolean,
  },
  riskScore: { type: Number, min: 0, max: 100, required: true },
  ruleScore: { type: Number, min: 0, max: 100 },
  aiScore: { type: Number, min: 0, max: 100, default: null },
  severity: { type: String, enum: ['low', 'moderate', 'high', 'critical'], required: true, index: true },
  mode: { type: String, enum: ['prevention', 'exposure', 'incident'], required: true, index: true },
  summary: String,
  scamType: String,
  indicators: [indicatorSchema],
  limitations: [String],
  guidance: {
    headline: String,
    steps: [stepSchema],
    contacts: [{ label: String, value: String, _id: false }],
    regionNote: String,
  },
  aiStatus: { type: String, enum: ['ok', 'not_configured', 'invalid_key', 'rate_limited', 'unavailable', 'invalid_output'] },
  aiMessage: String,
}, { timestamps: true });

scanSchema.index({ createdAt: -1 });

export default mongoose.model('Scan', scanSchema);
