// Authentification.
//   GET  /auth/sso        → redirects to the UM6P identity provider, back to the app with a session
//   POST /auth/login      {username, password} → Session
//   POST /auth/logout
//   GET  /auth/session    → Session | 401
import { request, USE_MOCK } from './client';
import db, { clone, delay } from './mock/db';

const SESSION_KEY = 'te.session';

const remember = (session) => {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
};

export function restoreSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function loginWithSso() {
  if (!USE_MOCK) {
    window.location.assign(`${import.meta.env.VITE_API_URL}/auth/sso?redirect=${encodeURIComponent(window.location.href)}`);
    return null;
  }
  await delay(400);
  const session = { user: clone(db.profile), via: 'sso' };
  remember(session);
  return session;
}

export async function login({ username, password }) {
  if (!USE_MOCK) {
    const session = await request('/auth/login', { method: 'POST', body: { username, password } });
    remember(session);
    return session;
  }
  await delay(300);
  if (!username || !password) throw new Error('Veuillez saisir votre nom d’utilisateur et votre mot de passe.');
  const session = { user: clone(db.profile), via: 'password' };
  remember(session);
  return session;
}

export async function logout() {
  remember(null);
  if (!USE_MOCK) return request('/auth/logout', { method: 'POST' });
  return null;
}
