import { Fragment } from 'react';
import Icon from './Icon';
import { NAV } from '../app/nav';

// Single toggle button, pinned to the top-left corner of the window so it stays put while the sidebar slides.
export function SidebarToggle({ open, onToggle }) {
  const label = open ? 'Masquer la barre latérale' : 'Afficher la barre latérale';
  return (
    <button className="sbt" aria-label={label} title={label} aria-expanded={open} onClick={onToggle}>
      <Icon name="sidebar" style={{ width: 20, height: 20 }} />
    </button>
  );
}

export default function Sidebar({ page, open, unread = 0, onNavigate, onLogout }) {
  return (
    <div className={'side-wrap' + (open ? '' : ' closed')}>
      <aside className="side" aria-hidden={!open} inert={!open}>
        <div className="sbh" />
        {NAV.map((group) => (
          <Fragment key={group.label}>
            <div className="gh">
              <Icon name={group.icon} />
              {group.label}
            </div>
            {group.items.map((item) => {
              const on = page === item.key;
              return (
                <button key={item.key} className={'it' + (on ? ' on' : '')} title={item.label} aria-current={on ? 'page' : undefined} onClick={() => onNavigate(item.key)}>
                  <Icon name={item.icon} />
                  <span className="it-label">{item.label}</span>
                  {item.key === 'notifications' && unread > 0 && <span className="it-badge">{unread}</span>}
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
