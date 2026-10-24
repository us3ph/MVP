// HTTP client for the backend. Until VITE_API_URL is set the app runs on the in-memory mock
// (src/api/mock.js), so the screens can be demoed without a server. Each src/api/*.js module exposes
// the calls the screens make; they switch on USE_MOCK, so wiring the backend is a matter of
// pointing VITE_API_URL at it and matching the routes documented in each module.

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const USE_MOCK = !BASE;

export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function request(path, { method = 'GET', body, params } = {}) {
  const url = new URL(BASE + path, window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => v != null && v !== '' && url.searchParams.set(k, v));
  const res = await fetch(url, {
    method,
    credentials: 'include', // session cookie from the SSO login
    headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detail = null;
    try {
      detail = await res.json();
    } catch {
      /* no body */
    }
    throw new ApiError(res.status, detail?.message || `${method} ${path} → ${res.status}`, detail);
  }
  return res.status === 204 ? null : res.json();
}

// Multipart upload (pièces jointes, photo, passeport…). Returns the stored file descriptor.
export async function upload(path, file, field = 'file') {
  const form = new FormData();
  form.append(field, file);
  const res = await fetch(BASE + path, { method: 'POST', credentials: 'include', body: form });
  if (!res.ok) throw new ApiError(res.status, `upload ${path} → ${res.status}`);
  return res.json();
}
