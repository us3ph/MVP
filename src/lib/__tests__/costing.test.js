import { describe, expect, it } from 'vitest';
import { distanceKm, estimateLines, kmAllowance, lodgingSkipTexts, mealsFor, perDiem, settle, sumMAD } from '../costing';
import { REFERENTIALS as ref } from '../../api/mock/referentials';

const b = ref.bareme;
const intl = {
  kind: 'international',
  startDate: '2025-05-19',
  endDate: '2025-05-22',
  cities: ['Montréal'],
  transports: [
    { mode: 'air', fromCity: 'Casablanca', toCity: 'Montréal' },
    { mode: 'air', fromCity: 'Montréal', toCity: 'Casablanca' },
  ],
  lodgings: [{}],
  advance: { amount: 660, currency: 'EUR', granted: true },
};

describe('barème international (annexe 2)', () => {
  it('per diem counts departure and return days', () => {
    const p = perDiem(intl, ref);
    expect(p.days).toBe(4);
    expect(p.amount).toBe(4 * b.international.perDiem.amount);
    expect(p.longStay).toBe(false);
  });
  it('switches to the prorated monthly flat rate for long stays', () => {
    const p = perDiem({ ...intl, startDate: '2025-05-01', endDate: '2025-06-12' }, ref); // 43 days
    expect(p.longStay).toBe(true);
    expect(p.amount).toBe(Math.round(((b.international.longStay.monthly.amount * 43) / 30) * 100) / 100);
  });
  it('reproduces the user guide example: 344 km round trip to the airport → 1 032 MAD', () => {
    expect(distanceKm(ref, 'Benguerir', 'Casablanca')).toBe(172);
    expect(distanceKm(ref, 'Casablanca', 'benguerir')).toBe(172);
    expect(distanceKm(ref, 'Fes', 'Benguerir')).toBe(465); // GeoNames spelling
    expect(distanceKm(ref, 'Tangier', 'Casablanca')).toBe(364);
    expect(distanceKm(ref, 'Benguerir', 'Nulle Part')).toBeNull();
    const km = kmAllowance(intl, ref);
    expect(km.km).toBe(344);
    expect(km.amount).toBe(1032);
  });
  it('charges the airport transfer abroad per leg', () => {
    const airport = estimateLines(intl, ref).find((l) => l.key === 'airport');
    expect(airport.amount).toBe(2 * b.international.airportTransferAbroad.amount);
  });
});

describe('barème national (annexe 1)', () => {
  it('grants lunch and dinner only when the time slots are inside the mission', () => {
    const oneDay = { kind: 'national', startDate: '2025-06-05', endDate: '2025-06-05', startTime: '09:00', endTime: '16:00' };
    expect(mealsFor(oneDay, ref)).toEqual({ lunches: 1, dinners: 0 });
    const twoDays = { kind: 'national', startDate: '2025-08-18', endDate: '2025-08-19', startTime: '09:00', endTime: '17:00' };
    expect(mealsFor(twoDays, ref)).toEqual({ lunches: 2, dinners: 1 });
    const late = { kind: 'national', startDate: '2025-06-04', endDate: '2025-06-04', startTime: '13:00', endTime: '22:00' };
    expect(mealsFor(late, ref)).toEqual({ lunches: 0, dinners: 1 });
  });
  it('pays the km allowance for personal-car legs only', () => {
    const base = { kind: 'national', startDate: '2025-08-18', endDate: '2025-08-19', startTime: '09:00', endTime: '17:00', cities: ['Casablanca'] };
    const personal = { ...base, transports: [{ mode: 'road', vehicle: 'personal', fromCity: 'Benguerir', toCity: 'Casablanca' }, { mode: 'road', vehicle: 'personal', fromCity: 'Casablanca', toCity: 'Benguerir' }] };
    expect(kmAllowance(personal, ref)).toMatchObject({ km: 344, amount: 1032 });
    const service = { ...base, transports: [{ mode: 'road', vehicle: 'service', fromCity: 'Benguerir', toCity: 'Casablanca' }] };
    expect(kmAllowance(service, ref).amount).toBe(0);
  });
  it('adds the intra-urban flat rate for public transport users', () => {
    const rail = { kind: 'national', startDate: '2025-06-04', endDate: '2025-06-04', startTime: '08:00', endTime: '18:00', cities: ['Rabat'], transports: [{ mode: 'rail', fromCity: 'Benguerir', toCity: 'Rabat' }] };
    const lines = estimateLines(rail, ref);
    expect(lines.find((l) => l.key === 'intra').amount).toBe(b.national.intraUrban.amount);
    expect(lines.find((l) => l.key === 'km')).toBeUndefined();
    expect(sumMAD(lines, ref.rates)).toBe(b.national.meals.amount + b.national.intraUrban.amount);
  });
  it('builds the lodging acknowledgement texts from the barème', () => {
    expect(lodgingSkipTexts('national', ref).flat).toContain(String(b.national.lodging.flat.amount));
    expect(lodgingSkipTexts('international', ref).refund).toContain('200 €');
  });
});

describe('décompte', () => {
  it('settles a note de frais against the granted advance', () => {
    const report = { expenses: [{ id: 'e1', type: 'Frais de conférence', amounts: [{ currency: 'MAD', amount: 1400 }] }] };
    const s = settle(report, { ...intl, transports: [], costLines: [{ key: 'perdiem', label: 'Indemnité de séjour', amount: 560, currency: 'EUR' }] }, ref);
    expect(s.invoicesTotal).toBe(1400);
    expect(s.allowancesTotal).toBe(560 * ref.rates.EUR);
    expect(s.advanceToRetain).toBe(660 * ref.rates.EUR);
    expect(s.total).toBe(1400 + 560 * ref.rates.EUR - 660 * ref.rates.EUR);
  });
});
