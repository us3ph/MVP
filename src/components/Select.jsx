import Icon from './Icon';
import usePopover from './usePopover';

// Custom dropdown that matches the app's rounded popovers (native <select> menus come from the OS).
// variant "field": full-width form control. variant "bar": compact pill for toolbars, with a prefix label.
export default function Select({ id, value, options, onChange, variant = 'field', prefix, ariaLabel }) {
  const { ref, open, setOpen } = usePopover();
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const current = items.find((o) => o.value === value) || items[0];

  return (
    <div className="pop-wrap" ref={ref}>
      <button
        id={id}
        type="button"
        className={(variant === 'bar' ? 'sel' : 'pick') + (open ? ' open' : '')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
      >
        {prefix && <span className="sel-pre">{prefix}</span>}
        <b>{current.label}</b>
        <Icon name="chevrons" />
      </button>
      {open && (
        <div className="pop" role="listbox" aria-label={ariaLabel || prefix}>
          {items.map((o) => {
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
                }}
              >
                {o.label}
                <Icon name="check" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
