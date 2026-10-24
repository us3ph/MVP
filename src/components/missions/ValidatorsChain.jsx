import Icon from '../Icon';

// « Validateurs »: the circuit of approval (platform label + actor). The validator's name is shown
// once the backend has resolved it for the collaborator's entity.
export default function ValidatorsChain({ steps = [], validators = [] }) {
  return (
    <ol className="chain">
      {steps.map((s, i) => {
        const v = validators.find((x) => x.role === s.label || x.role === s.role);
        return (
          <li key={s.label} className="chain-item">
            <span className="chain-av" aria-hidden="true">
              <Icon name="profile" />
            </span>
            {v?.name && <span className="chain-name">{v.name}</span>}
            <span className="chain-role">{s.label}</span>
            {s.role && s.role !== s.label && <span className="chain-actor">{s.role}</span>}
            {i < steps.length - 1 && <span className="chain-line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
