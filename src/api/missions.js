// Ordres de mission.
//   GET    /missions                      → Mission[]
//   GET    /missions/:id                  → Mission
//   POST   /missions                      → Mission (brouillon)
//   PUT    /missions/:id                  → Mission
//   DELETE /missions/:id                  (brouillon)
//   POST   /missions/:id/submit           → Mission (brouillon → en cours, numéro attribué)
//   POST   /missions/:id/recall           → Mission (en cours → brouillon)
//   POST   /missions/:id/cancel  {reason} → Mission (validé → annulé : en attente d’approbation)
//   POST   /missions/:id/retrocession {currency, amount, receipt} → Mission (reçu de la trésorerie)
//   POST   /missions/:id/report  {answers, files} → Mission   (compte rendu)
//   POST   /missions/:id/report/skip      → Mission
//   GET    /missions/:id/pdf              → file
import { request, USE_MOCK } from './client';
import db, { clone, delay, find, nextMissionNumber, childNumber } from './mock/db';
import { uid, todayISO } from '../lib/format';

export async function listMissions() {
  if (!USE_MOCK) return request('/missions');
  await delay();
  return clone(db.missions);
}

export async function getMission(id) {
  if (!USE_MOCK) return request(`/missions/${id}`);
  await delay(60);
  return clone(find('missions', id));
}

// Create or update a draft. Extensions / reductions get their number straight away (the guide shows
// « 2025-0013/01-Prolongement » as a draft); new orders are numbered on submission.
export async function saveMission(mission) {
  if (!USE_MOCK) return mission.id ? request(`/missions/${mission.id}`, { method: 'PUT', body: mission }) : request('/missions', { method: 'POST', body: mission });
  await delay();
  const existing = mission.id && db.missions.find((m) => m.id === mission.id);
  const parent = mission.parentId && db.missions.find((m) => m.id === mission.parentId);
  const saved = {
    ...(existing || { id: uid('om'), createdAt: todayISO(), status: 'draft', collaborator: { id: db.profile.id, matricule: db.profile.matricule, name: `${db.profile.firstName} ${db.profile.lastName}`, jobTitle: db.profile.jobTitle }, timeline: [] }),
    ...mission,
    number: existing?.number || (parent ? childNumber(parent) : mission.number || null),
  };
  if (existing) Object.assign(existing, saved);
  else db.missions.unshift(saved);
  return clone(saved);
}

export async function deleteMission(id) {
  if (!USE_MOCK) return request(`/missions/${id}`, { method: 'DELETE' });
  await delay();
  db.missions = db.missions.filter((m) => m.id !== id);
  return null;
}

export async function submitMission(id) {
  if (!USE_MOCK) return request(`/missions/${id}/submit`, { method: 'POST' });
  await delay();
  const m = find('missions', id);
  m.status = 'pending';
  m.number = m.number || nextMissionNumber();
  m.submittedAt = todayISO();
  m.timeline = [
    { step: 'Hiérarchie', at: null, done: false, comment: '' },
    { step: 'Validateur Fonctionnel', at: null, done: false, comment: '' },
    { step: 'Logistique Voyage', at: null, done: false, comment: '' },
  ];
  return clone(m);
}

export async function recallMission(id) {
  if (!USE_MOCK) return request(`/missions/${id}/recall`, { method: 'POST' });
  await delay();
  const m = find('missions', id);
  m.status = 'draft';
  return clone(m);
}

export async function cancelMission(id, reason) {
  if (!USE_MOCK) return request(`/missions/${id}/cancel`, { method: 'POST', body: { reason } });
  await delay();
  const m = find('missions', id);
  m.status = 'cancel_pending';
  m.cancellation = { reason, requestedAt: todayISO() };
  return clone(m);
}

export async function addRetrocession(id, { currency, amount, receipt = '' }) {
  if (!USE_MOCK) return request(`/missions/${id}/retrocession`, { method: 'POST', body: { currency, amount, receipt } });
  await delay();
  const m = find('missions', id);
  m.retrocession = { currency, amount, receipt, date: todayISO() };
  return clone(m);
}

export async function declineRetrocession(id) {
  if (!USE_MOCK) return request(`/missions/${id}/retrocession/skip`, { method: 'POST' });
  await delay();
  const m = find('missions', id);
  m.retrocession = { none: true, date: todayISO() };
  return clone(m);
}

export async function saveReport(id, report) {
  if (!USE_MOCK) return request(`/missions/${id}/report`, { method: 'POST', body: report });
  await delay();
  const m = find('missions', id);
  m.report = { ...report, submittedAt: todayISO() };
  return clone(m);
}

export async function skipReport(id) {
  if (!USE_MOCK) return request(`/missions/${id}/report/skip`, { method: 'POST' });
  await delay();
  const m = find('missions', id);
  m.report = { skipped: true, submittedAt: todayISO() };
  return clone(m);
}

export async function declineExpenses(id) {
  if (!USE_MOCK) return request(`/missions/${id}/expenses/skip`, { method: 'POST' });
  await delay();
  const m = find('missions', id);
  m.expensesDeclined = true;
  return clone(m);
}

// Returns the file name; the real API streams the PDF.
export async function downloadMissionPdf(id) {
  if (!USE_MOCK) return request(`/missions/${id}/pdf`);
  await delay(200);
  const m = find('missions', id);
  return { filename: `ordre-de-mission-${m.number || 'brouillon'}.pdf` };
}
