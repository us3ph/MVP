import { useEffect } from 'react';
import Icon from '../Icon';

// Centered dialog on a blurred overlay. `icon` draws the round badge the guide shows above the title.
export default function Modal({ title, subtitle, icon, tone = 'accent', width = 480, onClose, closable = true, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="ov" onClick={onClose}>
      <div className="md" role="dialog" aria-modal="true" aria-labelledby="md-title" style={{ width }} onClick={(e) => e.stopPropagation()}>
        {closable && (
          <button type="button" className="rb md-x" aria-label="Fermer" title="Fermer" onClick={onClose}>
            <Icon name="close" />
          </button>
        )}
        {(icon || title) && (
          <div className="md-top">
            {icon && (
              <span className={'md-icon ' + tone}>
                <Icon name={icon} />
              </span>
            )}
            <div className="md-title" id="md-title">
              {title}
            </div>
            {subtitle && <div className="md-sub">{subtitle}</div>}
          </div>
        )}
        <div className="md-body">{children}</div>
        {footer && <div className="ft">{footer}</div>}
      </div>
    </div>
  );
}
