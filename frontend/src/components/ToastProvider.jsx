import { useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import '../toast.css';

let toastFn = null;

export const toast = {
  success: (msg) => toastFn?.('success', msg),
  error: (msg) => toastFn?.('error', msg),
  info: (msg) => toastFn?.('info', msg),
};

let idCounter = 0;

const ICONS = {
  success: <CheckCircle2 size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    toastFn = addToast;
    return () => { toastFn = null; };
  }, [addToast]);

  return (
    <>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {ICONS[t.type]}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="ml-2 opacity-60 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ToastProvider;
