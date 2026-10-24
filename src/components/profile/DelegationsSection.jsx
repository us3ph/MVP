import { useState } from 'react';
import Icon from '../Icon';
import { fmtDateDot } from '../../lib/format';
import { delegationActionLabel, person } from '../../lib/refs';

const PAGE = 5;

// « Délégations »: add / edit buttons, the list and its pagination.
export default function DelegationsSection({ delegations = [], referentials, onAdd, onEdit, onDelete }) {
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(delegations.length / PAGE));
  const rows = delegations.slice(page * PAGE, page * PAGE + PAGE);
  const current = delegations.find((d) => d.id === selected);
  return (
    <section className="c formcard">
      <div className="form-head">
        <div>
          <div className="h" style={{ fontSize: 14 }}>
            Délégation
          </div>
          <div className="sub">Confiez la création, la gestion ou la validation à un collègue pour une période donnée.</div>
        </div>
      </div>
      <div className="dlg-btns">
        <button type="button" className="gbtn" onClick={onAdd}>
          <Icon name="plus" />
          Ajouter
        </button>
        <button type="button" className="gbtn" disabled={!current} onClick={() => onEdit(current)}>
          <Icon name="edit" />
          Modifier
        </button>
        <button type="button" className="gbtn" disabled={!current} onClick={() => onDelete(current)}>
          <Icon name="trash" />
          Supprimer
        </button>
      </div>
      <div className="dtable">
        <div className="dth">
          <div>Nom</div>
          <div>Prénom</div>
          <div>Libellé</div>
          <div>Date de début</div>
          <div>Date de fin incluse</div>
        </div>
        {rows.map((d) => {
          const p = person(referentials, d.delegateId);
          const on = selected === d.id;
          return (
            <button type="button" key={d.id} className={'dtr' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setSelected(on ? null : d.id)}>
              <div>{p?.lastName || '—'}</div>
              <div>{p?.firstName || '—'}</div>
              <div className="ellipsis" title={d.actions.map((a) => delegationActionLabel(referentials, a)).join(', ')}>
                {d.actions.map((a) => delegationActionLabel(referentials, a)).join(', ')}
              </div>
              <div>{fmtDateDot(d.startDate)}</div>
              <div>{fmtDateDot(d.endDate)}</div>
            </button>
          );
        })}
        {delegations.length === 0 && <div className="empty">Aucune délégation. Utilisez « Ajouter » pour en créer une.</div>}
        <div className="pager">
          <button type="button" className="rb" aria-label="Première page" disabled={page === 0} onClick={() => setPage(0)}>
            <Icon name="chevl" />
            <Icon name="chevl" style={{ marginLeft: -10 }} />
          </button>
          <button type="button" className="rb" aria-label="Page précédente" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            <Icon name="chevl" />
          </button>
          <span className="pager-txt">
            {delegations.length ? `${page * PAGE + 1} à ${Math.min(delegations.length, (page + 1) * PAGE)} sur ${delegations.length}` : '0 sur 0'}
          </span>
          <button type="button" className="rb" aria-label="Page suivante" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>
            <Icon name="chevr" />
          </button>
          <button type="button" className="rb" aria-label="Dernière page" disabled={page >= pages - 1} onClick={() => setPage(pages - 1)}>
            <Icon name="chevr" />
            <Icon name="chevr" style={{ marginLeft: -10 }} />
          </button>
        </div>
      </div>
    </section>
  );
}
