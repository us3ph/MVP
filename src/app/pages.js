import { CANCELLED_STATUSES } from '../domain/constants';

// Pages reachable from the sidebar: path, header texts and, for the lists, the status filter.
export const PAGES = {
  'mes-ordres': { path: '/', title: 'Mes ordres de mission', subtitle: 'Voici l’état de vos ordres de mission.' },
  national: { path: '/ordre/new/national' },
  international: { path: '/ordre/new/international' },
  brouillons: { path: '/brouillons', title: 'Brouillons', subtitle: 'Ordres de mission non encore soumis.', statusFilter: ['draft'] },
  historique: { path: '/historique', title: 'Historique', subtitle: 'Tous vos ordres de mission, du plus récent au plus ancien.', statusFilter: null },
  'en-cours': { path: '/en-cours', title: 'En cours', subtitle: 'Ordres de mission en attente de validation.', statusFilter: ['pending'] },
  valides: { path: '/valides', title: 'Validés', subtitle: 'Ordres de mission approuvés.', statusFilter: ['validated'] },
  archives: { path: '/archives', title: 'Archivés', subtitle: 'Ordres de mission archivés.', statusFilter: ['archived'] },
  annules: { path: '/annules', title: 'Annulés', subtitle: 'Ordres de mission annulés ou en attente d’approbation de l’annulation.', statusFilter: CANCELLED_STATUSES },
  avances: { path: '/avances', title: 'Avances', subtitle: 'Avances demandées sur vos ordres de mission.', statusFilter: null, onlyAdvance: true },
  'notes-de-frais': { path: '/notes-de-frais', title: 'Mes notes de frais', subtitle: 'Historique de vos ordres de mission et des notes de frais associées.' },
  profil: { path: '/profil', title: 'Mon profil', subtitle: 'Vos informations personnelles, documents de voyage et délégations.' },
  notifications: { path: '/notifications', title: 'Notifications', subtitle: 'Alertes et rappels liés à vos ordres.' },
};

export const LIST_PAGES = Object.entries(PAGES)
  .filter(([, p]) => 'statusFilter' in p)
  .map(([key, p]) => ({ key, ...p }));

// Sidebar entry to highlight for a path.
export function pageKeyFromPath(pathname) {
  const exact = Object.entries(PAGES).find(([, p]) => p.path === pathname);
  if (exact) return exact[0];
  if (pathname.startsWith('/ordre/new/international')) return 'international';
  if (pathname.startsWith('/ordre/new/national')) return 'national';
  return 'mes-ordres';
}
