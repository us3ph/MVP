import { useMemo, useState } from 'react';
import Icon from '../Icon';
import Select from '../Select';
import ActionMenu from '../ui/ActionMenu';
import { StatusPill } from '../ui/Pill';
import { ACTIONS, KIND_ICON, KIND_LABEL, KIND_SHORT, MISSION_STATUSES, PERIODS } from '../../domain/constants';
import { missionActions } from '../../lib/actions';
import { fmtAdvance, fmtAmount, fmtDate, inPeriod, missionRef, missionSuffix } from '../../lib/format';
import { countryName } from '../../lib/refs';
import { estimatedCost } from '../../lib/costing';

const ALL = 'Tout';

// « Mes ordres de mission »: filters (type, date), advanced filter (entité / projet, statut), search,
// the two create buttons and the list with its per-status actions.
export default function MissionsTable({
  missions,
  reportByMission = {},
  referentials,
  title = 'Mes ordres de mission',
  statusFilter = null, // array of status codes the page is limited to (null = all)
  onlyAdvance = false,
  filtersOpen,
  onToggleFilters,
  searchRef,
  onAction,
  onCreate,
}) {
  const [type, setType] = useState(ALL);
  const [period, setPeriod] = useState('all');
  const [status, setStatus] = useState(ALL);
  const [entity, setEntity] = useState(ALL);
  const [query, setQuery] = useState('');

  const statuses = statusFilter ? MISSION_STATUSES.filter((s) => statusFilter.includes(s.code)) : MISSION_STATUSES;
  const types = referentials?.missionTypes || [];
  const entities = referentials?.entities || [];

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return missions.filter(
      (m) =>
        (!statusFilter || statusFilter.includes(m.status)) &&
        (!onlyAdvance || m.advance?.amount) &&
        (type === ALL || m.types?.includes(type)) &&
        (status === ALL || m.status === status) &&
        (entity === ALL || m.objects?.some((o) => o.entity === entity)) &&
        inPeriod(m.startDate, period) &&
        (!q || [missionRef(m), m.types?.join(' '), countryName(referentials, m.country), m.cities?.join(' '), KIND_LABEL[m.kind]].filter(Boolean).some((v) => v.toLowerCase().includes(q))),
    );
  }, [missions, referentials, statusFilter, onlyAdvance, type, status, entity, period, query]);

  return (
    <section className="c tbl">
      <div className="tbl-bar">
        <span style={{ display: 'flex' }}>
          <Icon name="briefcase" />
        </span>
        <span className="tbl-title">{title}</span>
        <Select variant="bar" prefix="Type de la mission" value={type} options={[ALL, ...types]} onChange={setType} />
        <Select variant="bar" prefix="Date" value={period} options={PERIODS.map((p) => ({ value: p.code, label: p.label }))} onChange={setPeriod} />
        <button className={'sel' + (filtersOpen ? ' on' : '')} aria-label="Filtre avancé" title="Filtre avancé" aria-pressed={!!filtersOpen} style={{ padding: '0 8px' }} onClick={onToggleFilters}>
          <Icon name="filter" />
        </button>
        <label className="sel" style={{ width: 170, padding: '0 10px' }}>
          <Icon name="search" />
          <input ref={searchRef} className="srch" type="search" placeholder="Rechercher" aria-label="Rechercher" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        {onCreate && (
          <>
            <button className="gbtn" onClick={() => onCreate('national')} title="Ordre de mission national">
              <Icon name="car" />
              Ordre de mission national
            </button>
            <button className="gbtn" onClick={() => onCreate('international')} title="Ordre de mission international">
              <Icon name="plane" />
              Ordre de mission international
            </button>
          </>
        )}
      </div>

      {filtersOpen && (
        <div className="chips">
          <span className="chips-lab">Entité / Projet</span>
          <Select variant="bar" value={entity} options={[ALL, ...entities.map((e) => ({ value: e.code, label: e.label }))]} onChange={setEntity} ariaLabel="Entité / Projet" />
          <span className="chips-lab" style={{ marginLeft: 8 }}>
            Statut
          </span>
          {[{ code: ALL, label: ALL }, ...statuses].map((s) => (
            <button key={s.code} className={'chip' + (status === s.code ? ' on' : '')} aria-pressed={status === s.code} onClick={() => setStatus(s.code)}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="th">
        <div>N°</div>
        <div>Nature de la mission</div>
        <div>Dates</div>
        <div>Destination</div>
        <div>Avance demandée</div>
        <div>Coût global estimé</div>
        <div>Priorité</div>
        <div>Statut</div>
        <div></div>
      </div>

      {rows.map((m) => {
        const acts = missionActions(m, { report: reportByMission[m.id] });
        return (
          <div className={'tr st-' + m.status} key={m.id}>
            <div className={'n' + (m.number ? '' : ' mu')}>
              {m.number || '—'}
              {missionSuffix(m) && <span className="n-suffix">{missionSuffix(m)}</span>}
            </div>
            <div className="nt">
              <span className="nt-ic" aria-hidden="true">
                <Icon name={KIND_ICON[m.kind]} />
              </span>
              <div>
                <div className="h">{KIND_SHORT[m.kind]}</div>
                <div className="sub">{m.types?.join(', ')}</div>
              </div>
            </div>
            <div className="dt">
              <b>{fmtDate(m.startDate)}</b>
              <span>→ {fmtDate(m.endDate)}</span>
            </div>
            <div className="m">
              <Icon name="pin" />
              {countryName(referentials, m.country)}
            </div>
            <div className="mu2">{fmtAdvance(m.advance)}</div>
            <div className="num">{referentials ? fmtAmount(estimatedCost(m, referentials)) : '—'}</div>
            <div className="mu2">{m.priority}</div>
            <div>
              <StatusPill code={m.status} />
            </div>
            <div className="act">
              <button className="rb" aria-label={ACTIONS.view.label} title={ACTIONS.view.label} onClick={() => onAction(m, 'view')}>
                <Icon name="eye" />
              </button>
              <button className="rb" aria-label={acts.second.label} title={acts.second.label} onClick={() => onAction(m, acts.second.key)}>
                <Icon name={acts.second.icon} />
              </button>
              {acts.third ? (
                <button className="rb" aria-label={acts.third.label} title={acts.third.label} onClick={() => onAction(m, acts.third.key)}>
                  <Icon name={acts.third.icon} />
                </button>
              ) : (
                <ActionMenu items={acts.menu} onSelect={(key) => onAction(m, key)} />
              )}
            </div>
          </div>
        );
      })}

      {rows.length === 0 && <div className="empty">Aucun ordre de mission ne correspond à ces critères.</div>}
    </section>
  );
}
