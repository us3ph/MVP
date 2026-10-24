# Travel & Expense — profil Collaborateur

Front-end React (Vite) de la plateforme Travel & Expense, profil **Collaborateur**, construit à partir du
guide utilisateur (connexion, profil & délégations & mot de passe, notifications, ordres de mission national / international,
actions sur un ordre, prolongation / réduction / annulation, rétrocession, compte rendu, notes de frais).

Tout est cliquable et fonctionne sans serveur : les données vivent dans un mock en mémoire tant que
`VITE_API_URL` n’est pas renseigné.

## Lancer

```bash
npm install
npm run dev        # http://localhost:5180
npm run build && npm run preview   # http://localhost:4180
npm run lint       # ESLint (flat config, react-hooks, react-refresh)
npm test           # Vitest (costing, formats)
```

Connexion : « Se connecter avec SSO » ou n’importe quel nom d’utilisateur + mot de passe (mock).

## Brancher le backend

1. Copier `.env.example` en `.env` et renseigner `VITE_API_URL` (ex. `https://api.exemple.ma/v1`).
2. Exposer les routes documentées en tête de chaque module de `src/api/` (missions, notes de frais, profil,
   délégations, notifications, référentiels, authentification). Les modules n’appellent `fetch` que quand
   `VITE_API_URL` est défini ; sinon ils utilisent `src/api/mock`.
3. Les formulaires envoient exactement les objets validés par les schémas zod de `src/schemas/`.

Rien de métier n’est codé en dur côté écran : entités, pays (ISO 3166, noms français), villes (GeoNames via
`country-state-city`, chargées à la demande), collègues, types de mission, types de dépense, devises, taux,
barème des indemnités, circuits de validation, droits délégables et questionnaire du compte rendu
viennent tous de `GET /referentials` (mock dans `src/api/mock/referentials.js`). Seuls les codes du
workflow (statuts, natures d’ordre, modes de transport, clés d’action) sont dans `src/domain/constants.js`,
car ils font partie du contrat d’API.

## Règles métier (documents de la Direction du Capital Humain)

Le mock des référentiels (`src/api/mock/referentials.js`) transcrit les documents fournis :

- **Barème national (annexe 1)** : repas 120 MAD (déjeuner si la tranche 12h–14h est dans la mission, dîner si
  19h30–21h30), hébergement 1 500 MAD/nuit (réservé ou sur facture) ou forfait 500 MAD/nuit, indemnité
  kilométrique 3 MAD/km (voiture personnelle) + autoroute et parking sur justificatifs, forfait intra-urbain
  100 MAD/jour (transports publics), avion réservé par UM6P au-delà de 500 km.
- **Barème international (annexe 2, V.2 2026)** : per diem 140 € par jour (aller et retour inclus), forfait
  1 200 €/mois proratisé à partir de 15 jours, hébergement 300 € (réservé) / 200 € (facture) / forfait 85 €
  par nuit, transfert aéroport à l’étranger 50 € par trajet, transfert aéroport au Maroc à 3 MAD/km.
- **Tableau des distances kilométriques** (OS 768) : distances depuis Benguérir et entre les grandes villes,
  avec normalisation des orthographes GeoNames (Fes → Fès, Tangier → Tanger…).
- **Procédure RH** : OM international 10 jours avant le départ (avertissement dans l’assistant), demande
  d’avance 10 jours avant, décompte dans les 15 jours (international) / 5 jours (national), note déposée
  après le 20 du mois payée le mois suivant, reliquat d’avance restitué dans la devise avec reçu de la
  trésorerie (champ dans la rétrocession).
- **Workflows Maroc V2 / Étranger** : circuit OM (Hiérarchie → Validateur fonctionnel → Costing → COO →
  Logistique voyage à l’international ; Hiérarchie → Validateur fonctionnel → Logistique voyage au national)
  et circuit note de frais (Responsable hiérarchique → Gestionnaire paie → DCH → Paiement via la paie).
- **Canvas OM à l’étranger** : fonction du collaborateur, itinéraire, moyen de transport (véhicule personnel /
  de service / transports publics), demande d’avance en EUR/USD, demande de visa.
- **Décompte étranger (modèle Excel)** : lignes de dépenses avec devise, conversion au cours du bordereau de
  change, ligne « Divers (préciser la nature) », mentions « justificatifs à joindre ».

Les montants des ordres de mission ne sont plus stockés dans les données d’exemple : ils sont calculés par
`src/lib/costing.js` à partir du barème, des dates/heures et des trajets (tests dans `src/lib/__tests__`).

## Pile

React 19 · Vite · react-router-dom 7 · @tanstack/react-query 5 · react-hook-form 7 + zod 4 · date-fns 4 ·
lucide-react (icônes hors maquette) · i18n-iso-countries + country-state-city (référentiel géographique du mock) ·
ESLint 10 · Vitest.

## Structure

```
src/
  main.jsx            QueryClient, thème, toasts, App
  App.jsx             routes (react-router)
  app/                AppLayout (fenêtre, barre latérale, ruban, panneaux), Auth/Theme/Toast providers,
                      pages.js (chemins + en-têtes), header.js (useHeader), ui.js (panneaux globaux)
  pages/              une page par écran : tableau de bord, listes, notes de frais, aperçu d’un ordre,
                      création d’ordre (une page, une carte par étape, barre de progression), profil,
                      notifications ; useMissionActions = actions + dialogues
  components/         ui/ (Modal, SlideOver, Field, FileDrop, Accordion, Stepper, MultiSelect, ActionMenu…)
                      missions/, order-form/, expenses/, post-mission/, profile/, notifications/
  api/                client HTTP + un module par ressource (routes documentées) ; mock/ (db en mémoire, seeds)
  queries/            hooks React Query (lecture + mutations avec invalidation)
  schemas/            schémas zod (mission, note de frais, profil, délégation, mot de passe…)
  lib/                format (date-fns), costing (indemnités, décompte), actions (actions par statut), refs
  domain/constants.js vocabulaire du workflow partagé avec le backend
  styles.css          CSS de la maquette + styles des écrans (tokens --text, --accent… pour les deux thèmes)
```

## Modèle de données (tel qu’attendu de l’API)

- **Mission** (ordre de mission) : `id, number, kind, status, priority, types[], objects[] (activities, entity,
  percentage, expectations, attachments), startDate, endDate, startTime, endTime, country (ISO), cities[],
  participants[], transports[], transportComment, lodgings[], lodgingSkipped, advance, costLines[],
  estimatedCost, timeline[], validators[], vouchers[], retrocession, report, cancellation, parentId, change`.
- **ExpenseReport** (note de frais) : `id, missionId, status, expenses[] (type, amounts[{currency, amount}],
  attachment), actualCost, reimbursement, paymentDate, submittedAt`.
- **Profile**, **Delegation**, **Notification** : voir `src/api/mock/seed/`.
