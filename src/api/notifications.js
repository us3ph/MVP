// Notifications.
//   GET    /notifications          → Notification[]
//   POST   /notifications/read     (all)
//   POST   /notifications/:id/read
//   DELETE /notifications/:id
import { request, USE_MOCK } from './client';
import db, { clone, delay } from './mock/db';

export async function listNotifications() {
  if (!USE_MOCK) return request('/notifications');
  await delay(60);
  return clone(db.notifications);
}

export async function markNotificationRead(id) {
  if (!USE_MOCK) return request(`/notifications/${id}/read`, { method: 'POST' });
  const n = db.notifications.find((x) => x.id === id);
  if (n) n.read = true;
  return null;
}

export async function markAllNotificationsRead() {
  if (!USE_MOCK) return request('/notifications/read', { method: 'POST' });
  db.notifications.forEach((n) => (n.read = true));
  return null;
}

export async function dismissNotification(id) {
  if (!USE_MOCK) return request(`/notifications/${id}`, { method: 'DELETE' });
  db.notifications = db.notifications.filter((n) => n.id !== id);
  return null;
}
