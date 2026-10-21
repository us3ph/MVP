import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Sidebar, { SidebarToggle } from './components/Sidebar';
import PageHeader from './components/PageHeader';
import CostCard from './components/CostCard';
import DraftBanner from './components/DraftBanner';
import StatCards from './components/StatCards';
import QuickActions from './components/QuickActions';
import MissionsTable from './components/MissionsTable';
import MissionModal from './components/MissionModal';
import OrderFormPage from './components/OrderFormPage';
import PlaceholderPage from './components/PlaceholderPage';
import Toast from './components/Toast';
import { MISSIONS } from './data/missions';

// Reference size of the design; on larger screens the UI is scaled up (max 1.5x) to keep the mockup's proportions.
const DESIGN_W = 1440;
const DESIGN_H = 900;
const MAX_SCALE = 1.5;

const DASHBOARD = {
  title: 'Bonjour, Nom Prénom',
  subtitle: 'Voici l’état de vos ordres de mission.',
};

const PAGES = {
  accueil: DASHBOARD,
  'mes-ordres': DASHBOARD,
  national: {
    title: 'Ordre national',
    subtitle: 'Créer un ordre de mission sur le territoire national.',
  },
  international: {
    title: 'Ordre international',
    subtitle: 'Créer un ordre de mission à l’étranger.',
  },
  brouillons: {
    title: 'Brouillons',
    subtitle: 'Ordres de mission non encore envoyés.',
    status: 'Brouillon',
  },
  historique: {
    title: 'Historique',
    subtitle: 'Tous vos ordres de mission, du plus récent au plus ancien.',
    status: 'Tout',
  },
  'en-cours': {
    title: 'En cours',
    subtitle: 'Ordres de mission en attente de validation.',
    status: 'En cours',
  },
  valides: {
    title: 'Validés',
    subtitle: 'Ordres de mission approuvés.',
    status: 'Validé',
  },
  avances: {
    title: 'Avances',
    subtitle: 'Avances demandées sur vos ordres de mission.',
    status: 'Tout',
    onlyAdvance: true,
  },
  destinations: {
    title: 'Destinations',
    subtitle: 'Vos destinations de mission.',
    icon: 'pin',
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Alertes et rappels liés à vos ordres.',
    icon: 'bell',
  },
  parametres: {
    title: 'Paramètres',
    subtitle: 'Préférences de votre compte.',
    icon: 'sliders',
  },
  liens: {
    title: 'Liens utiles',
    subtitle: 'Ressources et documents de référence.',
    icon: 'link',
  },
};

// The window always fills the viewport. The scale is 1 on laptops and grows gently on big monitors.
function useFillScale() {
  const compute = () => {
    const scale = Math.min(Math.max(Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H), 1), MAX_SCALE);
    return {
      scale,
      width: window.innerWidth / scale,
      height: window.innerHeight / scale,
    };
  };
  const [box, setBox] = useState(compute);
  useEffect(() => {
    const onResize = () => setBox(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return box;
}

function ListPage({ missions, title, status, onView, onAction }) {
  const [filtersOpen, setFiltersOpen] = useState(status !== 'Tout');
  return (
    <MissionsTable
      missions={missions}
      title={title}
      initialStatus={status}
      filtersOpen={filtersOpen}
      onToggleFilters={() => setFiltersOpen((v) => !v)}
      onView={onView}
      onAction={onAction}
    />
  );
}

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* storage unavailable: fall through to the OS preference */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [page, setPage] = useState('mes-ordres');
  const [theme, setTheme] = useState(initialTheme);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const toastTimer = useRef();
  const searchRef = useRef(null);
  const mainRef = useRef(null);
  const pointer = useRef({ x: -1, y: -1 });

  // Scrolling slides tiles under a still cursor, which the browser reports as hover. Flag the column
  // while scrolling and clear the flag only when the pointer really moves (not on the browser's
  // synthetic post-scroll mouse event, which keeps the same coordinates).
  useEffect(() => {
    const onMove = (e) => {
      if (e.clientX === pointer.current.x && e.clientY === pointer.current.y) return;
      pointer.current = { x: e.clientX, y: e.clientY };
      mainRef.current?.removeAttribute('data-scrolling');
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  const { scale, width, height } = useFillScale();

  const missions = MISSIONS;
  const draft = missions.find((m) => m.status === 'Brouillon');
  const header = PAGES[page] || DASHBOARD;

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const navigate = useCallback((key) => {
    setPage(key);
    setModal(null);
    setFiltersOpen(false);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const onRowAction = (m, action) => {
    const ref = m.num ? `l’ordre ${m.num}` : 'le brouillon';
    const messages = {
      Suivre: `Suivi activé pour ${ref}.`,
      Envoyer: `${ref[0].toUpperCase()}${ref.slice(1)} a été envoyé pour validation.`,
      Historique: `Historique de ${ref} (bientôt disponible).`,
      Plus: 'Menu d’actions (bientôt disponible).',
    };
    notify(messages[action] || `${action} (bientôt disponible).`);
    setModal(null);
  };

  const onQuickAction = (key) => {
    switch (key) {
      case 'national':
      case 'international':
        navigate(key);
        break;
      case 'search':
        searchRef.current?.focus();
        break;
      case 'filter':
        setFiltersOpen((v) => !v);
        break;
      case 'suivi':
        navigate('en-cours');
        break;
      case 'export':
        notify('Export en cours de préparation…');
        break;
      default:
        break;
    }
  };

  const onFormSubmit = (mode) => {
    notify(mode === 'draft' ? 'Brouillon enregistré.' : 'Ordre de mission envoyé pour validation.');
    navigate('mes-ordres');
  };

  let content;
  if (page === 'accueil' || page === 'mes-ordres') {
    content = (
      <>
        <CostCard missions={missions} />
        <DraftBanner draft={draft} onOpen={() => setModal(draft)} />
        <StatCards missions={missions} onNavigate={navigate} />
        <QuickActions onAction={onQuickAction} />
        <MissionsTable
          missions={missions}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((v) => !v)}
          searchRef={searchRef}
          onView={setModal}
          onAction={onRowAction}
        />
      </>
    );
  } else if (page === 'national' || page === 'international') {
    content = <OrderFormPage kind={page} onSubmit={onFormSubmit} />;
  } else if (header.status) {
    const rows = header.onlyAdvance ? missions.filter((m) => m.advance) : missions;
    content = <ListPage missions={rows} title={header.title} status={header.status} onView={setModal} onAction={onRowAction} />;
  } else {
    content = (
      <PlaceholderPage
        icon={header.icon}
        title={header.title}
        text="Cet écran fait partie de la prochaine itération. La navigation, les filtres et les actions du tableau de bord sont déjà fonctionnels."
        onBack={() => navigate('mes-ordres')}
      />
    );
  }

  return (
    <>
      <div className="win" style={{ width, height, transform: `scale(${scale})` }}>
        <SidebarToggle open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
        <Sidebar
          page={page}
          open={sidebarOpen}
          onNavigate={navigate}
          onLogout={() => notify('Déconnexion (bientôt disponible).')}
        />
        <div className="main" ref={mainRef} onScroll={(e) => e.currentTarget.setAttribute('data-scrolling', '')}>
          <PageHeader
            title={header.title}
            subtitle={header.subtitle}
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          />
          <Fragment key={page}>{content}</Fragment>
        </div>
        {modal && <MissionModal mission={modal} onClose={closeModal} onAction={onRowAction} />}
        {toast && <Toast>{toast}</Toast>}
      </div>
    </>
  );
}
