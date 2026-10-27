import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../ui/Modal';
import Select from '../Select';
import DateField from '../DateField';
import MultiSelect from '../ui/MultiSelect';
import { Field } from '../ui/Field';
import { delegationSchema } from '../../schemas/profile';
import { peopleOptions } from '../../lib/refs';

// Ajouter / modifier une délégation: délégué, actions et droits, période.
export default function DelegationModal({ delegation, referentials, onSave, onClose, busy }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(delegationSchema),
    defaultValues: delegation || { delegateId: '', actions: [], startDate: '', endDate: '' },
  });
  const actionOptions = (referentials?.delegationActions || []).map((a) => ({ value: a.code, label: a.label, note: a.note }));
  return (
    <Modal icon="delegate" title={delegation ? 'Modifier la délégation' : 'Ajouter une délégation'} onClose={onClose}>
      <form className="form one" onSubmit={handleSubmit((d) => onSave({ ...delegation, ...d }))}>
        <Field label="Délégué" htmlFor="dlg-who" required error={errors.delegateId?.message} hint="Rechercher par nom, prénom ou email." full>
          <Controller name="delegateId" control={control} render={({ field }) => <Select id="dlg-who" value={field.value} options={peopleOptions(referentials)} placeholder="Choisir un collaborateur…" searchable searchPlaceholder="Rechercher par nom, prénom ou email" onChange={field.onChange} />} />
        </Field>
        <Field label="Action" htmlFor="dlg-act" required error={errors.actions?.message} full>
          <Controller name="actions" control={control} render={({ field }) => <MultiSelect id="dlg-act" values={field.value} options={actionOptions} placeholder="Actions et droits délégués…" icon="arrow-right" onChange={field.onChange} />} />
        </Field>
        <Field label="Date de début" htmlFor="dlg-from" required error={errors.startDate?.message}>
          <Controller name="startDate" control={control} render={({ field }) => <DateField id="dlg-from" value={field.value} onChange={field.onChange} />} />
        </Field>
        <Field label="Date de fin incluse" htmlFor="dlg-to" required error={errors.endDate?.message}>
          <Controller name="endDate" control={control} render={({ field }) => <DateField id="dlg-to" value={field.value} onChange={field.onChange} />} />
        </Field>
        <div className="form-ft start">
          <button type="submit" className="go lg" disabled={busy}>
            Sauvegarder
          </button>
          <button type="button" className="gbtn lg" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
