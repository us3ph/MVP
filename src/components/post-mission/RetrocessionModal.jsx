import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../ui/Modal';
import Select from '../Select';
import { Field } from '../ui/Field';
import FileDrop from '../ui/FileDrop';
import { retrocessionSchema } from '../../schemas/postMission';

// « Rétrocession »: give back (part of) the advance in cash, after a reduction or a cancellation.
export default function RetrocessionModal({ mission, currencies = [], onConfirm, onClose, busy }) {
  const options = mission.advance?.currencies?.length ? mission.advance.currencies : currencies;
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(retrocessionSchema),
    defaultValues: { currency: options[0] || '', amount: '', receipt: '' },
  });
  const currency = watch('currency');
  return (
    <Modal icon="coins" title="Rétrocession" subtitle="Afin d’ajouter une rétrocession, vous devez d’abord remplir ces informations." onClose={onClose}>
      <form onSubmit={handleSubmit((d) => onConfirm(d))} className="form one">
        <div className="form-cap">Espèce</div>
        <Field label="Devise" htmlFor="retro-cur" required error={errors.currency?.message} full>
          <Controller name="currency" control={control} render={({ field }) => <Select id="retro-cur" value={field.value} options={options} onChange={field.onChange} icon="arrow-right" />} />
        </Field>
        <Field label={`Montant (${currency || '—'})`} htmlFor="retro-amt" required error={errors.amount?.message} full>
          <input id="retro-amt" type="number" min="0" step="0.01" placeholder="0,00" {...register('amount')} />
        </Field>
        <div className="fld full">
          <Controller name="receipt" control={control} render={({ field }) => <FileDrop id="retro-receipt" label="Reçu de la trésorerie (justificatif du montant retourné)" files={field.value ? [field.value] : []} onChange={(n) => field.onChange(n[0] || '')} accept=".pdf,.jpg,.jpeg,.png" />} />
        </div>
        <div className="form-ft between">
          <button type="submit" className="go lg" disabled={busy}>
            Valider
          </button>
          <button type="button" className="gbtn lg" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
