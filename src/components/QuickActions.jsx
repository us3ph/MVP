import { useEffect, useRef } from 'react';
import Icon from './Icon';
import nationalClip from '../assets/clips/national.mp4';
import nationalPoster from '../assets/clips/national.webp';
import internationalClip from '../assets/clips/international.mp4';
import internationalPoster from '../assets/clips/international.webp';
import searchClip from '../assets/clips/search.mp4';
import searchPoster from '../assets/clips/search.webp';
import filterClip from '../assets/clips/filter.mp4';
import filterPoster from '../assets/clips/filter.webp';
import suiviClip from '../assets/clips/suivi.mp4';
import suiviPoster from '../assets/clips/suivi.webp';
import exportClip from '../assets/clips/export.mp4';
import exportPoster from '../assets/clips/export.webp';

// Each tile plays a short muted clip in a loop (src/assets/clips, encoded from the footage provided).
const ACTIONS = [
  { key: 'national', label: 'Ordre national', clip: nationalClip, poster: nationalPoster },
  { key: 'international', label: 'International', clip: internationalClip, poster: internationalPoster },
  { key: 'search', label: 'Rechercher', clip: searchClip, poster: searchPoster },
  { key: 'filter', label: 'Filtrer', clip: filterClip, poster: filterPoster },
  { key: 'suivi', label: 'Suivi', clip: suiviClip, poster: suiviPoster },
  { key: 'export', label: 'Exporter', clip: exportClip, poster: exportPoster },
];

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function Clip({ src, poster }) {
  const ref = useRef(null);
  // Autoplay is muted and inline; browsers may still refuse it, in which case the poster stays.
  useEffect(() => {
    const v = ref.current;
    if (!v || reducedMotion()) return;
    v.play().catch(() => {});
  }, []);
  return <video ref={ref} className="qa-clip" src={src} poster={poster} muted loop playsInline autoPlay={!reducedMotion()} preload="metadata" aria-hidden="true" />;
}

export default function QuickActions({ onAction }) {
  return (
    <section className="c qa-card">
      <div className="qa-head">
        <span style={{ display: 'flex' }}>
          <Icon name="bolt" />
        </span>
        Actions rapides
      </div>
      <div className="qa-row">
        {ACTIONS.map((a) => (
          <button key={a.key} className={'qa qa-' + a.key} onClick={() => onAction(a.key)}>
            <Clip src={a.clip} poster={a.poster} />
            <span className="qa-lab">{a.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
