import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DEFAULT_TOAST_DURATION_MS = 4500;
const ERROR_TOAST_DURATION_MS = 7000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => clearTimeout(timerId));
      timersRef.current.clear();
    };
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    const duration = type === 'error' ? ERROR_TOAST_DURATION_MS : DEFAULT_TOAST_DURATION_MS;
    setToasts(prev => [...prev, { id, message, type }]);
    const timerId = setTimeout(() => {
      timersRef.current.delete(id);
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    timersRef.current.set(id, timerId);
  }, []);

  const removeToast = useCallback((id: number) => {
    const timerId = timersRef.current.get(id);
    if (timerId) {
      clearTimeout(timerId);
      timersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const closeLabel = language === 'pt' ? 'Fechar notificação' : 'Close notification';

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-24 right-3 left-3 sm:left-auto sm:right-6 md:bottom-6 z-[100] flex flex-col gap-2.5 max-w-md sm:w-full pointer-events-none no-print">
        {toasts.map(toast => (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
            aria-atomic="true"
            className={`pointer-events-auto flex items-center justify-between gap-3 pl-4 pr-2 py-2.5 rounded-2xl shadow-xl border-2 transition-colors motion-reduce:transition-none high-contrast:bg-white high-contrast:text-black high-contrast:border-black dark:high-contrast:bg-black dark:high-contrast:text-white dark:high-contrast:border-white ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-100'
                : toast.type === 'error'
                  ? 'bg-red-50 border-red-400 text-red-950 dark:bg-red-950 dark:border-red-700 dark:text-red-100'
                  : 'bg-stone-50 border-stone-300 text-stone-950 dark:bg-stone-900 dark:border-teal-600 dark:text-stone-100'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 py-1">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0 text-emerald-700 dark:text-emerald-300 high-contrast:text-current" aria-hidden="true" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0 text-red-700 dark:text-red-300 high-contrast:text-current" aria-hidden="true" />}
              {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-teal-700 dark:text-teal-300 high-contrast:text-current" aria-hidden="true" />}
              <span className="font-bold text-sm sm:text-base leading-snug">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors motion-reduce:transition-none shrink-0 cursor-pointer"
              aria-label={closeLabel}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
