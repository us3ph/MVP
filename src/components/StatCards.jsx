import Icon from './Icon';
import { plural } from '../data/missions';

export default function StatCards({ missions, onNavigate }) {
  const enCours = missions.filter((m) => m.status === 'En cours');
  const valid = missions.filter((m) => m.status === 'Validé');
  const drafts = missions.filter((m) => m.status === 'Brouillon');
  const intl = missions.filter((m) => m.kind === 'international');

  const cards = [
    {
      key: 'en-cours',
      color: '#4640CF',
      icon: 'refresh',
      label: 'EN COURS',
      value: `${enCours.length} en cours`,
    },
    {
      key: 'valides',
      color: '#17803A',
      icon: 'check',
      label: 'VALIDÉS',
      value: plural(valid.length, 'validé'),
    },
    {
      key: 'brouillons',
      color: '#8E2DB8',
      icon: 'file',
      label: 'BROUILLONS',
      value: plural(drafts.length, 'brouillon'),
    },
    {
      key: 'historique',
      color: '#2D5BD6',
      icon: 'plane',
      label: 'INTERNATIONAL',
      value: plural(intl.length, 'ordre'),
    },
  ];

  return (
    <section className="stats">
      {cards.map((c) => (
        <button key={c.label} className="c stat" onClick={() => onNavigate(c.key)}>
          <div className="sl" style={{ color: c.color }}>
            <Icon name={c.icon} />
            {c.label}
          </div>
          <div className="sv">{c.value}</div>
        </button>
      ))}
    </section>
  );
}
