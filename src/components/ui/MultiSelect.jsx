import Icon from '../Icon';
import usePopover from '../../hooks/usePopover';

// Dropdown with check boxes (types de mission, devises, actions déléguées, participants). The list
// closes after each pick (reopen it to add another value); `closeOnSelect={false}` keeps it open.
export default function MultiSelect({ id, values = [], options, onChange, placeholder = 'Sélectionner…', ariaLabel, icon = 'chevrons', closeOnSelect = true }) {
  const { ref, open, setOpen } = usePopover();
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const selected = items.filter((o) => values.includes(o.value));
  const toggle = (v) => {
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
    if (closeOnSelect) setOpen(false);
  };
  return (
    <div className="pop-wrap" ref={ref}>
      <button id={id} type="button" className={'pick' + (open ? ' open' : '') + (selected.length ? '' : ' pick-blank')} aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel} onClick={() => setOpen((v) => !v)}>
        <b>{selected.length ? selected.map((o) => o.label).join(', ') : placeholder}</b>
        <Icon name={icon} />
      </button>
      {open && (
        <div className="pop" role="listbox" aria-multiselectable="true" aria-label={ariaLabel}>
          {items.map((o) => {
            const on = values.includes(o.value);
            return (
              <button key={o.value} type="button" role="option" aria-selected={on} className={'pop-item multi' + (on ? ' on' : '')} onClick={() => toggle(o.value)}>
                <span className={'chk' + (on ? ' on' : '')} aria-hidden="true">
                  {on && <Icon name="check-mark" />}
                </span>
                <span className="pop-text">
                  {o.label}
                  {o.note && <small>{o.note}</small>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
