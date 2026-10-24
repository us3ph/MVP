import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../ui/Modal';
import { Field, TextArea } from '../ui/Field';
import { lodgingSkipSchema } from '../../schemas/mission';
import { lodgingSkipTexts } from '../../lib/costing';

// « Ignorer l’étape d’hébergement »: the collaborator takes care of lodging and chooses between the
// daily flat rate and a capped reimbursement on the note de frais.
export default function SkipLodgingModal({ kind, referentials, onConfirm, onClose }) {
  const texts = lodgingSkipTexts(kind, referentials);
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(lodgingSkipSchema),
    defaultValues: { flatRate: true, acknowledged: false, comment: '' },
  });
  const flat = watch('flatRate');
  return (
    <Modal icon="check" title="Ignorer l’étape d’hébergement" subtitle="Êtes-vous sûr de vouloir ignorer l’étape d’hébergement ?" onClose={onClose} width={520}>
      <form className="form one" onSubmit={handleSubmit(onConfirm)}>
        <Field label="Souhaitez-vous obtenir le forfait journalier d’hébergement ?" full>
          <Controller
            name="flatRate"
            control={control}
            render={({ field }) => (
              <div className="radios">
                {[
                  [true, 'Oui'],
                  [false, 'Non'],
                ].map(([val, lab]) => (
                  <label key={lab} className="opt inline">
                    <input type="radio" name="flatRate" checked={field.value === val} onChange={() => field.onChange(val)} />
                    <span className="opt-mark" aria-hidden="true" />
                    {lab}
                  </label>
                ))}
              </div>
            )}
          />
        </Field>
        <Field error={errors.acknowledged?.message} full>
          <label className="opt top">
            <input type="checkbox" {...register('acknowledged')} />
            <span className="opt-mark sq" aria-hidden="true" />
            <span>
              <span className="req">* </span>
              {flat ? texts.flat : texts.refund}
            </span>
          </label>
        </Field>
        <Field label="Commentaire" htmlFor="skip-comment" required error={errors.comment?.message} full>
          <TextArea id="skip-comment" rows={4} placeholder="Commentaire de justification" {...register('comment')} />
        </Field>
        <div className="form-ft between">
          <button type="submit" className="go lg">
            Oui
          </button>
          <button type="button" className="gbtn lg" onClick={onClose}>
            Non
          </button>
        </div>
      </form>
    </Modal>
  );
}
