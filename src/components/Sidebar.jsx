import { Fragment } from 'react';
import Icon from './Icon';

export const NAV = [
  // Top-level entry with no group header: its icon already says "home".
  { items: [{ key: 'accueil', label: 'Accueil', icon: 'home' }] },
  {
    label: 'Missions',
    icon: 'briefcase',
    items: [
      { key: 'mes-ordres', label: 'Mes ordres de mission', icon: 'briefcase' },
      { key: 'national', label: 'Ordre national', icon: 'car' },
      { key: 'international', label: 'Ordre international', icon: 'plane' },
      { key: 'brouillons', label: 'Brouillons', icon: 'file' },
      { key: 'historique', label: 'Historique', icon: 'history' },
    ],
  },
  {
    label: 'Suivi',
    icon: 'chart',
    items: [
      { key: 'en-cours', label: 'En cours', icon: 'refresh' },
      { key: 'valides', label: 'Validés', icon: 'check' },
      { key: 'avances', label: 'Avances', icon: 'card' },
      { key: 'destinations', label: 'Destinations', icon: 'pin' },
    ],
  },
  {
    label: 'Compte',
    icon: 'user',
    items: [
      { key: 'notifications', label: 'Notifications', icon: 'bell' },
      { key: 'parametres', label: 'Paramètres', icon: 'sliders' },
      { key: 'liens', label: 'Liens utiles', icon: 'link' },
    ],
  },
];

// Single toggle button, pinned to the top-left corner of the window so it stays put while the sidebar slides.
export function SidebarToggle({ open, onToggle }) {
  const label = open ? 'Masquer la barre latérale' : 'Afficher la barre latérale';
  return (
    <button className="sbt" aria-label={label} title={label} aria-expanded={open} onClick={onToggle}>
      <Icon name="sidebar" style={{ width: 20, height: 20 }} />
    </button>
  );
}

export default function Sidebar({ page, open, onNavigate, onLogout }) {
  return (
    <div className={'side-wrap' + (open ? '' : ' closed')}>
      <aside className="side" aria-hidden={!open} inert={!open}>
        <div className="sbh" />
        {NAV.map((group) => (
          <Fragment key={group.label || group.items[0].key}>
            {group.label && (
              <div className="gh">
                <Icon name={group.icon} />
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const on = page === item.key;
              return (
                <button
                  key={item.key}
                  className={'it' + (on ? ' on' : '')}
                  aria-current={on ? 'page' : undefined}
                  onClick={() => onNavigate(item.key)}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </button>
              );
            })}
          </Fragment>
        ))}
        <div className="side-foot">
          <button className="it" onClick={onLogout}>
            <Icon name="logout" />
            Déconnexion
          </button>
        </div>
      </aside>
    </div>
  );
}
