import { useState } from 'react';
import Icon from './Icon';
import SpecularButton from './ui/SpecularButton';
import GhostFibers from './ui/GhostFibers';
import TravelLogo from './ui/TravelLogo';
import cover from '../assets/login-cover.jpg'; // cover picture under the brand tint (see login-cover.LICENSE.txt)

// « Connexion à l’interface »: sign-in goes through the UM6P SSO only. The card floats over a full-screen
// GhostFibers background drawn in the UM6P colours (ink on the light theme, glow on the dark one).
export default function LoginPage({ onSso, theme, onToggleTheme }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dark = theme === 'dark';

  const sso = async () => {
    setBusy(true);
    setError('');
    try {
      await onSso();
    } catch (e) {
      setError(e.message || 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <GhostFibers
        className="login-bg"
        aria-hidden="true"
        glowColor="#f5602e"
        secondaryColor="#d9260f"
        gradient="along"
        layers={3}
        twist={1.2}
        threads={72}
        fiberStyle="dots"
        depthOfField={0.85}
        hoverEffect="focus"
        vignette={0.35}
        lightMode={!dark}
        intro
        mouseInteraction
      />
      <button className="theme-btn login-theme" aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'} onClick={onToggleTheme}>
        <Icon name={dark ? 'sun' : 'moon'} />
      </button>

      <div className="login-card">
        <div className="login-form">
          <div className="login-welcome">Bienvenue sur</div>
          <div className="login-brand">
            <span>
              Travel <em>&amp;</em> Expense
            </span>
          </div>
          <p className="login-lead">Connectez-vous avec votre compte UM6P pour gérer vos ordres de mission, vos avances et vos notes de frais.</p>

          <SpecularButton
            type="button"
            size="md"
            className="login-sso"
            radius={999}
            tint={dark ? '#ffffff' : '#d9260f'}
            tintOpacity={dark ? 0.06 : 0.05}
            textColor={dark ? '#f2f2f5' : '#17171f'}
            lineColor={dark ? '#ffffff' : '#d9260f'}
            baseColor={dark ? '#6a6a72' : '#e9b8ad'}
            intensity={1}
            idleIntensity={0.45}
            shineSize={12}
            shineFade={40}
            thickness={1.3}
            glow={1}
            followMouse
            proximity={260}
            disabled={busy}
            onClick={sso}
          >
            <span className="brand sm" aria-hidden="true">
              {['U', 'M', '6', 'P'].map((ch) => (
                <span key={ch} className="brand-ch">
                  {ch}
                </span>
              ))}
            </span>
            {busy ? 'Connexion…' : 'Se connecter avec SSO'}
          </SpecularButton>
          {error && <div className="login-err">{error}</div>}
        </div>

        <aside className="login-cover" style={{ backgroundImage: `url(${cover})` }}>
          <div className="login-cover-main">
            <TravelLogo className="login-cover-ic" />
            <div className="login-cover-title">
              Travel <em>&amp;</em> Expense
            </div>
            <p className="login-cover-text">Vos déplacements professionnels, de l’ordre de mission au remboursement.</p>
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
