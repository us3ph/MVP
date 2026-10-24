import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseReportsTable from '../components/expenses/ExpenseReportsTable';
import Loading from '../components/ui/Loading';
import useMissionActions from './useMissionActions';
import { useHeader } from '../app/header';
import { useUI } from '../app/ui';
import { PAGES } from '../app/pages';
import { useExpenseReports, useMissions, useReferentials } from '../queries';

export default function ExpenseReportsPage() {
  const cfg = PAGES['notes-de-frais'];
  useHeader(cfg.title, cfg.subtitle);
  const navigate = useNavigate();
  const { openTimeline } = useUI();
  const { data: reports = [], isLoading } = useExpenseReports();
  const { data: missions = [] } = useMissions();
  const { data: ref } = useReferentials();
  const { run, dialogs } = useMissionActions();
  const [filtersOpen, setFiltersOpen] = useState(false);
  if (isLoading) return <Loading />;
  const missionById = Object.fromEntries(missions.map((m) => [m.id, m]));
  const onAction = (report, mission, key) => {
    if (key === 'view') navigate({ pathname: `/missions/${mission.id}`, hash: '#note-de-frais' });
    else if (key === 'timeline') openTimeline(mission.id);
    else run(mission, key);
  };
  return (
    <>
      <ExpenseReportsTable reports={reports} missionById={missionById} referentials={ref} filtersOpen={filtersOpen} onToggleFilters={() => setFiltersOpen((v) => !v)} onAction={onAction} />
      {dialogs}
    </>
  );
}
