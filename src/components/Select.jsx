import { useState } from 'react';
import Icon from './Icon';
import usePopover from '../hooks/usePopover';

// Custom dropdown that matches the app's rounded popovers (native <select> menus come from the OS).
// variant "field": full-width form control. variant "bar": compact pill for toolbars, with a prefix label.
// `searchable` adds a filter box (Délégué: rechercher par nom, prénom ou email); `clearable` adds the ×.
export default function Select({ id, value, options, onChange, variant = 'field', prefix, ariaLabel, placeholder, searchable = false, clearable = false, disabled = false }) {
  const { ref, open, setOpen } = usePopover();
  const [q, setQ] = useState('');
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const current = items.find((o) => o.value === value) || (value ? { value, label: value } : placeholder ? null : items[0]);
  // Search: names starting with the query come first, then the other matches, both in list order.
  const needle = q.trim().toLowerCase();
  const shown = searchable && needle
    ? items
        .map((o, i) => ({ o, i, rank: o.label.toLowerCase().startsWith(needle) ? 0 : `${o.label} ${o.sub || ''}`.toLowerCase().includes(needle) ? 1 : 2 }))
        .filter((x) => x.rank < 2)
        .sort((a, b) => a.rank - b.rank || a.i - b.i)
        .map((x) => x.o)
    : items;

  return (
    <div className="pop-wrap" ref={ref}>
      <button
        id={id}
        type="button"
        className={(variant === 'bar' ? 'sel' : 'pick') + (open ? ' open' : '') + (current ? '' : ' pick-blank')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        {prefix && <span className="sel-pre">{prefix}</span>}
        <b>{current ? current.label : placeholder}</b>
        {clearable && current && (
          <span
            className="pick-x"
            role="button"
            aria-label="Effacer"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
          >
            <Icon name="close" />
          </span>
        )}
        <Icon name="chevrons" />
      </button>
      {open && (
        <div className="pop" role="listbox" aria-label={ariaLabel || prefix}>
          {searchable && (
            <label className="pop-search">
              <Icon name="search" />
              <input autoFocus className="srch" placeholder="Rechercher par nom, prénom ou email" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
          )}
          {shown.length === 0 && <div className="pop-empty">Aucun résultat</div>}
          {shown.map((o) => {
            const on = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                className={'pop-item' + (on ? ' on' : '')}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                  setQ('');
                }}
              >
                <span className="pop-text">
                  {o.label}
                  {o.sub && <small>{o.sub}</small>}
                </span>
                <Icon name="check" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
