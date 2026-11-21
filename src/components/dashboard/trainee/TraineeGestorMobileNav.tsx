import { Camera, Edit2, Menu, Sparkles } from 'lucide-react';
import { TraineeGestorTab } from './TraineeGestorOverviewTab';

export interface TraineeGestorMobileNavProps {
  activeTab: TraineeGestorTab;
  onSelectTab: (tab: TraineeGestorTab) => void;
  onOpenMore: () => void;
}

export function TraineeGestorMobileNav({
  activeTab,
  onSelectTab,
  onOpenMore,
}: TraineeGestorMobileNavProps) {
  return (
    <nav
      aria-label="Navegação móvel"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-nav border-t-2 border-stone-200 dark:border-stone-800 shadow-2xl min-h-[68px] h-auto px-1 py-1 flex items-center justify-around"
    >
      <button
        type="button"
        onClick={() => onSelectTab('inicio')}
        aria-label="Ir para Início"
        className={`flex-1 min-h-[60px] flex flex-col items-center justify-center p-1 transition-colors ${
          activeTab === 'inicio' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        <Sparkles className="w-5 h-5 shrink-0" />
        <span className="text-[13px] font-black leading-tight mt-0.5 text-center">Início</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('textos')}
        aria-label="Ir para Textos"
        className={`flex-1 min-h-[60px] flex flex-col items-center justify-center p-1 transition-colors ${
          activeTab === 'textos' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        <Edit2 className="w-5 h-5 shrink-0" />
        <span className="text-[13px] font-black leading-tight mt-0.5 text-center">Textos</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('midia')}
        aria-label="Ir para Fotos e vídeos"
        className={`flex-1 min-h-[60px] flex flex-col items-center justify-center p-1 transition-colors ${
          activeTab === 'midia' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        <Camera className="w-5 h-5 shrink-0" />
        <span className="text-[13px] font-black leading-tight mt-0.5 text-center">Fotos e vídeos</span>
      </button>

      <button
        type="button"
        onClick={onOpenMore}
        aria-label="Abrir mais opções"
        className="flex-1 min-h-[60px] flex flex-col items-center justify-center p-1 text-stone-600 dark:text-stone-400 transition-colors"
      >
        <Menu className="w-5 h-5 shrink-0" />
        <span className="text-[13px] font-black leading-tight mt-0.5 text-center">Mais</span>
      </button>
    </nav>
  );
}
