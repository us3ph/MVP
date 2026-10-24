import { useState } from 'react';
import Icon from '../Icon';

// Collapsible section of the « Aperçu » pages. tone="accent" renders the blue « Coût global » header.
export default function Accordion({ title, extra, tone, defaultOpen = false, open: controlled, onToggle, children, id }) {
  const [inner, setInner] = useState(defaultOpen);
  const open = controlled ?? inner;
  const toggle = () => (onToggle ? onToggle(!open) : setInner((v) => !v));
  return (
    <section className={'acc' + (tone ? ' acc-' + tone : '') + (open ? ' open' : '')} id={id}>
      <button type="button" className="acc-hd" aria-expanded={open} onClick={toggle}>
        <span className="acc-title">{title}</span>
        {extra && <span className="acc-extra">{extra}</span>}
        <Icon name="chevd" className="i acc-chev" />
      </button>
      {open && <div className="acc-body">{children}</div>}
    </section>
  );
}
