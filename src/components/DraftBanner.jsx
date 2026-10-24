import Icon from './Icon';
import { fmtDate, inCountry } from '../lib/format';
import { countryName } from '../lib/refs';

export default function DraftBanner({ draft, referentials, onOpen }) {
  if (!draft) return null;
  const what = (draft.types?.[0] || 'ordre de mission').toLowerCase();
  return (
    <section className="c banner">
      <span className="banner-ic">
        <Icon name="file" style={{ width: 20, height: 20 }} />
      </span>
      <span className="banner-txt">
        Un ordre de mission est encore en brouillon : {/^[aeiouy]/i.test(what) ? 'l’' : 'le '}
        {what} du {fmtDate(draft.startDate)} {inCountry(countryName(referentials, draft.country))}. Terminez-le et envoyez-le.
      </span>
      <button className="go" onClick={onOpen}>
        Ouvrir
      </button>
    </section>
  );
}
