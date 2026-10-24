import Icon from '../Icon';
import SlideOver from '../ui/SlideOver';
import { EXPENSE_FLOW } from '../../domain/constants';
import { fmtDateTime, missionRef } from '../../lib/format';

function StepList({ items }) {
  return (
    <ol className="tl">
      {items.map((s, i) => (
        <li key={i} className={'tl-item' + (s.done ? ' done' : '')}>
          <span className="tl-dot">{s.done ? <Icon name="check-mark" /> : null}</span>
          <div className="tl-main">
            <div className="tl-row">
              <span className="tl-step">{s.step}</span>
              <span className="tl-date">{s.done ? (s.at ? fmtDateTime(s.at) : 'Validé') : 'En attente'}</span>
            </div>
            {s.done && 'comment' in s && (
              <div className="tl-comment">
                Commentaire : <span>{s.comment || '—'}</span>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

// « Activité de validation »: history of the order's processing (Hiérarchie → Validateur Fonctionnel
// → Logistique Voyage), and the note de frais circuit when one exists.
export default function TimelinePanel({ mission, report, processingSteps = [], expenseSteps = [], onClose }) {
  const steps = mission.timeline?.length ? mission.timeline : processingSteps.map((step) => ({ step, done: false }));
  const reached = report ? EXPENSE_FLOW.indexOf(report.status) : -1;
  const ndfSteps = report
    ? expenseSteps.map((s, i) => ({
        step: s.role ? `${s.label} (${s.role})` : s.label,
        done: reached > i,
        at: i === 0 && report.submittedAt ? `${report.submittedAt}T09:00` : s.code === 'payment_pending' && report.paymentDate ? `${report.paymentDate}T09:00` : null,
      }))
    : null;

  return (
    <SlideOver title="Activité de validation" onClose={onClose}>
      <div className="tl-group">
        <div className="tl-title">
          Ordre de mission {missionRef(mission) && <span className="mu">n° {missionRef(mission)}</span>}
        </div>
        <StepList items={steps} />
      </div>
      {ndfSteps && (
        <div className="tl-group">
          <div className="tl-title">Note de frais</div>
          <StepList items={ndfSteps} />
        </div>
      )}
    </SlideOver>
  );
}
