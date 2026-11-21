import { useRef } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Compass,
  Eye,
  LogOut,
  X,
} from 'lucide-react';
import { useLanguage } from '../../../contexts';
import { useFocusTrap } from '../../../hooks';

export interface TraineeGestorModalsProps {
  userName: string;
  isMoreOpen: boolean;
  onCloseMore: () => void;
  onOpenAccessibility: () => void;
  onOpenTour: () => void;
  onSelectApproveTab: () => void;
  onRequestExitFromMore: () => void;
  confirmExit: boolean;
  onCloseConfirmExit: () => void;
  onLogout: () => void;
  showCompletionModal: boolean;
  onCloseCompletionModal: () => void;
}

export function TraineeGestorModals({
  userName,
  isMoreOpen,
  onCloseMore,
  onOpenAccessibility,
  onOpenTour,
  onSelectApproveTab,
  onRequestExitFromMore,
  confirmExit,
  onCloseConfirmExit,
  onLogout,
  showCompletionModal,
  onCloseCompletionModal,
}: TraineeGestorModalsProps) {
  const { language, t } = useLanguage();
  const moreModalRef = useRef<HTMLDivElement>(null);
  const confirmExitRef = useRef<HTMLDivElement>(null);
  const completionModalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isMoreOpen, moreModalRef, onCloseMore);
  useFocusTrap(confirmExit, confirmExitRef, onCloseConfirmExit);
  useFocusTrap(showCompletionModal, completionModalRef, onCloseCompletionModal);

  return (
    <>
      {/* Modal / Painel "Mais": Outras opções, Guia e Sair */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseMore();
          }}
        >
          <div
            ref={moreModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="trainee-more-modal-title"
            className="bg-white dark:bg-stone-900 border-t-2 sm:border-2 border-stone-300 dark:border-stone-700 rounded-t-3xl sm:rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center font-black text-lg shrink-0">
                  {userName.charAt(0)}
                </div>
                <div>
                  <h3 id="trainee-more-modal-title" className="text-lg font-black text-stone-900 dark:text-white leading-tight">
                    {userName}
                  </h3>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    {t('roles.trainee_gestor')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseMore}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl cursor-pointer transition-colors"
                aria-label={t('common.close')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  onCloseMore();
                  onOpenAccessibility();
                }}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 text-left font-black text-base flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>{t('accessibility.title', 'Acessibilidade')}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onCloseMore();
                  onOpenTour();
                }}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-950 dark:text-amber-100 border-2 border-amber-300 dark:border-amber-700 text-left font-black text-base flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-6 h-6 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
                  <span>{language === 'pt' ? 'Tour Guiado (Passo a passo)' : 'Guided Tour (Step by step)'}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectApproveTab();
                  onCloseMore();
                }}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 text-left font-extrabold text-base flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>{language === 'pt' ? 'Aprovar peças de exemplo' : 'Approve sample pieces'}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  onCloseMore();
                  onRequestExitFromMore();
                }}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800 text-left font-black text-base flex items-center gap-3 cursor-pointer shadow-xs active:scale-95"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>{language === 'pt' ? 'Sair do Treino' : 'Exit Training'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmação de Saída */}
      {confirmExit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseConfirmExit();
          }}
        >
          <div
            ref={confirmExitRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="trainee-exit-modal-title"
            className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-700">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 id="trainee-exit-modal-title" className="text-2xl font-black text-stone-900 dark:text-white">
                {language === 'pt' ? 'Deseja sair?' : 'Do you want to exit?'}
              </h3>
            </div>
            <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
              {language === 'pt'
                ? 'Você será desconectado e retornará à tela inicial.'
                : 'You will be logged out and return to the home screen.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onCloseConfirmExit}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-[18px] hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-[18px] cursor-pointer shadow-sm active:scale-95"
              >
                {language === 'pt' ? 'Sim, sair' : 'Yes, log out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Conclusão do Treinamento Inicial */}
      {showCompletionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200 motion-reduce:animate-none"
          role="presentation"
        >
          <div
            ref={completionModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="trainee-gestor-complete-title"
            className="bg-white dark:bg-stone-900 border-2 border-emerald-400 dark:border-emerald-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-3">
              <h3
                id="trainee-gestor-complete-title"
                className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight"
              >
                Parabéns! Curso inicial concluído
              </h3>
              <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                Você completou todas as tarefas do ambiente de treino de gestão. Agora aguarde o retorno da Associação Julieta Barros para a liberação do seu acesso oficial.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onLogout}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-black text-[18px] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Sair do ambiente</span>
              </button>
              <button
                type="button"
                onClick={onCloseCompletionModal}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[18px] flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <span>Continuar testando</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
