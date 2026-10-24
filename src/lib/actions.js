// Which actions a collaborator can trigger on an ordre de mission, by status (user guide §3–6).
// Rows show: Afficher, then `second` (Timeline, or Soumettre for a draft), then `third` (the « … »
// menu when there is one, otherwise Télécharger).
import { ACTIONS } from '../domain/constants';
import { todayISO } from './format';

export function missionActions(m, { report } = {}) {
  const expenseAction = report ? ACTIONS.expenseEdit : ACTIONS.expense;
  let second = ACTIONS.timeline;
  let menu;
  switch (m.status) {
    case 'draft':
      second = ACTIONS.submit;
      menu = [ACTIONS.edit, ACTIONS.download, ACTIONS.delete];
      break;
    case 'pending':
      menu = [ACTIONS.recall, ACTIONS.download];
      break;
    case 'validated':
      menu = [expenseAction, ACTIONS.retrocession, ACTIONS.download, ACTIONS.cancel, ACTIONS.extend, ACTIONS.reduce];
      if (report) menu.push(ACTIONS.expensePdf);
      break;
    case 'cancel_pending':
      menu = [ACTIONS.download];
      if (m.advance?.granted && !m.retrocession) menu.unshift(ACTIONS.retrocession);
      break;
    default: // archived, cancelled: nothing but the PDF
      menu = [];
  }
  return { second, menu, third: menu.length ? null : ACTIONS.download };
}

// Overview bottom bar (« Approuvé le … » + icon actions).
export function overviewActions(m, { report } = {}) {
  if (m.status !== 'validated') return [];
  return [ACTIONS.download, report ? ACTIONS.expenseEdit : ACTIONS.expense, ACTIONS.cancel, ACTIONS.extend, ACTIONS.reduce];
}

// Which post-mission question is pending for a validated order (user guide « Processus post-mission »):
// 1/3 rétrocession, 2/3 compte rendu, 3/3 note de frais.
export function postMissionStep(mission, report) {
  if (mission.status !== 'validated' || !mission.endDate || mission.endDate > todayISO()) return null;
  if (!mission.retrocession) return 1;
  if (!mission.report) return 2;
  if (!report && !mission.expensesDeclined) return 3;
  return null;
}
