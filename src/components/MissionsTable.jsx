import { useMemo, useState } from 'react';
import Icon from './Icon';
import Select from './Select';
import {
  KIND_ICON,
  KIND_LABEL,
  KIND_TILE,
  MISSION_TYPES,
  SECONDARY_ACTION,
  STATUSES,
  STATUS_PILL,
  fmtAdvance,
  fmtAmount,
} from '../data/missions';

export default function MissionsTable({
  missions,
  title = 'Mes ordres de mission',
  initialStatus = 'Tout',
  filtersOpen,
  onToggleFilters,
  searchRef,
  onView,
  onAction,
}) {
  const [type, setType] = useState('Tout');
  const [status, setStatus] = useState(initialStatus);
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Tout');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return missions.filter(
      (m) =>
        (type === 'Tout' || m.type === type) &&
        (status === 'Tout' || m.status === status) &&
        (!q || [m.num, m.type, m.dest, KIND_LABEL[m.kind], m.status].filter(Boolean).some((v) => v.toLowerCase().includes(q))),
    );
  }, [missions, type, status, query]);

  return (
    <section className="c tbl">
      <div className="tbl-bar">
        <span style={{ display: 'flex' }}>
          <Icon name="briefcase" />
        </span>
        <span className="tbl-title">{title}</span>
        <Select variant="bar" prefix="Type de mission" value={type} options={['Tout', ...MISSION_TYPES]} onChange={setType} />
        <Select variant="bar" prefix="Date" value={period} options={['Tout']} onChange={setPeriod} />
        <button
          className={'sel' + (filtersOpen ? ' on' : '')}
          aria-label="Filtres"
          title="Filtres"
          aria-pressed={!!filtersOpen}
          style={{ padding: '0 8px' }}
          onClick={onToggleFilters}
        >
          <Icon name="filter" />
        </button>
        <label className="sel" style={{ width: 170, padding: '0 10px' }}>
          <Icon name="search" />
          <input
            ref={searchRef}
            className="srch"
            type="search"
            placeholder="Rechercher"
            aria-label="Rechercher"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {filtersOpen && (
        <div className="chips">
          <span className="chips-lab">Statut</span>
          {['Tout', ...STATUSES].map((s) => (
            <button key={s} className={'chip' + (status === s ? ' on' : '')} aria-pressed={status === s} onClick={() => setStatus(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="th">
        <div>N°</div>
        <div>Nature</div>
        <div>Dates</div>
        <div>Dest.</div>
        <div>Avance</div>
        <div>Coût</div>
        <div>Priorité</div>
        <div>Statut</div>
        <div></div>
      </div>

      {rows.map((m) => {
        const secondary = SECONDARY_ACTION[m.status];
        return (
          <div className="tr" key={m.id}>
            <div className={'n' + (m.num ? '' : ' mu')}>{m.num || '—'}</div>
            <div className="nt">
              <div className={'tile ' + KIND_TILE[m.kind]}>
                <Icon name={KIND_ICON[m.kind]} />
              </div>
              <div>
                <div className="h">{KIND_LABEL[m.kind]}</div>
                <div className="sub">{m.type}</div>
              </div>
            </div>
            <div className="dt">
              <b>{m.from}</b>
              <span>→ {m.to}</span>
            </div>
            <div className="m">
              <Icon name="pin" />
              {m.dest}
            </div>
            <div className="mu2">{fmtAdvance(m.advance)}</div>
            <div className="num">{fmtAmount(m.cost)}</div>
            <div className="mu2">{m.priority}</div>
            <div>
              <span className={'pill ' + STATUS_PILL[m.status]}>
                <i className="dot" />
                {m.status}
              </span>
            </div>
            <div className="act">
              <button className="rb" aria-label="Voir" title="Voir" onClick={() => onView(m)}>
                <Icon name="eye" />
              </button>
              <button className="rb" aria-label={secondary.label} title={secondary.label} onClick={() => onAction(m, secondary.label)}>
                <Icon name={secondary.icon} />
              </button>
              <button className="rb" aria-label="Plus d’actions" title="Plus d’actions" onClick={() => onAction(m, 'Plus')}>
                <Icon name="more" />
              </button>
            </div>
          </div>
        );
      })}

      {rows.length === 0 && <div className="empty">Aucun ordre de mission ne correspond à ces critères.</div>}
    </section>
  );
}
