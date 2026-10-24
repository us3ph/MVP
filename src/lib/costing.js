// Costing of an order (indemnités, allocations, décompte) following the Direction du Capital
// Humain barème (annexes 1 & 2) served by the referentials API; nothing is typed here. The backend
// owns the real computation — these helpers mirror it so the screens can show live estimates.
import { eachDayOfInterval } from 'date-fns';
import { daysBetween, nightsBetween, parseISO } from './format';

export const toMAD = (amount, currency, rates) => (amount || 0) * (rates?.[currency] ?? 1);
export const round2 = (n) => Math.round(n * 100) / 100;

const fmtQty = (n) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(n);
const fmtMoney = ({ amount, currency }) => `${fmtQty(amount)} ${currency}`;
const line = (key, label, icon, amount, currency, detail, extra = {}) => ({ key, label, icon, amount: round2(amount), currency, detail, ...extra });

// City names compared without accents, case or the GeoNames spelling variants.
export const normalizeCity = (name, ref) => {
  const canon = ref?.cityAliases?.[name] || name || '';
  return canon
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

// Road distance between two cities from the distance table (symmetric), null when unknown.
export function distanceKm(ref, a, b) {
  if (!a || !b) return null;
  const na = normalizeCity(a, ref);
  const nb = normalizeCity(b, ref);
  if (na === nb) return 0;
  const d = ref.distances || {};
  const rows = Object.entries(d).map(([from, row]) => [normalizeCity(from, ref), Object.fromEntries(Object.entries(row).map(([to, km]) => [normalizeCity(to, ref), km]))]);
  const table = Object.fromEntries(rows);
  const v = table[na]?.[nb] ?? table[nb]?.[na];
  return typeof v === 'number' ? v : null;
}

const toMin = (hhmm) => {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};

// Barème national: a meal allowance is due for each day whose mission hours cover the whole slot
// (12h–14h for lunch, 19h30–21h30 for dinner). Missing times mean the whole day.
export function mealsFor(m, ref) {
  const b = ref.bareme.national.meals;
  const start = parseISO(m.startDate);
  const end = parseISO(m.endDate);
  if (!start || !end || end < start) return { lunches: 0, dinners: 0 };
  const days = eachDayOfInterval({ start, end });
  const covers = (from, to, slot) => from <= toMin(slot[0]) && to >= toMin(slot[1]);
  let lunches = 0;
  let dinners = 0;
  days.forEach((_, i) => {
    const from = i === 0 ? (toMin(m.startTime) ?? 0) : 0;
    const to = i === days.length - 1 ? (toMin(m.endTime) ?? 24 * 60) : 24 * 60;
    if (covers(from, to, b.lunch)) lunches += 1;
    if (covers(from, to, b.dinner)) dinners += 1;
  });
  return { lunches, dinners };
}

// Indemnité de séjour (international): per diem per mission day, or the prorated monthly flat rate
// for long stays.
export function perDiem(m, ref) {
  const b = ref.bareme.international;
  const days = daysBetween(m.startDate, m.endDate);
  const longStay = days >= b.longStay.minDays;
  const amount = round2(longStay ? (b.longStay.monthly.amount * days) / 30 : days * b.perDiem.amount);
  const currency = longStay ? b.longStay.monthly.currency : b.perDiem.currency;
  const detail = longStay ? `Long séjour : ${fmtMoney(b.longStay.monthly)} / mois × ${days} j / 30` : `${days} jour${days > 1 ? 's' : ''} × ${fmtMoney(b.perDiem)}`;
  return { days, amount, currency, mad: round2(toMAD(amount, currency, ref.rates)), longStay, detail };
}

// Kilometre allowance: personal-car legs at the km rate. With no road leg, the transfer from the
// ville d’affectation to the destination (national) or to the airport (international), round trip.
export function kmAllowance(m, ref) {
  const transports = m.transports || [];
  const roadLegs = transports.filter((t) => t.mode === 'road');
  const personalLegs = roadLegs.filter((t) => (t.vehicle || 'personal') === 'personal');
  const none = { km: 0, amount: 0, currency: ref.bareme.kmRate.currency, unknown: false };
  // Road legs by service car or public transport: no allowance (reimbursed on receipts instead).
  if (roadLegs.length && !personalLegs.length) return none;
  let km = 0;
  let unknown = false;
  if (personalLegs.length) {
    personalLegs.forEach((t) => {
      const d = distanceKm(ref, t.fromCity, t.toCity);
      if (d == null) unknown = true;
      else km += d;
    });
  } else {
    // No road leg at all: a national trip by rail/air gets nothing; an international trip still has
    // the transfer from the ville d’affectation to the airport, round trip.
    if (m.kind === 'national' && transports.length) return none;
    const target = m.kind === 'international' ? (transports.find((t) => t.mode === 'air')?.fromCity ?? ref.airportCity.name) : m.cities?.[0];
    const d = distanceKm(ref, ref.homeCity.name, target);
    if (d == null) unknown = true;
    else km = 2 * d;
  }
  return { km, amount: round2(km * ref.bareme.kmRate.amount), currency: ref.bareme.kmRate.currency, unknown };
}

// « Coût global estimé de la mission »: the lines (their MAD total is sumMAD()).
export function estimateLines(m, ref) {
  const b = ref.bareme;
  const nights = Math.max(1, nightsBetween(m.startDate, m.endDate));
  const days = daysBetween(m.startDate, m.endDate);
  const transports = m.transports || [];
  const lines = [];
  const km = kmAllowance(m, ref);
  const kmLine = () =>
    lines.push(line('km', 'Allocation kilométrique', 'car', km.amount, km.currency || b.kmRate.currency, km.unknown ? 'Distance non référencée' : `${fmtQty(km.km)} km × ${fmtMoney(b.kmRate)}`, { km: km.km }));
  if (m.kind === 'international') {
    const pd = perDiem(m, ref);
    lines.push(line('perdiem', pd.longStay ? 'Forfait long séjour' : 'Indemnité de séjour', 'calendar', pd.amount, pd.currency, pd.detail));
    if (km.km > 0 || km.unknown) kmLine();
    if (m.lodgingSkipped?.flatRate) lines.push(line('lodging', 'Allocation hébergement', 'bed', nights * b.international.lodging.flat.amount, b.international.lodging.flat.currency, `${nights} nuit${nights > 1 ? 's' : ''} × ${fmtMoney(b.international.lodging.flat)}`));
    const airLegs = transports.filter((t) => t.mode === 'air').length;
    if (airLegs) lines.push(line('airport', 'Allocation transfert aéroport', 'plane', airLegs * b.international.airportTransferAbroad.amount, b.international.airportTransferAbroad.currency, `${airLegs} trajet${airLegs > 1 ? 's' : ''} × ${fmtMoney(b.international.airportTransferAbroad)}`));
  } else {
    const meals = mealsFor(m, ref);
    const mealRate = { amount: b.national.meals.amount, currency: b.national.meals.currency };
    if (meals.lunches) lines.push(line('lunch', 'Allocation repas déjeuner', 'utensils', meals.lunches * mealRate.amount, mealRate.currency, `${meals.lunches} × ${fmtMoney(mealRate)} (tranche 12h–14h)`));
    if (meals.dinners) lines.push(line('dinner', 'Allocation repas dîner', 'utensils', meals.dinners * mealRate.amount, mealRate.currency, `${meals.dinners} × ${fmtMoney(mealRate)} (tranche 19h30–21h30)`));
    if (km.km > 0 || km.unknown) kmLine();
    const publicTransport = transports.some((t) => t.mode === 'rail' || (t.mode === 'road' && t.vehicle === 'public'));
    if (publicTransport) lines.push(line('intra', 'Forfait transport intra-urbain', 'bag', days * b.national.intraUrban.amount, b.national.intraUrban.currency, `${days} jour${days > 1 ? 's' : ''} × ${fmtMoney(b.national.intraUrban)} (transports publics)`));
    if (m.lodgingSkipped?.flatRate) lines.push(line('lodging', 'Allocation hébergement', 'bed', nights * b.national.lodging.flat.amount, b.national.lodging.flat.currency, `${nights} nuit${nights > 1 ? 's' : ''} × ${fmtMoney(b.national.lodging.flat)}`));
  }
  return lines;
}

export const sumMAD = (lines, rates) => lines.reduce((s, l) => s + toMAD(l.amount, l.currency, rates), 0);
export const costLines = (m, ref) => (m.costLines?.length ? m.costLines : estimateLines(m, ref));
export const estimatedCost = (m, ref) => (m.estimatedCost != null ? m.estimatedCost : round2(sumMAD(costLines(m, ref), ref.rates)));

// Texts of the « Ignorer l’hébergement » acknowledgement, from the barème.
export function lodgingSkipTexts(kind, ref) {
  const fmt = ({ amount, currency }) => `${new Intl.NumberFormat('fr-FR').format(amount)} ${currency === 'EUR' ? '€' : currency}`;
  const l = ref.bareme[kind].lodging;
  return {
    flat: `Je reconnais avoir pris connaissance que mes frais d’hébergement seront forfaitaires à hauteur de ${fmt(l.flat)} par nuit.`,
    refund: `Je reconnais avoir pris connaissance que mes frais d’hébergement seront remboursés à hauteur de ${fmt(l.invoiceCap)} par nuit lors du décompte final.`,
  };
}

// « Décompte » of a note de frais: factures à régler, per diem & allocations, avance, remboursement.
export function settle(report, mission, ref) {
  const rates = ref.rates;
  const lines = costLines(mission, ref);
  const invoices = [
    ...(report?.expenses || []).flatMap((e) =>
      (e.amounts || []).map((a, i) => ({
        key: `${e.id}-${i}`,
        label: e.nature ? `${e.type} – ${e.nature}` : e.type,
        amount: a.amount,
        currency: a.currency,
        mad: round2(toMAD(a.amount, a.currency, rates)),
        attachment: e.attachment,
      })),
    ),
    ...lines.filter((l) => l.key === 'km').map((l) => ({ ...l, mad: round2(toMAD(l.amount, l.currency, rates)), note: l.km ? `${fmtQty(l.km)} KM` : l.note })),
  ];
  const allowances = lines.filter((l) => l.key !== 'km').map((l) => ({ ...l, mad: round2(toMAD(l.amount, l.currency, rates)) }));
  const invoicesTotal = round2(invoices.reduce((s, l) => s + l.mad, 0));
  const allowancesTotal = round2(allowances.reduce((s, l) => s + l.mad, 0));
  const advanceToRetain = mission.advance?.granted ? round2(toMAD(mission.advance.amount, mission.advance.currency, rates)) : 0;
  const total = round2(invoicesTotal + allowancesTotal - advanceToRetain);
  return { invoices, allowances, invoicesTotal, allowancesTotal, advanceToRetain, total, actualCost: round2(invoicesTotal + allowancesTotal) };
}
