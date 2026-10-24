// Sample notifications (the texts follow the user guide). `at` is relative to now so the panel shows
// « il y a … » as the real app does.
const ago = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();

export const NOTIFICATIONS = [
  { id: 'n1', kind: 'om_returned', title: 'Ordre de mission retourné', text: 'Votre ordre de mission N°2026-0090 a été retourné', at: ago(60), read: false, missionId: 'om-2026-0090' },
  { id: 'n2', kind: 'retro_validated', title: 'Rétrocession validée', text: 'Votre rétrocession pour l’ordre de mission N°2025-0010 a été bien validée', at: ago(75), read: false, missionId: 'om-2025-0010' },
  { id: 'n3', kind: 'advance_granted', title: 'Avance octroyée', text: 'Votre avance pour l’ordre de mission N°2025-0020 a été bien octroyée', at: ago(90), read: false, missionId: 'om-2025-0020' },
  { id: 'n4', kind: 'advance_ready', title: 'Avance prête pour récupération', text: 'Votre avance de l’ordre de mission N°2025-0020 est prête pour récupération de la banque', at: ago(95), read: true, missionId: 'om-2025-0020' },
  { id: 'n5', kind: 'om_validated', title: 'OM validé', text: 'Votre ordre de mission N°2025-0020 a été approuvé', at: ago(60 * 26), read: true, missionId: 'om-2025-0020' },
  { id: 'n6', kind: 'om_returned', title: 'Ordre de mission retourné', text: 'Votre ordre de mission N°2025-0089 a été retourné', at: ago(60 * 49), read: true, missionId: 'om-2025-0089' },
  { id: 'n7', kind: 'ndf_returned', title: 'Note de frais retournée', text: 'Votre note de frais pour l’ordre de mission N°2025-0167 a été retournée, merci de procéder à la modification', at: ago(60 * 24 * 3), read: true, missionId: 'om-2025-0167' },
  { id: 'n8', kind: 'om_returned', title: 'Ordre de mission retourné', text: 'Votre ordre de mission N°2025-0069/01 a été retourné', at: ago(60 * 24 * 5), read: true, missionId: 'om-2025-0069-01' },
];
