// Profil et délégations.
//   GET    /me                      → Profile
//   PUT    /me                      → Profile
//   POST   /me/password  {current, next}
//   GET    /me/delegations          → Delegation[]
//   POST   /me/delegations          → Delegation
//   PUT    /me/delegations/:id      → Delegation
//   DELETE /me/delegations/:id
import { request, USE_MOCK } from './client';
import db, { clone, delay } from './mock/db';
import { uid } from '../lib/format';

export async function getProfile() {
  if (!USE_MOCK) return request('/me');
  await delay(60);
  return clone(db.profile);
}

export async function updateProfile(profile) {
  if (!USE_MOCK) return request('/me', { method: 'PUT', body: profile });
  await delay();
  Object.assign(db.profile, profile);
  return clone(db.profile);
}

export async function changePassword({ current, next }) {
  if (!USE_MOCK) return request('/me/password', { method: 'POST', body: { current, next } });
  await delay();
  if (!current || !next) throw new Error('Mot de passe manquant.');
  return null;
}

export async function listDelegations() {
  if (!USE_MOCK) return request('/me/delegations');
  await delay(60);
  return clone(db.delegations);
}

export async function saveDelegation(delegation) {
  if (!USE_MOCK) return delegation.id ? request(`/me/delegations/${delegation.id}`, { method: 'PUT', body: delegation }) : request('/me/delegations', { method: 'POST', body: delegation });
  await delay();
  const existing = delegation.id && db.delegations.find((d) => d.id === delegation.id);
  const saved = { ...(existing || { id: uid('dlg') }), ...delegation };
  if (existing) Object.assign(existing, saved);
  else db.delegations.push(saved);
  return clone(saved);
}

export async function deleteDelegation(id) {
  if (!USE_MOCK) return request(`/me/delegations/${id}`, { method: 'DELETE' });
  await delay();
  db.delegations = db.delegations.filter((d) => d.id !== id);
  return null;
}
