import { useState } from 'react';
import Modal from '../ui/Modal';
import FileDrop from '../ui/FileDrop';
import { TextArea } from '../ui/Field';

// « Compte rendu »: questionnaire (texte libre, case à cocher, choix multiple) with attachments.
export default function ReportModal({ questions = [], onSubmit, onClose, busy }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState([]);
  const q = questions[index];
  const last = index === questions.length - 1;
  const set = (value) => setAnswers((a) => ({ ...a, [q.id]: value }));
  const toggle = (opt) => {
    const cur = answers[q.id] || [];
    set(cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt]);
  };
  if (!q) return null;
  return (
    <Modal icon="list-check" title="Compte Rendu" subtitle="Afin d’ajouter votre compte rendu, vous devez d’abord répondre à ces questions." onClose={onClose} width={540}>
      <div className="quiz">
        <div className="quiz-n">
          Question {index + 1} sur {questions.length}
        </div>
        <div className="quiz-q">{q.text}</div>
        {q.type === 'text' ? (
          <TextArea rows={4} value={answers[q.id] || ''} onChange={(e) => set(e.target.value)} placeholder="Votre réponse" />
        ) : (
          <ul className="quiz-opts">
            {q.options.map((opt) => {
              const on = q.type === 'multi' ? (answers[q.id] || []).includes(opt) : answers[q.id] === opt;
              return (
                <li key={opt}>
                  <label className="opt">
                    <input type={q.type === 'multi' ? 'checkbox' : 'radio'} name={q.id} checked={on} onChange={() => (q.type === 'multi' ? toggle(opt) : set(opt))} />
                    <span className={'opt-mark' + (q.type === 'multi' ? ' sq' : '')} aria-hidden="true" />
                    {opt}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        <FileDrop id="report-files" files={files} onChange={setFiles} multiple />
        <div className="form-ft between">
          <button type="button" className="gbtn lg" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
            Retour
          </button>
          {last ? (
            <button type="button" className="go lg" disabled={busy} onClick={() => onSubmit({ answers, files })}>
              Terminer
            </button>
          ) : (
            <button type="button" className="go lg" onClick={() => setIndex((i) => i + 1)}>
              Suivant
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
