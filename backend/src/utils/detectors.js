import { combineWeights } from './scoring.js';

const SHORTENERS = new Set(['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly', 'rb.gy', 'shorturl.at', 'ow.ly', 'tiny.cc', 'rebrand.ly', 'bl.ink', 't.ly']);
const RISKY_TLDS = new Set(['xyz', 'top', 'click', 'work', 'zip', 'mov', 'gq', 'tk', 'ml', 'cf', 'ga', 'icu', 'buzz', 'rest', 'loan', 'cyou', 'monster']);
const SLD = new Set(['co', 'com', 'org', 'gov', 'ac', 'net', 'edu', 'nic', 'res']);
// Deliberately small, illustrative list. Absence from this list proves nothing.
const BRANDS = {
  sbi: ['sbi.co.in', 'onlinesbi.sbi', 'onlinesbi.com', 'sbi.bank.in'],
  hdfc: ['hdfcbank.com', 'hdfc.com', 'hdfclife.com'],
  icici: ['icicibank.com', 'icici.com'],
  paytm: ['paytm.com', 'paytm.in'],
  phonepe: ['phonepe.com'],
  amazon: ['amazon.in', 'amazon.com'],
  flipkart: ['flipkart.com'],
  paypal: ['paypal.com'],
  microsoft: ['microsoft.com', 'live.com', 'office.com'],
  apple: ['apple.com', 'icloud.com'],
  google: ['google.com', 'google.co.in', 'gmail.com'],
  netflix: ['netflix.com'],
  whatsapp: ['whatsapp.com', 'whatsapp.net'],
  instagram: ['instagram.com'],
  linkedin: ['linkedin.com'],
  naukri: ['naukri.com'],
};

const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"'`]+|\b(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy|shorturl\.at|ow\.ly|tiny\.cc|t\.ly)\/[^\s<>"'`]+/gi;

const ind = (id, title, evidence, explanation, weight) => ({
  id, title, evidence: String(evidence).slice(0, 200), explanation, weight,
  severity: weight >= 20 ? 'high' : weight >= 10 ? 'medium' : 'low',
  source: 'rules', evidenceVerified: true,
});

export function extractUrls(text) {
  const found = (text.match(URL_RE) || []).map((s) => s.replace(/[.,;:!?)\]]+$/, ''));
  return [...new Set(found)].slice(0, 10);
}

export function normalizeUrlInput(input) {
  const s = String(input || '').trim();
  if (!s || /\s/.test(s) || s.length > 2048) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    if (!['http:', 'https:'].includes(u.protocol)) return null;
    if (!u.hostname.includes('.') && !u.hostname.startsWith('[')) return null;
    return u;
  } catch {
    return null;
  }
}

function registrable(host) {
  const l = host.split('.');
  if (l.length <= 2) return host;
  const tld = l[l.length - 1];
  const sl = l[l.length - 2];
  return tld.length === 2 && SLD.has(sl) ? l.slice(-3).join('.') : l.slice(-2).join('.');
}

// Static analysis only. The URL is parsed, never fetched or opened.
export function analyzeUrl(raw) {
  const u = normalizeUrlInput(raw);
  if (!u) return { host: null, indicators: [] };
  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  const out = [];
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');

  if (u.username || u.password) {
    out.push(ind('userinfo_url', 'Link hides its real destination', raw,
      `Text before the "@" in a link is ignored by browsers; the real host is "${host}". Attackers use this to make a link look like a trusted site.`, 30));
  }
  if (isIp) {
    out.push(ind('ip_url', 'Link uses a raw IP address', raw,
      'Legitimate services almost always use domain names. IP-address links are common in phishing, though some internal tools also use them.', 22));
  } else {
    const reg = registrable(host);
    const nameLabel = reg.split('.')[0];
    const tld = host.split('.').pop();
    if (host.split('.').some((l) => l.startsWith('xn--'))) {
      out.push(ind('punycode', 'Look-alike (punycode) hostname', raw, 'Internationalised domains can imitate well-known names with similar-looking characters.', 20));
    }
    if (SHORTENERS.has(host)) {
      out.push(ind('url_shortener', 'Shortened link (destination hidden)', raw,
        'Shorteners hide the real destination. Many are used legitimately, so this is only informational. NOVA did not expand the link.', 6));
    }
    if (RISKY_TLDS.has(tld)) {
      out.push(ind('risky_tld', `Uncommon domain ending ".${tld}"`, raw,
        `The ".${tld}" ending is cheap and frequently abused, but also used by legitimate sites. Treat it as a weak signal.`, 8));
    }
    const tokens = host.split(/[.-]/);
    for (const [brand, official] of Object.entries(BRANDS)) {
      if (tokens.includes(brand) && !official.includes(reg) && nameLabel !== brand) {
        out.push(ind('brand_lookalike', `Hostname mentions "${brand}" but is not a known ${brand} domain`, raw,
          `The domain "${reg}" is not in NOVA's small list of known official ${brand} domains. That list is incomplete, so verify on the official site.`, 28));
        break;
      }
    }
    if (host.split('.').length - reg.split('.').length >= 3) {
      out.push(ind('many_subdomains', 'Unusually deep subdomain nesting', raw, 'Long chains of subdomains can bury the real domain at the end of the hostname.', 8));
    }
    if ((host.match(/-/g) || []).length >= 3) {
      out.push(ind('hyphen_heavy', 'Hostname contains many hyphens', raw, 'Look-alike phishing domains often chain words with hyphens.', 8));
    }
  }
  if (u.protocol === 'http:') {
    out.push(ind('plain_http', 'Link is not encrypted (HTTP)', raw,
      'Many older legitimate sites still use HTTP, so this is a minor signal. Never enter passwords or payment details on a non-HTTPS page.', 3));
  }
  return { host, indicators: out };
}

const SECRET = /\b(otp|one[- ]time password|password|passcode|cvv|card number|card details|bank details|account number|aadhaar|upi pin|atm pin|pin number|your pin)\b/i;
const VERB = /\b(share|send|enter|provide|confirm|tell|verify|give|submit|reply with)\b/gi;
const NEGATION = /\b(do not|don't|dont|never|not|won't|will not|should not)\s+(\w+\s+){0,2}$/i;

function credentialRequest(text) {
  VERB.lastIndex = 0;
  let m;
  while ((m = VERB.exec(text))) {
    if (NEGATION.test(text.slice(Math.max(0, m.index - 25), m.index))) continue; // "never share your OTP" is a warning, not a request
    const from = Math.max(0, m.index - 40);
    const win = text.slice(from, m.index + m[0].length + 45);
    const k = win.match(SECRET);
    if (k) {
      const a = Math.min(m.index, from + k.index);
      const b = Math.max(m.index + m[0].length, from + k.index + k[0].length);
      return text.slice(a, b);
    }
  }
  return null;
}

const RULES = [
  { id: 'urgency', title: 'Pressure to act quickly', weight: 12,
    re: /\b(urgent(ly)?|immediately|act now|last chance|final (notice|warning)|within \d+ ?(hours?|hrs?|minutes?|mins?)|expires? (today|soon|in \d+)|(account|card|sim|number) (will be |is |has been )?(blocked|suspended|deactivated|closed)|today only)\b/i,
    why: 'Scammers create deadlines so you act before verifying. Genuine organisations also set deadlines, so this is a weak signal alone.' },
  { id: 'payment_request', title: 'Asks for an upfront fee or payment', weight: 25,
    re: /\b(registration|processing|security|refundable|verification|training|kit|joining|admission|document|activation|clearance|release)\s+(fee|fees|charges?|deposit|amount)\b|\bpay\b.{0,40}\b(fee|deposit|₹|rs\.?|inr)|(?:₹|\brs\.?|\binr)\s?\d[\d,]*.{0,40}\b(?:pay|transfer|send|deposit)\b/i,
    why: 'Genuine scholarships, internships and jobs do not normally require candidates to pay to receive an offer. Confirm on the organisation\'s official website.' },
  { id: 'guaranteed_outcome', title: 'Promises a guaranteed result', weight: 22,
    re: /\b(100% (guaranteed|placement|job|selection)|guaranteed (job|placement|selection|returns?|scholarship|income)|no interview|without (any )?interview|assured (job|income))\b/i,
    why: 'Guaranteed jobs, placements or returns are a classic lure. Real selection processes rarely promise outcomes upfront.' },
  { id: 'unsolicited_selection', title: 'Unexpected "you have been selected" claim', weight: 10,
    re: /\b(you (have been|are|were) (selected|chosen|shortlisted)|congratulations)\b/i,
    why: 'Unprompted selection or prize messages are used as bait. Genuine selections exist too, so check whether you actually applied.' },
  { id: 'lottery_prize', title: 'Lottery, prize or cashback claim', weight: 20,
    re: /\b(lottery|lucky draw|prize money|won (rs\.?|₹|inr|\$)\s?\d|cashback (claim|offer))\b/i,
    why: 'You cannot win a lottery or draw you never entered. These messages usually lead to a fee or a data-harvesting page.' },
  { id: 'kyc_pressure', title: 'KYC update or account-block threat', weight: 15,
    re: /\bkyc\b.{0,60}\b(expire[sd]?|update|pending|suspend(ed)?|block(ed)?)\b/i,
    why: 'Banks do not usually ask for KYC updates through unsolicited links. Use the official app or branch instead.' },
  { id: 'digital_arrest', title: 'Threat of arrest, parcel seizure or legal action', weight: 28,
    re: /\b(digital arrest|arrest warrant|parcel (has been )?(seized|held|detained)|illegal (items|goods|parcel)|narcotics)\b/i,
    why: 'Police and customs agencies do not demand money or video-call "custody" by phone or chat. This is a well-known scam script.' },
  { id: 'remote_access', title: 'Asks you to install a remote-access app', weight: 35,
    re: /\b(anydesk|teamviewer|quicksupport|ultraviewer|rustdesk)\b/i,
    why: 'Remote-access apps give someone control of your device and banking apps. Only install them for support you initiated yourself.' },
  { id: 'apk_file', title: 'Mentions installing an APK file', weight: 25,
    re: /\b[\w.-]+\.apk\b/i,
    why: 'Apps installed outside official stores can contain malware, including tools that read SMS and OTPs.' },
  { id: 'messaging_redirect', title: 'Moves the conversation to WhatsApp or Telegram', weight: 12,
    re: /\b(contact|message|join|text|dm)\b.{0,40}\b(whatsapp|telegram)\b|\b(whatsapp|telegram)\b.{0,40}(\+?\d[\d\s-]{8,}|link|group)/i,
    why: 'Recruiters and institutions usually use official email and portals. Pushing you to private chat apps is a common scam pattern.' },
];

const ORG = /\b(rbi|reserve bank|income tax|cbi|police|customs|trai|uidai|npci|sebi|ugc|aicte|ministry|government of india|sbi|hdfc|icici|amazon|flipkart|tcs|infosys|wipro|google|microsoft)\b/i;

export function messageIndicators(text) {
  const out = [];
  const cred = credentialRequest(text);
  if (cred) {
    out.push(ind('credential_request', 'Asks for OTP, password, PIN or ID details', cred,
      'Genuine banks and organisations never ask you to share OTPs, PINs or passwords. NOVA will never ask for them either.', 35));
  }
  for (const r of RULES) {
    const m = text.match(r.re);
    if (m) out.push(ind(r.id, r.title, m[0], r.why, r.weight));
  }
  const email = text.match(/[\w.+-]+@(?:gmail|yahoo|outlook|hotmail|rediffmail)\.com/i);
  if (email && /\b(hr|recruit\w*|talent|careers?|official|scholarship|admissions?|bank|government|ministry|kyc|support)\b/i.test(text)) {
    out.push(ind('free_email', 'Official-sounding sender uses a free email address', email[0],
      'Established organisations normally email from their own domain. A free address does not prove fraud but deserves verification.', 12));
  }
  return out;
}

export function runDetectors({ inputType, text }) {
  const raw = [];
  const hosts = [];
  const urls = inputType === 'url' ? [text.trim()] : extractUrls(text);
  for (const u of urls) {
    const r = analyzeUrl(u);
    if (r.host) { hosts.push(r.host); raw.push(...r.indicators); }
  }
  if (inputType !== 'url') {
    raw.push(...messageIndicators(text));
    const org = text.match(ORG);
    if (org && raw.some((i) => i.weight >= 12)) {
      raw.push(ind('impersonation', `Names a well-known organisation ("${org[0]}")`, org[0],
        'NOVA cannot verify who actually sent this. Contact the organisation using details from its official website.', 8));
    }
  }
  const seen = new Set();
  const indicators = raw.filter((i) => {
    const k = `${i.id}|${i.evidence.toLowerCase()}`;
    return seen.has(k) ? false : (seen.add(k), true);
  });
  return { indicators, hosts: [...new Set(hosts)], ruleScore: combineWeights(indicators.map((i) => i.weight)) };
}
