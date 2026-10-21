import Icon from './Icon';

const ACTIONS = [
  { key: 'national', label: 'Ordre national', icon: 'car', bg: 'linear-gradient(180deg,#D8E4F8,#DCE7F8)', color: '#2F7DF0' },
  { key: 'international', label: 'International', icon: 'plane', bg: 'linear-gradient(180deg,#DFDEF4,#E3E2F5)', color: '#4B46D8' },
  { key: 'search', label: 'Rechercher', icon: 'search', bg: 'linear-gradient(180deg,#EADCF0,#EEE1F2)', color: '#B03AC6' },
  { key: 'filter', label: 'Filtrer', icon: 'filter', bg: 'linear-gradient(180deg,#F7DCE3,#F8E0E6)', color: '#E8235A' },
  { key: 'suivi', label: 'Suivi', icon: 'refresh', bg: 'linear-gradient(180deg,#DCEFE2,#E0F1E6)', color: '#1FA350' },
  { key: 'export', label: 'Exporter', icon: 'box', bg: 'linear-gradient(180deg,#F6E5D9,#F7E9DF)', color: '#F08A0B' },
];

export default function QuickActions({ onAction }) {
  return (
    <section className="c qa-card">
      <div className="qa-head">
        <span style={{ display: 'flex', color: '#17171F' }}>
          <Icon name="bolt" />
        </span>
        Actions rapides
      </div>
      <div className="qa-row">
        {ACTIONS.map((a) => (
          <button key={a.key} className="qa" style={{ background: a.bg }} onClick={() => onAction(a.key)}>
            <span style={{ color: a.color, display: 'flex' }}>
              <Icon name={a.icon} />
            </span>
            {a.label}
          </button>
        ))}
      </div>
    </section>
  );
}
