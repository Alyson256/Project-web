import React from 'react';
import { Activity, Box, Camera, LayoutDashboard, Menu, Ticket } from 'lucide-react';
import type { AdmTabType } from '../../../hooks';

interface AdmMobileNavProps {
  isAdm: boolean;
  activeTab: AdmTabType;
  onSelectTab: (tab: AdmTabType) => void;
  onOpenMore: () => void;
}

export const AdmMobileNav: React.FC<AdmMobileNavProps> = ({
  isAdm,
  activeTab,
  onSelectTab,
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
        aria-label="Ir para Início"
        className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
          activeTab === 'overview' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 shrink-0" />
        <span className="text-[14px] font-bold leading-tight mt-0.5 text-center">Início</span>
      </button>

      {!isAdm ? (
        <>
          <button
            type="button"
            onClick={() => onSelectTab('catalog')}
            aria-label="Ir para Peças"
            className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
              activeTab === 'catalog' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Box className="w-5 h-5 shrink-0" />
            <span className="text-[14px] font-bold leading-tight mt-0.5 text-center">Peças</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('content')}
            aria-label="Ir para Textos e fotos"
            className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
              activeTab === 'content' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Camera className="w-5 h-5 shrink-0" />
            <span className="text-[14px] font-bold leading-tight mt-0.5 text-center break-words max-w-[80px]">
              Textos e fotos
            </span>
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onSelectTab('tech_tickets')}
            aria-label="Ir para Chamados"
            className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
              activeTab === 'tech_tickets' ? 'text-teal-600 dark:text-teal-400' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Ticket className="w-5 h-5 shrink-0" />
            <span className="text-[14px] font-bold leading-tight mt-0.5 text-center">Chamados</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('diagnostics')}
            aria-label="Ir para Sistema"
            className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
              activeTab === 'diagnostics' ? 'text-teal-600 dark:text-teal-400' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Activity className="w-5 h-5 shrink-0" />
            <span className="text-[14px] font-bold leading-tight mt-0.5 text-center">Sistema</span>
          </button>
        </>
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
