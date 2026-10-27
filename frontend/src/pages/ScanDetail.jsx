import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import AnalysisResult from '../components/AnalysisResult.jsx';
import { Card, Notice, Skeleton } from '../components/ui.jsx';
import { TYPE_LABEL, fmtDate } from '../utils/format.js';

export default function ScanDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [scan, setScan] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    api.getScan(id).then((d) => live && setScan(d.scan)).catch((e) => live && setError(e.message));
    return () => { live = false; };
  }, [id]);

  const del = async () => {
    if (!window.confirm('Delete this scan permanently?')) return;
    try { await api.deleteScan(id); toast('Scan deleted.', 'success'); nav('/history'); } catch (e) { toast(e.message, 'error'); }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} />History</Link>
        {scan && <button onClick={del} className="btn-ghost !py-1.5 text-red-300"><Trash2 size={16} />Delete</button>}
      </div>
      {error ? <Notice tone="red" title="Could not load this scan">{error}</Notice>
        : !scan ? <div className="space-y-4" aria-busy="true"><Skeleton className="h-40" /><Skeleton className="h-56" /></div>
        : (
          <div className="space-y-4">
            <Card>
              <p className="text-xs text-slate-500">{TYPE_LABEL[scan.inputType]} · {fmtDate(scan.createdAt)}</p>
              <p className="mt-2 whitespace-pre-wrap break-words rounded-md bg-ink-900 p-3 text-sm text-slate-300">{scan.inputPreview}{scan.inputPreview?.length >= 600 ? ' ...' : ''}</p>
              <p className="mt-2 text-xs text-slate-500">Excerpt only (first 600 characters).</p>
            </Card>
            <AnalysisResult scan={scan} saved />
          </div>
        )}
    </div>
  );
}
