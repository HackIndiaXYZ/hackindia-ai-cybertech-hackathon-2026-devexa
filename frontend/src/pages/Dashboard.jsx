import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { api } from '../services/api.js';
import { Card, EmptyState, MODES, Notice, SEVERITY, SeverityBadge, Skeleton } from '../components/ui.jsx';
import { TYPE_LABEL, fmtDate } from '../utils/format.js';

const tip = { contentStyle: { background: '#0F1829', border: '1px solid #1F2F4A', borderRadius: 8, color: '#E2E8F0' } };

function Stat({ label, value, hint }) {
  return (
    <Card>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  );
}

export default function Dashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    setData(null); setError('');
    api.stats(days).then((d) => live && setData(d)).catch((e) => live && setError(e.message));
    return () => { live = false; };
  }, [days]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Calculated from scans stored in your database. Days are UTC.</p>
        </div>
        <label className="text-sm text-slate-400">Period{' '}
          <select className="field !w-auto !py-1.5" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option>
          </select>
        </label>
      </div>

      <div className="mt-6">
        {error ? <Notice tone="red" title="Dashboard unavailable">{error}</Notice>
          : !data ? (
            <div className="space-y-4" aria-busy="true">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}</div>
              <Skeleton className="h-72" />
            </div>
          ) : data.allTime === 0 ? (
            <EmptyState icon={BarChart3} title="No scans yet" action={<Link to="/analyze" className="btn-primary">Analyze your first message</Link>}>
              Your dashboard fills in as you analyze messages, emails, links and screenshots.
            </EmptyState>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Total scans (all time)" value={data.allTime} />
                <Stat label={`Scans, last ${data.days} days`} value={data.total} />
                <Stat label="Average risk score" value={data.total ? data.avgRisk : '-'} hint="Heuristic, 0 to 100" />
                <Stat label="High or critical" value={data.severity.filter((s) => ['high', 'critical'].includes(s.key)).reduce((a, s) => a + s.count, 0)} />
              </div>

              <Card>
                <h2 className="font-display text-base font-semibold text-white">Scan trend</h2>
                <div className="mt-4 h-64" role="img" aria-label="Scans per day">
                  <ResponsiveContainer>
                    <AreaChart data={data.trend} margin={{ left: -20, right: 8 }}>
                      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22D3EE" stopOpacity={0.4} /><stop offset="100%" stopColor="#22D3EE" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid stroke="#1F2F4A" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke="#64748B" fontSize={12} minTickGap={24} />
                      <YAxis allowDecimals={false} stroke="#64748B" fontSize={12} />
                      <Tooltip {...tip} />
                      <Area type="monotone" dataKey="scans" name="Scans" stroke="#22D3EE" fill="url(#g)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <h2 className="font-display text-base font-semibold text-white">Risk distribution</h2>
                  {data.total === 0 ? <p className="mt-4 text-sm text-slate-400">No scans in this period.</p> : (
                    <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
                      <div className="h-48 w-48" role="img" aria-label="Risk distribution">
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie data={data.severity.filter((s) => s.count)} dataKey="count" nameKey="key" innerRadius={50} outerRadius={80} paddingAngle={2} stroke="none">
                              {data.severity.filter((s) => s.count).map((s) => <Cell key={s.key} fill={SEVERITY[s.key].hex} />)}
                            </Pie>
                            <Tooltip {...tip} formatter={(v, n) => [v, SEVERITY[n].label]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <ul className="space-y-1.5 text-sm">
                        {data.severity.map((s) => (
                          <li key={s.key} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: SEVERITY[s.key].hex }} />{SEVERITY[s.key].label}: <strong>{s.count}</strong></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
                <Card>
                  <h2 className="font-display text-base font-semibold text-white">Response modes</h2>
                  <div className="mt-4 h-48" role="img" aria-label="Response mode distribution">
                    <ResponsiveContainer>
                      <BarChart data={data.mode.map((m) => ({ ...m, name: MODES[m.key].label }))} margin={{ left: -20 }}>
                        <CartesianGrid stroke="#1F2F4A" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                        <YAxis allowDecimals={false} stroke="#64748B" fontSize={12} />
                        <Tooltip {...tip} cursor={{ fill: '#162238' }} />
                        <Bar dataKey="count" name="Scans" radius={[4, 4, 0, 0]}>{data.mode.map((m) => <Cell key={m.key} fill={MODES[m.key].hex} />)}</Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <Card>
                <div className="flex items-center justify-between"><h2 className="font-display text-base font-semibold text-white">Recent scans</h2><Link to="/history" className="text-sm text-nova-cyan hover:underline">View all</Link></div>
                {data.recent.length === 0 ? <p className="mt-3 text-sm text-slate-400">No scans in this period.</p> : (
                  <ul className="mt-3 divide-y divide-ink-600/60">
                    {data.recent.map((s) => (
                      <li key={s._id}><Link to={`/history/${s._id}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-ink-700/40">
                        <SeverityBadge severity={s.severity} />
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-300">{s.summary}</span>
                        <span className="text-xs text-slate-500">{TYPE_LABEL[s.inputType]} · {fmtDate(s.createdAt)}</span>
                      </Link></li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          )}
      </div>
    </div>
  );
}
