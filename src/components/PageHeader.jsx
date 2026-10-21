import Icon from './Icon';

export default function PageHeader({ title, subtitle, theme, onToggleTheme }) {
  const dark = theme === 'dark';
  const label = dark ? 'Passer en mode clair' : 'Passer en mode sombre';
  return (
    <div className="hdr">
      <div>
        <h1>{title}</h1>
        <div className="hsub">{subtitle}</div>
      </div>
      <div className="hdr-right">
        <button className="theme-btn" aria-label={label} title={label} aria-pressed={dark} onClick={onToggleTheme}>
          <Icon name={dark ? 'sun' : 'moon'} />
        </button>
        <div className="brand" aria-label="UM6P" title="UM6P">
          {['U', 'M', '6', 'P'].map((ch) => (
            <span key={ch} className="brand-ch" aria-hidden="true">
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
