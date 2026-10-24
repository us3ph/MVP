import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CostCard from '../components/CostCard';
import DraftBanner from '../components/DraftBanner';
import StatCards from '../components/StatCards';
import QuickActions from '../components/QuickActions';
import MissionsTable from '../components/missions/MissionsTable';
import Loading from '../components/ui/Loading';
import useMissionActions from './useMissionActions';
import { useHeader } from '../app/header';
import { useToast } from '../app/ToastProvider';
import { PAGES } from '../app/pages';
import { useExpenseReports, useMissions, useProfile, useReferentials } from '../queries';

export default function DashboardPage() {
  const { data: profile } = useProfile();
  const { data: missions = [], isLoading } = useMissions();
  const { data: reports = [] } = useExpenseReports();
  const { data: ref } = useReferentials();
  useHeader(profile ? `Bonjour, ${profile.firstName} ${profile.lastName}` : 'Bonjour', PAGES['mes-ordres'].subtitle);
  const navigate = useNavigate();
  const notify = useToast();
  const { run, dialogs } = useMissionActions();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef(null);

  if (isLoading) return <Loading />;
  const draft = missions.find((m) => m.status === 'draft');
  const reportByMission = Object.fromEntries(reports.map((r) => [r.missionId, r]));

  const onQuickAction = (key) => {
    switch (key) {
      case 'national':
      case 'international':
        navigate(PAGES[key].path);
        break;
      case 'search':
        searchRef.current?.focus();
        break;
      case 'filter':
        setFiltersOpen((v) => !v);
        break;
      case 'suivi':
        navigate(PAGES['en-cours'].path);
        break;
      case 'export':
        notify('Export en cours de préparation…');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <CostCard missions={missions} referentials={ref} />
      <DraftBanner draft={draft} referentials={ref} onOpen={() => navigate(`/ordre/edit/${draft.id}`)} />
      <StatCards missions={missions} onNavigate={(key) => navigate(PAGES[key].path)} />
      <QuickActions onAction={onQuickAction} />
      <MissionsTable
        missions={missions}
        reportByMission={reportByMission}
        referentials={ref}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((v) => !v)}
        searchRef={searchRef}
        onAction={run}
        onCreate={(kind) => navigate(PAGES[kind].path)}
      />
      {dialogs}
    </>
  );
}
