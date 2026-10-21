import Icon from './Icon';

export default function PlaceholderPage({ icon, title, text, onBack }) {
  return (
    <section className="c ph">
      <div className="big">
        <Icon name={icon} />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="go lg" onClick={onBack}>
        Retour au tableau de bord
      </button>
    </section>
  );
}
