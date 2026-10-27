import { useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Select from '../components/Select';
import DateField from '../components/DateField';
import FileDrop from '../components/ui/FileDrop';
import Loading from '../components/ui/Loading';
import { Field, TextArea } from '../components/ui/Field';
import DelegationsSection from '../components/profile/DelegationsSection';
import DelegationModal from '../components/profile/DelegationModal';
import { useHeader } from '../app/header';
import { useUI } from '../app/ui';
import { useToast } from '../app/ToastProvider';
import { useDelegations, useProfile, useProfileMutations, useReferentials } from '../queries';
import { profileSchema } from '../schemas/profile';
import { uid } from '../lib/format';

// macOS-style default user picture: white silhouette on a grey disc.
function DefaultAvatar() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <clipPath id="av-clip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
        <linearGradient id="av-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6d6db" />
          <stop offset="1" stopColor="#a6a6ae" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#av-bg)" />
      <g clipPath="url(#av-clip)" fill="#fff">
        <circle cx="32" cy="25" r="11" />
        <path d="M7 66c0-14.5 10.5-23 25-23s25 8.5 25 23z" />
      </g>
    </svg>
  );
}

function Card({ title, text, children, extra }) {
  return (
    <section className="c formcard">
      <div className="form-head">
        <div style={{ flex: 1 }}>
          <div className="h" style={{ fontSize: 14 }}>
            {title}
          </div>
          {text && <div className="sub">{text}</div>}
        </div>
        {extra}
      </div>
      {children}
    </section>
  );
}

function ProfileForm({ profile, referentials, delegations }) {
  const navigate = useNavigate();
  const notify = useToast();
  const { openPassword } = useUI();
  const pm = useProfileMutations();
  const photoRef = useRef(null);
  const [dlg, setDlg] = useState(null); // null | { delegation|null }

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({ resolver: zodResolver(profileSchema), defaultValues: profile });
  const { fields: visas, append: addVisa, remove: removeVisa } = useFieldArray({ control, name: 'visas', keyName: 'k' });
  const photo = watch('photo');
  const entities = (referentials.entities || []).map((e) => ({ value: e.code, label: e.label }));
  const countries = (referentials.countries || []).map((c) => ({ value: c.code, label: c.label }));

  const save = async (data) => {
    await pm.update.mutateAsync(data);
    notify('Profil enregistré.');
  };
  const saveDelegation = async (d) => {
    await pm.saveDelegation.mutateAsync(d);
    setDlg(null);
    notify(d.id ? 'Délégation modifiée.' : 'Délégation ajoutée.');
  };
  const deleteDelegation = async (d) => {
    await pm.deleteDelegation.mutateAsync(d.id);
    notify('Délégation supprimée.');
  };

  return (
    <form className="settings" onSubmit={handleSubmit(save)}>
      <div className="two-col">
        <Card title="Votre photo de profil">
          <div className="photo-col">
            <button type="button" className="avatar" aria-label="Changer la photo de profil" title="Changer la photo" onClick={() => photoRef.current?.click()}>
              <DefaultAvatar />
            </button>
            <input ref={photoRef} className="upl-input" type="file" accept=".jpg,.jpeg,.png" aria-label="Photo de profil" onChange={(e) => setValue('photo', e.target.files?.[0]?.name || '', { shouldDirty: true })} />
            <button type="button" className="go" onClick={() => photoRef.current?.click()}>
              Changer la photo
            </button>
            <div className="avatar-hint">{photo || 'La taille recommandée est de 512x512px'}</div>
            <button type="button" className="gbtn" onClick={openPassword}>
              <Icon name="lock" />
              Changer votre mot de passe
            </button>
          </div>
        </Card>
        <Card title="Informations personnelles">
          <div className="form">
            <Field label="Matricule" htmlFor="p-mat">
              <input id="p-mat" readOnly {...register('matricule')} />
            </Field>
            <Field label="Fonction" htmlFor="p-job" hint="Renseignée par les Ressources Humaines.">
              <input id="p-job" readOnly {...register('jobTitle')} />
            </Field>
            <Field label="Nom" htmlFor="p-last" required error={errors.lastName?.message}>
              <input id="p-last" {...register('lastName')} />
            </Field>
            <Field label="Prénom" htmlFor="p-first" required error={errors.firstName?.message}>
              <input id="p-first" {...register('firstName')} />
            </Field>
            <Field label="Entité d’affectation" htmlFor="p-entity" required error={errors.entity?.message} full>
              <Controller name="entity" control={control} render={({ field }) => <Select id="p-entity" value={field.value} options={entities} onChange={field.onChange} />} />
            </Field>
            <Field label="Adresse" htmlFor="p-addr" full>
              <TextArea id="p-addr" rows={3} {...register('address')} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="two-col">
        <Card title="Passeport et CIN">
          <div className="form">
            <Field label="N° Passeport" htmlFor="p-pass" error={errors.passport?.number?.message}>
              <input id="p-pass" placeholder="Ex. : AB1234567" {...register('passport.number')} />
            </Field>
            <Field label="Date de fin de validité" htmlFor="p-pass-exp">
              <Controller name="passport.expiry" control={control} render={({ field }) => <DateField id="p-pass-exp" value={field.value} onChange={field.onChange} />} />
            </Field>
            <div className="fld full">
              <Controller name="passport.file" control={control} render={({ field }) => <FileDrop id="p-pass-file" label="Passeport" files={field.value ? [field.value] : []} onChange={(n) => field.onChange(n[0] || '')} accept=".pdf,.jpg,.jpeg,.png" />} />
            </div>
            <Field label="N° CIN" htmlFor="p-cin" full>
              <input id="p-cin" placeholder="Ex. : AB123456" {...register('cin.number')} />
            </Field>
            <div className="fld full">
              <Controller name="cin.file" control={control} render={({ field }) => <FileDrop id="p-cin-file" label="CIN" files={field.value ? [field.value] : []} onChange={(n) => field.onChange(n[0] || '')} accept=".pdf,.jpg,.jpeg,.png" />} />
            </div>
          </div>
        </Card>
        <Card title="Autres">
          <div className="form">
            <Field label="Téléphone" htmlFor="p-phone">
              <input id="p-phone" type="tel" placeholder="+212 6 00 00 00 00" {...register('phone')} />
            </Field>
            <Field label="Code Safar Flyer" htmlFor="p-safar">
              <input id="p-safar" placeholder="Ex. : 123456789" {...register('safarFlyer')} />
            </Field>
            <div className="fld full">
              <Controller name="signature" control={control} render={({ field }) => <FileDrop id="p-sign" label="Signature en PJ" files={field.value ? [field.value] : []} onChange={(n) => field.onChange(n[0] || '')} accept=".jpg,.jpeg,.png" hint="Image de votre signature (PNG ou JPG)" />} />
            </div>
            <div className="visas">
              <button type="button" className="add-row" onClick={() => addVisa({ id: uid('visa'), country: '', number: '', expires: '', file: '' })}>
                + Ajouter un visa
              </button>
              {visas.map((v, i) => (
                <div className="visa-row" key={v.k}>
                  <Field label="Pays" htmlFor={`v-country-${v.k}`} required error={errors.visas?.[i]?.country?.message}>
                    <Controller name={`visas.${i}.country`} control={control} render={({ field }) => <Select id={`v-country-${v.k}`} value={field.value} options={countries} placeholder="Pays" searchable searchPlaceholder="Rechercher un pays…" itemsLabel="pays" onChange={field.onChange} />} />
                  </Field>
                  <Field label="Numéro" htmlFor={`v-num-${v.k}`}>
                    <input id={`v-num-${v.k}`} placeholder="Numéro du visa" {...register(`visas.${i}.number`)} />
                  </Field>
                  <Field label="Date de fin de validité" htmlFor={`v-exp-${v.k}`}>
                    <Controller name={`visas.${i}.expires`} control={control} render={({ field }) => <DateField id={`v-exp-${v.k}`} value={field.value} onChange={field.onChange} />} />
                  </Field>
                  <button type="button" className="rb visa-rm" aria-label={`Retirer le visa ${i + 1}`} title="Retirer" onClick={() => removeVisa(i)}>
                    <Icon name="trash" />
                  </button>
                </div>
              ))}
            </div>
            <Field label="Date de fin validité de l’assurance de voyage" htmlFor="p-ins" full>
              <Controller name="insuranceExpiry" control={control} render={({ field }) => <DateField id="p-ins" value={field.value} onChange={field.onChange} />} />
            </Field>
          </div>
        </Card>
      </div>

      <DelegationsSection delegations={delegations} referentials={referentials} onAdd={() => setDlg({ delegation: null })} onEdit={(d) => setDlg({ delegation: d })} onDelete={deleteDelegation} />

      <div className="c settings-ft bar">
        <button type="button" className="gbtn lg" onClick={() => navigate(-1)}>
          Retour
        </button>
        <span style={{ flex: 1 }} />
        <button type="submit" className="go lg" disabled={pm.update.isPending}>
          Enregistrer
        </button>
      </div>

      {dlg && <DelegationModal delegation={dlg.delegation} referentials={referentials} onSave={saveDelegation} onClose={() => setDlg(null)} busy={pm.saveDelegation.isPending} />}
    </form>
  );
}

export default function ProfilePage() {
  useHeader('Mon profil', 'Vos informations personnelles, documents de voyage et délégations.');
  const { data: profile } = useProfile();
  const { data: referentials } = useReferentials();
  const { data: delegations = [] } = useDelegations();
  if (!profile || !referentials) return <Loading />;
  return <ProfileForm key={profile.id} profile={profile} referentials={referentials} delegations={delegations} />;
}
