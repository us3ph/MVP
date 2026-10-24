// Workflow vocabulary shared with the backend: status codes, order kinds, transport modes, the
// actions a collaborator can trigger. These are part of the API contract (the server stores the
// `code`s), so they live in the front end on purpose. Everything that is business data — entities,
// countries, cities, people, mission types, barème… — is NOT here: it comes from the referentials
// API (see src/api/referentials.js).

export const MISSION_KINDS = [
  { code: 'national', label: 'Ordre de mission national', short: 'Ordre national', icon: 'car', tile: 'nat' },
  { code: 'international', label: 'Ordre de mission international', short: 'Ordre international', icon: 'plane', tile: 'int' },
];
export const KIND = Object.fromEntries(MISSION_KINDS.map((k) => [k.code, k]));
export const KIND_LABEL = Object.fromEntries(MISSION_KINDS.map((k) => [k.code, k.label]));
export const KIND_SHORT = Object.fromEntries(MISSION_KINDS.map((k) => [k.code, k.short]));
export const KIND_ICON = Object.fromEntries(MISSION_KINDS.map((k) => [k.code, k.icon]));
export const KIND_TILE = Object.fromEntries(MISSION_KINDS.map((k) => [k.code, k.tile]));

// Ordre de mission. `pill` is the CSS class of the status badge.
export const MISSION_STATUSES = [
  { code: 'draft', label: 'Brouillon', pill: 'pg' },
  { code: 'pending', label: 'En cours', pill: 'po' },
  { code: 'validated', label: 'Validé', pill: 'pv' },
  { code: 'archived', label: 'Archivé', pill: 'pm' },
  { code: 'cancel_pending', label: 'Annulé : En attente d’approbation', short: 'Annulé', pill: 'pk' },
  { code: 'cancelled', label: 'Annulé', pill: 'pk' },
];
export const MISSION_STATUS = Object.fromEntries(MISSION_STATUSES.map((s) => [s.code, s]));
export const statusLabel = (code) => MISSION_STATUS[code]?.label || code;
// Compact label for list pills (the full one stays in the tooltip and on the detail page).
export const statusShort = (code) => MISSION_STATUS[code]?.short || statusLabel(code);
export const statusPill = (code) => MISSION_STATUS[code]?.pill || 'pg';
export const CANCELLED_STATUSES = ['cancel_pending', 'cancelled'];

// Note de frais.
export const EXPENSE_STATUSES = [
  { code: 'draft', label: 'Brouillon', pill: 'pg' },
  { code: 'manager', label: 'En cours Responsable hiérarchique', short: 'En cours Hiérarchie', pill: 'pv' },
  { code: 'controller', label: 'En cours Contrôleur', pill: 'pv' },
  { code: 'hr', label: 'En cours RH', pill: 'pv' },
  { code: 'payment_pending', label: 'En attente de paiement', short: 'Attente paiement', pill: 'pa' },
  { code: 'paid', label: 'Payée', pill: 'pv' },
];
export const EXPENSE_STATUS = Object.fromEntries(EXPENSE_STATUSES.map((s) => [s.code, s]));
export const expenseStatusLabel = (code) => EXPENSE_STATUS[code]?.label || code;
export const expenseStatusShort = (code) => EXPENSE_STATUS[code]?.short || expenseStatusLabel(code);
export const expenseStatusPill = (code) => EXPENSE_STATUS[code]?.pill || 'pg';
// Order of the validation circuit of a note de frais (used by the timeline panel).
export const EXPENSE_FLOW = ['manager', 'controller', 'hr', 'payment_pending', 'paid'];

export const TRANSPORT_MODES = [
  { code: 'air', label: 'Aérien', icon: 'plane' },
  { code: 'rail', label: 'Ferroviaire', icon: 'train' },
  { code: 'road', label: 'Routier', icon: 'car' },
  { code: 'other', label: 'Autre', icon: 'bag' },
];
export const TRANSPORT_MODE = Object.fromEntries(TRANSPORT_MODES.map((m) => [m.code, m]));

// Kinds of change requested on a validated order.
export const CHANGE = { EXTENSION: 'extension', REDUCTION: 'reduction' };

// Actions on an ordre de mission (rows, overview, menus). `key` is what the UI dispatches.
export const ACTIONS = {
  view: { key: 'view', label: 'Afficher', icon: 'eye' },
  timeline: { key: 'timeline', label: 'Timeline', icon: 'history' },
  download: { key: 'download', label: 'Télécharger', icon: 'download' },
  submit: { key: 'submit', label: 'Soumettre', icon: 'send' },
  edit: { key: 'edit', label: 'Modifier', icon: 'edit' },
  recall: { key: 'recall', label: 'Rappeler', icon: 'undo' },
  cancel: { key: 'cancel', label: 'Annuler', icon: 'minus-circle' },
  extend: { key: 'extend', label: 'Prolonger ma mission', icon: 'bookmark-plus' },
  reduce: { key: 'reduce', label: 'Réduire ma mission', icon: 'bookmark-minus' },
  retrocession: { key: 'retrocession', label: 'Ajouter une rétrocession', icon: 'comment-plus' },
  expense: { key: 'expense', label: 'Ajouter une note de frais', icon: 'note-add' },
  expenseEdit: { key: 'expenseEdit', label: 'Modifier la note de frais', icon: 'note-add' },
  expensePdf: { key: 'expensePdf', label: 'Télécharger la note de frais en PDF', icon: 'download' },
  delete: { key: 'delete', label: 'Supprimer', icon: 'trash', danger: true },
};

// Period filter of the lists.
export const PERIODS = [
  { code: 'all', label: 'Tout' },
  { code: 'month', label: 'Ce mois-ci' },
  { code: 'quarter', label: 'Ce trimestre' },
  { code: 'year', label: 'Cette année' },
  { code: 'last_year', label: 'Année dernière' },
];

// Notifications: icon and tone per kind.
export const NOTIFICATION_KINDS = {
  om_returned: { icon: 'briefcase', tone: 'warn' },
  om_validated: { icon: 'briefcase', tone: 'ok' },
  retro_validated: { icon: 'coins', tone: 'ok' },
  advance_granted: { icon: 'wallet', tone: 'ok' },
  advance_ready: { icon: 'wallet', tone: 'info' },
  ndf_returned: { icon: 'note-add', tone: 'warn' },
};
