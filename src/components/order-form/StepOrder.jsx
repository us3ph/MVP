import { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import Icon from '../Icon';
import Select from '../Select';
import DateField from '../DateField';
import MultiSelect from '../ui/MultiSelect';
import FileDrop from '../ui/FileDrop';
import { Field, FormSection, TextArea } from '../ui/Field';
import { useCities } from '../../queries';
import { cityOptions, controllerOf, countryName, peopleOptions } from '../../lib/refs';
import { addDays, fmtAmount, todayISO, uid } from '../../lib/format';

// Step 1 « Ordre de mission »: types, objet(s), dates, destination, priorité, participants.
export default function StepOrder({ referentials: ref, previousTotal = 0 }) {
  const { control, register, watch, setValue, formState: { errors } } = useFormContext();
  const kind = watch('kind');
  const country = watch('country');
  const cities = watch('cities') || [];
  const national = kind === 'national';
  const startDate = watch('startDate');
  const leadDays = ref.rules?.omLeadDays?.[kind] ?? 0;
  const tooLate = !!startDate && leadDays > 0 && startDate < addDays(todayISO(), leadDays);
  const { fields, append, remove } = useFieldArray({ control, name: 'objects', keyName: 'k' });
  const { data: cityList = [], isFetching } = useCities(country);
  const [showCities, setShowCities] = useState(true);
  const entities = (ref.entities || []).map((e) => ({ value: e.code, label: e.label }));
  const countries = (ref.countries || []).map((c) => ({ value: c.code, label: c.label }));
  const addCity = (name) => {
    if (name && !cities.includes(name)) setValue('cities', [...cities, name], { shouldValidate: true, shouldDirty: true });
  };
  const removeCity = (name) => setValue('cities', cities.filter((c) => c !== name), { shouldValidate: true, shouldDirty: true });

  return (
    <div className="form one">
      <Field label="Types de mission" htmlFor="o-types" required error={errors.types?.message} full>
        <Controller name="types" control={control} render={({ field }) => <MultiSelect id="o-types" values={field.value} options={ref.missionTypes || []} placeholder="Types de l’ordre de mission" onChange={field.onChange} />} />
      </Field>

      {fields.map((o, i) => (
        <FormSection
          key={o.k}
          title={fields.length > 1 ? `Objet de la mission ${i + 1}` : 'Objet de la mission'}
          extra={
            fields.length > 1 && (
              <button type="button" className="lnk danger" onClick={() => remove(i)}>
                Supprimer
              </button>
            )
          }
        >
          <Field label="Activité(s)" htmlFor={`o-act-${i}`} required error={errors.objects?.[i]?.activities?.message} full>
            <TextArea id={`o-act-${i}`} rows={3} {...register(`objects.${i}.activities`)} />
          </Field>
          <Field label="Entité / Projet" htmlFor={`o-ent-${i}`} required error={errors.objects?.[i]?.entity?.message} className="span2">
            <Controller name={`objects.${i}.entity`} control={control} render={({ field }) => <Select id={`o-ent-${i}`} value={field.value} options={entities} placeholder="Ordre interne" clearable onChange={field.onChange} />} />
          </Field>
          <Field label="Pourcentage" htmlFor={`o-pct-${i}`} required error={errors.objects?.[i]?.percentage?.message}>
            <div className="suffix">
              <input id={`o-pct-${i}`} type="number" min="0" max="100" step="0.01" {...register(`objects.${i}.percentage`)} />
              <span>%</span>
            </div>
          </Field>
          <div className="ctrl full">
            <span className="ctrl-av">
              <Icon name="profile" />
            </span>
            <span className="sub">Contrôleur de gestion</span>
            <b>{controllerOf(ref, watch(`objects.${i}.entity`)) || '—'}</b>
          </div>
          <div className="fsec-sub full">Attentes</div>
          <Field label="Description" htmlFor={`o-exp-${i}`} full>
            <TextArea id={`o-exp-${i}`} rows={3} {...register(`objects.${i}.expectations`)} />
          </Field>
          <div className="fld full">
            <Controller name={`objects.${i}.attachments`} control={control} render={({ field }) => <FileDrop id={`o-files-${i}`} label="Pièces jointes" files={field.value} onChange={field.onChange} multiple />} />
          </div>
        </FormSection>
      ))}
      <button type="button" className="add-row" onClick={() => append({ id: uid('obj'), activities: '', entity: fields[0]?.entity || '', percentage: 100, expectations: '', attachments: [] })}>
        + Ajouter un autre objet
      </button>

      <div className="form">
        <Field label="Date du début" htmlFor="o-start" required error={errors.startDate?.message}>
          <Controller name="startDate" control={control} render={({ field }) => <DateField id="o-start" value={field.value} onChange={field.onChange} placeholder="Date de début" />} />
        </Field>
        {national ? (
          <Field label="Heure" htmlFor="o-start-t" required error={errors.startTime?.message}>
            <input id="o-start-t" type="time" {...register('startTime')} />
          </Field>
        ) : (
          <Field label="Date de fin" htmlFor="o-end" required error={errors.endDate?.message}>
            <Controller name="endDate" control={control} render={({ field }) => <DateField id="o-end" value={field.value} onChange={field.onChange} placeholder="Date de fin" />} />
          </Field>
        )}
        {national && (
          <>
            <Field label="Date de fin" htmlFor="o-end" required error={errors.endDate?.message}>
              <Controller name="endDate" control={control} render={({ field }) => <DateField id="o-end" value={field.value} onChange={field.onChange} placeholder="Date de fin" />} />
            </Field>
            <Field label="Heure" htmlFor="o-end-t" required error={errors.endTime?.message}>
              <input id="o-end-t" type="time" {...register('endTime')} />
            </Field>
          </>
        )}
        {!national && (
          <Field label="Pays" htmlFor="o-country" required error={errors.country?.message}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  id="o-country"
                  value={field.value}
                  options={countries}
                  placeholder="Choisir un pays…"
                  searchable
                  onChange={(code) => {
                    field.onChange(code);
                    setValue('cities', [], { shouldDirty: true });
                  }}
                />
              )}
            />
          </Field>
        )}
        <Field label="Ville" htmlFor="o-city" required error={errors.cities?.message} full={national}>
          <Select id="o-city" value="" options={cityOptions(cityList)} placeholder={isFetching ? 'Chargement des villes…' : country ? 'Choisir une ville…' : 'Choisissez d’abord le pays'} searchable disabled={!country} onChange={addCity} />
        </Field>
        <div className="cities full">
          <div className="cities-hd">
            <span className="sub">Liste de villes</span>
            <button type="button" className="lnk" onClick={() => setShowCities((v) => !v)}>
              <Icon name={showCities ? 'eye-off' : 'eye'} />
              {showCities ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {showCities && (
            <div className="chips wrap">
              {cities.map((c) => (
                <span key={c} className="chip on static">
                  {c}
                  <button type="button" className="chip-x" aria-label={`Retirer ${c}`} onClick={() => removeCity(c)}>
                    <Icon name="close" />
                  </button>
                </span>
              ))}
              {!cities.length && <span className="sub">Aucune ville sélectionnée{country ? ` (${countryName(ref, country)})` : ''}.</span>}
            </div>
          )}
        </div>
        <Field label="Priorité" htmlFor="o-prio" required error={errors.priority?.message}>
          <Controller name="priority" control={control} render={({ field }) => <Select id="o-prio" value={field.value} options={ref.priorities || []} onChange={field.onChange} />} />
        </Field>
        <Field label="Participants" htmlFor="o-part">
          <Controller name="participants" control={control} render={({ field }) => <MultiSelect id="o-part" values={field.value} options={peopleOptions(ref)} placeholder="Ajouter des participants…" onChange={field.onChange} />} />
        </Field>
        {!national && (
          <Field label="Demande de visa" full>
            <Controller
              name="visaRequest"
              control={control}
              render={({ field }) => (
                <label className="opt inline">
                  <input type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  <span className="opt-mark sq" aria-hidden="true" />
                  Je souhaite que la logistique voyage prenne en charge ma demande de visa pour cette destination.
                </label>
              )}
            />
          </Field>
        )}
        {tooLate && (
          <div className="note warn full">
            Délai réglementaire : l’ordre de mission {national ? 'national' : 'international'} doit être établi au moins {leadDays} jours avant la date de départ (demande d’avance : {ref.rules.advanceLeadDays} jours). Votre demande pourra être refusée ou traitée en urgence.
          </div>
        )}
      </div>

      <div className="total-banner">
        <Icon name="briefcase-clock" />
        <span className="total-main">
          <span className="total-lab">Total des missions antérieures</span>
          <span className="total-val">
            {fmtAmount(previousTotal, 2)} <small>MAD</small>
          </span>
        </span>
      </div>
    </div>
  );
}
