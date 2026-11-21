import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../contexts';
import { useFocusTrap } from '../../../hooks';

export function InactivityTracker({ role, logout }: { role: string | null; logout: () => void }) {
  const { t } = useLanguage();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const warningRef = useRef<HTMLDivElement>(null);
  const showWarningRef = useRef(showWarning);
  const logoutRef = useRef(logout);

  showWarningRef.current = showWarning;
  logoutRef.current = logout;

  const handleContinue = useCallback(() => {
    setShowWarning(false);
    setCountdown(60);
  }, []);

  useFocusTrap(showWarning, warningRef, handleContinue);

  useEffect(() => {
    if (!role || role === 'visitante') {
      setShowWarning(false);
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;

    const scheduleWarning = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setCountdown(60);
        setShowWarning(true);
      }, 15 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (!showWarningRef.current) {
        scheduleWarning();
      }
    };

    events.forEach((e) => document.addEventListener(e, handleActivity, { passive: true }));
    scheduleWarning();

    return () => {
      events.forEach((e) => document.removeEventListener(e, handleActivity));
      if (timeout) clearTimeout(timeout);
    };
  }, [role]);

  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          logoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={handleContinue} />
      <div
        ref={warningRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="inactivity-modal-title"
        className="relative bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in duration-200"
      >
        <div className="flex items-center gap-4 mb-4 text-amber-600 dark:text-amber-500">
          <AlertTriangle className="w-8 h-8 shrink-0" />
          <h3 id="inactivity-modal-title" className="text-xl font-bold text-stone-900 dark:text-white">
            {t('dash.aviso_inatividade')}
          </h3>
        </div>
        <p className="text-stone-600 dark:text-stone-400 mb-6 font-medium text-lg">
          Você está inativo há algum tempo. Por segurança, sua sessão será encerrada em{' '}
          <strong className="text-red-600 dark:text-red-400">{countdown}s</strong>.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 min-h-[48px] px-5 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors text-lg cursor-pointer"
          >
            Continuar Logado
          </button>
        </div>
      </div>
    </div>
  );
}
