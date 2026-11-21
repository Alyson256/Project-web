import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { UserRole } from '../../contexts';
import { ROLE_GUIDE_DATA } from './guideSteps';
import { Volume2, VolumeX, ArrowRight, ArrowLeft, Check, X, ShieldCheck } from 'lucide-react';
import { useFocusTrap } from '../../hooks';

interface RoleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

export function RoleGuideModal({ isOpen, onClose, role }: RoleGuideModalProps) {
  const roleKey = role || 'visitante';
  const guideData = ROLE_GUIDE_DATA[roleKey] || ROLE_GUIDE_DATA.visitante;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const handleCloseWithStop = useCallback(() => {
    stopSpeaking();
    onClose();
  }, [stopSpeaking, onClose]);

  useFocusTrap(isOpen, containerRef, handleCloseWithStop);

  // Reinicia o passo quando o cargo ou o modal mudam
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      stopSpeaking();
    }
  }, [isOpen, roleKey, stopSpeaking]);

  // Cancela qualquer narração de voz ao fechar
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const totalSteps = guideData.steps.length;
  const currentStep = guideData.steps[currentStepIndex] || guideData.steps[0];

  // Lê apenas a frase do passo atual, sem repetições
  const handleToggleSpeak = () => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentStep.phrase);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.88; // Cadência amigável e acolhedora para idosos
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    stopSpeaking();
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    stopSpeaking();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleDismiss = () => {
    stopSpeaking();
    localStorage.setItem(`guide_dismissed_${roleKey}`, 'true');
    onClose();
  };

  const handleComplete = () => {
    stopSpeaking();
    localStorage.setItem(`guide_dismissed_${roleKey}`, 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div 
        ref={containerRef}
        id="guia-container"
        className="relative bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
      >
        
        {/* Faixa Fina do Topo: Mensagem de tranquilidade para aprendizes */}
        {guideData.hasPeaceBanner && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/60 px-4 sm:px-5 py-2 text-emerald-900 dark:text-emerald-200 text-sm sm:text-base font-bold flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Nada vai para a internet: este é um espaço seguro de treino.</span>
          </div>
        )}

        {/* Cabeçalho Fixo do Guia com Botão de Fechar sempre visível */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-white dark:bg-stone-900 z-10 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400">
              Passo {currentStep.stepNumber} de {totalSteps} · {guideData.badgeLabel}
            </div>
            <h2 id="guide-title" className="text-lg sm:text-2xl font-black text-stone-900 dark:text-white leading-tight truncate">
              {guideData.roleName}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Fechar guia"
            className="min-h-[48px] px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center gap-1.5 font-bold text-base transition-colors cursor-pointer shrink-0 border border-stone-300 dark:border-stone-700"
          >
            <X className="w-5 h-5 shrink-0" />
            <span>Fechar</span>
          </button>
        </div>

        {/* Área rolável: Barra de Passos e Conteúdo do Passo Atual */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {/* Barra de Passos */}
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5" role="tablist" aria-label="Navegação entre passos do guia">
              {guideData.steps.map((step, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isCompleted = idx < currentStepIndex;
                return (
                  <button
                    key={step.stepNumber}
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      setCurrentStepIndex(idx);
                    }}
                    className={`min-h-[44px] px-3 py-1.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer border-2 ${
                      isCurrent
                        ? 'bg-emerald-700 border-emerald-800 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                        : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                    aria-selected={isCurrent}
                    aria-label={`Ir para o Passo ${step.stepNumber}: ${step.actionTitle}`}
                  >
                    <span className={`w-5 h-5 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                      isCurrent 
                        ? 'bg-white text-emerald-800' 
                        : isCompleted 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                    }`}>
                      {isCompleted ? <Check className="w-3 h-3" /> : step.stepNumber}
                    </span>
                    <span>Passo {step.stepNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título e Explicação do Passo */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
              {currentStep.actionTitle}
            </h3>
            
            <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
              {currentStep.phrase}
            </p>
          </div>

          {/* Dica */}
          {currentStep.tip && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80">
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                {currentStep.tip}
              </p>
            </div>
          )}

          {/* Botão de Ouvir Voz */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleToggleSpeak}
              className={`min-h-[56px] px-5 py-3 rounded-2xl font-black text-base flex items-center gap-2.5 transition-all cursor-pointer border-2 ${
                isSpeaking
                  ? 'bg-amber-600 border-amber-700 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5 shrink-0" />
                  <span>Parar</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
                  <span>Ouvir</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rodapé Fixo do Guia com Navegação */}
        <div className="p-3.5 sm:p-4 bg-stone-50 dark:bg-stone-950/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`min-h-[56px] px-4 sm:px-5 py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-colors flex-1 sm:flex-initial ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-stone-400 dark:text-stone-600'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer border border-stone-300 dark:border-stone-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            <span>Voltar</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="min-h-[56px] px-5 sm:px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Concluir Guia' : 'Próximo passo'}</span>
            {currentStepIndex === totalSteps - 1 ? (
              <Check className="w-5 h-5 shrink-0" />
            ) : (
              <ArrowRight className="w-5 h-5 shrink-0" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
