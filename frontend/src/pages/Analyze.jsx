import { useEffect, useRef, useState } from 'react';
import { ImageIcon, Link2, Loader2, Mail, MessageSquare, ScanSearch, Upload } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import AnalysisResult from '../components/AnalysisResult.jsx';
import { Card, Notice, Skeleton, cn } from '../components/ui.jsx';
import { ACTIONS } from '../utils/format.js';

const TYPES = [
  { id: 'message', label: 'Message', Icon: MessageSquare, ph: 'Paste the SMS, WhatsApp or chat message here...' },
  { id: 'email', label: 'Email', Icon: Mail, ph: 'Paste the email subject, sender address and body...' },
  { id: 'url', label: 'URL', Icon: Link2, ph: 'https://example.com/...' },
  { id: 'screenshot', label: 'Screenshot', Icon: ImageIcon, ph: 'Extracted text appears here. Review and correct it before analyzing.' },
];
const MAX_MB = 5;

export default function Analyze() {
  const toast = useToast();
  const [type, setType] = useState('message');
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [actions, setActions] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [ocr, setOcr] = useState(null);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [health, setHealth] = useState(null);
  const resultRef = useRef(null);
  const cur = TYPES.find((t) => t.id === type);

  useEffect(() => { api.health().then(setHealth).catch(() => setHealth({ offline: true })); }, []);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const pickFile = (f) => {
    setOcr(null);
    if (!f) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(f.type)) return toast('Use a PNG, JPEG or WebP image.', 'error');
    if (f.size > MAX_MB * 1024 * 1024) return toast(`Image is larger than ${MAX_MB} MB.`, 'error');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const extract = async () => {
    setOcrBusy(true);
    try {
      const r = await api.ocr(file);
      setText(r.text);
      setOcr(r);
      toast('Text extracted. Please review it before analyzing.', 'success');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setOcrBusy(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (text.trim().length < 3) return setError(type === 'screenshot' ? 'Upload a screenshot and extract its text first, or type the text.' : 'Enter some content to analyze.');
    setBusy(true);
    setResult(null);
    try {
      const data = await api.analyze({ inputType: type, text, language, actions });
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch (err) {
      setError(err.message);
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Analyze something suspicious</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-400">NOVA never opens links or runs files. Don't paste passwords, PINs or OTPs.</p>

      <div className="mt-4 space-y-2">
        {health?.offline && <Notice tone="red" title="Backend not reachable">Start it with <code>npm run dev</code> from the project root, then refresh.</Notice>}
        {health && !health.offline && !health.ai.configured && <Notice title="AI analysis is not configured">Add GEMINI_API_KEY to backend/.env and restart the backend. Rule-based checks will still run.</Notice>}
        {health && !health.offline && !health.db.connected && <Notice title="MongoDB is not connected">Scans will be analyzed but not saved, and Dashboard and History will be unavailable.</Notice>}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form onSubmit={submit} className="space-y-5" noValidate>
          <Card className="space-y-4">
            <div role="tablist" aria-label="Input type" className="grid grid-cols-4 gap-1 rounded-lg bg-ink-900 p-1">
              {TYPES.map(({ id, label, Icon }) => (
                <button type="button" role="tab" key={id} aria-selected={type === id}
                  onClick={() => { setType(id); setError(''); }}
                  className={cn('flex flex-col items-center gap-1 rounded-md px-1 py-2 text-xs font-semibold transition-colors sm:flex-row sm:justify-center sm:gap-2 sm:text-sm',
                    type === id ? 'bg-ink-600 text-white' : 'text-slate-400 hover:text-white')}>
                  <Icon size={16} aria-hidden="true" />{label}
                </button>
              ))}
            </div>

            {type === 'screenshot' && (
              <div className="space-y-3">
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-ink-600 p-5 text-center text-sm text-slate-400 hover:border-nova-cyan">
                  <Upload size={22} className="text-nova-cyan" aria-hidden="true" />
                  <span>{file ? file.name : `Choose a PNG, JPEG or WebP (max ${MAX_MB} MB)`}</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => pickFile(e.target.files?.[0])} />
                </label>
                {preview && <img src={preview} alt="Uploaded screenshot preview" className="max-h-48 w-full rounded-lg border border-ink-600 object-contain" />}
                <button type="button" className="btn-ghost w-full" disabled={!file || ocrBusy} onClick={extract}>
                  {ocrBusy ? <><Loader2 className="animate-spin" size={16} /> Extracting text (first run may take a while)...</> : 'Extract text from screenshot'}
                </button>
                {ocr && <p className="text-xs text-slate-400">OCR confidence about {ocr.confidence}%. OCR can misread characters, so check the text below.{ocr.truncated ? ' Text was truncated to 8,000 characters.' : ''}</p>}
              </div>
            )}

            <div>
              <label htmlFor="content" className="mb-1.5 block text-sm font-semibold text-slate-200">{type === 'screenshot' ? 'Extracted text (editable)' : 'Content'}</label>
              {type === 'url' ? (
                <input id="content" className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder={cur.ph} autoComplete="off" spellCheck="false" />
              ) : (
                <textarea id="content" className="field min-h-[170px] resize-y" value={text} onChange={(e) => setText(e.target.value)} placeholder={cur.ph} maxLength={8000} />
              )}
              <p className="mt-1 text-right text-xs text-slate-500">{text.length} / 8000</p>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-sm font-semibold text-slate-200">Guidance language</legend>
              <div className="inline-flex rounded-lg bg-ink-900 p-1">
                {[['en', 'English'], ['hinglish', 'Hinglish']].map(([v, l]) => (
                  <button type="button" key={v} aria-pressed={language === v} onClick={() => setLanguage(v)}
                    className={cn('rounded-md px-4 py-1.5 text-sm font-semibold', language === v ? 'bg-ink-600 text-white' : 'text-slate-400')}>{l}</button>
                ))}
              </div>
            </fieldset>
          </Card>

          <Card>
            <fieldset>
              <legend className="font-display text-base font-semibold text-white">What have you already done?</legend>
              <p className="mt-1 text-xs text-slate-400">Leave everything unticked if you haven't acted. NOVA adapts its advice to your situation.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {ACTIONS.map(([k, label]) => (
                  <label key={k} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-ink-600 px-3 py-2.5 text-sm hover:bg-ink-700">
                    <input type="checkbox" className="h-4 w-4 accent-cyan-400" checked={!!actions[k]} onChange={(e) => setActions((a) => ({ ...a, [k]: e.target.checked }))} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          </Card>

          {error && <Notice tone="red">{error}</Notice>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? <><Loader2 className="animate-spin" size={16} /> Analyzing...</> : <><ScanSearch size={16} /> Analyze</>}
          </button>
        </form>

        <div ref={resultRef} className="scroll-mt-4">
          {busy ? (
            <div className="space-y-4" aria-busy="true"><Skeleton className="h-40" /><Skeleton className="h-56" /><Skeleton className="h-48" /></div>
          ) : result ? (
            <AnalysisResult {...result} />
          ) : (
            <Card className="hidden text-sm text-slate-400 lg:block">
              <p className="font-display text-base font-semibold text-white">Your assessment appears here</p>
              <p className="mt-2">You will get a risk score, the exact phrases behind it, the limits of the analysis, and steps matched to what you've done so far.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
