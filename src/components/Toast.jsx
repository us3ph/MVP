import Icon from './Icon';

export default function Toast({ children }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <Icon name="info" />
      {children}
    </div>
  );
}
