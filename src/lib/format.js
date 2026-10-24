// Formatting helpers built on date-fns. Dates travel as ISO strings ('2025-05-19',
// '2025-05-19T16:14') and are only turned into French text here.
import {
  addDays as dfAddDays,
  differenceInCalendarDays,
  format,
  formatDistanceToNowStrict,
  isSameMonth,
  isSameQuarter,
  isSameYear,
  isValid,
  parseISO as dfParseISO,
  subYears,
} from 'date-fns';
import { fr } from 'date-fns/locale';

const NBSP = ' ';

// fr-FR uses a narrow no-break space as thousands separator; the design uses a regular-width one.
export const fmtAmount = (n, digits) =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: digits ?? (Number.isInteger(n) ? 0 : 2),
    maximumFractionDigits: 2,
  })
    .format(n || 0)
    .replace(/\u202f/g, NBSP);

export const fmtMoney = (n, currency = 'MAD') => `${fmtAmount(n, 2)}${NBSP}${currency}`;
export const fmtAdvance = (a) => (a && a.amount ? `${fmtAmount(a.amount)}${NBSP}${a.currency}` : '—');

export const parseISO = (s) => {
  if (!s) return null;
  const d = dfParseISO(s);
  return isValid(d) ? d : null;
};
export const toISO = (d) => format(d, 'yyyy-MM-dd');
export const todayISO = () => toISO(new Date());
export const nowISO = () => format(new Date(), "yyyy-MM-dd'T'HH:mm");

const withDate = (iso, fn) => {
  const d = parseISO(iso);
  return d ? fn(d) : '—';
};
export const fmtDate = (iso) => withDate(iso, (d) => format(d, 'dd/MM/yyyy'));
export const fmtDateDot = (iso) => withDate(iso, (d) => format(d, 'dd.MM.yyyy'));
export const fmtDateTime = (iso) => withDate(iso, (d) => format(d, 'dd/MM/yyyy HH:mm'));
export const fmtLongDate = (iso) => withDate(iso, (d) => format(d, 'd MMMM yyyy', { locale: fr }));
export const fmtMonth = (d) => format(d, 'MMM yyyy', { locale: fr });

export const addDays = (iso, n) => toISO(dfAddDays(parseISO(iso), n));
// Calendar days between two ISO dates, both included (a one-day mission counts 1).
export const daysBetween = (a, b) => {
  const da = parseISO(a);
  const db = parseISO(b);
  return da && db ? Math.max(0, differenceInCalendarDays(db, da) + 1) : 0;
};
export const nightsBetween = (a, b) => Math.max(0, daysBetween(a, b) - 1);

// Period filter of the lists (see PERIODS in domain/constants).
export const inPeriod = (iso, code) => {
  if (!code || code === 'all') return true;
  const d = parseISO(iso);
  if (!d) return false;
  const now = new Date();
  switch (code) {
    case 'month':
      return isSameMonth(d, now);
    case 'quarter':
      return isSameQuarter(d, now);
    case 'year':
      return isSameYear(d, now);
    case 'last_year':
      return isSameYear(d, subYears(now, 1));
    default:
      return true;
  }
};

export const timeAgo = (iso) => formatDistanceToNowStrict(new Date(iso), { addSuffix: true, locale: fr });

export const inCountry = (country) => (country === 'Maroc' ? 'au Maroc' : `en ${country}`);
export const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

// Mission number with its suffix as the guide shows it ("2025-0013/01-Prolongement" while the
// change request is still a draft or under validation; just "2025-0013/01" once validated).
const CHANGE_SUFFIX = { extension: 'Prolongement', reduction: 'Réduction' };
export const missionSuffix = (m) => (m?.number && m.change && ['draft', 'pending'].includes(m.status) ? CHANGE_SUFFIX[m.change] || '' : '');
export const missionRef = (m) => {
  if (!m?.number) return '';
  const suffix = missionSuffix(m);
  return suffix ? `${m.number}-${suffix}` : m.number;
};

export const uid = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
