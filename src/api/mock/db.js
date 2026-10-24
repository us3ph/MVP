// In-memory database used while no backend is configured (VITE_API_URL unset). Seeded from ./seed
// and mutated by the api/* modules exactly as the server would (numbers assigned on submission,
// statuses moving along the workflow…), so the demo behaves like the real thing.
import { MISSIONS } from './seed/missions';
import { EXPENSE_REPORTS } from './seed/expenseReports';
import { NOTIFICATIONS } from './seed/notifications';
import { PROFILE, DELEGATIONS } from './seed/profile';

export const clone = (x) => (typeof structuredClone === 'function' ? structuredClone(x) : JSON.parse(JSON.stringify(x)));
export const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const db = {
  missions: clone(MISSIONS),
  expenseReports: clone(EXPENSE_REPORTS),
  notifications: clone(NOTIFICATIONS),
  profile: clone(PROFILE),
  delegations: clone(DELEGATIONS),
};

let seq = 200;
export const nextMissionNumber = () => `${new Date().getFullYear()}-${String(seq++).padStart(4, '0')}`;
// Extensions / reductions take the parent's number with a /01, /02… suffix.
export const childNumber = (parent) => {
  const n = db.missions.filter((m) => m.parentId === parent.id && m.number).length + 1;
  return `${parent.number}/${String(n).padStart(2, '0')}`;
};

export const find = (list, id) => {
  const item = db[list].find((x) => x.id === id);
  if (!item) throw new Error(`${list}: ${id} introuvable`);
  return item;
};

export default db;
