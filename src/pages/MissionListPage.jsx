import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MissionsTable from '../components/missions/MissionsTable';
import Loading from '../components/ui/Loading';
import useMissionActions from './useMissionActions';
import { useHeader } from '../app/header';
import { PAGES } from '../app/pages';
import { useExpenseReports, useMissions, useReferentials } from '../queries';

// Brouillons, Historique, En cours, Validés, Archivés, Annulés, Avances.
export default function MissionListPage({ config }) {
  useHeader(config.title, config.subtitle);
  const navigate = useNavigate();
  const { data: missions = [], isLoading } = useMissions();
  const { data: reports = [] } = useExpenseReports();
  const { data: ref } = useReferentials();
  const { run, dialogs } = useMissionActions();
  const [filtersOpen, setFiltersOpen] = useState(!!config.statusFilter && config.statusFilter.length > 1);
  if (isLoading) return <Loading />;
  const reportByMission = Object.fromEntries(reports.map((r) => [r.missionId, r]));
  return (
    <>
      <MissionsTable
        title={config.title}
        missions={missions}
        reportByMission={reportByMission}
        referentials={ref}
        statusFilter={config.statusFilter}
        onlyAdvance={config.onlyAdvance}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((v) => !v)}
        onAction={run}
        onCreate={(kind) => navigate(PAGES[kind].path)}
      />
      {dialogs}
    </>
  );
}
