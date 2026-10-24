import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);
  const timer = useRef();
  const notify = useCallback((msg) => {
    clearTimeout(timer.current);
    setMessage(msg);
    timer.current = setTimeout(() => setMessage(null), 2800);
  }, []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      {message && <Toast>{message}</Toast>}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
