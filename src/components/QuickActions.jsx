import Icon from './Icon';
import car from '../assets/3d/car.png';
import plane from '../assets/3d/plane.png';
import search from '../assets/3d/search.png';
import track from '../assets/3d/track.png';
import exportTray from '../assets/3d/export.png';

// 3D objects: Microsoft Fluent Emoji (MIT), see src/assets/3d/LICENSE.txt.
const ACTIONS = [
  { key: 'national', label: 'Ordre national', img: car },
  { key: 'international', label: 'International', img: plane },
  { key: 'search', label: 'Rechercher', img: search },
  { key: 'filter', label: 'Filtrer' },
  { key: 'suivi', label: 'Suivi', img: track },
  { key: 'export', label: 'Exporter', img: exportTray },
];

// Drawn knob panel (same soft 3D look as the images) so each knob can turn on hover.
const KNOBS = [
  [21, 21, 'k1'],
  [43, 21, 'k2'],
  [21, 43, 'k3'],
  [43, 43, 'k4'],
];
const TICKS = [-135, -90, -45, 0, 45, 90, 135];

function KnobPanel() {
  return (
    <svg className="qa-obj knobs" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="knob-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f5fd" />
          <stop offset="1" stopColor="#d6d2ea" />
        </linearGradient>
        <radialGradient id="knob-face" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#a4d3ff" />
          <stop offset="0.55" stopColor="#3f8cf5" />
          <stop offset="1" stopColor="#1e5ccb" />
        </radialGradient>
      </defs>
      <rect x="7" y="5" width="50" height="54" rx="10" fill="url(#knob-panel)" stroke="rgba(255,255,255,0.85)" />
      <rect x="9.5" y="7.5" width="45" height="49" rx="8" fill="none" stroke="rgba(110,100,160,0.14)" />
      {KNOBS.map(([cx, cy, k]) => (
        <g key={k} transform={`translate(${cx} ${cy})`}>
          {TICKS.map((a) => (
            <line key={a} x1="0" y1="-10.4" x2="0" y2="-12.2" transform={`rotate(${a})`} stroke="#aaa5c9" strokeWidth="1.3" strokeLinecap="round" />
          ))}
          <circle r="8.4" cy="0.9" fill="#1a4fae" opacity="0.35" />
          <circle r="8.2" fill="url(#knob-face)" />
          <circle r="8.2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <g className={'needle ' + k}>
            <circle r="8.2" fill="rgba(0,0,0,0)" />
            <line x1="0" y1="-2" x2="0" y2="-6.4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </g>
      ))}
    </svg>
  );
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
            <span className="qa-stage" aria-hidden="true">
              <span className="qa-ground" />
              {a.img ? <img className="qa-obj" src={a.img} alt="" draggable="false" /> : <KnobPanel />}
            </span>
            {a.label}
          </button>
        ))}
      </div>
    </section>
  );
}
