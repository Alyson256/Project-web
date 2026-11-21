import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { WifiOff, Wifi, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { useConnectivityStatus } from '../hooks';
import { useLanguage, useToast } from '../contexts';

export const OfflineIndicator: React.FC = () => {
  const {
    isOnline,
    mutationBlocked,
    servedFromCache,
    isChecking,
    justReconnected,
    checkConnection,
    clearReconnectedNotice,
  } = useConnectivityStatus();
  const { language } = useLanguage();
  const { addToast } = useToast();
  const location = useLocation();

  const [isDismissed, setIsDismissed] = useState(false);
  const previousOnlineRef = useRef<boolean>(isOnline);

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isPt = language === 'pt';

  // Notifica via toast e reabre o banner quando há transição real de conectividade ou bloqueio de envio
  useEffect(() => {
    const wasOnline = previousOnlineRef.current;

    if (wasOnline && !isOnline) {
      setIsDismissed(false);
      addToast(
        isPt
          ? 'Conexão perdida — Modo Offline ativado. Exibindo os dados salvos.'
          : 'Connection lost — Offline Mode enabled. Showing saved data.',
        'error'
      );
    } else if (!wasOnline && isOnline) {
      setIsDismissed(false);
      addToast(
        isPt
          ? 'Conexão restabelecida! Tudo sincronizado com a associação.'
          : 'Connection restored! Everything is synced.',
        'success'
      );
    }

    previousOnlineRef.current = isOnline;
  }, [isOnline, isPt, addToast]);

  // Se uma ação de salvamento falhar por falta de rede enquanto o banner estava minimizado, reexibe na hora
  useEffect(() => {
    if (!isOnline && mutationBlocked) {
      setIsDismissed(false);
      addToast(
        isPt
          ? 'Você está sem internet. Aguarde a conexão voltar para salvar esta alteração.'
          : 'You are offline. Wait for connection to return before saving.',
        'error'
      );
    }
  }, [isOnline, mutationBlocked, isPt, addToast]);

  if (isOnline && !justReconnected) {
    return null;
  }

  // Confirmação breve quando a internet volta
  if (isOnline && justReconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed top-3 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-1.5rem)] max-w-lg no-print animate-in fade-in duration-200 motion-reduce:animate-none"
      >
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-800 text-white px-4 py-3 shadow-2xl border-2 border-emerald-400">
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" aria-hidden="true" />
            <p className="text-sm sm:text-base font-black leading-snug">
              {isPt ? 'Conexão restabelecida com sucesso.' : 'Connection restored successfully.'}
            </p>
          </div>
          <button
            type="button"
            onClick={clearReconnectedNotice}
            aria-label={isPt ? 'Fechar aviso de conexão restabelecida' : 'Dismiss restored notice'}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center hover:bg-emerald-700/80 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  // Versão compacta se o usuário optar por recolher o aviso enquanto continua offline
  if (isDismissed) {
    return (
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[120] no-print">
        <button
          type="button"
          onClick={() => setIsDismissed(false)}
          className="min-h-[44px] px-4 py-2 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white border-2 border-amber-300 shadow-xl font-black text-sm flex items-center gap-2 cursor-pointer transition-colors"
        >
          <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{isPt ? 'Modo Offline · Ver detalhes' : 'Offline Mode · Details'}</span>
        </button>
      </div>
    );
  }

  const titleText = mutationBlocked
    ? isPt
      ? 'Ação não enviada: você está sem internet'
      : 'Action not sent: you are offline'
    : isPt
    ? 'Modo Offline — Sem conexão com a internet'
    : 'Offline Mode — No internet connection';

  const bodyText = mutationBlocked
    ? isPt
      ? 'Envios e edições precisam de internet para serem salvos. Assim que a rede voltar, tente novamente.'
      : 'Submissions and edits require internet access. Please try again once connection returns.'
    : isDashboard
    ? isPt
      ? 'Você pode consultar o conteúdo salvo no painel, mas envios e aprovações precisam de conexão.'
      : 'You can browse saved items in the dashboard, but submissions and approvals require internet.'
    : servedFromCache
    ? isPt
      ? 'Exibindo as peças salvas da Vitrine Rosa Mística até a sua internet voltar.'
      : 'Showing cached pieces from the showcase until your internet returns.'
    : isPt
    ? 'Algumas fotos ou atualizações da vitrine podem não carregar até a conexão retornar.'
    : 'Some showcase images or updates may not load until your connection returns.';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-1.5rem)] max-w-xl no-print animate-in fade-in duration-200 motion-reduce:animate-none"
    >
      <div
        className={`rounded-2xl px-4 py-3.5 shadow-2xl border-2 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          mutationBlocked
            ? 'bg-red-800 border-red-300'
            : 'bg-amber-800 border-amber-300'
        }`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0 mt-0.5">
            <WifiOff className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-black leading-snug">{titleText}</p>
            <p className="text-xs sm:text-sm font-medium text-white/90 leading-relaxed mt-0.5">
              {bodyText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => void checkConnection()}
            disabled={isChecking}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black text-xs sm:text-sm flex items-center gap-2 border border-white/30 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            {isChecking ? (
              <RefreshCw className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" />
            ) : (
              <Wifi className="w-4 h-4" aria-hidden="true" />
            )}
            <span>
              {isChecking
                ? isPt
                  ? 'Verificando...'
                  : 'Checking...'
                : isPt
                ? 'Tentar agora'
                : 'Retry'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label={isPt ? 'Minimizar aviso de modo offline' : 'Minimize offline notice'}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-black/15 hover:bg-black/25 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
