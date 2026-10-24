import { z } from 'zod';

export const expenseSchema = z.object({
  id: z.string(),
  type: z.string().trim().min(1, 'Choisissez le type de dépense'),
  nature: z.string().default(''), // précision demandée pour « Divers »
  amounts: z.array(z.object({ currency: z.string().min(1), amount: z.coerce.number({ message: 'Montant invalide' }).positive('Montant invalide') })).min(1, 'Choisissez au moins une devise'),
  attachment: z.string().default(''),
});

export const expenseReportSchema = z.object({
  id: z.string().optional(),
  missionId: z.string().min(1),
  expenses: z.array(expenseSchema).min(1, 'Ajoutez au moins une dépense'),
});
