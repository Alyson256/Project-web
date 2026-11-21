import { BookOpen, Box, Calendar as CalendarIcon, Menu } from 'lucide-react';
import { VisitorTab } from './VisitorHeader';

export interface VisitorMobileNavProps {
  activeTab: VisitorTab;
  onSelectTab: (tab: VisitorTab) => void;
  onOpenMore: () => void;
}

export function VisitorMobileNav({ activeTab, onSelectTab, onOpenMore }: VisitorMobileNavProps) {
  return (
    <nav
      aria-label="Navegação móvel"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-nav border-t-2 border-stone-200 dark:border-stone-800 shadow-2xl min-h-[72px] sm:min-h-[68px] h-auto px-1 py-1 flex items-center justify-around"
    >
      <button
        type="button"
        onClick={() => onSelectTab('vitrine')}
        aria-label="Ir para Vitrine"
        className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
          activeTab === 'vitrine' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        <Box className="w-5 h-5 shrink-0" />
        <span className="text-[14px] font-bold leading-tight mt-0.5 text-center break-words max-w-[80px]">
          Vitrine
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('agenda')}
        aria-label="Ir para Agenda"
        className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
          activeTab === 'agenda' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        <CalendarIcon className="w-5 h-5 shrink-0" />
        <span className="text-[14px] font-bold leading-tight mt-0.5 text-center break-words max-w-[80px]">
          Agenda
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('historia')}
        aria-label="Ir para História"
        className={`flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 transition-colors ${
          activeTab === 'historia' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        <BookOpen className="w-5 h-5 shrink-0" />
        <span className="text-[14px] font-bold leading-tight mt-0.5 text-center break-words max-w-[80px]">
          História
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenMore}
        aria-label="Abrir mais opções"
        className="flex-1 min-h-[64px] flex flex-col items-center justify-center p-1 text-stone-600 dark:text-stone-400 transition-colors"
      >
        <Menu className="w-5 h-5 shrink-0" />
        <span className="text-[14px] font-bold leading-tight mt-0.5 text-center">
          Mais
        </span>
      </button>
    </nav>
  );
}
