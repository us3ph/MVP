import Icon from '../Icon';
import { NOTIFICATION_KINDS } from '../../domain/constants';
import { timeAgo } from '../../lib/format';

// Cards shared by the slide-over and the Notifications page.
export default function NotificationList({ items, onOpen, onDismiss, compact = false }) {
  if (!items.length) return <div className="empty">Aucune notification.</div>;
  return (
    <div className={'notifs' + (compact ? ' compact' : '')}>
      {items.map((n) => {
        const kind = NOTIFICATION_KINDS[n.kind] || NOTIFICATION_KINDS.om_validated;
        return (
          <article key={n.id} className={'notif' + (n.read ? '' : ' unread')}>
            <span className={'notif-ic ' + kind.tone} aria-hidden="true">
              <Icon name={kind.icon} />
            </span>
            <div className="notif-main">
              <div className="notif-title">{n.title}</div>
              <div className="notif-text">{n.text}</div>
              <div className="notif-foot">
                <span className="notif-time">
                  <Icon name="clock" />
                  {timeAgo(n.at)}
                </span>
                <button type="button" className="notif-more" onClick={() => onOpen(n)}>
                  Plus de détails
                </button>
              </div>
            </div>
            <button type="button" className="rb notif-x" aria-label="Supprimer la notification" title="Supprimer" onClick={() => onDismiss(n.id)}>
              <Icon name="close" />
            </button>
          </article>
        );
      })}
    </div>
  );
}
