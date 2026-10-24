import Icon from './Icon';
import { plural } from '../lib/format';

export default function StatCards({ missions, onNavigate }) {
  const enCours = missions.filter((m) => m.status === 'pending');
  const valid = missions.filter((m) => m.status === 'validated');
  const drafts = missions.filter((m) => m.status === 'draft');
  const intl = missions.filter((m) => m.kind === 'international');

  const cards = [
    {
      key: 'en-cours',
      icon: 'refresh',
      label: 'EN COURS',
      value: `${enCours.length} en cours`,
    },
    {
      key: 'valides',
      icon: 'check',
      label: 'VALIDÉS',
      value: plural(valid.length, 'validé'),
    },
    {
      key: 'brouillons',
      icon: 'file',
      label: 'BROUILLONS',
      value: plural(drafts.length, 'brouillon'),
    },
    {
      key: 'historique',
      icon: 'plane',
      label: 'INTERNATIONAL',
      value: plural(intl.length, 'ordre'),
    },
  ];

  return (
    <section className="stats">
      {cards.map((c) => (
        <button key={c.label} className="c stat" onClick={() => onNavigate(c.key)}>
          <div className="sl" style={{ color: `var(--stat-${c.key})` }}>
            <Icon name={c.icon} />
            {c.label}
          </div>
          <div className="sv">{c.value}</div>
        </button>
      ))}
    </section>
  );
}
