import React from 'react';
import {
  BookOpen,
  Box,
  Compass,
  Eye,
  HelpCircle,
  Leaf,
  LogOut,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { useLanguage } from '../../../contexts';
import type { ProducerTab } from '../../../hooks';

interface ProducerHeaderProps {
  isTraining: boolean;
  userName?: string;
  activeTab: ProducerTab;
  onSelectTab: (tab: ProducerTab) => void;
  onOpenTour: () => void;
  onOpenAccessibility: () => void;
  onOpenHelpModal?: () => void;
  onOpenTutorial?: () => void;
  onRequestExit: () => void;
}

export const ProducerHeader: React.FC<ProducerHeaderProps> = ({
  isTraining,
  userName,
  activeTab,
  onSelectTab,
  onOpenTour,
  onOpenAccessibility,
  onOpenHelpModal,
  onOpenTutorial,
  onRequestExit,
}) => {
  const { t, language } = useLanguage();
  const displayUserName = userName?.trim() || (isTraining ? 'Aprendiz' : 'Produtor');

  return (
    <div className="sticky top-0 z-40">
      {isTraining && (
        <div
          data-tour="aprendiz-banner"
          className="bg-emerald-800 text-white px-4 sm:px-6 py-2.5 text-base sm:text-lg font-bold flex items-center justify-center gap-2.5 shadow-xs"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-200 shrink-0" aria-hidden="true" />
          <span className="text-[18px] font-bold text-center leading-tight">
            Você está no espaço de treino. Nada vai para o site público.
          </span>
        </div>
      )}

      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm transition-colors duration-500">
        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between h-16 px-3 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center border border-emerald-300 dark:border-emerald-700 shrink-0">
              <Leaf className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />
            </div>
            <div className="min-w-0">
              <span className="font-black text-sm text-stone-900 dark:text-white truncate block">
                {isTraining
                  ? language === 'pt'
                    ? 'Treino'
                    : 'Training'
                  : language === 'pt'
                    ? 'Minhas peças'
                    : 'My Pieces'}
              </span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 truncate block">
                {displayUserName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isTraining ? (
              <button
                type="button"
                onClick={onOpenTour}
                aria-label={language === 'pt' ? 'Abrir tour guiado passo a passo' : 'Open step-by-step guided tour'}
                className="h-11 px-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
                <span>Tour</span>
              </button>
            ) : (
              onOpenHelpModal && (
                <button
                  type="button"
                  onClick={onOpenHelpModal}
                  aria-label={language === 'pt' ? 'Pedir ajuda ao suporte' : 'Ask support for help'}
                  className="h-11 px-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span>{language === 'pt' ? 'Pedir ajuda' : 'Ask help'}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center border-2 border-emerald-300 dark:border-emerald-700 shrink-0">
                <Leaf className="w-7 h-7 text-emerald-800 dark:text-emerald-300" />
              </div>
              <div className="min-w-0">
                <span className="font-black text-xl lg:text-2xl tracking-tight text-stone-900 dark:text-white block leading-tight">
                  {t('brand.name')}
                </span>
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400 block truncate">
                  {isTraining
                    ? language === 'pt'
                      ? `${displayUserName} · Em treinamento`
                      : `${displayUserName} · In training`
                    : language === 'pt'
                      ? `${displayUserName} · Equipe de produção`
                      : `${displayUserName} · Production Team`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isTraining ? (
                <>
                    <button
                      type="button"
                      onClick={onOpenTour}
                      aria-label={language === 'pt' ? 'Abrir tour guiado passo a passo' : 'Open step-by-step guided tour'}
                      className="min-h-[48px] px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-700 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Compass className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
                      <span>{language === 'pt' ? 'Tour Guiado' : 'Guided Tour'}</span>
                    </button>
                    <button
                      type="button"
                      data-tour="aprendiz-accessibility"
                      onClick={onOpenAccessibility}
                      aria-label="Abrir opções de acessibilidade"
                      className="min-h-[48px] px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>Acessibilidade</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onOpenAccessibility}
                      aria-label={language === 'pt' ? 'Abrir opções de acessibilidade' : 'Open accessibility settings'}
                      title={language === 'pt' ? 'Acessibilidade' : 'Accessibility'}
                      className="min-h-[48px] px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <SlidersHorizontal className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>{language === 'pt' ? 'Acessibilidade' : 'Accessibility'}</span>
                    </button>

                    {onOpenHelpModal && (
                      <button
                        type="button"
                        onClick={onOpenHelpModal}
                        aria-label="Pedir ajuda ao suporte"
                        className="min-h-[48px] px-4 py-2.5 rounded-2xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <HelpCircle className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                        <span>Pedir ajuda</span>
                      </button>
                    )}

                    {onOpenTutorial && (
                      <button
                        type="button"
                        onClick={onOpenTutorial}
                        aria-label="Abrir guia da tela passo a passo"
                        className="min-h-[48px] px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                      <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>Guia da Tela</span>
                    </button>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={onRequestExit}
                aria-label="Sair da conta"
                className="min-h-[48px] px-4 py-2.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 py-2">
            <button
              type="button"
              onClick={() => onSelectTab('overview')}
              aria-label="Ir para Meus Produtos"
              className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Meus Produtos</span>
            </button>

            {!isTraining && (
              <button
                type="button"
                onClick={() => onSelectTab('contact')}
                aria-label="Configurar meu contato e WhatsApp"
                className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
                  activeTab === 'contact'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Meu Contato</span>
              </button>
            )}

            <button
              type="button"
              data-tour="aprendiz-catalog-tab"
              onClick={() => onSelectTab('catalog')}
              aria-label="Ver vitrine Rosa Mística"
              className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Vitrine Rosa Mística</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
