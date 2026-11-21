import { useRef } from 'react';
import { AlertTriangle, UserCheck } from 'lucide-react';
import { useFocusTrap } from '../../../hooks';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, modalRef, onCancel);

  if (!isOpen) return null;

  const isPositiveAction =
    (title || '').toLowerCase().includes('promover') ||
    (confirmText || '').toLowerCase().includes('promover') ||
    (title || '').toLowerCase().includes('treinamento') ||
    (confirmText || '').toLowerCase().includes('confirmar');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onCancel}></div>
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isPositiveAction
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400'
            }`}
          >
            {isPositiveAction ? <UserCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <h3 id="confirm-modal-title" className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
            {title}
          </h3>
        </div>
        <p className="text-stone-700 dark:text-stone-300 mb-8 font-medium text-[18px] leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            aria-label={cancelText || 'Não, voltar'}
            className="min-h-[56px] flex-1 px-6 py-3.5 rounded-2xl font-black text-stone-800 dark:text-stone-200 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors text-[18px] cursor-pointer"
          >
            {cancelText || 'Não, voltar'}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            aria-label={confirmText || 'Sim, promover'}
            className={`min-h-[56px] flex-1 px-6 py-3.5 rounded-2xl font-black text-white transition-all text-[18px] cursor-pointer shadow-md ${
              isPositiveAction ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {confirmText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
