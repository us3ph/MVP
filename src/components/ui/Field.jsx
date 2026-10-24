import { forwardRef } from 'react';
import clsx from 'clsx';

// Form field: label (with the red * of required fields), the control, and the validation message.
export function Field({ label, htmlFor, required, error, hint, full, className, children }) {
  return (
    <div className={clsx('fld', full && 'full', error && 'err', className)}>
      {label && (
        <label htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="req" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <div className="fld-err" role="alert">
          {error}
        </div>
      ) : (
        hint && <div className="fld-hint">{hint}</div>
      )}
    </div>
  );
}

export const TextArea = forwardRef(function TextArea({ rows = 3, ...props }, ref) {
  return <textarea ref={ref} rows={rows} {...props} />;
});

// Section title inside a form card (« Objet de la mission », « Attentes »…).
export function FormSection({ title, extra, children }) {
  return (
    <div className="fsec">
      <div className="fsec-hd">
        <span className="fsec-title">{title}</span>
        {extra}
      </div>
      <div className="form">{children}</div>
    </div>
  );
}
