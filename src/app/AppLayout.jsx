import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar, { SidebarToggle } from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import TimelinePanel from '../components/missions/TimelinePanel';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import useFillScale from '../hooks/useFillScale';
import { HeaderContext } from './header';
import { UIContext } from './ui';
import { PAGES, pageKeyFromPath } from './pages';
import { useAuth } from './AuthProvider';
import { useTheme } from './ThemeProvider';
import { useToast } from './ToastProvider';
import { useExpenseReports, useMissions, useNotifications, useProfileMutations, useReferentials } from '../queries';

// The application window: sidebar, header, page, and the panels / dialogs any page can open.
export default function AppLayout() {
  const { theme, toggle } = useTheme();
  const { logout } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { scale, width, height } = useFillScale();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [header, setHeader] = useState({ title: '', subtitle: '' });
  const [panelState, setPanelState] = useState(null); // { type: 'timeline', id } | { type: 'password' }
  // A panel belongs to the page it was opened on: navigating away closes it without any effect.
  const panel = panelState && panelState.at === location.key ? panelState : null;
  const mainRef = useRef(null);
  const pointer = useRef({ x: -1, y: -1 });

  const { data: ref } = useReferentials();
  const { data: notifications = [] } = useNotifications();
  const { data: missions = [] } = useMissions();
  const { data: reports = [] } = useExpenseReports();
  const pm = useProfileMutations();
  const unread = notifications.filter((n) => !n.read).length;

  // Scrolling slides tiles under a still cursor, which the browser reports as hover. Flag the column
  // while scrolling and clear the flag only when the pointer really moves.
  useEffect(() => {
    const onMove = (e) => {
      if (e.clientX === pointer.current.x && e.clientY === pointer.current.y) return;
      pointer.current = { x: e.clientX, y: e.clientY };
      mainRef.current?.removeAttribute('data-scrolling');
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  // New page: scroll back to the top (unless a section anchor is targeted).
  useEffect(() => {
    if (!location.hash) mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  const ui = useMemo(
    () => ({
      openTimeline: (id) => setPanelState({ type: 'timeline', id, at: location.key }),
      openPassword: () => setPanelState({ type: 'password', at: location.key }),
      close: () => setPanelState(null),
    }),
    [location.key],
  );

  const onNavigate = (key) => navigate(PAGES[key].path);
  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };
  const timelineMission = panel?.type === 'timeline' ? missions.find((m) => m.id === panel.id) : null;

  return (
    <UIContext.Provider value={ui}>
      <HeaderContext.Provider value={setHeader}>
        <div className="win" style={{ width, height, transform: `scale(${scale})` }}>
          <SidebarToggle open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
          <Sidebar page={pageKeyFromPath(location.pathname)} open={sidebarOpen} unread={unread} onNavigate={onNavigate} onLogout={onLogout} />
          <div className="main" ref={mainRef} onScroll={(e) => e.currentTarget.setAttribute('data-scrolling', '')}>
            <PageHeader title={header.title} subtitle={header.subtitle} theme={theme} onToggleTheme={toggle} />
            <Outlet key={location.pathname} />
          </div>
          {timelineMission && <TimelinePanel mission={timelineMission} report={reports.find((r) => r.missionId === timelineMission.id)} processingSteps={ref?.processingSteps?.[timelineMission.kind] || []} expenseSteps={ref?.expenseSteps || []} onClose={ui.close} />}
          {panel?.type === 'password' && (
            <ChangePasswordModal
              busy={pm.changePassword.isPending}
              onClose={ui.close}
              onSubmit={async (data) => {
                try {
                  await pm.changePassword.mutateAsync(data);
                  ui.close();
                  notify('Mot de passe modifié.');
                } catch (e) {
                  notify(e.message || 'Impossible de changer le mot de passe.');
                }
              }}
            />
          )}
        </div>
      </HeaderContext.Provider>
    </UIContext.Provider>
  );
}
