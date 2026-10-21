import Icon from './Icon';
import { inCountry } from '../data/missions';

export default function DraftBanner({ draft, onOpen }) {
  if (!draft) return null;
  return (
    <section className="c banner">
      <span className="banner-ic">
        <Icon name="file" style={{ width: 20, height: 20 }} />
      </span>
      <span className="banner-txt">
        Un ordre de mission est encore en brouillon : le {draft.type.toLowerCase()} du {draft.from} {inCountry(draft.dest)}. Terminez-le et
        envoyez-le.
      </span>
      <button className="go" onClick={onOpen}>
        Ouvrir
      </button>
    </section>
  );
}
