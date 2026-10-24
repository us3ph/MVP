// Titles, step texts and initial values of the order wizard.
import { CHANGE } from '../../domain/constants';
import { uid } from '../../lib/format';

export const WIZARD_TITLES = {
  new: 'Création ordre de mission',
  edit: 'Modifier l’ordre de mission',
  extend: 'Prolonger l’ordre de mission',
  reduce: 'Réduire l’ordre de mission',
};

// One card per step; `side` is the node label of the progress line.
export const META = {
  order: { side: 'Ordre de mission', title: 'Ordre de mission', hint: 'Informations générales sur la mission : types, objet, dates, destination, participants.' },
  transports: { side: 'Transports', title: 'Transports', hint: 'Trajets depuis votre ville d’affectation (ou autre) jusqu’au retour.' },
  lodging: { side: 'Hébergement', title: 'Hébergement', hint: 'Villes et dates de séjour. L’étape peut être ignorée avec un commentaire de justification.' },
  advance: { side: 'Avance', title: 'Demande d’avance', hint: 'Indemnité de séjour, devises attendues et montant de l’avance.' },
  preview: { side: 'Aperçu', title: 'Aperçu de votre ordre de mission', hint: 'Validateurs et coût global estimé, mis à jour au fur et à mesure de votre saisie.' },
};

const blankAdvance = (ref) => ({ currencies: [], currency: ref.currencies[0], amount: '', comment: '' });

// Initial values of the form for each mode (new, edit, extend, reduce).
export function defaultsFor(mode, kind, source, ref, profile) {
  if (mode === 'edit') return { ...source, advance: source.kind === 'international' ? source.advance || blankAdvance(ref) : null };
  if (mode === 'extend' || mode === 'reduce') {
    const { id: _id, number: _n, timeline: _t, ...rest } = source;
    return {
      ...rest,
      parentId: source.id,
      change: mode === 'extend' ? CHANGE.EXTENSION : CHANGE.REDUCTION,
      status: 'draft',
      advance: mode === 'extend' && source.kind === 'international' ? { ...(source.advance || blankAdvance(ref)), granted: null } : null,
      lodgingSkipped: null,
    };
  }
  return {
    kind,
    types: [],
    objects: [{ id: uid('obj'), activities: '', entity: profile.entity || '', percentage: 100, expectations: '', attachments: [] }],
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    country: kind === 'national' ? ref.homeCity.countryCode : '',
    cities: [],
    priority: ref.priorities[0],
    participants: [],
    visaRequest: false,
    transports: [],
    transportComment: '',
    lodgings: [],
    lodgingSkipped: null,
    advance: kind === 'international' ? blankAdvance(ref) : null,
  };
}

