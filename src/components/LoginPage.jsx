import { useState } from 'react';
import Icon from './Icon';

// « Connexion à l’interface »: SSO first, then username / password.
export default function LoginPage({ onSso, onLogin, theme, onToggleTheme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dark = theme === 'dark';

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(e.message || 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <div className="login-bg" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>
      <button className="theme-btn login-theme" aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'} onClick={onToggleTheme}>
        <Icon name={dark ? 'sun' : 'moon'} />
      </button>
      <form
        className="c login-card"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => onLogin({ username, password }));
        }}
      >
        <div className="login-logo" aria-hidden="true">
          <Icon name="suitcase" />
        </div>
        <div className="login-brand">
          TRAVEL<span>&amp;</span>EXPENSE
        </div>
        <div className="login-sub">Connectez-vous à votre compte</div>

        <button type="button" className="sso" disabled={busy} onClick={() => run(onSso)}>
          <span className="brand sm" aria-hidden="true">
            {['U', 'M', '6', 'P'].map((ch) => (
              <span key={ch} className="brand-ch">
                {ch}
              </span>
            ))}
          </span>
          Se connecter avec SSO
        </button>
        <div className="login-or">
          <span>Ou</span>
        </div>

        <label className="login-field">
          <Icon name="mail" />
          <span className="login-lab">Nom d’utilisateur</span>
          <input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="login-field">
          <Icon name="lock" />
          <span className="login-lab">Mot de passe</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <div className="login-err">{error}</div>}
        <button type="submit" className="go lg login-go" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
        <div className="login-foot">
          <span className="brand" aria-label="UM6P">
            {['U', 'M', '6', 'P'].map((ch) => (
              <span key={ch} className="brand-ch" aria-hidden="true">
                {ch}
              </span>
            ))}
          </span>
          <span className="login-univ">
            University
            <br />
            Mohammed VI
            <br />
            Polytechnic
          </span>
        </div>
      </form>
    </div>
  );
}
