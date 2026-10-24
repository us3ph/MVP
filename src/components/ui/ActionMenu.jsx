import Icon from '../Icon';
import usePopover from '../../hooks/usePopover';

// « … » button opening the list of actions available on a row or an overview.
export default function ActionMenu({ items, onSelect, label = 'Plus d’actions', align = 'right', className = 'rb' }) {
  const { ref, open, setOpen } = usePopover();
  return (
    <div className="pop-wrap" ref={ref}>
      <button type="button" className={className + (open ? ' open' : '')} aria-label={label} title={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <Icon name="more" />
      </button>
      {open && (
        <div className={'pop menu' + (align === 'right' ? ' pop-right' : '')} role="menu">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              role="menuitem"
              className={'pop-item' + (it.danger ? ' danger' : '')}
              onClick={() => {
                setOpen(false);
                onSelect(it.key);
              }}
            >
              <Icon name={it.icon} className="i menu-ic" />
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
