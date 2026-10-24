import { useRef, useState } from 'react';
import Icon from '../Icon';

// Drop zone « Cliquez ici, ou faites glisser un fichier pour le téléverser ». `files` is a list of
// file names (the API returns stored descriptors; the demo keeps the names).
export default function FileDrop({ id, label, files = [], onChange, multiple = false, accept, hint = 'Cliquez ici, ou faites glisser un fichier pour le téléverser.' }) {
  const ref = useRef(null);
  const [over, setOver] = useState(false);
  const add = (list) => {
    const names = Array.from(list || []).map((f) => f.name);
    if (!names.length) return;
    onChange(multiple ? [...files, ...names] : names.slice(0, 1));
  };
  const remove = (name) => onChange(files.filter((f) => f !== name));
  return (
    <div className="fld">
      {label && <label htmlFor={id}>{label}</label>}
      {files.map((name) => (
        <div className="upl has" key={name}>
          <span className="upl-btn">
            <Icon name="file" />
            <span className="upl-name">{name}</span>
          </span>
          <button type="button" className="rb" aria-label={`Retirer ${name}`} title="Retirer" onClick={() => remove(name)}>
            <Icon name="trash" />
          </button>
        </div>
      ))}
      {(multiple || files.length === 0) && (
        <button
          type="button"
          className={'drop' + (over ? ' over' : '')}
          onClick={() => ref.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            add(e.dataTransfer.files);
          }}
        >
          <input
            ref={ref}
            id={id}
            className="upl-input"
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => {
              add(e.target.files);
              e.target.value = '';
            }}
          />
          <Icon name="file-plus" />
          <span>{hint}</span>
        </button>
      )}
    </div>
  );
}
