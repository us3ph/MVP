import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import Icon from '../Icon';
import Select from '../Select';
import DateField from '../DateField';
import { Field, TextArea } from '../ui/Field';
import { TRANSPORT_MODES } from '../../domain/constants';
import { useCities } from '../../queries';
import { cityOptions, countryName } from '../../lib/refs';
import { uid } from '../../lib/format';

// Step 2 « Transports »: legs from the ville d’affectation (or another city) to the destination and back.
export default function StepTransports({ referentials: ref }) {
  const { control, register, watch, getValues, setValue, formState: { errors } } = useFormContext();
  const country = watch('country');
  const home = ref.homeCity;
  const { data: homeCities = [] } = useCities(home.countryCode);
  const { data: destCities = [] } = useCities(country && country !== home.countryCode ? country : null);
  const options = [...cityOptions(homeCities, countryName(ref, home.countryCode)), ...cityOptions(destCities, countryName(ref, country))];
  const { fields, append, remove } = useFieldArray({ control, name: 'transports', keyName: 'k' });
  const legs = watch('transports') || [];
  const [startDate, endDate, cities] = watch(['startDate', 'endDate', 'cities']);
  // First leg: from the ville d’affectation to the first destination city on the start date; second leg:
  // the way back on the end date; further legs start where the previous one ended.
  const addLeg = () => {
    const last = legs[legs.length - 1];
    if (!last) append({ id: uid('leg'), fromCity: home.name, departDate: startDate || '', mode: '', vehicle: '', toCity: cities?.[0] || '', arriveDate: startDate || '' });
    else if (legs.length === 1) append({ id: uid('leg'), fromCity: last.toCity || '', departDate: endDate || last.arriveDate || '', mode: last.mode || '', vehicle: last.vehicle || '', toCity: home.name, arriveDate: endDate || last.arriveDate || '' });
    else append({ id: uid('leg'), fromCity: last.toCity || '', departDate: last.arriveDate || '', mode: '', vehicle: '', toCity: '', arriveDate: '' });
  };

  return (
    <div className="form one">
      {fields.map((leg, i) => (
        <div className="blk" key={leg.k}>
          <div className="blk-hd">
            <span className="fsec-title">Trajet {i + 1}</span>
            {fields.length > 1 && (
              <button type="button" className="lnk danger" onClick={() => remove(i)}>
                Supprimer
              </button>
            )}
          </div>
          <div className="form">
            <Field label="Ville de départ" htmlFor={`t-from-${i}`} required error={errors.transports?.[i]?.fromCity?.message}>
              <Controller name={`transports.${i}.fromCity`} control={control} render={({ field }) => <Select id={`t-from-${i}`} value={field.value} options={options} placeholder="Choisir…" searchable searchPlaceholder="Rechercher une ville…" itemsLabel="villes" clearable onChange={field.onChange} />} />
            </Field>
            <Field label="Date de départ" htmlFor={`t-dep-${i}`} required error={errors.transports?.[i]?.departDate?.message}>
              <Controller name={`transports.${i}.departDate`} control={control} render={({ field }) => <DateField id={`t-dep-${i}`} value={field.value} onChange={field.onChange} />} />
            </Field>
            <Field required error={errors.transports?.[i]?.mode?.message} full>
              <Controller
                name={`transports.${i}.mode`}
                control={control}
                render={({ field }) => (
                  <div className="modes" role="radiogroup" aria-label="Mode de transport">
                    {TRANSPORT_MODES.map((m) => (
                      <button
                        key={m.code}
                        type="button"
                        role="radio"
                        aria-checked={field.value === m.code}
                        className={'mode' + (field.value === m.code ? ' on' : '')}
                        onClick={() => {
                          field.onChange(m.code);
                          if (m.code === 'road' && !getValues(`transports.${i}.vehicle`)) setValue(`transports.${i}.vehicle`, ref.roadVehicles[0].code);
                        }}
                      >
                        <Icon name={m.icon} />
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}
              />
            </Field>
            {legs[i]?.mode === 'road' && (
              <Field label="Véhicule" htmlFor={`t-veh-${i}`} required error={errors.transports?.[i]?.vehicle?.message} hint="Seule la voiture personnelle ouvre droit à l’indemnité kilométrique ; les autres frais sont remboursés sur justificatifs." full>
                <Controller name={`transports.${i}.vehicle`} control={control} render={({ field }) => <Select id={`t-veh-${i}`} value={field.value} options={ref.roadVehicles.map((v) => ({ value: v.code, label: v.label }))} placeholder="Choisir…" onChange={field.onChange} />} />
              </Field>
            )}
            <Field label="Ville d’arrivée" htmlFor={`t-to-${i}`} required error={errors.transports?.[i]?.toCity?.message}>
              <Controller name={`transports.${i}.toCity`} control={control} render={({ field }) => <Select id={`t-to-${i}`} value={field.value} options={options} placeholder="Choisir…" searchable searchPlaceholder="Rechercher une ville…" itemsLabel="villes" clearable onChange={field.onChange} />} />
            </Field>
            <Field label="Date d’arrivée" htmlFor={`t-arr-${i}`} required error={errors.transports?.[i]?.arriveDate?.message}>
              <Controller name={`transports.${i}.arriveDate`} control={control} render={({ field }) => <DateField id={`t-arr-${i}`} value={field.value} onChange={field.onChange} />} />
            </Field>
          </div>
        </div>
      ))}
      {fields.length === 0 && <div className="empty">Aucun trajet. Le premier trajet est pré-rempli depuis votre ville d’affectation vers la destination.</div>}
      {errors.transports?.message && <div className="fld-err">{errors.transports.message}</div>}
      <button type="button" className="add-row" onClick={addLeg}>
        {fields.length === 0 ? '+ Ajouter le trajet aller' : fields.length === 1 ? '+ Ajouter le trajet retour' : '+ Ajouter un autre trajet'}
      </button>
      <div className="note">
        NB : l’option « Aérien » n’est pas valable pour les trajets de moins de {ref.bareme.airMinKm} km (avion réservé uniquement par UM6P). Le trajet part de votre ville d’affectation (ou autre) jusqu’au retour au Maroc vers la ville d’affectation (ou autre).
      </div>
      <Field label="Commentaire" htmlFor="t-comment" full>
        <TextArea id="t-comment" rows={3} {...register('transportComment')} />
      </Field>
    </div>
  );
}
