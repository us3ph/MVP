// Référentiels (listes de valeurs).
//   GET /referentials                       → Referentials (entities, people, countries, barème…)
//   GET /referentials/cities?country=MA     → [{ name, countryCode }]
import { request, USE_MOCK } from './client';
import { delay } from './mock/db';
import { REFERENTIALS, citiesOf } from './mock/referentials';

export async function getReferentials() {
  if (!USE_MOCK) return request('/referentials');
  await delay(80);
  return REFERENTIALS;
}

export async function listCities(countryCode) {
  if (!USE_MOCK) return request('/referentials/cities', { params: { country: countryCode } });
  return citiesOf(countryCode);
}
