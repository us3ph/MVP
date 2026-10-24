import Icon from '../Icon';
import NotificationList from './NotificationList';

export default function NotificationsView({ items, onOpen, onDismiss, onReadAll }) {
  const unread = items.filter((n) => !n.read).length;
  return (
    <section className="c formcard">
      <div className="form-head">
        <span className="tile int">
          <Icon name="bell" />
        </span>
        <div style={{ flex: 1 }}>
          <div className="h" style={{ fontSize: 14 }}>
            Notifications
          </div>
          <div className="sub">{unread ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Vous êtes à jour.'}</div>
        </div>
        {unread > 0 && (
          <button type="button" className="gbtn" onClick={onReadAll}>
            Tout marquer comme lu
          </button>
        )}
      </div>
      <NotificationList items={items} onOpen={onOpen} onDismiss={onDismiss} />
    </section>
  );
}
