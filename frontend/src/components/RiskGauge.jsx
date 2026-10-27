import { useEffect, useState } from 'react';
import { SEVERITY } from './ui.jsx';

export default function RiskGauge({ score, severity, size = 128 }) {
  const s = SEVERITY[severity] || SEVERITY.low;
  const r = 52;
  const c = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setV(score));
    return () => cancelAnimationFrame(id);
  }, [score]);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Risk score ${score} out of 100, ${s.label}`}>
      <svg viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1F2F4A" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={s.hex} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} style={{ transition: 'stroke-dashoffset 0.9s ease' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-3xl font-bold text-white">{score}</div>
          <div className="text-xs text-slate-400">of 100</div>
        </div>
      </div>
    </div>
  );
}
