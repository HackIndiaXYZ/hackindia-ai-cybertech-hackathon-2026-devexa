import { Phone, Quote } from 'lucide-react';
import RiskGauge from './RiskGauge.jsx';
import { Card, ModeBadge, Notice, SeverityBadge, SEVERITY, cn } from './ui.jsx';

const SEV_DOT = { low: 'bg-emerald-400', medium: 'bg-amber-400', high: 'bg-red-400' };
const PRIORITY = { now: ['Do now', 'bg-rose-400/15 text-rose-200'], next: ['Next', 'bg-violet-400/15 text-violet-200'], later: ['Later', 'bg-slate-400/15 text-slate-300'] };

export default function AnalysisResult({ scan, saved, saveWarning }) {
  const g = scan.guidance || { steps: [], contacts: [] };
  return (
    <div className="space-y-4" aria-live="polite">
      {saveWarning && <Notice tone="amber" title="Not saved">{saveWarning}</Notice>}
      {scan.aiStatus && scan.aiStatus !== 'ok' && <Notice tone="amber" title="AI analysis did not run">{scan.aiMessage}</Notice>}

      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <RiskGauge score={scan.riskScore} severity={scan.severity} />
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap gap-2"><SeverityBadge severity={scan.severity} /><ModeBadge mode={scan.mode} /></div>
            <p className="text-slate-100">{scan.summary}</p>
            <p className="text-xs text-slate-400">
              Rule checks {scan.ruleScore}/100 · AI {scan.aiScore ?? 'not run'}
              {scan.scamType && scan.scamType !== 'unknown' && scan.scamType !== 'none' ? ` · Pattern: ${scan.scamType}` : ''}
              {saved ? ' · Saved to history' : ''}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-base font-semibold text-white">Why NOVA flagged this</h3>
        {scan.indicators?.length ? (
          <ul className="mt-3 divide-y divide-ink-600/60">
            {scan.indicators.map((i, k) => (
              <li key={k} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', SEV_DOT[i.severity])} aria-hidden="true" />
                  <span className="font-semibold text-slate-100">{i.title}</span>
                  <span className="ml-auto text-xs text-slate-500">{i.source === 'rules' ? 'Rule check' : 'AI'} · {i.severity}</span>
                </div>
                {i.evidence && (
                  <p className="mt-2 flex gap-2 rounded-md bg-ink-900 px-3 py-2 text-sm text-cyan-100">
                    <Quote size={14} className="mt-1 shrink-0 text-nova-cyan" aria-hidden="true" />
                    <span className="break-words">{i.evidence}{i.evidenceVerified === false && <em className="ml-2 text-xs text-amber-300">(AI paraphrase; exact quote not found in your text)</em>}</span>
                  </p>
                )}
                <p className="mt-2 text-sm text-slate-400">{i.explanation}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No specific warning signs were found. That does not prove the content is safe, so verify anything that asks you to act.</p>
        )}
      </Card>

      <Card>
        <h3 className="font-display text-base font-semibold text-white">{g.headline}</h3>
        <ol className="mt-4 space-y-4">
          {g.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-600 text-xs font-bold text-white">{i + 1}</span>
              <div>
                <p className="flex flex-wrap items-center gap-2 font-semibold text-slate-100">
                  {s.title}<span className={cn('rounded px-1.5 py-0.5 text-[11px] font-semibold', PRIORITY[s.priority]?.[1])}>{PRIORITY[s.priority]?.[0]}</span>
                </p>
                <p className="mt-1 text-sm text-slate-400">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        {g.contacts?.length > 0 && (
          <div className="mt-5 rounded-lg border border-rose-400/20 bg-rose-400/5 p-3">
            {g.contacts.map((c) => (
              <p key={c.value} className="flex items-center gap-2 text-sm text-slate-100"><Phone size={14} className="text-rose-300" aria-hidden="true" />{c.label}: <strong>{c.value}</strong></p>
            ))}
            {g.regionNote && <p className="mt-2 text-xs text-slate-400">{g.regionNote}</p>}
          </div>
        )}
        <p className="mt-4 text-xs text-slate-500">NOVA gives guidance only. It has not contacted your bank, blocked anything, or reported anything for you.</p>
      </Card>

      <Card>
        <h3 className="font-display text-base font-semibold text-white">Limitations</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">{scan.limitations?.map((l, i) => <li key={i}>{l}</li>)}</ul>
        {scan.urls?.length > 0 && <p className="mt-3 text-xs text-slate-500">Hosts found (not visited): {scan.urls.join(', ')}</p>}
      </Card>
    </div>
  );
}
