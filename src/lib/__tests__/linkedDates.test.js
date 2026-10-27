import { describe, expect, it } from 'vitest';
import { datesToFill, linkedDates, stayDates } from '../linkedDates';

const leg = (departDate = '', arriveDate = '') => ({ fromCity: '', toCity: '', mode: '', departDate, arriveDate });
const lodging = (checkIn = '', checkOut = '') => ({ city: '', checkIn, checkOut });

describe('linked dates', () => {
  it('links the outbound leg to the start date and the return leg to the end date', () => {
    const v = { startDate: '2026-11-12', endDate: '2026-11-15', transports: [leg(), leg()], lodgings: [] };
    expect(linkedDates(v)).toEqual({
      'transports.0.departDate': '2026-11-12',
      'transports.0.arriveDate': '2026-11-12',
      'transports.1.departDate': '2026-11-15',
      'transports.1.arriveDate': '2026-11-15',
    });
  });

  it('takes the stay from the outbound arrival and the return departure, else from the mission', () => {
    const base = { startDate: '2026-11-12', endDate: '2026-11-15' };
    expect(stayDates({ ...base, transports: [leg('2026-11-12', '2026-11-13'), leg('2026-11-15', '2026-11-16')] })).toEqual({ checkIn: '2026-11-13', checkOut: '2026-11-15' });
    expect(stayDates({ ...base, transports: [] })).toEqual({ checkIn: '2026-11-12', checkOut: '2026-11-15' });
  });

  it('fills rows that were added before the mission dates were chosen', () => {
    const v = { startDate: '2026-11-12', endDate: '2026-11-15', transports: [leg(), leg()], lodgings: [lodging()] };
    const { changes } = datesToFill(v, {});
    expect(changes).toEqual({
      'transports.0.departDate': '2026-11-12',
      'transports.0.arriveDate': '2026-11-12',
      'transports.1.departDate': '2026-11-15',
      'transports.1.arriveDate': '2026-11-15',
      'lodgings.0.checkIn': '2026-11-12',
      'lodgings.0.checkOut': '2026-11-15',
    });
  });

  it('follows a change of the mission dates while the user has not edited the row', () => {
    const before = { startDate: '2026-11-12', endDate: '2026-11-15', transports: [leg('2026-11-12', '2026-11-12'), leg('2026-11-15', '2026-11-15')], lodgings: [lodging('2026-11-12', '2026-11-15')] };
    const { next: previous } = datesToFill(before, {});
    const after = { ...before, endDate: '2026-11-17' };
    expect(datesToFill(after, previous).changes).toEqual({
      'transports.1.departDate': '2026-11-17',
      'transports.1.arriveDate': '2026-11-17',
      'lodgings.0.checkOut': '2026-11-17',
    });
  });

  it('keeps a date the user changed', () => {
    const before = { startDate: '2026-11-12', endDate: '2026-11-15', transports: [leg('2026-11-12', '2026-11-12')], lodgings: [] };
    const { next: previous } = datesToFill(before, {});
    const edited = { ...before, transports: [leg('2026-11-12', '2026-11-13')] };
    const moved = { ...edited, startDate: '2026-11-10' };
    expect(datesToFill(moved, previous).changes).toEqual({ 'transports.0.departDate': '2026-11-10' });
  });

  it('does not overwrite the dates of a saved order when it is opened', () => {
    const saved = { startDate: '2026-11-12', endDate: '2026-11-15', transports: [leg('2026-11-11', '2026-11-12')], lodgings: [lodging('2026-11-12', '2026-11-14')] };
    expect(datesToFill(saved, {}).changes).toEqual({});
  });

  it('never clears a row when a mission date is emptied', () => {
    const before = { startDate: '2026-11-12', endDate: '2026-11-15', transports: [leg('2026-11-12', '2026-11-12')], lodgings: [] };
    const { next: previous } = datesToFill(before, {});
    expect(datesToFill({ ...before, startDate: '' }, previous).changes).toEqual({});
  });
});
