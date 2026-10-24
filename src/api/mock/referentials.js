// Mock of the referentials endpoint. Nothing business-specific is typed by hand where a standard
// source exists: countries come from ISO 3166 (i18n-iso-countries, French names) and cities from
// country-state-city (GeoNames). The barème, rules and workflow actors below transcribe the
// Direction du Capital Humain documents (« Management des déplacements des collaborateurs »,
// annexes 1 & 2 — V.2 2026, procédure RH, workflows Maroc V2 / Étranger, tableau des distances).
import isoCountries from 'i18n-iso-countries';
import fr from 'i18n-iso-countries/langs/fr.json';

isoCountries.registerLocale(fr);

const collator = new Intl.Collator('fr');

export const COUNTRIES = Object.entries(isoCountries.getNames('fr', { select: 'official' }))
  .map(([code, label]) => ({ code, label }))
  .sort((a, b) => collator.compare(a.label, b.label));

export const HOME_COUNTRY = 'MA';

// Spellings used by GeoNames for cities of the distance table (lookups go through lib/costing.normalizeCity).
export const CITY_ALIASES = {
  'Oujda-Angad': 'Oujda',
  Tangier: 'Tanger',
  'Tanger-Assilah': 'Tanger',
  Fes: 'Fès',
  'Fès al Bali': 'Fès',
  Meknes: 'Meknès',
  Kenitra: 'Kénitra',
  'El Jadid': 'El Jadida',
  'El-Jadida': 'El Jadida',
  Laayoune: 'Laâyoune',
  'Al-Hoceima': 'Al Hoceïma',
  'El Aïoun': 'El Aioun',
  'Sidi-Kacem': 'Sidi Kacem',
  'Mechraa Bel Ksiri': 'Mechraâ Bel Ksiri',
  Marrakesh: 'Marrakech',
  Ouarzazat: 'Ouarzazate',
  'Fquih Ben Salah Province': 'Fquih Ben Salah',
};

// Cities are loaded on demand (the GeoNames dataset is large), one country at a time. For Morocco
// the cities of the distance table (ville d’affectation included) are merged in, as the backend
// referential will carry them.
export async function citiesOf(countryCode) {
  if (!countryCode) return [];
  const { City } = await import('country-state-city');
  const seen = new Set();
  const extra = countryCode === HOME_COUNTRY ? [...Object.keys(DISTANCES), ...Object.values(DISTANCES).flatMap((row) => Object.keys(row))] : [];
  const geo = (City.getCitiesOfCountry(countryCode) || []).map((c) => CITY_ALIASES[c.name] || c.name);
  return [...extra, ...geo]
    .filter((name) => (seen.has(name) ? false : seen.add(name)))
    .map((name) => ({ name, countryCode }))
    .sort((a, b) => collator.compare(a.name, b.name));
}

const MAD = (amount) => ({ amount, currency: 'MAD' });
const EUR = (amount) => ({ amount, currency: 'EUR' });

// « Tableau des distances kilométriques » (OS 768): road distances in km from the ville
// d’affectation (Benguérir) and between the main cities. The backend serves the full matrix;
// lookups are symmetric (see lib/costing.distanceKm).
export const DISTANCES = {
  Benguerir: {
    Youssoufia: 60, 'Tleta Sidi Bouguedra': 124, Taza: 587, Tanger: 536, 'Souk Arbaâ du Gharb': 381, 'Sidi Slimane': 366, 'Sidi Kacem': 388, 'Sidi Hajjaj': 165,
    Settat: 100, Safi: 150, Rabat: 263, 'Pont Blondin': 207, Oujda: 808, 'Oued Zem': 197, Nouaceur: 147, Nador: 815, 'Mechraâ Bel Ksiri': 385, Mohammedia: 200,
    Meknès: 403, Marrakech: 70, Khouribga: 184, Khemisset: 345, Kénitra: 304, 'Jorf Lasfar': 171, Imouzzer: 429, Ifrane: 404, 'Fquih Ben Salah': 151, Fès: 465,
    Essaouira: 246, 'El Jadida': 151, 'Al Hoceïma': 700, 'El Aioun': 750, Casablanca: 172, 'Bir Jdid': 175, Berrechid: 130, Berkane: 868, Agadir: 326,
  },
  Casablanca: { Rabat: 91, Marrakech: 242, Agadir: 498, Fès: 291, Tanger: 364, Meknès: 231, 'El Jadida': 98, Settat: 72, Safi: 252, Kénitra: 132, Oujda: 636, Mohammedia: 28, Khouribga: 120 },
  Rabat: { Marrakech: 333, Fès: 200, Tanger: 273, Meknès: 140, Kénitra: 40, Agadir: 589, Oujda: 545 },
  Marrakech: { Agadir: 256, Essaouira: 176, Safi: 152, Fès: 494, Ouarzazate: 204 },
};

export const REFERENTIALS = {
  homeCity: { name: 'Benguerir', countryCode: HOME_COUNTRY },
  // Airport used for international departures from the ville d’affectation (transfert aéroport au Maroc).
  airportCity: { name: 'Casablanca', countryCode: HOME_COUNTRY },
  countries: COUNTRIES,
  distances: DISTANCES,
  cityAliases: CITY_ALIASES,
  entities: [
    { code: 'RH1', label: 'UM6P - RH1', controller: { id: 'c-rh', name: 'Contrôleur de gestion RH' } },
    { code: 'DSI', label: 'UM6P - DSI', controller: { id: 'c-dsi', name: 'Contrôleur de gestion DSI' } },
    { code: 'FIN', label: 'UM6P - Direction Financière', controller: { id: 'c-fin', name: 'Contrôleur de gestion Finance' } },
    { code: 'RI', label: 'UM6P - Recherche & Innovation', controller: { id: 'c-ri', name: 'Contrôleur de gestion R&I' } },
    { code: 'ACAD', label: 'UM6P - Direction Académique', controller: { id: 'c-acad', name: 'Contrôleur de gestion Académique' } },
  ],
  people: [
    { id: 'u-ahmad', firstName: 'Farid', lastName: 'Ahmad', email: 'farid.ahmad@um6p.ma' },
    { id: 'u-bennani', firstName: 'Salma', lastName: 'Bennani', email: 'salma.bennani@um6p.ma' },
    { id: 'u-elidrissi', firstName: 'Youssef', lastName: 'El Idrissi', email: 'youssef.elidrissi@um6p.ma' },
    { id: 'u-tazi', firstName: 'Meryem', lastName: 'Tazi', email: 'meryem.tazi@um6p.ma' },
    { id: 'u-alaoui', firstName: 'Omar', lastName: 'Alaoui', email: 'omar.alaoui@um6p.ma' },
    { id: 'u-chraibi', firstName: 'Nadia', lastName: 'Chraibi', email: 'nadia.chraibi@um6p.ma' },
  ],
  missionTypes: ['Mission', 'Training', 'Congrès', 'Conférence', 'Réunion', 'Forum'],
  // Dépenses remboursables sur justificatif (barème annexes 1 & 2, décompte étranger). Les billets
  // d’avion réservés par le personnel ne sont pas pris en charge, donc absents de la liste.
  expenseTypes: ['Hébergement', 'Invitation client', 'Frais autoroute', 'Frais de parking', 'Frais de conférence', 'Transport', 'Transport interurbain à l’étranger', 'Frais Visa', 'Divers'],
  expenseTypeOther: 'Divers', // demande de préciser la nature
  // Véhicule d’un trajet routier : seule la voiture personnelle ouvre droit à l’indemnité kilométrique.
  roadVehicles: [
    { code: 'personal', label: 'Voiture personnelle', km: true },
    { code: 'service', label: 'Voiture de service', km: false },
    { code: 'public', label: 'Transports publics (autocar, taxi)', km: false, public: true },
  ],
  currencies: ['EUR', 'MAD', 'USD'],
  priorities: ['Normal', 'Urgent'],
  // Taux de change indicatifs (vers MAD) ; le décompte réel utilise le cours du bordereau de change de la banque.
  rates: { MAD: 1, EUR: 11, USD: 10 },
  bareme: {
    version: 'V.2 2026',
    kmRate: MAD(3), // indemnité kilométrique (voiture personnelle), + autoroute et parking sur justificatifs
    airMinKm: 500, // avion réservé par UM6P pour les trajets de plus de 500 km lorsque le vol existe
    national: {
      meals: { amount: 120, currency: 'MAD', lunch: ['12:00', '14:00'], dinner: ['19:30', '21:30'] }, // tranche horaire incluse dans la mission
      lodging: { bookedCap: MAD(1500), invoiceCap: MAD(1500), flat: MAD(500) }, // par nuit (chambre et petit déjeuner)
      intraUrban: MAD(100), // par jour, seulement pour les personnes se déplaçant via transports publics
    },
    international: {
      perDiem: EUR(140), // par jour de mission, jours d’aller et de retour inclus
      longStay: { minDays: 15, monthly: EUR(1200) }, // proratisé au nombre de jours à partir du premier jour
      lodging: { bookedCap: EUR(300), invoiceCap: EUR(200), flat: EUR(85) }, // par nuit
      airportTransferAbroad: EUR(50), // par destination et par trajet
    },
  },
  // Règles de la procédure RH « Management des déplacements ».
  rules: {
    omLeadDays: { international: 10, national: 0 }, // OM établi au moins 10 jours avant (international) / 1 h avant (national)
    advanceLeadDays: 10,
    expenseDeadlineDays: { international: 15, national: 5 }, // décompte après le retour
    paymentCutoffDay: 20, // note déposée après le 20 → remboursée le mois suivant
    extensionMaxDaysWithoutNewOm: 1, // au-delà d’une journée, refaire l’OM
  },
  // Circuit de validation affiché dans l’aperçu avant soumission (libellés de la plateforme, acteur réel).
  validatorChains: {
    international: [
      { label: 'Hiérarchie', role: 'Responsable hiérarchique' },
      { label: 'Validateur Fonctionnel', role: 'Responsable de l’entité' },
      { label: 'Costing', role: 'Contrôle de gestion' },
      { label: 'Validateur Final', role: 'Chief Operating Officer' },
    ],
    national: [
      { label: 'Hiérarchie', role: 'Responsable hiérarchique' },
      { label: 'Validateur Fonctionnel', role: 'Responsable de l’entité' },
    ],
  },
  // « Validation timeline » de l’aperçu d’un ordre de mission.
  validationSteps: {
    international: ['Responsable hiérarchique', 'Contrôleur de gestion', 'Chief Operating Officer'],
    national: ['Responsable hiérarchique', 'Responsable de l’entité'],
  },
  // Étapes de l’activité de validation (panneau Timeline).
  processingSteps: {
    international: ['Hiérarchie', 'Validateur Fonctionnel', 'Costing', 'Validateur Final', 'Logistique Voyage'],
    national: ['Hiérarchie', 'Validateur Fonctionnel', 'Logistique Voyage'],
  },
  // Circuit de la note de frais (workflow « Mes déplacements et frais V2 »).
  expenseSteps: [
    { code: 'manager', label: 'Responsable hiérarchique' },
    { code: 'controller', label: 'Contrôle et validation', role: 'Gestionnaire paie' },
    { code: 'hr', label: 'Validation RH', role: 'Directeur du Capital Humain' },
    { code: 'payment_pending', label: 'Paiement', role: 'via la paie du mois' },
  ],
  delegationActions: [
    { code: 'om_manage', label: 'Création et gestion des ordres de mission' },
    { code: 'om_validate', label: 'Validation des ordres de mission', note: 'Réservée aux validateurs' },
    { code: 'expense_validate', label: 'Validation de la note de frais', note: 'Réservée aux validateurs' },
  ],
  reportQuestions: [
    { id: 'q1', type: 'single', text: 'La mission s’est-elle déroulée comme prévu ?', options: ['Oui', 'Partiellement', 'Non'] },
    { id: 'q2', type: 'multi', text: 'Quels objectifs ont été atteints ?', options: ['Objectifs principaux', 'Rencontres partenaires', 'Formation / montée en compétences', 'Autre'] },
    { id: 'q3', type: 'text', text: 'Commentaires et recommandations pour les prochaines missions' },
  ],
};
