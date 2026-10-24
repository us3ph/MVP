// The signed-in collaborator (« Mon profil ») and their delegations.
export const PROFILE = {
  id: 'me',
  matricule: 'UM010203',
  jobTitle: 'Chargé(e) de projets', // fonction (fournie par la RH)
  lastName: 'Nom',
  firstName: 'Prénom',
  email: 'nom.prenom@um6p.ma',
  entity: 'RH1', // entité d’affectation (ordre interne), see referentials.ENTITIES
  address: '',
  photo: '',
  passport: { number: 'DD109210', expiry: '2032-04-10', file: 'passeport.png' },
  cin: { number: 'BY896080', file: '' },
  phone: '0635235234',
  safarFlyer: '4325DSFG',
  signature: '',
  visas: [],
  insuranceExpiry: '',
};

export const DELEGATIONS = [
  { id: 'd1', delegateId: 'u-ahmad', actions: ['om_manage'], startDate: '2025-04-22', endDate: '2025-04-30' },
  { id: 'd2', delegateId: 'u-ahmad', actions: ['expense_validate'], startDate: '2025-05-04', endDate: '2025-05-05' },
  { id: 'd3', delegateId: 'u-ahmad', actions: ['om_validate', 'om_manage'], startDate: '2025-05-07', endDate: '2025-05-31' },
];
