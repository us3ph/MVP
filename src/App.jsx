import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './app/AuthProvider';
import AppLayout from './app/AppLayout';
import { LIST_PAGES } from './app/pages';
import LoginRoute from './pages/LoginRoute';
import DashboardPage from './pages/DashboardPage';
import MissionListPage from './pages/MissionListPage';
import ExpenseReportsPage from './pages/ExpenseReportsPage';
import MissionDetailPage from './pages/MissionDetailPage';
import OrderFormPage from './pages/OrderFormPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginRoute /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      ...LIST_PAGES.map((p) => ({ path: p.path.slice(1), element: <MissionListPage config={p} /> })),
      { path: 'notes-de-frais', element: <ExpenseReportsPage /> },
      { path: 'missions/:id', element: <MissionDetailPage /> },
      { path: 'ordre/new/:kind', element: <OrderFormPage /> },
      { path: 'ordre/:mode/:id', element: <OrderFormPage /> },
      { path: 'profil', element: <ProfilePage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
