import { useMemo, useState } from 'react';
import Icon from '../Icon';
import Select from '../Select';
import ActionMenu from '../ui/ActionMenu';
import { ExpenseStatusPill } from '../ui/Pill';
import { ACTIONS, EXPENSE_STATUSES, KIND_ICON, KIND_LABEL, KIND_SHORT, PERIODS } from '../../domain/constants';
import { settle } from '../../lib/costing';
import { fmtAmount, fmtDate, inPeriod, missionRef, missionSuffix } from '../../lib/format';
import { countryName } from '../../lib/refs';

const ALL = 'Tout';

// « Mes notes de frais »: history of the orders with their expense report.
export default function ExpenseReportsTable({ reports, missionById, referentials, filtersOpen, onToggleFilters, onAction }) {
  const [type, setType] = useState(ALL);
  const [period, setPeriod] = useState('all');
  const [status, setStatus] = useState(ALL);
  const [query, setQuery] = useState('');
  const types = referentials?.missionTypes || [];

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports
      .map((r) => ({ r, m: missionById[r.missionId] }))
      .filter(({ m }) => m)
      .filter(
        ({ r, m }) =>
          (type === ALL || m.types?.includes(type)) &&
          (status === ALL || r.status === status) &&
          inPeriod(m.startDate, period) &&
          (!q || [missionRef(m), m.types?.join(' '), countryName(referentials, m.country), KIND_LABEL[m.kind]].filter(Boolean).some((v) => v.toLowerCase().includes(q))),
      );
  }, [reports, missionById, referentials, type, status, period, query]);

  return (
    <section className="c tbl">
      <div className="tbl-bar">
        <span style={{ display: 'flex' }}>
          <Icon name="note-add" />
        </span>
        <span className="tbl-title">Mes notes de frais</span>
        <Select variant="bar" prefix="Type de la mission" value={type} options={[ALL, ...types]} onChange={setType} />
        <Select variant="bar" prefix="Date" value={period} options={PERIODS.map((p) => ({ value: p.code, label: p.label }))} onChange={setPeriod} />
        <button className={'sel' + (filtersOpen ? ' on' : '')} aria-label="Filtre avancé" title="Filtre avancé" aria-pressed={!!filtersOpen} style={{ padding: '0 8px' }} onClick={onToggleFilters}>
          <Icon name="filter" />
        </button>
        <label className="sel" style={{ width: 170, padding: '0 10px' }}>
          <Icon name="search" />
          <input className="srch" type="search" placeholder="Rechercher" aria-label="Rechercher" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      {filtersOpen && (
        <div className="chips">
          <span className="chips-lab">Statut note de frais</span>
          {[{ code: ALL, label: ALL }, ...EXPENSE_STATUSES].map((s) => (
            <button key={s.code} className={'chip' + (status === s.code ? ' on' : '')} aria-pressed={status === s.code} onClick={() => setStatus(s.code)}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="th ndf-grid">
        <div>N°</div>
        <div>Nature de la mission</div>
        <div>Dates</div>
        <div>Destination</div>
        <div>Coût global réel</div>
        <div>Remboursement</div>
        <div>Statut note de frais</div>
        <div>Date paiement</div>
        <div></div>
      </div>

      {rows.map(({ r, m }) => {
        const computed = referentials ? settle(r, m, referentials) : null;
        const actual = r.actualCost ?? (r.status !== 'draft' && computed ? computed.actualCost : null);
        const refund = r.reimbursement ?? (r.status !== 'draft' && computed ? computed.total : null);
        const menu = [r.status === 'draft' ? ACTIONS.expenseEdit : null, r.status !== 'draft' ? ACTIONS.expensePdf : null, { ...ACTIONS.download, label: 'Télécharger l’ordre de mission' }].filter(Boolean);
        return (
          <div className="tr ndf-grid" key={r.id}>
            <div className="n">
              {m.number}
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
            <div className="num">{actual != null ? fmtAmount(actual) : '—'}</div>
            <div className="num">{refund != null ? fmtAmount(refund) : '—'}</div>
            <div>
              <ExpenseStatusPill code={r.status} />
            </div>
            <div className="mu2">{r.paymentDate ? fmtDate(r.paymentDate) : '—'}</div>
            <div className="act">
              <button className="rb" aria-label="Afficher" title="Afficher" onClick={() => onAction(r, m, 'view')}>
                <Icon name="eye" />
              </button>
              <button className="rb" aria-label="Timeline" title="Timeline" onClick={() => onAction(r, m, 'timeline')}>
                <Icon name="history" />
              </button>
              <ActionMenu items={menu} onSelect={(key) => onAction(r, m, key)} />
            </div>
          </div>
        );
      })}
      {rows.length === 0 && <div className="empty">Aucune note de frais ne correspond à ces critères.</div>}
    </section>
  );
}
