// Navigation. Keys map to paths in src/app/pages.js.
export const NAV = [
  {
    label: 'Missions',
    icon: 'briefcase',
    items: [
      { key: 'mes-ordres', label: 'Mes ordres de mission', icon: 'briefcase' },
      { key: 'national', label: 'Ordre national', icon: 'car' },
      { key: 'international', label: 'Ordre international', icon: 'plane' },
      { key: 'brouillons', label: 'Brouillons', icon: 'file' },
      { key: 'historique', label: 'Historique', icon: 'history' },
    ],
  },
  {
    label: 'Notes de frais',
    icon: 'note-add',
    items: [{ key: 'notes-de-frais', label: 'Mes notes de frais', icon: 'note-add' }],
  },
  {
    label: 'Suivi',
    icon: 'chart',
    items: [
      { key: 'en-cours', label: 'En cours', icon: 'refresh' },
      { key: 'valides', label: 'Validés', icon: 'check' },
      { key: 'archives', label: 'Archivés', icon: 'box' },
      { key: 'annules', label: 'Annulés', icon: 'minus-circle' },
      { key: 'avances', label: 'Avances', icon: 'card' },
    ],
  },
  {
    label: 'Compte',
    icon: 'user',
    items: [
      { key: 'profil', label: 'Mon profil', icon: 'profile' },
      { key: 'notifications', label: 'Notifications', icon: 'bell' },
    ],
  },
];
