import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);

const STYLE = {
  success: ['border-emerald-400/40', CheckCircle2, 'text-emerald-300'],
  error: ['border-red-400/40', AlertTriangle, 'text-red-300'],
  info: ['border-cyan-400/40', Info, 'text-cyan-300'],
};

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const n = useRef(0);
  const toast = useCallback((message, type = 'info') => {
    const id = ++n.current;
    setItems((i) => [...i, { id, message, type }]);
    setTimeout(() => setItems((i) => i.filter((t) => t.id !== id)), 5000);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex flex-col items-end gap-2" role="status" aria-live="polite">
        {items.map((t) => {
          const [border, Icon, color] = STYLE[t.type] || STYLE.info;
          return (
            <div key={t.id} className={`pointer-events-auto flex max-w-sm items-start gap-2 rounded-lg border ${border} bg-ink-800 px-4 py-3 text-sm text-slate-100 shadow-xl`}>
              <Icon size={18} className={`mt-0.5 shrink-0 ${color}`} aria-hidden="true" />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
