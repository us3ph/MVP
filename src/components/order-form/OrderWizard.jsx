import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Icon from '../Icon';
import ProgressLine from './ProgressLine';
import StepOrder from './StepOrder';
import StepTransports from './StepTransports';
import StepLodging from './StepLodging';
import StepAdvance from './StepAdvance';
import StepValidation from './StepValidation';
import SkipLodgingModal from './SkipLodgingModal';
import { MISSION_STEP_FIELDS, missionSchema } from '../../schemas/mission';
import { useMissionMutations } from '../../queries';
import { useToast } from '../../app/ToastProvider';
import { todayISO } from '../../lib/format';
import { META, defaultsFor } from './defaults';

const cardId = (key) => `wiz-${key}`;

// Which steps are valid, from the schema issues of the current values.
function useStepValidity(control, steps) {
  const values = useWatch({ control });
  return useMemo(() => {
    const result = missionSchema.safeParse(values);
    const failing = new Set();
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const root = String(issue.path[0] ?? '');
        const step = Object.keys(MISSION_STEP_FIELDS).find((k) => MISSION_STEP_FIELDS[k].includes(root));
        failing.add(step || 'order');
      });
    }
    const map = {};
    steps.forEach((s) => {
      map[s.key] = s.key === 'preview' ? failing.size === 0 : !failing.has(s.key);
    });
    return map;
  }, [values, steps]);
}

// Highlights the node of the card currently in view (the scroll container is .main).
function useCurrentCard(keys) {
  const [current, setCurrent] = useState(keys[0]);
  useEffect(() => {
    const root = document.querySelector('.main');
    const cards = keys.map((k) => document.getElementById(cardId(k))).filter(Boolean);
    if (!root || !cards.length) return undefined;
    const ratios = new Map();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));
        const best = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
        if (best && best[1] > 0) setCurrent(best[0].replace('wiz-', ''));
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [keys]);
  return current;
}

export default function OrderWizard({ mode, kind, source, referentials: ref, profile, previousTotal }) {
  const navigate = useNavigate();
  const notify = useToast();
  const mm = useMissionMutations();
  const steps = useMemo(() => {
    const keys = ['order', 'transports', 'lodging', ...(kind === 'international' && mode !== 'reduce' ? ['advance'] : []), 'preview'];
    return keys.map((key) => ({ key, ...META[key] }));
  }, [kind, mode]);
  const keys = useMemo(() => steps.map((s) => s.key), [steps]);
  const [skipOpen, setSkipOpen] = useState(false);
  const form = useForm({ resolver: zodResolver(missionSchema), defaultValues: defaultsFor(mode, kind, source, ref, profile), mode: 'onTouched' });
  const { control, getValues, setValue, handleSubmit } = form;
  const validity = useStepValidity(control, steps);
  const current = useCurrentCard(keys);
  const busy = mm.save.isPending || mm.submit.isPending || mm.remove.isPending;
  const advanceLocked = mode === 'extend' && !!source?.startDate && source.startDate <= todayISO();
  const completed = steps.filter((s) => validity[s.key]).length;
  const scrolledOnce = useRef(false);

  const goTo = useCallback((key) => {
    document.getElementById(cardId(key))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  // Deep link: /ordre/…#transports opens on that card.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!scrolledOnce.current && keys.includes(hash)) {
      scrolledOnce.current = true;
      setTimeout(() => goTo(hash), 50);
    }
  }, [keys, goTo]);

  const persist = async () => {
    const saved = await mm.save.mutateAsync(getValues());
    setValue('id', saved.id);
    if (saved.number) setValue('number', saved.number);
    return saved;
  };
  const save = async () => {
    await persist();
    notify('Ordre de mission enregistré en brouillon.');
  };
  const remove = async () => {
    const id = getValues('id');
    if (id) await mm.remove.mutateAsync(id);
    notify(id ? 'Ordre de mission supprimé.' : 'Saisie abandonnée.');
    navigate('/');
  };
  const submit = handleSubmit(
    async () => {
      const saved = await persist();
      const m = await mm.submit.mutateAsync(saved.id);
      notify('Ordre de mission soumis aux validateurs.');
      navigate(`/missions/${m.id}`, { replace: true });
    },
    () => {
      const first = steps.find((s) => !validity[s.key]);
      if (first) goTo(first.key);
      notify('Veuillez compléter les étapes en rouge avant de soumettre.');
    },
  );
  const skipLodging = (data) => {
    setValue('lodgingSkipped', data, { shouldDirty: true, shouldValidate: true });
    setValue('lodgings', [], { shouldValidate: true });
    setSkipOpen(false);
  };

  const body = {
    order: <StepOrder referentials={ref} previousTotal={previousTotal} />,
    transports: <StepTransports referentials={ref} />,
    lodging: <StepLodging referentials={ref} />,
    advance: <StepAdvance referentials={ref} locked={advanceLocked} />,
    preview: <StepValidation referentials={ref} />,
  };

  return (
    <FormProvider {...form}>
      <div className="wiz">
        {steps.map((s, i) => {
          const ok = validity[s.key];
          return (
            <section key={s.key} id={cardId(s.key)} className={clsx('c formcard wiz-card', ok && 'ok', s.key === current && 'cur')}>
              <div className="form-head">
                <span className={clsx('wiz-n', ok && 'ok')} aria-hidden="true">
                  {ok ? <Icon name="check-mark" /> : i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="h" style={{ fontSize: 14 }}>
                    {s.title}
                  </div>
                  <div className="sub">{s.hint}</div>
                </div>
                {s.key === 'lodging' && !getValues('lodgingSkipped') && (
                  <button type="button" className="gbtn accent" onClick={() => setSkipOpen(true)}>
                    Ignorer
                  </button>
                )}
              </div>
              {body[s.key]}
            </section>
          );
        })}

        <div className="c wiz-bar">
          <button type="button" className="gbtn lg danger" disabled={busy} onClick={remove}>
            Supprimer
          </button>
          <ProgressLine steps={steps.map((s) => ({ key: s.key, label: s.side, done: validity[s.key] }))} current={current} onSelect={goTo} />
          <button type="button" className="gbtn lg" disabled={busy} onClick={save}>
            Sauvegarder
          </button>
          <button type="button" className="go lg" disabled={busy} onClick={submit} title={completed < steps.length ? 'Complétez toutes les étapes pour soumettre' : 'Soumettre aux validateurs'}>
            <Icon name="send" style={{ width: 14, height: 14 }} />
            Soumettre
          </button>
        </div>
      </div>
      {skipOpen && <SkipLodgingModal kind={kind} referentials={ref} onConfirm={skipLodging} onClose={() => setSkipOpen(false)} />}
    </FormProvider>
  );
}
