import { AlertTriangle, Eye, Info, ShieldCheck, Siren } from 'lucide-react';

export const cn = (...a) => a.filter(Boolean).join(' ');

export const SEVERITY = {
  low: { label: 'Low', text: 'text-emerald-300', bg: 'bg-emerald-400/10', ring: 'ring-emerald-400/30', hex: '#34D399' },
  moderate: { label: 'Moderate', text: 'text-amber-300', bg: 'bg-amber-400/10', ring: 'ring-amber-400/30', hex: '#FBBF24' },
  high: { label: 'High', text: 'text-orange-300', bg: 'bg-orange-400/10', ring: 'ring-orange-400/30', hex: '#FB923C' },
  critical: { label: 'Critical', text: 'text-red-300', bg: 'bg-red-400/10', ring: 'ring-red-400/30', hex: '#F87171' },
};

export const MODES = {
  prevention: { label: 'Prevention', hint: 'Nothing acted on yet', Icon: ShieldCheck, text: 'text-cyan-300', bg: 'bg-cyan-400/10', ring: 'ring-cyan-400/30', hex: '#22D3EE' },
  exposure: { label: 'Exposure', hint: 'Clicked, downloaded or shared something', Icon: Eye, text: 'text-violet-300', bg: 'bg-violet-400/10', ring: 'ring-violet-400/30', hex: '#8B5CF6' },
  incident: { label: 'Incident', hint: 'Possible financial loss or account compromise', Icon: Siren, text: 'text-rose-300', bg: 'bg-rose-400/10', ring: 'ring-rose-400/30', hex: '#FB7185' },
};

const pill = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1';

export function SeverityBadge({ severity }) {
  const s = SEVERITY[severity] || SEVERITY.low;
  return (
    <span className={cn(pill, s.bg, s.text, s.ring)}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.hex }} aria-hidden="true" />
      {s.label} risk
    </span>
  );
}

export function ModeBadge({ mode }) {
  const m = MODES[mode] || MODES.prevention;
  return (
    <span className={cn(pill, m.bg, m.text, m.ring)}>
      <m.Icon size={13} aria-hidden="true" />
      {m.label} mode
    </span>
  );
}

export const Card = ({ className, children, ...p }) => (
  <section className={cn('rounded-xl border border-ink-600/70 bg-ink-800/70 p-5', className)} {...p}>{children}</section>
);

export const Skeleton = ({ className }) => <div className={cn('skeleton', className)} aria-hidden="true" />;

export function EmptyState({ icon: Icon = Info, title, children, action }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-ink-600 px-6 py-12 text-center">
      <Icon className="mb-3 text-nova-cyan" size={28} aria-hidden="true" />
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-400">{children}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const TONES = { amber: 'border-amber-400/30 bg-amber-400/10 text-amber-100', red: 'border-red-400/30 bg-red-400/10 text-red-100', cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100' };
export function Notice({ tone = 'amber', title, children }) {
  return (
    <div role="alert" className={cn('flex gap-3 rounded-lg border p-3 text-sm', TONES[tone])}>
      <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div>{title && <p className="font-semibold">{title}</p>}<p className="opacity-90">{children}</p></div>
    </div>
  );
}

export const Logo = ({ size = 22 }) => (
  <span className="inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white">
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-nova-cyan to-nova-violet text-ink-950">
      <ShieldCheck size={size - 4} aria-hidden="true" />
    </span>
    NOVA
  </span>
);
