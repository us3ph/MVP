import { useState } from 'react';
import Icon from './Icon';
import Select from './Select';
import DateField from './DateField';
import { KIND_ICON, KIND_LABEL, KIND_TILE, MISSION_TYPES } from '../data/missions';

export default function OrderFormPage({ kind, onSubmit }) {
  const national = kind === 'national';
  const [f, setF] = useState({
    type: 'Mission',
    priority: 'Normal',
    from: '',
    to: '',
    dest: '',
    subject: '',
    advance: '',
    currency: national ? 'MAD' : 'EUR',
    cost: '',
  });
  const set = (key) => (e) => setF({ ...f, [key]: e.target.value });
  const setVal = (key) => (v) => setF({ ...f, [key]: v });

  return (
    <section className="c formcard">
      <div className="form-head">
        <div className={'tile ' + KIND_TILE[kind]}>
          <Icon name={KIND_ICON[kind]} />
        </div>
        <div>
          <div className="h" style={{ fontSize: 14 }}>
            Nouvel {KIND_LABEL[kind].toLowerCase()}
          </div>
          <div className="sub">Renseignez les informations de la mission, puis enregistrez ou envoyez.</div>
        </div>
      </div>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit('send', f);
        }}
      >
        <div className="fld">
          <label htmlFor="f-type">Type de mission</label>
          <Select id="f-type" value={f.type} options={MISSION_TYPES} onChange={setVal('type')} />
        </div>
        <div className="fld">
          <label htmlFor="f-prio">Priorité</label>
          <Select id="f-prio" value={f.priority} options={['Normal', 'Urgent']} onChange={setVal('priority')} />
        </div>
        <div className="fld">
          <label htmlFor="f-from">Date de début</label>
          <DateField id="f-from" value={f.from} onChange={setVal('from')} />
        </div>
        <div className="fld">
          <label htmlFor="f-to">Date de fin</label>
          <DateField id="f-to" value={f.to} onChange={setVal('to')} />
        </div>
        <div className="fld">
          <label htmlFor="f-dest">Destination</label>
          <input id="f-dest" placeholder={national ? 'Ville (Maroc)' : 'Pays, ville'} value={f.dest} onChange={set('dest')} />
        </div>
        <div className="fld">
          <label htmlFor="f-cost">Coût estimé</label>
          <input id="f-cost" type="number" min="0" step="0.01" placeholder="0,00" value={f.cost} onChange={set('cost')} />
        </div>
        <div className="fld full">
          <label htmlFor="f-subj">Objet de la mission</label>
          <input id="f-subj" placeholder="Ex. : participation au congrès annuel…" value={f.subject} onChange={set('subject')} />
        </div>
        <div className="fld">
          <label htmlFor="f-adv">Avance demandée</label>
          <div className="fld-row">
            <input id="f-adv" type="number" min="0" placeholder="0" value={f.advance} onChange={set('advance')} />
            <Select ariaLabel="Devise" value={f.currency} options={['MAD', 'EUR', 'USD']} onChange={setVal('currency')} />
          </div>
        </div>
        <div className="form-ft">
          <button type="button" className="gbtn lg" onClick={() => onSubmit('draft', f)}>
            <Icon name="file" />
            Enregistrer en brouillon
          </button>
          <button type="submit" className="go lg">
            <Icon name="send" style={{ width: 14, height: 14 }} />
            Envoyer pour validation
          </button>
        </div>
      </form>
    </section>
  );
}
