import Icon from '../Icon';
import { TRANSPORT_MODE } from '../../domain/constants';
import { perDiem } from '../../lib/costing';
import { fmtAdvance, fmtAmount, fmtDate, fmtMoney } from '../../lib/format';
import { controllerOf, countryName, entityLabel, personName } from '../../lib/refs';

// Read-only blocks of an ordre de mission, shared by the « Aperçu » step and the mission overview.

function KV({ k, v, full }) {
  return (
    <div className={full ? 'full' : ''}>
      <div className="k">{k}</div>
      <div className="v">{v || '—'}</div>
    </div>
  );
}

export function OrderSection({ m, referentials: ref }) {
  const national = m.kind === 'national';
  return (
    <>
      <div className="kv">
        <KV k="Type(s) de mission" v={m.types?.join(', ')} />
        <KV k="Priorité" v={m.priority} />
        <KV k="Date de début" v={`${fmtDate(m.startDate)}${national && m.startTime ? ` à ${m.startTime}` : ''}`} />
        <KV k="Date de fin" v={`${fmtDate(m.endDate)}${national && m.endTime ? ` à ${m.endTime}` : ''}`} />
        {!national && <KV k="Pays" v={countryName(ref, m.country)} />}
        <KV k="Ville(s)" v={m.cities?.join(', ')} />
        <KV k="Participants" v={(m.participants || []).map((p) => personName(ref, p)).join(', ')} full />
        {!national && <KV k="Demande de visa" v={m.visaRequest ? 'Oui' : 'Non'} />}
      </div>
      {(m.objects || []).map((o, i) => (
        <div className="obj" key={o.id || i}>
          <div className="obj-title">Objet de la mission {m.objects.length > 1 ? i + 1 : ''}</div>
          <div className="kv">
            <KV k="Activité(s)" v={o.activities} full />
            <KV k="Entité / Projet" v={`${entityLabel(ref, o.entity)} · ${fmtAmount(o.percentage)} %`} />
            <KV k="Contrôleur de gestion" v={controllerOf(ref, o.entity)} />
            <KV k="Attentes" v={o.expectations} full />
            <KV k="Pièces jointes" v={o.attachments?.length ? o.attachments.join(', ') : 'Aucune'} full />
          </div>
        </div>
      ))}
    </>
  );
}

export function TransportsSection({ m, referentials: ref }) {
  const vehicleLabel = (code) => ref?.roadVehicles?.find((v) => v.code === code)?.label;
  return (
    <>
      {(m.transports || []).length === 0 && <div className="empty">Aucun trajet renseigné.</div>}
      <ul className="legs">
        {(m.transports || []).map((t, i) => {
          const mode = TRANSPORT_MODE[t.mode];
          return (
            <li key={t.id || i} className="leg">
              <span className="leg-ic">
                <Icon name={mode?.icon || 'bag'} />
              </span>
              <span className="leg-main">
                <span className="leg-route">
                  {t.fromCity} <Icon name="arrow-right" className="i leg-arrow" /> {t.toCity}
                </span>
                <span className="sub">
                  {mode?.label || '—'}
                  {t.mode === 'road' && vehicleLabel(t.vehicle) ? ` (${vehicleLabel(t.vehicle)})` : ''} · départ {fmtDate(t.departDate)} · arrivée {fmtDate(t.arriveDate)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      {m.transportComment && (
        <div className="kv">
          <KV k="Commentaire" v={m.transportComment} full />
        </div>
      )}
    </>
  );
}

export function LodgingSection({ m }) {
  if (m.lodgingSkipped) {
    return (
      <div className="kv">
        <KV k="Étape ignorée" v={m.lodgingSkipped.flatRate ? 'Forfait journalier d’hébergement : Oui' : 'Forfait journalier d’hébergement : Non (remboursement sur note de frais)'} full />
        <KV k="Commentaire" v={m.lodgingSkipped.comment} full />
      </div>
    );
  }
  if (!(m.lodgings || []).length) return <div className="empty">Aucun hébergement renseigné.</div>;
  return (
    <ul className="legs">
      {m.lodgings.map((l, i) => (
        <li key={l.id || i} className="leg">
          <span className="leg-ic">
            <Icon name="bed" />
          </span>
          <span className="leg-main">
            <span className="leg-route">{l.city}</span>
            <span className="sub">
              Check-in {fmtDate(l.checkIn)} · Check-out {fmtDate(l.checkOut)}
              {l.preferences ? ` · ${l.preferences}` : ''}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AdvanceSection({ m, referentials: ref }) {
  if (!m.advance) return <div className="empty">Aucune avance demandée.</div>;
  const pd = perDiem(m, ref);
  const state = m.advance.granted === true ? 'Octroyée' : m.advance.granted === false ? 'Non octroyée' : 'En attente de traitement par la trésorerie';
  return (
    <div className="kv">
      <KV k="Indemnité de séjour" v={`${fmtMoney(pd.amount, pd.currency)} (${fmtMoney(pd.mad, 'MAD')})`} />
      <KV k="Devise(s) attendue(s)" v={(m.advance.currencies || []).join(', ')} />
      <KV k="Montant de l’avance" v={fmtAdvance(m.advance)} />
      <KV k="Statut" v={state} />
      <KV k="Commentaire" v={m.advance.comment} full />
    </div>
  );
}
