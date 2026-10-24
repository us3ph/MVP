import { useEffect } from 'react';
import Icon from '../Icon';

// Panel sliding in from the right (notifications, activité de validation).
export default function SlideOver({ title, onClose, children, width = 380, actions }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="ov ov-side" onClick={onClose}>
      <aside className="slide" role="dialog" aria-modal="true" aria-label={title} style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="slide-hd">
          <span className="slide-title">{title}</span>
          {actions}
          <button type="button" className="rb" aria-label="Fermer" title="Fermer" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="slide-body">{children}</div>
      </aside>
    </div>
  );
}
