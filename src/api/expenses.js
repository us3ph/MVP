// Notes de frais.
//   GET  /expense-reports            → ExpenseReport[]
//   POST /expense-reports            → ExpenseReport (brouillon)
//   PUT  /expense-reports/:id        → ExpenseReport
//   POST /expense-reports/:id/submit → ExpenseReport
//   GET  /expense-reports/:id/pdf    → file
import { request, USE_MOCK } from './client';
import db, { clone, delay, find } from './mock/db';
import { uid, todayISO } from '../lib/format';

export async function listExpenseReports() {
  if (!USE_MOCK) return request('/expense-reports');
  await delay();
  return clone(db.expenseReports);
}

export async function saveExpenseReport(report) {
  if (!USE_MOCK) return report.id ? request(`/expense-reports/${report.id}`, { method: 'PUT', body: report }) : request('/expense-reports', { method: 'POST', body: report });
  await delay();
  const existing = report.id && db.expenseReports.find((r) => r.id === report.id);
  const saved = { ...(existing || { id: uid('ndf'), createdAt: todayISO(), status: 'draft', submittedAt: null, actualCost: null, reimbursement: null, paymentDate: null }), ...report };
  if (existing) Object.assign(existing, saved);
  else db.expenseReports.unshift(saved);
  const mission = db.missions.find((m) => m.id === saved.missionId);
  if (mission) mission.expenseReportId = saved.id;
  return clone(saved);
}

export async function submitExpenseReport(id) {
  if (!USE_MOCK) return request(`/expense-reports/${id}/submit`, { method: 'POST' });
  await delay();
  const r = find('expenseReports', id);
  r.status = 'manager';
  r.submittedAt = todayISO();
  return clone(r);
}

export async function downloadExpenseReportPdf(id) {
  if (!USE_MOCK) return request(`/expense-reports/${id}/pdf`);
  await delay(200);
  const r = find('expenseReports', id);
  const m = db.missions.find((x) => x.id === r.missionId);
  return { filename: `note-de-frais-${m?.number || id}.pdf` };
}
