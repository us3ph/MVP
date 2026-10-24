import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../ui/Modal';
import { Field } from '../ui/Field';
import { passwordSchema } from '../../schemas/profile';

export default function ChangePasswordModal({ onSubmit, onClose, busy }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { current: '', next: '', confirm: '' } });
  return (
    <Modal icon="lock" title="Changer votre mot de passe" subtitle="Choisissez un nouveau mot de passe d’au moins 8 caractères." onClose={onClose}>
      <form className="form one" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Mot de passe actuel" htmlFor="pw-cur" required error={errors.current?.message} full>
          <input id="pw-cur" type="password" autoComplete="current-password" {...register('current')} />
        </Field>
        <Field label="Nouveau mot de passe" htmlFor="pw-next" required error={errors.next?.message} full>
          <input id="pw-next" type="password" autoComplete="new-password" {...register('next')} />
        </Field>
        <Field label="Confirmer le nouveau mot de passe" htmlFor="pw-conf" required error={errors.confirm?.message} full>
          <input id="pw-conf" type="password" autoComplete="new-password" {...register('confirm')} />
        </Field>
        <div className="form-ft">
          <button type="button" className="gbtn lg" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="go lg" disabled={busy}>
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
}
