import React, { useRef, useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { useFocusTrap, usePWAInstall } from '../hooks';

interface PWAInstallButtonProps {
  variant?: 'header' | 'drawer';
  onAction?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  onAction,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(showIOSGuide, modalRef, () => setShowIOSGuide(false));

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    onAction?.();
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {variant === 'drawer' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className="min-h-[56px] px-5 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg flex items-center justify-between cursor-pointer shadow-sm transition-colors motion-reduce:transition-none high-contrast:bg-black high-contrast:text-white high-contrast:border-2 high-contrast:border-white"
        >
          <span className="flex items-center gap-2.5">
            <Download className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Instalar aplicativo</span>
          </span>
          <Smartphone className="w-5 h-5 shrink-0" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          className="min-h-[48px] px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white border-2 border-stone-300 dark:border-stone-700 font-black text-base flex items-center gap-2 transition-colors motion-reduce:transition-none cursor-pointer active:scale-95 whitespace-nowrap high-contrast:bg-white high-contrast:text-black high-contrast:border-black dark:high-contrast:bg-black dark:high-contrast:text-white dark:high-contrast:border-white"
          aria-label="Instalar aplicativo no aparelho"
        >
          <Download className="w-4 h-4 text-emerald-700 dark:text-emerald-400 high-contrast:text-current shrink-0" aria-hidden="true" />
          <span>Instalar app</span>
        </button>
      )}

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-[102] flex items-center justify-center bg-stone-900/75 backdrop-blur-sm p-4"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 p-6 sm:p-7 shadow-2xl border-2 border-stone-200 dark:border-stone-800 space-y-5 text-stone-900 dark:text-white high-contrast:bg-white high-contrast:text-black high-contrast:border-black dark:high-contrast:bg-black dark:high-contrast:text-white dark:high-contrast:border-white"
          >
            <div className="flex items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-6 h-6 text-emerald-700 dark:text-emerald-400 high-contrast:text-current shrink-0" aria-hidden="true" />
                <h3 id="ios-install-title" className="text-xl font-black">
                  Instalar no iPhone ou iPad
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="min-w-[44px] min-h-[44px] rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 high-contrast:text-current high-contrast:border-2 cursor-pointer"
                aria-label="Fechar orientações"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3 text-base sm:text-lg font-medium text-stone-700 dark:text-stone-300 high-contrast:text-current leading-relaxed list-decimal pl-5">
              <li>
                Toque no botão <strong className="inline-flex items-center gap-1 text-stone-900 dark:text-white high-contrast:text-current"><Share className="w-4 h-4 inline" aria-hidden="true" /> Compartilhar</strong> na barra do Safari.
              </li>
              <li>
                Role a lista para baixo e toque em <strong className="text-stone-900 dark:text-white high-contrast:text-current">Adicionar à Tela de Início</strong>.
              </li>
              <li>
                Confirme tocando em <strong className="text-stone-900 dark:text-white high-contrast:text-current">Adicionar</strong> no canto superior direito.
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full min-h-[52px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg transition-colors motion-reduce:transition-none cursor-pointer high-contrast:bg-black high-contrast:text-white high-contrast:border-2 high-contrast:border-black dark:high-contrast:bg-white dark:high-contrast:text-black"
            >
              Entendi, fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
