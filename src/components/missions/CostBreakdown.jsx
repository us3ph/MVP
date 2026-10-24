import Icon from '../Icon';
import Accordion from '../ui/Accordion';
import { fmtAmount, fmtMoney } from '../../lib/format';

// « Coût global estimé / réel de la mission »: blue header with the MAD total, lines inside.
export default function CostBreakdown({ title, total, lines, defaultOpen = false }) {
  return (
    <Accordion title={title} tone="accent" defaultOpen={defaultOpen} extra={<span className="acc-amount">{fmtAmount(total, 2)} Dhs</span>}>
      <ul className="cost-lines">
        {lines.map((l) => (
          <li key={l.key} className="cost-line">
            <span className="cost-ic">
              <Icon name={l.icon || 'wallet'} />
            </span>
            <span className="cost-label">
              {l.label}
              {l.detail && <small className="cost-detail">{l.detail}</small>}
            </span>
            <span className="cost-amt">{fmtMoney(l.amount, l.currency)}</span>
          </li>
        ))}
        {!lines.length && <li className="empty">Aucune ligne de coût.</li>}
      </ul>
    </Accordion>
  );
}
