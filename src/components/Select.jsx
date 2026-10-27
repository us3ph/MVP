import { useMemo, useState } from 'react';
import Icon from './Icon';
import usePopover from '../hooks/usePopover';

// Long searchable lists (a country's cities: about 8 800 for France, 20 000 for the United States) are
// searched rather than drawn in full, as travel sites do: the list opens on the search box, and typing
// shows the best matches, at most MAX_SHOWN of them. Drawing every option made the list take seconds
// to open. Shorter lists (Moroccan cities, countries) still open with every option, as before.
const LARGE_LIST = 300;
const MAX_SHOWN = 50;

// Lower-case and accent-free, so « fes » finds « Fès » and « saint etienne » finds « Saint-Étienne ».
const fold = (s) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[-’']/g, ' ')
    .toLowerCase();
const count = (n) => n.toLocaleString('fr-FR');

// Custom dropdown that matches the app's rounded popovers (native <select> menus come from the OS).
// variant "field": full-width form control. variant "bar": compact pill for toolbars, with a prefix label.
// `searchable` adds a filter box (with `searchPlaceholder`; `itemsLabel` names the items in the hint of
// long lists, e.g. « villes »); `clearable` adds the ×.
export default function Select({
  id,
  value,
  options,
  onChange,
  variant = 'field',
  prefix,
  ariaLabel,
  placeholder,
  searchable = false,
  searchPlaceholder = 'Rechercher…',
  itemsLabel = 'éléments',
  clearable = false,
  disabled = false,
}) {
  const { ref, open, setOpen } = usePopover();
  const [q, setQ] = useState('');
  const items = useMemo(() => options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)), [options]);
  const current = items.find((o) => o.value === value) || (value ? { value, label: value } : placeholder ? null : items[0]);
  const large = searchable && items.length > LARGE_LIST;

  // Search keys, built once per list and only while the list is open.
  const keys = useMemo(() => (open && searchable ? items.map((o) => ({ label: fold(o.label), all: fold(`${o.label} ${o.sub || ''}`) })) : null), [open, searchable, items]);

  // Names starting with the query come first, then the other matches, both in list order.
  const needle = open && keys ? fold(q.trim()) : '';
  let matches = items;
  if (needle) {
    const starts = [];
    const contains = [];
    items.forEach((o, i) => {
      if (keys[i].label.startsWith(needle)) starts.push(o);
      else if (keys[i].all.includes(needle)) contains.push(o);
    });
    matches = starts.concat(contains);
  }
  // A long list shows nothing but its current value until something is typed.
  const waiting = large && !needle;
  const shown = waiting ? (current && value ? [current] : []) : large ? matches.slice(0, MAX_SHOWN) : matches;
  const more = large && !waiting ? matches.length - shown.length : 0;

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
              <input autoFocus className="srch" placeholder={searchPlaceholder} aria-label={searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
          )}
          {waiting && (
            <div className="pop-empty" role="status">
              Saisissez les premières lettres pour rechercher parmi {count(items.length)} {itemsLabel}.
            </div>
          )}
          {!waiting && shown.length === 0 && <div className="pop-empty">Aucun résultat</div>}
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
          {more > 0 && (
            <div className="pop-empty pop-more" role="status">
              {count(shown.length)} premiers résultats sur {count(matches.length)}. Continuez à saisir pour affiner.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
