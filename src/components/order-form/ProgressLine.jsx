import clsx from 'clsx';
import Icon from '../Icon';

// Horizontal process line: one node per step, filled once the step is valid, the segment between two
// nodes filled when both are valid; the node of the card in view is highlighted.
export default function ProgressLine({ steps, current, onSelect }) {
  const done = steps.filter((s) => s.done).length;
  return (
    <nav className="pline" aria-label={`Progression : ${done} étape${done > 1 ? 's' : ''} sur ${steps.length}`}>
      {steps.map((s, i) => (
        <button
          key={s.key}
          type="button"
          className={clsx('pnode', s.done && 'done', s.key === current && 'cur', i > 0 && s.done && steps[i - 1].done && 'linked')}
          aria-current={s.key === current ? 'step' : undefined}
          title={s.done ? `${s.label} : complété` : `${s.label} : à compléter`}
          onClick={() => onSelect(s.key)}
        >
          <span className="pnode-dot" aria-hidden="true">
            {s.done ? <Icon name="check-mark" /> : i + 1}
          </span>
          <span className="pnode-lab">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}
