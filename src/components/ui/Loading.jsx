export default function Loading({ text = 'Chargement…' }) {
  return (
    <div className="c loading" role="status" aria-live="polite">
      <span className="spin" aria-hidden="true" />
      {text}
    </div>
  );
}
