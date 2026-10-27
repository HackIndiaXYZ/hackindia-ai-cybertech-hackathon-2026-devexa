import Scan from '../models/Scan.js';
import { aiConfigured, env } from '../config/env.js';
import { dbState } from '../config/db.js';

export function health(req, res) {
  res.json({ ok: true, data: { status: 'ok', db: dbState(), ai: { configured: aiConfigured(), model: env.geminiModel } } });
}

export async function stats(req, res) {
  const { days } = req.validatedQuery;
  const since = new Date(Date.now() - days * 864e5);
  const [agg] = await Scan.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $facet: {
      totals: [{ $group: { _id: null, total: { $sum: 1 }, avg: { $avg: '$riskScore' } } }],
      severity: [{ $group: { _id: '$severity', count: { $sum: 1 } } }],
      mode: [{ $group: { _id: '$mode', count: { $sum: 1 } } }],
      trend: [{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, avg: { $avg: '$riskScore' } } }],
    } },
  ]);
  const [allTime, recent] = await Promise.all([
    Scan.countDocuments(),
    Scan.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(5)
      .select('inputType severity riskScore mode summary createdAt').lean(),
  ]);
  const toMap = (rows) => Object.fromEntries(rows.map((r) => [r._id, r.count]));
  const byDay = Object.fromEntries(agg.trend.map((t) => [t._id, t]));
  const trend = [];
  for (let i = Math.min(days, 90) - 1; i >= 0; i--) { // dates are UTC days
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    trend.push({ date: d, scans: byDay[d]?.count || 0, avgRisk: byDay[d] ? Math.round(byDay[d].avg) : null });
  }
  const sev = toMap(agg.severity);
  const mode = toMap(agg.mode);
  res.json({ ok: true, data: {
    days, allTime,
    total: agg.totals[0]?.total || 0,
    avgRisk: agg.totals[0] ? Math.round(agg.totals[0].avg) : 0,
    severity: ['low', 'moderate', 'high', 'critical'].map((k) => ({ key: k, count: sev[k] || 0 })),
    mode: ['prevention', 'exposure', 'incident'].map((k) => ({ key: k, count: mode[k] || 0 })),
    trend, recent,
  } });
}
