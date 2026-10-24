import { describe, expect, it } from 'vitest';
import { daysBetween, fmtAmount, fmtDate, fmtDateDot, inPeriod, missionRef, nightsBetween } from '../format';

describe('format', () => {
  it('formats amounts the French way with a regular no-break space', () => {
    expect(fmtAmount(15681.06)).toBe('15 681,06');
    expect(fmtAmount(1280)).toBe('1 280');
  });
  it('formats ISO dates', () => {
    expect(fmtDate('2025-05-19')).toBe('19/05/2025');
    expect(fmtDateDot('2025-05-19')).toBe('19.05.2025');
    expect(fmtDate('')).toBe('—');
  });
  it('counts days and nights inclusively', () => {
    expect(daysBetween('2025-05-19', '2025-05-22')).toBe(4);
    expect(nightsBetween('2025-05-19', '2025-05-22')).toBe(3);
    expect(daysBetween('2025-05-19', '2025-05-19')).toBe(1);
  });
  it('filters by period', () => {
    expect(inPeriod('2000-01-01', 'all')).toBe(true);
    expect(inPeriod('2000-01-01', 'year')).toBe(false);
  });
  it('renders the mission reference with its change suffix', () => {
    expect(missionRef({ number: '2025-0013/01', change: 'extension', status: 'draft' })).toBe('2025-0013/01-Prolongement');
    expect(missionRef({ number: '2025-0013/01', change: 'extension', status: 'validated' })).toBe('2025-0013/01');
    expect(missionRef({ number: null })).toBe('');
  });
});
