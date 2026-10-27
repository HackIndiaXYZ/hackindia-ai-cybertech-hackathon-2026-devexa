import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, Search, Trash2 } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import { Card, EmptyState, ModeBadge, Notice, SeverityBadge, Skeleton } from '../components/ui.jsx';
import { TYPE_LABEL, fmtDate } from '../utils/format.js';

export default function History() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [f, setF] = useState({ severity: '', mode: '', inputType: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { const t = setTimeout(() => { setSearch(q); setPage(1); }, 350); return () => clearTimeout(t); }, [q]);

  const load = useCallback(() => {
    setError('');
    return api.listScans({ search, ...f, page, limit: 10 }).then(setData).catch((e) => { setData(null); setError(e.message); });
  }, [search, f, page]);
  useEffect(() => { setData(null); load(); }, [load]);

  const del = async (id) => {
    if (!window.confirm('Delete this scan permanently?')) return;
    try { await api.deleteScan(id); toast('Scan deleted.', 'success'); load(); } catch (e) { toast(e.message, 'error'); }
  };
  const setFilter = (k) => (e) => { setF((x) => ({ ...x, [k]: e.target.value })); setPage(1); };
  const filtered = search || f.severity || f.mode || f.inputType;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Scan history</h1>
      <p className="mt-1 text-sm text-slate-400">Only a short excerpt of each input is stored. Screenshots are never stored.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={16} className="absolute left-3 top-3 text-slate-500" aria-hidden="true" />
          <input className="field !pl-9" placeholder="Search text or hosts" aria-label="Search scans" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="field" aria-label="Filter by severity" value={f.severity} onChange={setFilter('severity')}>
          <option value="">All severities</option><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option><option value="critical">Critical</option>
        </select>
        <select className="field" aria-label="Filter by mode" value={f.mode} onChange={setFilter('mode')}>
          <option value="">All modes</option><option value="prevention">Prevention</option><option value="exposure">Exposure</option><option value="incident">Incident</option>
        </select>
        <select className="field" aria-label="Filter by type" value={f.inputType} onChange={setFilter('inputType')}>
          <option value="">All types</option>{Object.entries(TYPE_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>

      <div className="mt-5">
        {error ? <Notice tone="red" title="History unavailable">{error}</Notice>
          : !data ? <div className="space-y-3" aria-busy="true">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}</div>
          : data.items.length === 0 ? (
            <EmptyState icon={HistoryIcon} title={filtered ? 'No scans match these filters' : 'No scans yet'} action={!filtered && <Link to="/analyze" className="btn-primary">Analyze something</Link>}>
              {filtered ? 'Try a different search or clear the filters.' : 'Scans you run are saved here so you can revisit the evidence and next steps.'}
            </EmptyState>
          ) : (
            <>
              <ul className="space-y-3">
                {data.items.map((s) => (
                  <li key={s._id}>
                    <Card className="flex items-start gap-3 !p-0">
                      <Link to={`/history/${s._id}`} className="min-w-0 flex-1 p-4 hover:bg-ink-700/40">
                        <div className="flex flex-wrap items-center gap-2"><SeverityBadge severity={s.severity} /><ModeBadge mode={s.mode} /><span className="text-xs text-slate-500">{TYPE_LABEL[s.inputType]} · Score {s.riskScore} · {fmtDate(s.createdAt)}</span></div>
                        <p className="mt-2 truncate text-sm text-slate-200">{s.summary}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{s.inputPreview}</p>
                      </Link>
                      <button className="m-3 rounded-lg p-2 text-slate-400 hover:bg-red-400/10 hover:text-red-300" onClick={() => del(s._id)} aria-label="Delete scan"><Trash2 size={18} /></button>
                    </Card>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                <span>{data.total} scan{data.total === 1 ? '' : 's'}</span>
                <div className="flex items-center gap-3">
                  <button className="btn-ghost !py-1.5" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                  <span>Page {data.page} of {data.pages}</span>
                  <button className="btn-ghost !py-1.5" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
