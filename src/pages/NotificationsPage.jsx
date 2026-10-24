import { useNavigate } from 'react-router-dom';
import NotificationsView from '../components/notifications/NotificationsView';
import { useHeader } from '../app/header';
import { PAGES } from '../app/pages';
import { useNotificationMutations, useNotifications } from '../queries';

export default function NotificationsPage() {
  useHeader(PAGES.notifications.title, PAGES.notifications.subtitle);
  const navigate = useNavigate();
  const { data: items = [] } = useNotifications();
  const nm = useNotificationMutations();
  return (
    <NotificationsView
      items={items}
      onOpen={(n) => {
        nm.markRead.mutate(n.id);
        if (n.missionId) navigate(`/missions/${n.missionId}`);
      }}
      onDismiss={(id) => nm.dismiss.mutate(id)}
      onReadAll={() => nm.markAllRead.mutate()}
    />
  );
}
