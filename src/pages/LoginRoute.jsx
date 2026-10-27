import { Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import { useAuth } from '../app/AuthProvider';
import { useTheme } from '../app/ThemeProvider';

export default function LoginRoute() {
  const { session, loginSso } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  if (session) return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  return <LoginPage onSso={loginSso} theme={theme} onToggleTheme={toggle} />;
}
