import React from 'react';
import { Box, Eye, HelpCircle, Menu, MessageCircle } from 'lucide-react';
import type { ProducerTab } from '../../../hooks';

interface ProducerMobileNavProps {
  isTraining: boolean;
  activeTab: ProducerTab;
  onSelectTab: (tab: ProducerTab) => void;
  onOpenHelpModal?: () => void;
  onOpenMore: () => void;
}

export const ProducerMobileNav: React.FC<ProducerMobileNavProps> = ({
  isTraining,
  activeTab,
  onSelectTab,
  onOpenHelpModal,
  onOpenMore,
}) => {
  return (
    <nav
      aria-label="Navegação móvel"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-nav dark:bg-stone-900 border-t-2 border-stone-200 dark:border-stone-800 shadow-2xl min-h-[72px] sm:min-h-[68px] h-auto px-1 py-1 flex items-center justify-around"
    >
      <button
        type="button"
        onClick={() => onSelectTab('overview')}
        aria-label="Ir para Minhas peças"
        className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
          activeTab === 'overview' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        <Box className="w-5 h-5 shrink-0" />
        <span className="text-[14px] font-bold leading-tight mt-0.5 text-center break-words max-w-[80px]">
          Minhas peças
        </span>
      </button>

      {!isTraining && (
        <button
          type="button"
          onClick={() => onSelectTab('contact')}
          aria-label="Ir para Meu contato"
          className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
            activeTab === 'contact' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="text-[14px] font-bold leading-tight mt-0.5 text-center break-words max-w-[80px]">
            Meu contato
          </span>
        </button>
      )}

      {isTraining && (
        <button
          type="button"
          onClick={() => onSelectTab('catalog')}
          aria-label="Ver Vitrine Rosa Mística"
          className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
            activeTab === 'catalog' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Eye className="w-5 h-5 shrink-0" />
          <span className="text-[14px] font-bold leading-tight mt-0.5 text-center break-words max-w-[80px]">
            Vitrine
          </span>
        </button>
      )}

      {!isTraining && onOpenHelpModal && (
        <button
          type="button"
          onClick={onOpenHelpModal}
          aria-label="Pedir Ajuda"
          className="flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 text-stone-600 dark:text-stone-400 transition-colors"
        >
          <HelpCircle className="w-5 h-5 shrink-0" />
          <span className="text-[14px] font-bold leading-tight mt-0.5 text-center break-words max-w-[80px]">
            Pedir ajuda
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={onOpenMore}
        aria-label="Abrir mais opções"
        className="flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 text-stone-600 dark:text-stone-400 transition-colors"
      >
        <Menu className="w-5 h-5 shrink-0" />
        <span className="text-[14px] font-bold leading-tight mt-0.5 text-center">Mais</span>
      </button>
    </nav>
  );
};
