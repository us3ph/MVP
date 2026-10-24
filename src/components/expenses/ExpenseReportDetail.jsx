import Icon from '../Icon';
import { settle } from '../../lib/costing';
import { fmtAmount, fmtDate, fmtMoney } from '../../lib/format';

// Detail of a note de frais: expenses & allowances with their MAD conversion, then the
// « Remboursement » block and total.
export default function ExpenseReportDetail({ mission, report, referentials, onEdit, onDownload, onSubmit }) {
  const s = settle(report, mission, referentials);
  const rows = [...s.invoices, ...s.allowances];
  return (
    <div className="ndf">
      <div className="ndf-hd">
        <span className="sub">{report.submittedAt ? `Soumise le ${fmtDate(report.submittedAt)}` : 'Brouillon non soumis'}</span>
        <span style={{ flex: 1 }} />
        {report.status === 'draft' ? (
          <>
            <button type="button" className="gbtn" onClick={onEdit}>
              <Icon name="edit" />
              Modifier
            </button>
            <button type="button" className="go" onClick={onSubmit}>
              <Icon name="send" style={{ width: 13, height: 13 }} />
              Soumettre
            </button>
          </>
        ) : (
          <button type="button" className="gbtn" onClick={onDownload}>
            <Icon name="download" />
            Télécharger la note de frais en format PDF
          </button>
        )}
      </div>
      <ul className="ndf-rows">
        {rows.map((r) => (
          <li key={r.key} className="ndf-row">
            <span className="ndf-lab">{r.label}</span>
            <span className="ndf-src">{fmtAmount(r.amount)} {r.currency}</span>
            <span className="ndf-mad">{fmtMoney(r.mad, 'MAD')}</span>
            <span className="ndf-tag">
              {r.attachment ? (
                <span title={r.attachment}>
                  <Icon name="file" />
                </span>
              ) : (
                r.note || '-'
              )}
            </span>
          </li>
        ))}
      </ul>
      <div className="ndf-cap">Remboursement</div>
      <ul className="ndf-sum">
        <li>
          <span>Avance à retenir</span>
          <b>{fmtMoney(s.advanceToRetain, 'MAD')}</b>
        </li>
        <li>
          <span>Sommes des dépenses</span>
          <b>{fmtMoney(s.invoicesTotal, 'MAD')}</b>
        </li>
        <li>
          <span>Indemnité de séjour</span>
          <b>{fmtMoney(s.allowancesTotal, 'MAD')}</b>
        </li>
      </ul>
      <div className="ndf-notes">
        <span>* Tous les justificatifs doivent être joints au décompte.</span>
        <span>
          ** Conversion au cours du bordereau de change de la banque (taux indicatifs : {Object.entries(referentials.rates || {}).filter(([c]) => c !== 'MAD').map(([c, r]) => `1 ${c} = ${r} MAD`).join(', ')}).
        </span>
        {referentials.rules?.paymentCutoffDay && <span>Une note déposée après le {referentials.rules.paymentCutoffDay} du mois est remboursée le mois suivant, via la paie.</span>}
      </div>
      <div className="total-banner">
        <Icon name="briefcase-clock" />
        <span className="total-main">
          <span className="total-lab">Remboursement</span>
          <span className="total-val">
            {fmtAmount(s.total, 2)} <small>MAD</small>
          </span>
        </span>
      </div>
    </div>
  );
}
