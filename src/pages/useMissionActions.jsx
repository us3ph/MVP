import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import CancelMissionModal from '../components/post-mission/CancelMissionModal';
import RetrocessionModal from '../components/post-mission/RetrocessionModal';
import ReportModal from '../components/post-mission/ReportModal';
import ExpenseReportModal from '../components/expenses/ExpenseReportModal';
import { useToast } from '../app/ToastProvider';
import { useUI } from '../app/ui';
import { useExpenseReportMutations, useExpenseReports, useMissionMutations, useReferentials } from '../queries';

// One place that knows what every action key does (navigation, mutation or dialog), shared by the
// dashboard, the list pages and the mission overview.
export default function useMissionActions() {
  const navigate = useNavigate();
  const notify = useToast();
  const { openTimeline } = useUI();
  const mm = useMissionMutations();
  const em = useExpenseReportMutations();
  const { data: ref } = useReferentials();
  const { data: reports = [] } = useExpenseReports();
  const [dialog, setDialog] = useState(null); // { type, mission, report }
  const close = () => setDialog(null);
  const open = (type, mission) => setDialog({ type, mission, report: reports.find((r) => r.missionId === mission.id) });

  const run = async (m, key) => {
    const report = reports.find((r) => r.missionId === m.id);
    try {
      switch (key) {
        case 'view':
          navigate(`/missions/${m.id}`);
          break;
        case 'timeline':
          openTimeline(m.id);
          break;
        case 'edit':
          navigate(`/ordre/edit/${m.id}`);
          break;
        case 'extend':
          navigate(`/ordre/extend/${m.id}`);
          break;
        case 'reduce':
          navigate(`/ordre/reduce/${m.id}`);
          break;
        case 'submit':
          await mm.submit.mutateAsync(m.id);
          notify('Ordre de mission soumis aux validateurs.');
          break;
        case 'recall':
          await mm.recall.mutateAsync(m.id);
          notify('Ordre de mission rappelé : il est de nouveau modifiable.');
          break;
        case 'download': {
          const { filename } = await mm.downloadPdf.mutateAsync(m.id);
          notify(`Téléchargement de ${filename}…`);
          break;
        }
        case 'expensePdf':
          if (report) {
            const { filename } = await em.downloadPdf.mutateAsync(report.id);
            notify(`Téléchargement de ${filename}…`);
          }
          break;
        case 'delete':
        case 'cancel':
        case 'retrocession':
        case 'expense':
        case 'expenseEdit':
        case 'report':
          open(key === 'expenseEdit' ? 'expense' : key, m);
          break;
        default:
          notify(`${key} (bientôt disponible).`);
      }
    } catch (e) {
      notify(e.message || 'Une erreur est survenue.');
    }
  };

  let dialogs = null;
  if (dialog) {
    const { type, mission, report } = dialog;
    if (type === 'delete')
      dialogs = (
        <Modal icon="trash" tone="danger" title="Supprimer le brouillon" onClose={close} closable={false}>
          <p className="md-text">Ce brouillon sera définitivement supprimé. Continuer ?</p>
          <div className="form-ft between">
            <button
              type="button"
              className="go lg"
              disabled={mm.remove.isPending}
              onClick={async () => {
                await mm.remove.mutateAsync(mission.id);
                close();
                notify('Brouillon supprimé.');
              }}
            >
              Oui
            </button>
            <button type="button" className="gbtn lg" onClick={close}>
              Non
            </button>
          </div>
        </Modal>
      );
    if (type === 'cancel')
      dialogs = (
        <CancelMissionModal
          mission={mission}
          busy={mm.cancel.isPending}
          onClose={close}
          onConfirm={async (reason) => {
            await mm.cancel.mutateAsync({ id: mission.id, reason });
            close();
            notify('Demande d’annulation envoyée à la logistique voyage.');
          }}
        />
      );
    if (type === 'retrocession')
      dialogs = (
        <RetrocessionModal
          mission={mission}
          currencies={ref?.currencies || []}
          busy={mm.addRetrocession.isPending}
          onClose={close}
          onConfirm={async ({ currency, amount, receipt }) => {
            await mm.addRetrocession.mutateAsync({ id: mission.id, currency, amount, receipt });
            close();
            notify('Rétrocession ajoutée.');
          }}
        />
      );
    if (type === 'report')
      dialogs = (
        <ReportModal
          questions={ref?.reportQuestions || []}
          busy={mm.saveReport.isPending}
          onClose={close}
          onSubmit={async (data) => {
            await mm.saveReport.mutateAsync({ id: mission.id, report: data });
            close();
            notify('Compte rendu ajouté.');
          }}
        />
      );
    if (type === 'expense')
      dialogs = (
        <ExpenseReportModal
          mission={mission}
          report={report}
          expenseTypes={ref?.expenseTypes || []}
          otherType={ref?.expenseTypeOther}
          currencies={ref?.currencies || []}
          rules={ref?.rules}
          busy={em.save.isPending || em.submit.isPending}
          onClose={close}
          onSave={async (data) => {
            await em.save.mutateAsync(data);
            close();
            notify('Note de frais enregistrée en brouillon.');
          }}
          onSubmit={async (data) => {
            const saved = await em.save.mutateAsync(data);
            await em.submit.mutateAsync(saved.id);
            close();
            notify('Note de frais soumise pour validation et paiement.');
          }}
        />
      );
  }

  return { run, open, dialogs };
}
