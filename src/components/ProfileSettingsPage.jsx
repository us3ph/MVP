import { useRef, useState } from 'react';
import Icon from './Icon';
import Select from './Select';
import DateField from './DateField';

const ENTITIES = [
  'Direction des Systèmes d’Information',
  'Direction Financière',
  'Direction des Ressources Humaines',
  'Recherche & Innovation',
  'Direction Académique',
];

// File picker: the whole box is the button (opens the file dialog); once chosen it shows the name and a remove action.
function FileField({ id, label, value, onChange, accept = '.pdf,.jpg,.jpeg,.png', hint }) {
  const ref = useRef(null);
  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      <div className={'upl' + (value ? ' has' : '')}>
        <input
          ref={ref}
          id={id}
          className="upl-input"
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0]?.name || '')}
        />
        <button type="button" className="upl-btn" onClick={() => ref.current?.click()}>
          <Icon name={value ? 'file' : 'upload'} />
          <span className="upl-name">{value || hint || 'Choisir un fichier'}</span>
        </button>
        {value && (
          <button type="button" className="rb" aria-label="Retirer le fichier" title="Retirer" onClick={() => onChange('')}>
            <Icon name="close" />
          </button>
        )}
      </div>
    </div>
  );
}

// macOS-style default user picture: white silhouette on a grey disc.
function DefaultAvatar() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <clipPath id="av-clip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
        <linearGradient id="av-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6d6db" />
          <stop offset="1" stopColor="#a6a6ae" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#av-bg)" />
      <g clipPath="url(#av-clip)" fill="#fff">
        <circle cx="32" cy="25" r="11" />
        <path d="M7 66c0-14.5 10.5-23 25-23s25 8.5 25 23z" />
      </g>
    </svg>
  );
}

function Section({ title, text, children }) {
  return (
    <section className="c formcard">
      <div className="form-head">
        <div>
          <div className="h" style={{ fontSize: 14 }}>
            {title}
          </div>
          <div className="sub">{text}</div>
        </div>
      </div>
      <div className="form">{children}</div>
    </section>
  );
}

let visaSeq = 1;

export default function ProfileSettingsPage({ onSave }) {
  const [f, setF] = useState({
    lastName: 'Nom',
    firstName: 'Prénom',
    email: 'nom.prenom@um6p.ma',
    entity: ENTITIES[0],
    photo: '',
    passportNum: '',
    passportExp: '',
    passportFile: '',
    cinNum: '',
    cinFile: '',
    phone: '',
    safar: '',
    signature: '',
    insuranceExp: '',
  });
  const [visas, setVisas] = useState([]);
  const set = (key) => (e) => setF({ ...f, [key]: e.target.value });
  const setVal = (key) => (v) => setF({ ...f, [key]: v });
  const photoRef = useRef(null);

  const addVisa = () => setVisas([...visas, { id: visaSeq++, country: '', number: '', expires: '' }]);
  const setVisa = (id, key, value) => setVisas(visas.map((v) => (v.id === id ? { ...v, [key]: value } : v)));
  const removeVisa = (id) => setVisas(visas.filter((v) => v.id !== id));

  return (
    <form
      className="settings"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...f, visas });
      }}
    >
      <Section title="Aperçu général sur votre profil" text="Photo, informations personnelles et entité d’affectation.">
        <div className="profile-top">
          <button
            type="button"
            className="avatar"
            aria-label="Changer la photo de profil"
            title="Changer la photo"
            onClick={() => photoRef.current?.click()}
          >
            <DefaultAvatar />
          </button>
          <div className="avatar-actions">
            <input
              ref={photoRef}
              className="upl-input"
              type="file"
              accept=".jpg,.jpeg,.png"
              aria-label="Photo de profil"
              onChange={(e) => setVal('photo')(e.target.files?.[0]?.name || '')}
            />
            <div className="fld-row">
              <button type="button" className="gbtn" onClick={() => photoRef.current?.click()}>
                {f.photo ? 'Changer la photo' : 'Ajouter une photo'}
              </button>
              {f.photo && (
                <button type="button" className="gbtn" onClick={() => setVal('photo')('')}>
                  Retirer
                </button>
              )}
            </div>
            <div className="avatar-hint">{f.photo || 'JPG ou PNG, 2 Mo maximum.'}</div>
          </div>
        </div>
        <div className="fld">
          <label htmlFor="p-last">Nom</label>
          <input id="p-last" value={f.lastName} onChange={set('lastName')} />
        </div>
        <div className="fld">
          <label htmlFor="p-first">Prénom</label>
          <input id="p-first" value={f.firstName} onChange={set('firstName')} />
        </div>
        <div className="fld">
          <label htmlFor="p-email">E-mail professionnel</label>
          <input id="p-email" type="email" value={f.email} onChange={set('email')} />
        </div>
        <div className="fld">
          <label htmlFor="p-entity">Entité d’affectation</label>
          <Select id="p-entity" value={f.entity} options={ENTITIES} onChange={setVal('entity')} />
        </div>
      </Section>

      <Section title="Passeport" text="Numéro, date de fin de validité et copie du document.">
        <div className="fld">
          <label htmlFor="p-pass">Numéro de passeport</label>
          <input id="p-pass" placeholder="Ex. : AB1234567" value={f.passportNum} onChange={set('passportNum')} />
        </div>
        <div className="fld">
          <label htmlFor="p-pass-exp">Date de fin de validité</label>
          <DateField id="p-pass-exp" value={f.passportExp} onChange={setVal('passportExp')} />
        </div>
        <div className="fld full">
          <FileField
            id="p-pass-file"
            label="Fichier correspondant"
            value={f.passportFile}
            onChange={setVal('passportFile')}
            hint="PDF ou image du passeport"
          />
        </div>
      </Section>

      <Section title="CIN (Carte d’Identité Nationale)" text="Numéro et copie de la carte.">
        <div className="fld">
          <label htmlFor="p-cin">Numéro de CIN</label>
          <input id="p-cin" placeholder="Ex. : AB123456" value={f.cinNum} onChange={set('cinNum')} />
        </div>
        <div className="fld">
          <FileField
            id="p-cin-file"
            label="Fichier correspondant"
            value={f.cinFile}
            onChange={setVal('cinFile')}
            hint="PDF ou image de la CIN"
          />
        </div>
      </Section>

      <Section title="Autres informations" text="Contact, fidélité, signature, visas et assurance voyage.">
        <div className="fld">
          <label htmlFor="p-phone">Téléphone</label>
          <input id="p-phone" type="tel" placeholder="+212 6 00 00 00 00" value={f.phone} onChange={set('phone')} />
        </div>
        <div className="fld">
          <label htmlFor="p-safar">Code Safar Flyer</label>
          <input id="p-safar" placeholder="Ex. : 123456789" value={f.safar} onChange={set('safar')} />
        </div>
        <div className="fld full">
          <FileField
            id="p-sign"
            label="Signature en PJ"
            value={f.signature}
            onChange={setVal('signature')}
            hint="Image de votre signature (PNG ou JPG)"
          />
        </div>

        <div className="visas">
          <div className="visas-head">
            <span className="visas-title">
              Visas
              {visas.length > 0 && <span className="pill pg">{visas.length}</span>}
            </span>
            <button type="button" className="gbtn" onClick={addVisa}>
              Ajouter un visa
            </button>
          </div>
          {visas.length === 0 && <div className="visa-empty">Aucun visa enregistré. Utilisez « Ajouter un visa » pour en ajouter un.</div>}
          {visas.map((v, i) => (
            <div className="visa-row" key={v.id}>
              <div className="fld">
                <label htmlFor={`v-country-${v.id}`}>Pays</label>
                <input
                  id={`v-country-${v.id}`}
                  placeholder="Ex. : France"
                  value={v.country}
                  onChange={(e) => setVisa(v.id, 'country', e.target.value)}
                />
              </div>
              <div className="fld">
                <label htmlFor={`v-num-${v.id}`}>Numéro</label>
                <input
                  id={`v-num-${v.id}`}
                  placeholder="Numéro du visa"
                  value={v.number}
                  onChange={(e) => setVisa(v.id, 'number', e.target.value)}
                />
              </div>
              <div className="fld">
                <label htmlFor={`v-exp-${v.id}`}>Date de fin de validité</label>
                <DateField id={`v-exp-${v.id}`} value={v.expires} onChange={(d) => setVisa(v.id, 'expires', d)} />
              </div>
              <button
                type="button"
                className="rb visa-rm"
                aria-label={`Retirer le visa ${i + 1}`}
                title="Retirer"
                onClick={() => removeVisa(v.id)}
              >
                <Icon name="trash" />
              </button>
            </div>
          ))}
        </div>

        <div className="fld">
          <label htmlFor="p-ins">Date de fin de validité de l’Assurance Voyage</label>
          <DateField id="p-ins" value={f.insuranceExp} onChange={setVal('insuranceExp')} />
        </div>
      </Section>

      <div className="settings-ft">
        <button type="button" className="gbtn lg" onClick={() => window.scrollTo?.(0, 0)}>
          Annuler
        </button>
        <button type="submit" className="go lg">
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}
