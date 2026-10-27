import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import Icon from '../Icon';
import Select from '../Select';
import DateField from '../DateField';
import { Field, TextArea } from '../ui/Field';
import { useCities } from '../../queries';
import { cityOptions } from '../../lib/refs';
import { uid } from '../../lib/format';
import { stayDates } from '../../lib/linkedDates';

// Step 3 « Hébergement »: city from the mission, dates from the outbound arrival and the return departure
// (or the mission dates), all editable; can be skipped (see SkipLodgingModal).
export default function StepLodging({ referentials: ref }) {
  const { control, register, watch, getValues, setValue, formState: { errors } } = useFormContext();
  const country = watch('country') || ref.homeCity.countryCode;
  const skipped = watch('lodgingSkipped');
  const { data: cities = [] } = useCities(country);
  const { fields, append, remove } = useFieldArray({ control, name: 'lodgings', keyName: 'k' });

  if (skipped) {
    return (
      <div className="form one">
        <div className="note">
          <b>Étape ignorée.</b> Forfait journalier d’hébergement : {skipped.flatRate ? 'Oui' : 'Non (remboursement sur la note de frais)'}.
          <br />
          Commentaire : {skipped.comment}
        </div>
        <div>
          <button
            type="button"
            className="gbtn"
            onClick={() => {
              setValue('lodgingSkipped', null, { shouldDirty: true });
              append({ id: uid('lod'), city: watch('cities')?.[0] || '', ...stayDates(getValues()), preferences: '' });
            }}
          >
            <Icon name="undo" />
            Rétablir l’étape d’hébergement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form one">
      {fields.map((l, i) => (
        <div className="blk" key={l.k}>
          <div className="blk-hd">
            <span className="fsec-title">Hébergement {fields.length > 1 ? i + 1 : ''}</span>
            {fields.length > 1 && (
              <button type="button" className="lnk danger" onClick={() => remove(i)}>
                Supprimer
              </button>
            )}
          </div>
          <div className="form">
            <Field label="Ville d’hébergement" htmlFor={`h-city-${i}`} required error={errors.lodgings?.[i]?.city?.message} full>
              <Controller name={`lodgings.${i}.city`} control={control} render={({ field }) => <Select id={`h-city-${i}`} value={field.value} options={cityOptions(cities)} placeholder="Choisir…" searchable searchPlaceholder="Rechercher une ville…" itemsLabel="villes" onChange={field.onChange} />} />
            </Field>
            <Field label="Date de check-in" htmlFor={`h-in-${i}`} required error={errors.lodgings?.[i]?.checkIn?.message}>
              <Controller name={`lodgings.${i}.checkIn`} control={control} render={({ field }) => <DateField id={`h-in-${i}`} value={field.value} onChange={field.onChange} />} />
            </Field>
            <Field label="Date de check-out" htmlFor={`h-out-${i}`} required error={errors.lodgings?.[i]?.checkOut?.message}>
              <Controller name={`lodgings.${i}.checkOut`} control={control} render={({ field }) => <DateField id={`h-out-${i}`} value={field.value} onChange={field.onChange} />} />
            </Field>
            <Field label="Préférences" htmlFor={`h-pref-${i}`} full>
              <TextArea id={`h-pref-${i}`} rows={3} {...register(`lodgings.${i}.preferences`)} />
            </Field>
          </div>
        </div>
      ))}
      {fields.length === 0 && <div className="empty">Aucun hébergement. Ajoutez-en un (ville et dates pré-remplies depuis la mission et vos trajets) ou ignorez l’étape avec le bouton « Ignorer ».</div>}
      {errors.lodgings?.message && <div className="fld-err">{errors.lodgings.message}</div>}
      <button type="button" className="add-row" onClick={() => append({ id: uid('lod'), city: fields.length ? '' : watch('cities')?.[0] || '', ...stayDates(getValues()), preferences: '' })}>
        {fields.length === 0 ? '+ Ajouter un hébergement' : '+ Ajouter un autre hébergement'}
      </button>
    </div>
  );
}
