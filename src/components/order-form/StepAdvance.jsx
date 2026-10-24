import { Controller, useFormContext, useWatch } from 'react-hook-form';
import Icon from '../Icon';
import MultiSelect from '../ui/MultiSelect';
import { Field, TextArea } from '../ui/Field';
import { perDiem } from '../../lib/costing';
import { fmtAmount } from '../../lib/format';

// Step 4 « Avance » (international): per diem entitlement, expected currencies, requested amount.
export default function StepAdvance({ referentials: ref, locked = false }) {
  const { control, register, formState: { errors } } = useFormContext();
  const values = useWatch();
  const pd = perDiem(values, ref);
  const currency = values.advance?.currencies?.[0] || values.advance?.currency || ref.currencies[0];
  return (
    <div className="form one">
      <div className="total-banner">
        <Icon name="briefcase-clock" />
        <span className="total-main">
          <span className="total-lab">Indemnité de séjour</span>
          <span className="total-val">
            {fmtAmount(pd.mad)} <small>MAD</small>, {fmtAmount(pd.amount)} <small>{pd.currency}</small>
          </span>
        </span>
      </div>
      {locked && <div className="note">Pendant la mission et après sa date de fin, il n’est pas possible de demander un complément d’avance en espèces : les champs sont grisés et non modifiables.</div>}
      <Field label="Devise(s) attendue(s)" htmlFor="a-cur" required error={errors.advance?.currencies?.message} full>
        <Controller
          name="advance.currencies"
          control={control}
          render={({ field }) => <MultiSelect id="a-cur" values={field.value || []} options={ref.currencies} placeholder="EUR, USD…" icon="arrow-right" onChange={locked ? () => {} : field.onChange} />}
        />
      </Field>
      <Field label={`Montant de l’avance (${currency}) (Indemnité : ${fmtAmount(pd.amount)})`} htmlFor="a-amt" required error={errors.advance?.amount?.message} full>
        <input id="a-amt" type="number" min="0" step="0.01" placeholder="0,00" disabled={locked} {...register('advance.amount')} />
      </Field>
      <input type="hidden" value={currency} {...register('advance.currency')} />
      <Field label="Commentaire" htmlFor="a-comment" full>
        <TextArea id="a-comment" rows={4} disabled={locked} {...register('advance.comment')} />
      </Field>
    </div>
  );
}
