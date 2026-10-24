import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import Accordion from '../components/ui/Accordion';
import Loading from '../components/ui/Loading';
import { ExpenseStatusPill } from '../components/ui/Pill';
import ValidationTimeline from '../components/missions/ValidationTimeline';
import ValidatorsChain from '../components/missions/ValidatorsChain';
import CostBreakdown from '../components/missions/CostBreakdown';
import { AdvanceSection, LodgingSection, OrderSection, TransportsSection } from '../components/missions/MissionSections';
import PostMissionBanner from '../components/post-mission/PostMissionBanner';
import ExpenseReportDetail from '../components/expenses/ExpenseReportDetail';
import useMissionActions from './useMissionActions';
import { useHeader } from '../app/header';
import { useToast } from '../app/ToastProvider';
import { KIND_LABEL, statusLabel, statusPill } from '../domain/constants';
import { overviewActions, postMissionStep } from '../lib/actions';
import { costLines, estimatedCost, settle } from '../lib/costing';
import { fmtAdvance, fmtDate, fmtDateDot, missionRef } from '../lib/format';
import { countryName, personName } from '../lib/refs';
import { useExpenseReportMutations, useExpenseReports, useMission, useMissionMutations, useReferentials } from '../queries';

// « Aperçu de l’ordre de mission » (action Afficher): header card, validation timeline, every
// section of the order, the post-mission steps and the actions available on the order.
export default function MissionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const notify = useToast();
  const { data: m, isLoading } = useMission(id);
  const { data: ref } = useReferentials();
  const { data: reports = [] } = useExpenseReports();
  const mm = useMissionMutations();
  const em = useExpenseReportMutations();
  const { run, open, dialogs } = useMissionActions();
  useHeader(m ? `Ordre de mission n° ${missionRef(m) || '—'}` : 'Ordre de mission', m ? KIND_LABEL[m.kind] : '');

  useEffect(() => {
    if (hash && m) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash, m]);

  if (isLoading || !ref) return <Loading />;
  if (!m) return <div className="c empty">Ordre de mission introuvable.</div>;

  const report = reports.find((r) => r.missionId === m.id);
  const lines = costLines(m, ref);
  const validationSteps = ref.validationSteps[m.kind] || [];
  const reached = ['validated', 'archived', 'cancel_pending', 'cancelled'].includes(m.status) ? validationSteps.length : m.status === 'pending' ? Math.min((m.timeline || []).filter((t) => t.done).length, validationSteps.length) : 0;
  const step = postMissionStep(m, report);
  const deadlineDays = ref.rules?.expenseDeadlineDays?.[m.kind];
  const postHint = step === 3 && deadlineDays ? `À déclarer dans les ${deadlineDays} jours suivant le retour ; une note déposée après le ${ref.rules.paymentCutoffDay} du mois est remboursée le mois suivant.` : step === 1 && m.advance?.granted ? 'Le reliquat non dépensé de l’avance est restitué dans la devise de l’avance ; joignez le reçu de la trésorerie.' : null;
  const actual = report && report.status !== 'draft' ? settle(report, m, ref) : null;
  const bar = overviewActions(m, { report });

  const answer = async (which, yes) => {
    if (which === 1) return yes ? open('retrocession', m) : mm.declineRetrocession.mutateAsync(m.id).then(() => notify('Pas de rétrocession pour cette mission.'));
    if (which === 2) return yes ? open('report', m) : mm.skipReport.mutateAsync(m.id).then(() => notify('Compte rendu ignoré.'));
    return yes ? open('expense', m) : mm.declineExpenses.mutateAsync(m.id).then(() => notify('Aucun frais à déclarer.'));
  };

  return (
    <div className="stack">
      <PostMissionBanner step={step} hint={postHint} onAnswer={answer} />

      <section className="c ov-card">
        <button type="button" className="rb" aria-label="Retour" title="Retour" onClick={() => navigate(-1)}>
          <Icon name="arrow-left" />
        </button>
        <div className="ov-head">
          <div>
            <div className="ov-title">Ordre de mission n° {missionRef(m) || '—'}</div>
            <div className="sub">Créé le {fmtDateDot(m.createdAt)}</div>
          </div>
          <div className={'ov-prio' + (m.priority === 'Urgent' ? ' urgent' : '')}>
            <span className="k">Priorité</span>
            <span className="v">
              {m.priority} <i className="dot" />
            </span>
          </div>
        </div>
        <div className="ov-grid two">
          <div className="ov-tile">
            <span className="ov-av">
              <Icon name="profile" />
            </span>
            <span>
              <b>{m.collaborator?.name}</b>
              <small>
                {m.collaborator?.matricule}
                {m.collaborator?.jobTitle ? ` · ${m.collaborator.jobTitle}` : ''}
              </small>
            </span>
          </div>
          <div className="ov-tile">
            <span>
              <small>Participants</small>
              <b>{(m.participants || []).map((p) => personName(ref, p)).join(', ') || '—'}</b>
            </span>
          </div>
        </div>
        <div className="ov-grid four">
          <div className={'ov-tile status ' + statusPill(m.status)}>
            <span>
              <small>Statut</small>
              <b>{statusLabel(m.status)}</b>
            </span>
          </div>
          <div className="ov-tile">
            <span>
              <small>Date de départ</small>
              <b>{fmtDateDot(m.startDate)}</b>
            </span>
          </div>
          <div className="ov-tile">
            <span>
              <small>Date de retour</small>
              <b>{fmtDateDot(m.endDate)}</b>
            </span>
          </div>
          <div className="ov-tile">
            <span>
              <small>Destination</small>
              <b>{countryName(ref, m.country).toUpperCase()}</b>
            </span>
          </div>
        </div>
        <ValidationTimeline steps={validationSteps} reached={reached} />
      </section>

      <Accordion title="Ordre de mission" defaultOpen>
        <OrderSection m={m} referentials={ref} />
      </Accordion>
      <Accordion title="Transports">
        <TransportsSection m={m} referentials={ref} />
      </Accordion>
      <Accordion title="Hébergement">
        <LodgingSection m={m} />
      </Accordion>
      {m.kind === 'international' && (
        <Accordion title="Avance">
          <AdvanceSection m={m} referentials={ref} />
        </Accordion>
      )}
      <Accordion title="Validateurs">
        <ValidatorsChain steps={ref.validatorChains[m.kind] || []} validators={m.validators || []} />
      </Accordion>
      <CostBreakdown title="Coût global estimé de la mission" total={estimatedCost(m, ref)} lines={lines} />
      {actual && <CostBreakdown title="Coût global réel de la mission" total={actual.actualCost} lines={[...actual.invoices, ...actual.allowances].map((l) => ({ ...l, icon: l.icon || 'receipt' }))} />}

      {['validated', 'archived', 'cancel_pending', 'cancelled'].includes(m.status) && (
        <>
          <Accordion title="Vouchers et billet">
            {(m.vouchers || []).length ? (
              <ul className="files">
                {m.vouchers.map((v) => (
                  <li key={v.id} className="file">
                    <Icon name="ticket" />
                    <span>{v.label}</span>
                    <small>{v.file}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty">Aucun voucher ni billet transmis par la logistique voyage.</div>
            )}
          </Accordion>
          <Accordion title="Rétrocession">
            {m.retrocession ? (
              <div className="kv">
                <div>
                  <div className="k">Montant</div>
                  <div className="v">{m.retrocession.none ? 'Aucune rétrocession' : fmtAdvance(m.retrocession)}</div>
                </div>
                <div>
                  <div className="k">Date</div>
                  <div className="v">{fmtDate(m.retrocession.date)}</div>
                </div>
                {m.retrocession.receipt && (
                  <div className="full">
                    <div className="k">Reçu de la trésorerie</div>
                    <div className="v">{m.retrocession.receipt}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty">
                Aucune rétrocession déclarée.{' '}
                <button type="button" className="lnk" onClick={() => open('retrocession', m)}>
                  Ajouter une rétrocession
                </button>
              </div>
            )}
          </Accordion>
          <Accordion title="Compte Rendu">
            {m.report?.answers ? (
              <div className="kv">
                {ref.reportQuestions.map((q) => (
                  <div key={q.id} className="full">
                    <div className="k">{q.text}</div>
                    <div className="v">{Array.isArray(m.report.answers[q.id]) ? m.report.answers[q.id].join(', ') : m.report.answers[q.id] || '—'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                {m.report?.skipped ? 'Compte rendu ignoré.' : 'Aucun compte rendu.'}{' '}
                <button type="button" className="lnk" onClick={() => open('report', m)}>
                  Ajouter
                </button>
              </div>
            )}
          </Accordion>
          <Accordion title="Note de frais" id="note-de-frais" defaultOpen={hash === '#note-de-frais'} extra={report && <ExpenseStatusPill code={report.status} full />}>
            {report ? (
              <ExpenseReportDetail
                mission={m}
                report={report}
                referentials={ref}
                onEdit={() => open('expense', m)}
                onDownload={() => run(m, 'expensePdf')}
                onSubmit={async () => {
                  await em.submit.mutateAsync(report.id);
                  notify('Note de frais soumise pour validation et paiement.');
                }}
              />
            ) : (
              <div className="empty">
                Aucune note de frais.{' '}
                <button type="button" className="lnk" onClick={() => open('expense', m)}>
                  Ajouter une note de frais
                </button>
              </div>
            )}
          </Accordion>
        </>
      )}

      {bar.length > 0 && (
        <section className="c ov-bar">
          <span className="ov-approved">
            <Icon name="check" />
            Approuvé le {fmtDateDot(m.approvedAt || m.createdAt)}
          </span>
          <span style={{ flex: 1 }} />
          {bar.map((a) => (
            <button key={a.key} type="button" className={'obtn' + (a.key === 'cancel' ? ' danger' : '')} aria-label={a.label} title={a.label} onClick={() => run(m, a.key)}>
              <Icon name={a.icon} />
            </button>
          ))}
        </section>
      )}
      {dialogs}
    </div>
  );
}
