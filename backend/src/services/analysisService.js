import { runDetectors } from '../utils/detectors.js';
import { clamp, severityFor } from '../utils/scoring.js';
import { runAiAnalysis } from './aiService.js';
import { buildGuidance, determineMode } from './guidance.js';

export async function analyzeInput({ inputType, text, language, actions }) {
  const rules = runDetectors({ inputType, text });
  const ai = await runAiAnalysis({ inputType, text, language, actions, rules });
  const aiOk = ai.status === 'ok';

  const seen = new Set(rules.indicators.map((i) => i.evidence.toLowerCase()));
  const aiIndicators = aiOk ? ai.data.indicators.filter((i) => !(i.evidence && seen.has(i.evidence.toLowerCase()))) : [];
  const indicators = [...rules.indicators, ...aiIndicators].slice(0, 14);

  // Blend, but never let the AI fully erase strong deterministic evidence.
  const riskScore = clamp(aiOk
    ? Math.max(Math.round(0.4 * rules.ruleScore + 0.6 * ai.data.riskScore), Math.round(0.8 * rules.ruleScore))
    : rules.ruleScore);
  const severity = severityFor(riskScore);
  const mode = determineMode(actions);
  const guidance = buildGuidance({
    mode, severity, actions, language,
    flags: { remoteAccess: rules.indicators.some((i) => i.id === 'remote_access') },
  });

  const limitations = [
    'The risk score is a heuristic estimate that combines rule checks with AI reasoning. It is not a calibrated probability or proof of fraud.',
    'NOVA did not open any link, query a URL-reputation service, or verify who sent the content.',
    ...(aiOk ? ai.data.limitations : [ai.message]),
  ];

  const summary = aiOk
    ? ai.data.summary
    : rules.indicators.length
      ? `Rule-based checks found ${rules.indicators.length} warning sign${rules.indicators.length > 1 ? 's' : ''}. AI analysis did not run, so this is a partial assessment.`
      : 'Rule-based checks found no clear warning signs. AI analysis did not run, so this is a partial assessment.';

  return {
    inputType, language, actions,
    urls: rules.hosts,
    riskScore, ruleScore: rules.ruleScore, aiScore: aiOk ? ai.data.riskScore : null,
    severity, mode, summary,
    scamType: aiOk ? ai.data.scamType : 'unknown',
    indicators, limitations, guidance,
    aiStatus: ai.status, aiMessage: ai.message || '',
  };
}
