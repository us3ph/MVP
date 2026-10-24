import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../ui/Modal';
import { Field, TextArea } from '../ui/Field';
import { cancelSchema } from '../../schemas/postMission';

// « Annuler l’ordre de mission »: the collaborator gives the reason; the request then goes to
// logistique voyage (and trésorerie when an advance was granted).
export default function CancelMissionModal({ mission, onConfirm, onClose, busy }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(cancelSchema), defaultValues: { reason: '' } });
  return (
    <Modal icon="ban" tone="danger" title="Annuler l’ordre de mission" onClose={onClose} closable={false}>
      <form id="cancel-form" onSubmit={handleSubmit((d) => onConfirm(d.reason))} className="form one">
        <p className="md-text">Êtes-vous sûr de vouloir demander l’annulation de cet ordre de mission ?</p>
        <Field label="Motif d’annulation" htmlFor="cancel-reason" required error={errors.reason?.message} full>
          <TextArea id="cancel-reason" rows={4} placeholder="Motif d’annulation" {...register('reason')} />
        </Field>
        {mission.advance?.granted && !mission.retrocession && (
          <div className="note">Une avance en devise a été octroyée : pensez à ajouter votre rétrocession avant l’annulation.</div>
        )}
        <div className="form-ft between">
          <button type="submit" className="go lg" disabled={busy}>
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
