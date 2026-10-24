import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import { qk } from './keys';

export function useNotifications() {
  return useQuery({ queryKey: qk.notifications, queryFn: api.listNotifications, refetchInterval: 60_000 });
}

export function useNotificationMutations() {
  const qc = useQueryClient();
  const done = () => qc.invalidateQueries({ queryKey: qk.notifications });
  return {
    markRead: useMutation({ mutationFn: (id) => api.markNotificationRead(id), onSuccess: done }),
    markAllRead: useMutation({ mutationFn: () => api.markAllNotificationsRead(), onSuccess: done }),
    dismiss: useMutation({ mutationFn: (id) => api.dismissNotification(id), onSuccess: done }),
  };
}
