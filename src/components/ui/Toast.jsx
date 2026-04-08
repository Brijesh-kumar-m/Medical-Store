import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

let toastId = 0;
const listeners = new Set();

export function showToast(message, type = 'success', duration = 3000) {
  const id = ++toastId;
  const toast = { id, message, type, duration };
  listeners.forEach((fn) => fn(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration);
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const icons = {
    success: <CheckCircle size={20} className="text-green-400 shrink-0" />,
    error: <AlertCircle size={20} className="text-red-400 shrink-0" />,
    warning: <AlertCircle size={20} className="text-amber-400 shrink-0" />,
    info: <Info size={20} className="text-blue-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    warning: 'border-amber-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-md mx-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`glass rounded-2xl px-4 py-3 flex items-center gap-3 toast-enter pointer-events-auto border ${borderColors[toast.type]}`}
        >
          {icons[toast.type]}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-surface-500 hover:text-white transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
