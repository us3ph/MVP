import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../Icon';

const EXIT_MS = 380; // same motion as the sidebar (see .side-wrap in styles.css)

// Panel sliding in from the right (activité de validation). Closing plays the reverse slide first,
// whatever triggered it (overlay click, × button, Escape), then unmounts.
export default function SlideOver({ title, onClose, children, width = 380, actions }) {
  const [closing, setClosing] = useState(false);
  const timer = useRef();
  const requestClose = useCallback(() => {
    setClosing((already) => {
      if (!already) timer.current = setTimeout(() => onClose?.(), EXIT_MS);
      return true;
    });
  }, [onClose]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && requestClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestClose]);
  return (
    <div className={'ov ov-side' + (closing ? ' out' : '')} onClick={requestClose}>
      <aside className={'slide' + (closing ? ' out' : '')} role="dialog" aria-modal="true" aria-label={title} style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="slide-hd">
          <span className="slide-title">{title}</span>
          {actions}
          <button type="button" className="rb" aria-label="Fermer" title="Fermer" onClick={requestClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="slide-body">{children}</div>
      </aside>
    </div>
  );
}
