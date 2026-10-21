// Sample data matching the design mockup. Replace with API data later.
export const MISSIONS = [
  {
    id: 'm1',
    num: '2026-0090',
    kind: 'national',
    type: 'Training',
    from: '01/01/2026',
    to: '03/01/2026',
    dest: 'Maroc',
    advance: null,
    cost: 1280,
    priority: 'Normal',
    status: 'En cours',
  },
  {
    id: 'm2',
    num: '2025-0089',
    kind: 'international',
    type: 'Mission',
    from: '03/12/2025',
    to: '04/12/2025',
    dest: 'Maroc',
    advance: { amount: 100, currency: 'EUR' },
    cost: 1189.37,
    priority: 'Normal',
    status: 'En cours',
  },
  {
    id: 'm3',
    num: null,
    kind: 'international',
    type: 'Congrès',
    from: '27/08/2025',
    to: '29/08/2025',
    dest: 'France',
    advance: { amount: 520, currency: 'EUR' },
    cost: 10187.69,
    priority: 'Normal',
    status: 'Brouillon',
  },
  {
    id: 'm4',
    num: '2025-0069',
    kind: 'national',
    type: 'Mission',
    from: '18/08/2025',
    to: '21/08/2025',
    dest: 'Maroc',
    advance: null,
    cost: 1752,
    priority: 'Normal',
    status: 'En cours',
  },
  {
    id: 'm5',
    num: '2025-0069',
    kind: 'national',
    type: 'Mission',
    from: '18/08/2025',
    to: '19/08/2025',
    dest: 'Maroc',
    advance: null,
    cost: 1272,
    priority: 'Normal',
    status: 'Validé',
  },
];

export const MISSION_TYPES = ['Mission', 'Training', 'Congrès'];
export const STATUSES = ['En cours', 'Validé', 'Brouillon'];

export const KIND_LABEL = { national: 'Ordre national', international: 'Ordre international' };
export const KIND_ICON = { national: 'car', international: 'plane' };
export const KIND_TILE = { national: 'nat', international: 'int' };
export const STATUS_PILL = { 'En cours': 'pb', Brouillon: 'pg', Validé: 'pv' };

// Secondary row action depends on the status.
export const SECONDARY_ACTION = {
  'En cours': { label: 'Suivre', icon: 'refresh' },
  Brouillon: { label: 'Envoyer', icon: 'send' },
  Validé: { label: 'Historique', icon: 'history' },
};

// fr-FR uses a narrow no-break space as thousands separator; the design uses a regular-width one.
export const fmtAmount = (n) =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(n)
    .replace(/\u202f/g, '\u00a0');

export const fmtAdvance = (a) => (a ? `${fmtAmount(a.amount)} ${a.currency}` : '—');

export const parseFR = (s) => {
  const [d, m, y] = s.split('/').map(Number);
  return new Date(y, m - 1, d);
};

export const fmtMonth = (d) => new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(d);

export const inCountry = (dest) => ({ Maroc: 'au Maroc', France: 'en France' })[dest] || `en ${dest}`;

export const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
