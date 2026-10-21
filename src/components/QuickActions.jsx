import Icon from './Icon';
import car from '../assets/3d/car.png';
import plane from '../assets/3d/plane.png';
import search from '../assets/3d/search.png';

// 3D objects: Microsoft Fluent Emoji (MIT), see src/assets/3d/LICENSE.txt.
const ACTIONS = [
  { key: 'national', label: 'Ordre national', img: car },
  { key: 'international', label: 'International', img: plane },
  { key: 'search', label: 'Rechercher', img: search },
  { key: 'filter', label: 'Filtrer' },
  { key: 'suivi', label: 'Suivi' },
  { key: 'export', label: 'Exporter' },
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
            <line
              key={a}
              x1="0"
              y1="-10.4"
              x2="0"
              y2="-12.2"
              transform={`rotate(${a})`}
              stroke="#aaa5c9"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
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

// Compass: golden bezel, white dial with ticks, red/grey needle that whirls and settles north on hover.
const CARDINAL = [0, 90, 180, 270];
const MINOR = [30, 60, 120, 150, 210, 240, 300, 330];
function Compass() {
  return (
    <svg className="qa-obj compass" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="cmp-bezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd97a" />
          <stop offset="1" stopColor="#dd9a14" />
        </linearGradient>
        <radialGradient id="cmp-dial" cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e4e1ee" />
        </radialGradient>
        <linearGradient id="cmp-red" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff6b6b" />
          <stop offset="1" stopColor="#d9262f" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="7.5" r="3.6" fill="none" stroke="#e0a21c" strokeWidth="2.4" />
      <rect x="29.5" y="9.5" width="5" height="4" rx="1.5" fill="#d4931a" />
      <circle cx="32" cy="35.5" r="24" fill="#b47a10" opacity="0.35" transform="translate(0 1.2)" />
      <circle cx="32" cy="35.5" r="24" fill="url(#cmp-bezel)" />
      <circle cx="32" cy="35.5" r="20.5" fill="#c58c18" />
      <circle cx="32" cy="35.5" r="19" fill="url(#cmp-dial)" />
      <g transform="translate(32 35.5)" stroke="#7c7892" strokeLinecap="round">
        {CARDINAL.map((a) => (
          <line key={a} x1="0" y1="-17" x2="0" y2="-13" strokeWidth="1.8" transform={`rotate(${a})`} />
        ))}
        {MINOR.map((a) => (
          <line key={a} x1="0" y1="-17" x2="0" y2="-15" strokeWidth="1.2" transform={`rotate(${a})`} />
        ))}
      </g>
      <g transform="translate(32 35.5)">
        <g className="cmp-needle">
          <circle r="14" fill="rgba(0,0,0,0)" />
          <polygon points="0,-14 -3.4,0 3.4,0" fill="url(#cmp-red)" />
          <polygon points="0,14 -3.4,0 3.4,0" fill="#9d9bb0" />
          <circle r="2.8" fill="#2d2d36" />
          <circle r="1" cx="-0.7" cy="-0.7" fill="#9a9aa6" />
        </g>
      </g>
      <ellipse cx="25" cy="25" rx="9" ry="5" fill="#fff" opacity="0.28" transform="rotate(-30 25 25)" />
    </svg>
  );
}

// Outbox tray: a document shoots up out of the slot while the arrow bobs, then a new one slides back in.
function OutboxTray() {
  return (
    <svg className="qa-obj tray" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="tray-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfcbe6" />
          <stop offset="1" stopColor="#b9b4d6" />
        </linearGradient>
        <linearGradient id="tray-lip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efedf9" />
          <stop offset="1" stopColor="#d3cfe8" />
        </linearGradient>
        <linearGradient id="tray-arrow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a94" />
          <stop offset="1" stopColor="#e52f5c" />
        </linearGradient>
      </defs>
      <g transform="translate(32 33) scale(1.14) translate(-32 -33)">
        <rect x="10" y="27" width="44" height="22" rx="6" fill="url(#tray-back)" />
        <rect x="13" y="37" width="38" height="6" fill="#3d6fe3" />
        <g className="tray-sheet">
          <rect x="22" y="29" width="20" height="24" rx="2.5" fill="#fff" stroke="#d9d6e6" strokeWidth="0.8" />
          <line x1="25.5" y1="33.5" x2="38.5" y2="33.5" stroke="#b8b4cc" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="25.5" y1="37" x2="35" y2="37" stroke="#b8b4cc" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        <rect x="10" y="41" width="44" height="14" rx="6" fill="url(#tray-lip)" />
        <rect x="10" y="41" width="44" height="2" fill="#2c57c7" opacity="0.55" />
        <g className="tray-arrow">
          <polygon points="32,6 41,16 35.5,16 35.5,24 28.5,24 28.5,16 23,16" fill="url(#tray-arrow)" />
        </g>
      </g>
    </svg>
  );
}

const CUSTOM = { filter: KnobPanel, suivi: Compass, export: OutboxTray };
function CustomObject({ which }) {
  const Obj = CUSTOM[which];
  return <Obj />;
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
              {a.img ? <img className="qa-obj" src={a.img} alt="" draggable="false" /> : CUSTOM[a.key] && <CustomObject which={a.key} />}
            </span>
            {a.label}
          </button>
        ))}
      </div>
    </section>
  );
}
