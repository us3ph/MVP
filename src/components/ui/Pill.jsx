import { expenseStatusLabel, expenseStatusPill, expenseStatusShort, statusLabel, statusPill, statusShort } from '../../domain/constants';

export function StatusPill({ code, full = false }) {
  const label = full ? statusLabel(code) : statusShort(code);
  return (
    <span className={'pill ' + statusPill(code)} title={label !== statusLabel(code) ? statusLabel(code) : undefined}>
      <i className="dot" />
      {label}
    </span>
  );
}

export function ExpenseStatusPill({ code, full = false }) {
  const label = full ? expenseStatusLabel(code) : expenseStatusShort(code);
  return (
    <span className={'pill ' + expenseStatusPill(code)} title={label !== expenseStatusLabel(code) ? expenseStatusLabel(code) : undefined}>
      <i className="dot" />
      {label}
    </span>
  );
}
