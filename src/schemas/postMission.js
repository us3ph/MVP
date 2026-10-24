import { z } from 'zod';

export const retrocessionSchema = z.object({
  currency: z.string().trim().min(1, 'Choisissez la devise'),
  amount: z.coerce.number({ message: 'Montant invalide' }).positive('Montant invalide'),
  receipt: z.string().default(''), // justificatif du montant retourné, délivré par la trésorerie
});

export const cancelSchema = z.object({ reason: z.string().trim().min(1, 'Le motif d’annulation est obligatoire') });
