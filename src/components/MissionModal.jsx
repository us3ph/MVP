import { useEffect } from 'react';
import Icon from './Icon';
import { KIND_ICON, KIND_LABEL, KIND_TILE, SECONDARY_ACTION, STATUS_PILL, fmtAdvance, fmtAmount } from '../data/missions';

export default function MissionModal({ mission: m, onClose, onAction }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const secondary = SECONDARY_ACTION[m.status];

  return (
    <div className="ov" onClick={onClose}>
      <div className="md" role="dialog" aria-modal="true" aria-labelledby="md-title" onClick={(e) => e.stopPropagation()}>
        <div className="hd">
          <div className={'tile ' + KIND_TILE[m.kind]}>
            <Icon name={KIND_ICON[m.kind]} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ttl" id="md-title">
              {KIND_LABEL[m.kind]} · {m.type}
            </div>
            <div className="sub">{m.num ? `N° ${m.num}` : 'Sans numéro (brouillon)'}</div>
          </div>
          <span className={'pill ' + STATUS_PILL[m.status]}>
            <i className="dot" />
            {m.status}
          </span>
          <button className="rb" aria-label="Fermer" title="Fermer" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="kv">
          <div>
            <div className="k">Dates</div>
            <div className="v">
              {m.from} → {m.to}
            </div>
          </div>
          <div>
            <div className="k">Destination</div>
            <div className="v">{m.dest}</div>
          </div>
          <div>
            <div className="k">Avance</div>
            <div className="v">{fmtAdvance(m.advance)}</div>
          </div>
          <div>
            <div className="k">Coût estimé</div>
            <div className="v">{fmtAmount(m.cost)}</div>
          </div>
          <div>
            <div className="k">Priorité</div>
            <div className="v">{m.priority}</div>
          </div>
          <div>
            <div className="k">Statut</div>
            <div className="v">{m.status}</div>
          </div>
        </div>
        <div className="ft">
          <button className="gbtn lg" onClick={onClose}>
            Fermer
          </button>
          <button className="go lg" onClick={() => onAction(m, secondary.label)}>
            <Icon name={secondary.icon} style={{ width: 14, height: 14 }} />
            {secondary.label}
          </button>
        </div>
      </div>
    </div>
  );
}
