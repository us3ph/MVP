import { useState } from 'react';
import Icon from './Icon';
import cover from '../assets/login-cover.jpg'; // UM6P campus photo under the brand tint (see login-cover.LICENSE.txt)

// « Connexion à l’interface »: username / password, then SSO.
export default function LoginPage({ onSso, onLogin, theme, onToggleTheme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
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
      <button className="theme-btn login-theme" aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'} onClick={onToggleTheme}>
        <Icon name={dark ? 'sun' : 'moon'} />
      </button>

      <div className="login-card">
        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => onLogin({ username, password }));
          }}
        >
          <div className="login-welcome">Bienvenue sur</div>
          <div className="login-brand">
            <Icon name="suitcase" className="i login-brand-ic" />
            <span>
              Travel <em>&amp;</em> Expense
            </span>
          </div>
          <p className="login-lead">Connectez-vous pour gérer vos ordres de mission, vos avances et vos notes de frais.</p>

          <label className="login-field">
            <Icon name="profile" />
            <input placeholder="Nom d’utilisateur" aria-label="Nom d’utilisateur" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="login-field">
            <Icon name="lock" />
            <input type={show ? 'text' : 'password'} placeholder="Mot de passe" aria-label="Mot de passe" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="login-eye" aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} title={show ? 'Masquer' : 'Afficher'} onClick={() => setShow((v) => !v)}>
              <Icon name={show ? 'eye-off' : 'eye'} />
            </button>
          </label>
          {error && <div className="login-err">{error}</div>}
          <button type="submit" className="login-go" disabled={busy}>
            {busy ? 'Connexion…' : 'Se connecter'}
          </button>
          <div className="login-help">
            Problème de connexion ?{' '}
            <a href="mailto:support@um6p.ma" className="login-link">
              Contacter le support
            </a>
          </div>

          <div className="login-or">
            <span>Ou</span>
          </div>
          <div className="login-alt">Continuer avec votre compte UM6P</div>
          <button type="button" className="login-sso" disabled={busy} onClick={() => run(onSso)}>
            <span className="brand sm" aria-hidden="true">
              {['U', 'M', '6', 'P'].map((ch) => (
                <span key={ch} className="brand-ch">
                  {ch}
                </span>
              ))}
            </span>
            Se connecter avec SSO
          </button>
        </form>

        <aside className="login-cover" style={{ backgroundImage: `url(${cover})` }}>
          <div className="login-cover-main">
            <Icon name="suitcase" className="i login-cover-ic" />
            <div className="login-cover-title">
              Travel <em>&amp;</em> Expense
            </div>
            <p className="login-cover-text">La plateforme UM6P pour vos déplacements : ordres de mission, avances en devises, rétrocessions et notes de frais, du départ jusqu’au remboursement.</p>
          </div>
          <div className="login-cover-foot">
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
        </aside>
      </div>
    </div>
  );
}
