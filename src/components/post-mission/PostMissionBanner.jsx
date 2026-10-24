const STEPS = {
  1: { text: 'Envisagez-vous de procéder à une rétrocession ?', yes: 'Oui', no: 'Non' },
  2: { text: 'Veuillez ajouter votre compte rendu', yes: 'Ajouter', no: 'Ignorer' },
  3: { text: 'Avez-vous des frais à déclarer pour cette mission ?', yes: 'Oui', no: 'Non' },
};

export default function PostMissionBanner({ step, hint, onAnswer }) {
  if (!step) return null;
  const s = STEPS[step];
  return (
    <div className="qbar" role="status">
      <span className="qbar-n">{step}/3</span>
      <span className="qbar-text">
        {s.text}
        {hint && <small className="qbar-hint">{hint}</small>}
      </span>
      <span className="qbar-btns">
        {step === 2 ? (
          <>
            <button type="button" className="qbtn" onClick={() => onAnswer(step, false)}>
              {s.no}
            </button>
            <button type="button" className="qbtn" onClick={() => onAnswer(step, true)}>
              {s.yes}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="qbtn" onClick={() => onAnswer(step, true)}>
              {s.yes}
            </button>
            <button type="button" className="qbtn" onClick={() => onAnswer(step, false)}>
              {s.no}
            </button>
          </>
        )}
      </span>
    </div>
  );
}
