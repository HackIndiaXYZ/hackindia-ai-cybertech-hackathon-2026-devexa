const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(code, message, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function request(path, opts = {}) {
  let res;
  try {
    res = await fetch(BASE + path, opts);
  } catch {
    throw new ApiError('NETWORK', 'Cannot reach the NOVA server. Make sure the backend is running on port 4000.', 0);
  }
  let json = null;
  try { json = await res.json(); } catch { /* non-JSON response */ }
  if (!res.ok || !json?.ok) {
    throw new ApiError(json?.error?.code || 'ERROR', json?.error?.message || `Request failed (${res.status}).`, res.status);
  }
  return json.data;
}

const qs = (o) => {
  const p = new URLSearchParams();
  Object.entries(o).forEach(([k, v]) => v !== '' && v != null && p.set(k, v));
  return p.toString();
};

export const api = {
  health: () => request('/health'),
  analyze: (body) => request('/scans/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  ocr: (file) => { const f = new FormData(); f.append('image', file); return request('/ocr', { method: 'POST', body: f }); },
  listScans: (params) => request('/scans?' + qs(params)),
  getScan: (id) => request(`/scans/${id}`),
  deleteScan: (id) => request(`/scans/${id}`, { method: 'DELETE' }),
  stats: (days) => request(`/stats?days=${days}`),
};
