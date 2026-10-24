import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../ui/Modal';
import Select from '../Select';
import MultiSelect from '../ui/MultiSelect';
import FileDrop from '../ui/FileDrop';
import { Field } from '../ui/Field';
import { expenseReportSchema } from '../../schemas/expenseReport';
import { uid } from '../../lib/format';

const blankExpense = () => ({ id: uid('exp'), type: '', nature: '', amounts: [], attachment: '' });

// « Note de frais »: one block per expense (type, devise(s), montant par devise, pièce justificative).
export default function ExpenseReportModal({ mission, report, expenseTypes = [], otherType = '', currencies = [], rules, onSave, onSubmit, onClose, busy }) {
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(expenseReportSchema),
    defaultValues: { id: report?.id, missionId: mission.id, expenses: report?.expenses?.length ? report.expenses : [blankExpense()] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'expenses', keyName: 'k' });

  return (
    <Modal icon="check" title="Note de frais" subtitle="Afin d’ajouter une note de frais, vous devez d’abord remplir ces informations." onClose={onClose} width={560}>
      <form className="form one" onSubmit={handleSubmit((d) => onSubmit(d))}>
        {fields.map((f, i) => (
          <div className="blk" key={f.k}>
            <div className="blk-hd">
              {fields.length > 1 && (
                <button type="button" className="lnk danger" onClick={() => remove(i)}>
                  Supprimer
                </button>
              )}
            </div>
            <div className="form">
              <Field label="Type de dépense" htmlFor={`exp-type-${i}`} required error={errors.expenses?.[i]?.type?.message}>
                <Controller name={`expenses.${i}.type`} control={control} render={({ field }) => <Select id={`exp-type-${i}`} value={field.value} options={expenseTypes} placeholder="Choisir…" onChange={field.onChange} />} />
              </Field>
              {otherType && watch(`expenses.${i}.type`) === otherType && (
                <Field label="Nature de la dépense" htmlFor={`exp-nat-${i}`} required>
                  <input id={`exp-nat-${i}`} placeholder="Préciser la nature" {...register(`expenses.${i}.nature`)} />
                </Field>
              )}
              <Controller
                name={`expenses.${i}.amounts`}
                control={control}
                render={({ field }) => (
                  <>
                    <Field label="Devise(s)" htmlFor={`exp-cur-${i}`} required error={errors.expenses?.[i]?.amounts?.message || errors.expenses?.[i]?.amounts?.root?.message}>
                      <MultiSelect
                        id={`exp-cur-${i}`}
                        values={field.value.map((a) => a.currency)}
                        options={currencies}
                        placeholder="EUR et/ou MAD"
                        icon="arrow-right"
                        onChange={(cs) => field.onChange(cs.map((c) => field.value.find((a) => a.currency === c) || { currency: c, amount: '' }))}
                      />
                    </Field>
                    {field.value.map((a, j) => (
                      <Field key={a.currency} label={`Montant (${a.currency})`} htmlFor={`exp-amt-${i}-${j}`} required error={errors.expenses?.[i]?.amounts?.[j]?.amount?.message}>
                        <input
                          id={`exp-amt-${i}-${j}`}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          value={a.amount}
                          onChange={(e) => field.onChange(field.value.map((x, k) => (k === j ? { ...x, amount: e.target.value } : x)))}
                        />
                      </Field>
                    ))}
                  </>
                )}
              />
              <div className="fld full">
                <Controller
                  name={`expenses.${i}.attachment`}
                  control={control}
                  render={({ field }) => <FileDrop id={`exp-file-${i}`} label="Pièce justificative" files={field.value ? [field.value] : []} onChange={(names) => field.onChange(names[0] || '')} accept=".pdf,.jpg,.jpeg,.png" hint="Facture, ticket de caisse… (cliquez ou déposez le fichier)" />}
                />
              </div>
            </div>
          </div>
        ))}
        {errors.expenses?.message && <div className="fld-err">{errors.expenses.message}</div>}
        <button type="button" className="add-row" onClick={() => append(blankExpense())}>
          + Ajouter une autre dépense
        </button>
        <div className="note">
          Tous les justificatifs (factures, tickets de caisse, billets…) doivent être joints au décompte, dans le respect du barème en vigueur.
          {rules?.expenseDeadlineDays?.[mission.kind] ? ` Délai : ${rules.expenseDeadlineDays[mission.kind]} jours après le retour ; une note déposée après le ${rules.paymentCutoffDay} du mois est remboursée le mois suivant.` : ''}
        </div>
        <div className="form-ft">
          <button type="button" className="gbtn lg" disabled={busy} onClick={handleSubmit((d) => onSave(d))}>
            Sauvegarder
          </button>
          <button type="submit" className="go lg" disabled={busy}>
            Soumettre
          </button>
          <button type="button" className="gbtn lg" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
