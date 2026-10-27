import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { History, LayoutDashboard, Menu, ScanSearch, X } from 'lucide-react';
import { Logo, cn } from '../components/ui.jsx';

const NAV = [
  { to: '/analyze', label: 'Analyze', Icon: ScanSearch },
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/history', label: 'History', Icon: History },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav aria-label="Main" className="mt-8 space-y-1">
      {NAV.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive ? 'bg-nova-cyan/10 text-nova-cyan' : 'text-slate-400 hover:bg-ink-700 hover:text-white')}>
          <Icon size={18} aria-hidden="true" />{label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-60 shrink-0 border-r border-ink-600/60 bg-char-900 p-5 lg:block">
        <Link to="/" aria-label="NOVA home"><Logo /></Link>
        {nav}
        <p className="mt-10 text-xs leading-relaxed text-slate-500">Demo mode: no sign-in. All scans are shared on this installation.</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-600/60 bg-char-900 px-4 py-3 lg:hidden">
          <Link to="/" aria-label="NOVA home"><Logo /></Link>
          <button className="btn-ghost !p-2" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>
        {open && <div id="mobile-nav" className="border-b border-ink-600/60 bg-char-900 px-4 pb-4 lg:hidden">{nav}</div>}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-10"><Outlet /></main>
      </div>
    </div>
  );
}
