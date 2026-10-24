// « Validation timeline » of the order overview: one dot per validator, filled once reached.
export default function ValidationTimeline({ steps = [], reached = 0 }) {
  return (
    <div className="vtl">
      <div className="vtl-cap">Validation timeline</div>
      <ol className="vtl-steps">
        {steps.map((s, i) => (
          <li key={s} className={'vtl-step' + (i < reached ? ' done' : '')}>
            <span className="vtl-dot" />
            <span className="vtl-label">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
