import { z } from 'zod';

// Validation of an ordre de mission (the same object the API receives). Messages are what the
// forms display under the fields.
const req = (message = 'Champ obligatoire') => z.string().trim().min(1, { message });
const optional = () => z.string().default('');

export const missionObjectSchema = z.object({
  id: z.string(),
  activities: req('Décrivez l’activité'),
  entity: req('Choisissez une entité / un projet'),
  percentage: z.coerce.number({ message: 'Nombre attendu' }).min(0, 'Entre 0 et 100').max(100, 'Entre 0 et 100'),
  expectations: optional(),
  attachments: z.array(z.string()).default([]),
});

export const transportSchema = z
  .object({
    id: z.string(),
    fromCity: req('Choisissez la ville de départ'),
    departDate: req(),
    mode: z.enum(['air', 'rail', 'road', 'other'], { message: 'Choisissez un mode' }),
    vehicle: optional(), // road legs: personal | service | public (see referentials.roadVehicles)
    toCity: req('Choisissez la ville d’arrivée'),
    arriveDate: req(),
  })
  .refine((t) => !t.departDate || !t.arriveDate || t.arriveDate >= t.departDate, { message: 'La date d’arrivée doit suivre le départ', path: ['arriveDate'] })
  .refine((t) => t.mode !== 'road' || !!t.vehicle, { message: 'Précisez le véhicule', path: ['vehicle'] });

export const lodgingSchema = z
  .object({ id: z.string(), city: req('Choisissez la ville'), checkIn: req(), checkOut: req(), preferences: optional() })
  .refine((l) => !l.checkIn || !l.checkOut || l.checkOut >= l.checkIn, { message: 'Le check-out doit suivre le check-in', path: ['checkOut'] });

export const lodgingSkipSchema = z.object({
  flatRate: z.boolean(),
  acknowledged: z.literal(true, { message: 'Veuillez cocher la case de reconnaissance' }),
  comment: req('Le commentaire de justification est obligatoire'),
});

export const advanceSchema = z.object({
  currencies: z.array(z.string()).min(1, 'Choisissez au moins une devise'),
  currency: z.string().default('EUR'),
  amount: z.coerce.number({ message: 'Montant invalide' }).min(0, 'Montant invalide'),
  comment: optional(),
});

export const missionSchema = z
  .object({
    id: z.string().optional(),
    kind: z.enum(['national', 'international']),
    types: z.array(z.string()).min(1, 'Choisissez au moins un type de mission'),
    objects: z.array(missionObjectSchema).min(1, 'Ajoutez un objet de mission'),
    startDate: req('Date de début obligatoire'),
    endDate: req('Date de fin obligatoire'),
    startTime: optional(),
    endTime: optional(),
    country: optional(),
    cities: z.array(z.string()).min(1, 'Choisissez au moins une ville'),
    priority: req('Choisissez la priorité'),
    participants: z.array(z.string()).default([]),
    visaRequest: z.boolean().default(false),
    transports: z.array(transportSchema).default([]),
    transportComment: optional(),
    lodgings: z.array(lodgingSchema).default([]),
    lodgingSkipped: lodgingSkipSchema.nullable().default(null),
    advance: advanceSchema.nullable().default(null),
  })
  .superRefine((m, ctx) => {
    if (m.startDate && m.endDate && m.endDate < m.startDate) ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'La date de fin doit suivre la date de début' });
    if (m.kind === 'national') {
      if (!m.startTime) ctx.addIssue({ code: 'custom', path: ['startTime'], message: 'Heure obligatoire' });
      if (!m.endTime) ctx.addIssue({ code: 'custom', path: ['endTime'], message: 'Heure obligatoire' });
    } else if (!m.country) ctx.addIssue({ code: 'custom', path: ['country'], message: 'Choisissez le pays' });
    if (!m.transports?.length) ctx.addIssue({ code: 'custom', path: ['transports'], message: 'Ajoutez au moins un trajet' });
    if (!m.lodgings?.length && !m.lodgingSkipped) ctx.addIssue({ code: 'custom', path: ['lodgings'], message: 'Ajoutez un hébergement ou ignorez l’étape' });
  });

// Fields validated when leaving each step of the wizard.
export const MISSION_STEP_FIELDS = {
  order: ['types', 'objects', 'startDate', 'endDate', 'startTime', 'endTime', 'country', 'cities', 'priority', 'participants'],
  transports: ['transports', 'transportComment'],
  lodging: ['lodgings', 'lodgingSkipped'],
  advance: ['advance'],
};
