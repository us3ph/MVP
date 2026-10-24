import { useState } from 'react';
import Icon from './Icon';
import usePopover from '../hooks/usePopover';

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (s) => (s ? new Date(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) : null);
const fmtFR = (s) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : '');
const monthTitle = (d) => new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(d);

// Calendar grid for the month containing `view`: 6 rows x 7 days, Monday first.
function monthGrid(view) {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(1 - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// Date input with a popover calendar styled like the rest of the app. `value` is an ISO date string or ''.
export default function DateField({ id, value, onChange, placeholder = 'jj/mm/aaaa', disabled = false }) {
  const { ref, open, setOpen } = usePopover();
  const [view, setView] = useState(() => fromISO(value) || new Date());
  const today = toISO(new Date());

  const openCal = () => {
    setView(fromISO(value) || new Date());
    setOpen((v) => !v);
  };
  const pick = (d) => {
    onChange(toISO(d));
    setOpen(false);
  };
  const shift = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));

  return (
    <div className="pop-wrap" ref={ref}>
      <button
        id={id}
        type="button"
        className={'pick' + (open ? ' open' : '') + (value ? '' : ' pick-blank')}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={openCal}
      >
        <b>{fmtFR(value) || placeholder}</b>
        <Icon name="calendar" />
      </button>
      {open && (
        <div className="pop cal" role="dialog" aria-label="Choisir une date">
          <div className="cal-head">
            <button type="button" className="cal-nav" aria-label="Mois précédent" onClick={() => shift(-1)}>
              <Icon name="chevl" />
            </button>
            <span className="cal-title">{monthTitle(view)}</span>
            <button type="button" className="cal-nav" aria-label="Mois suivant" onClick={() => shift(1)}>
              <Icon name="chevr" />
            </button>
          </div>
          <div className="cal-grid">
            {DOW.map((d, i) => (
              <span key={i} className="cal-dow">
                {d}
              </span>
            ))}
            {monthGrid(view).map((d) => {
              const iso = toISO(d);
              const cls =
                'cal-day' +
                (d.getMonth() !== view.getMonth() ? ' mu' : '') +
                (iso === today ? ' today' : '') +
                (iso === value ? ' on' : '');
              return (
                <button key={iso} type="button" className={cls} aria-pressed={iso === value} onClick={() => pick(d)}>
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          <div className="cal-ft">
            <button type="button" onClick={() => pick(new Date())}>
              Aujourd’hui
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              Effacer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
