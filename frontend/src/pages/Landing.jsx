import { Link } from 'react-router-dom';
import { BarChart3, FileSearch, Image as ImageIcon, Languages, LockKeyhole, ScanSearch, Sparkles } from 'lucide-react';
import RiskGauge from '../components/RiskGauge.jsx';
import { Logo, MODES, ModeBadge, SeverityBadge } from '../components/ui.jsx';

const Mark = ({ children }) => <mark className="rounded bg-nova-cyan/15 px-0.5 text-cyan-100 underline decoration-nova-cyan decoration-2 underline-offset-4">{children}</mark>;

const FEATURES = [
  [ScanSearch, 'Hybrid detection', 'Deterministic URL and message checks run first, then AI reasoning adds context. Neither is treated as proof on its own.'],
  [FileSearch, 'Evidence you can check', 'Every warning sign quotes the exact phrase it came from, with a plain explanation and its limits.'],
  [Sparkles, 'Advice that fits your situation', 'Nothing clicked, a link opened, or money lost: the next steps change with what you actually did.'],
  [ImageIcon, 'Screenshot reading', 'Upload a screenshot, review the extracted text, correct it, then analyze.'],
  [Languages, 'English and Hinglish', 'Get guidance in the language you think in.'],
  [BarChart3, 'Real history and trends', 'Scans, risk levels and response modes are tracked in your own database.'],
];

const STEPS = [
  ['Detect', 'Parse links and scan wording for known scam patterns. Nothing is opened or executed.'],
  ['Explain', 'Show each warning sign with the quoted evidence behind it.'],
  ['Assess', 'Combine rule checks and AI into a 0 to 100 risk score, with limitations stated.'],
  ['Guide', 'Give prioritized steps based on what you have and have not done.'],
];

const MODE_COPY = {
  prevention: ['You received it but did nothing.', 'Verify through official channels, don\'t pay, block and report.'],
  exposure: ['You clicked, downloaded or shared details.', 'Change exposed passwords on a trusted device, clean your device, watch for misuse.'],
  incident: ['Money or account access may be lost.', 'Call your bank first, then 1930 and cybercrime.gov.in in India. Preserve evidence.'],
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <nav aria-label="Primary" className="flex items-center gap-2">
          <Link to="/dashboard" className="btn-ghost hidden sm:inline-flex">Dashboard</Link>
          <Link to="/analyze" className="btn-primary">Analyze now</Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-14">
          <div>
            <p className="text-sm font-semibold text-nova-mint">Neural Operations for Vigilance &amp; Assistance</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl">Got a message that feels off? Know what it is, and what to do next.</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">NOVA checks messages, emails, links and screenshots for scam signals, shows the evidence behind its risk score, and adapts its advice to what you have already done.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/analyze" className="btn-primary !px-6 !py-3">Analyze a message</Link>
              <a href="#modes" className="btn-ghost !px-6 !py-3">See the three response modes</a>
            </div>
            <p className="mt-4 text-xs text-slate-500">From cyber threat detection to guided action.</p>
          </div>

          <div className="rounded-2xl border border-ink-600 bg-char-800 p-5 shadow-2xl shadow-violet-950/30" aria-label="Sample analysis">
            <p className="mb-3 text-xs text-slate-500">Sample analysis. Illustrative only, not a real scan.</p>
            <p className="rounded-lg bg-ink-900 p-3 text-sm leading-relaxed text-slate-300">
              Congratulations! You are selected for the Merit Scholarship. <Mark>Pay a Rs 500 registration fee</Mark> <Mark>within 2 hours</Mark> and <Mark>share the OTP</Mark> you receive to claim Rs 50,000.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <RiskGauge score={82} severity="critical" size={104} />
              <div className="space-y-2"><div className="flex flex-wrap gap-2"><SeverityBadge severity="critical" /><ModeBadge mode="prevention" /></div>
                <p className="text-sm text-slate-300">Several strong warning signs. Verify on the official portal before doing anything.</p></div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {[['Asks for an upfront fee', 'Genuine scholarships do not charge to release funds.'], ['Asks you to share an OTP', 'No real organisation needs your OTP.'], ['Pressure to act within hours', 'Deadlines stop you from verifying.']].map(([t, d]) => (
                <li key={t} className="rounded-lg border border-ink-600 px-3 py-2"><span className="font-semibold text-slate-100">{t}.</span> <span className="text-slate-400">{d}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-ink-600/50 bg-char-900/60 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">How NOVA works</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(([t, d], i) => (
                <li key={t} className="border-t-2 border-nova-cyan/60 pt-4">
                  <p className="font-display text-sm font-semibold text-nova-cyan">Step {i + 1}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-white">{t}</h3>
                  <p className="mt-2 text-sm text-slate-400">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="modes" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Advice that matches where you are</h2>
          <p className="mt-2 max-w-2xl text-slate-400">The same message needs different guidance depending on whether you ignored it, clicked it, or paid.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {Object.entries(MODES).map(([k, m]) => (
              <article key={k} className="rounded-xl bg-ink-800/70 p-5" style={{ borderTop: `3px solid ${m.hex}` }}>
                <m.Icon className={m.text} size={24} aria-hidden="true" />
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{m.label}</h3>
                <p className="mt-1 font-semibold text-slate-200">{MODE_COPY[k][0]}</p>
                <p className="mt-2 text-sm text-slate-400">{MODE_COPY[k][1]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Built to be honest about what it knows</h2>
          <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {FEATURES.map(([Icon, t, d]) => (
              <div key={t} className="flex gap-4">
                <Icon className="mt-1 shrink-0 text-nova-mint" size={22} aria-hidden="true" />
                <div><h3 className="font-semibold text-white">{t}</h3><p className="mt-1 text-sm text-slate-400">{d}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-nova-violet/30 bg-gradient-to-r from-violet-500/10 to-cyan-400/10 p-8 sm:flex-row sm:items-center">
            <div><h2 className="font-display text-2xl font-bold text-white">Check it before you act on it.</h2><p className="mt-1 text-slate-300">Paste a message, a link or a screenshot. It takes a few seconds.</p></div>
            <Link to="/analyze" className="btn-primary !px-6 !py-3">Analyze now</Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-600/50 py-8">
        <div className="mx-auto max-w-6xl space-y-3 px-4 text-xs leading-relaxed text-slate-500 sm:px-6">
          <p className="flex items-start gap-2"><LockKeyhole size={14} className="mt-0.5 shrink-0" aria-hidden="true" /><span><strong className="text-slate-400">Safety notice.</strong> NOVA provides guidance, not legal, financial or law-enforcement advice, and cannot guarantee that content is safe or fraudulent. Risk scores are heuristic estimates, not probabilities. NOVA never opens links, never asks for passwords, PINs or OTPs, and does not contact banks or authorities for you. In an emergency, call your bank and, in India, helpline 1930.</span></p>
          <p>NOVA - Built for HackIndia 2026, AI &amp; CyberTech Hackathon, KIT Kanpur.</p>
        </div>
      </footer>
    </div>
  );
}
