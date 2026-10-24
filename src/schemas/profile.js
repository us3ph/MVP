import { z } from 'zod';

const str = () => z.string().default('');

export const visaSchema = z.object({ id: z.string(), country: z.string().trim().min(1, 'Pays obligatoire'), number: str(), expires: str(), file: str() });

export const profileSchema = z.object({
  id: z.string().optional(),
  matricule: str(),
  jobTitle: str(),
  lastName: z.string().trim().min(1, 'Nom obligatoire'),
  firstName: z.string().trim().min(1, 'Prénom obligatoire'),
  email: str(),
  entity: z.string().trim().min(1, 'Entité obligatoire'),
  address: str(),
  photo: str(),
  passport: z.object({ number: str(), expiry: str(), file: str() }).default({ number: '', expiry: '', file: '' }),
  cin: z.object({ number: str(), file: str() }).default({ number: '', file: '' }),
  phone: str(),
  safarFlyer: str(),
  signature: str(),
  visas: z.array(visaSchema).default([]),
  insuranceExpiry: str(),
});

export const delegationSchema = z
  .object({
    id: z.string().optional(),
    delegateId: z.string().trim().min(1, 'Choisissez un délégué'),
    actions: z.array(z.string()).min(1, 'Choisissez au moins une action'),
    startDate: z.string().trim().min(1, 'Date de début obligatoire'),
    endDate: z.string().trim().min(1, 'Date de fin obligatoire'),
  })
  .refine((d) => d.endDate >= d.startDate, { message: 'La date de fin doit suivre la date de début', path: ['endDate'] });

export const passwordSchema = z
  .object({
    current: z.string().min(1, 'Mot de passe actuel obligatoire'),
    next: z.string().min(8, 'Au moins 8 caractères'),
    confirm: z.string(),
  })
  .refine((p) => p.next === p.confirm, { message: 'Les deux mots de passe ne correspondent pas', path: ['confirm'] });
