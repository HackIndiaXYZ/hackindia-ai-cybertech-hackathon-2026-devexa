export const clamp = (n, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

// Thresholds are product choices, not calibrated probabilities.
export function severityFor(score) {
  if (score < 25) return 'low';
  if (score < 50) return 'moderate';
  if (score < 75) return 'high';
  return 'critical';
}

// Diminishing-returns combination: several weak signals never exceed 100.
export function combineWeights(weights) {
  const remaining = weights.reduce((p, w) => p * (1 - clamp(w, 0, 60) / 100), 1);
  return Math.round(100 * (1 - remaining));
}
