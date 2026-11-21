import { Camera, CheckCircle2, Compass, Edit2, Eye, Leaf, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../contexts';
import { TraineeGestorTab } from './TraineeGestorOverviewTab';

export interface TraineeGestorHeaderProps {
  userName: string;
  activeTab: TraineeGestorTab;
  onSelectTab: (tab: TraineeGestorTab) => void;
  onOpenTour: () => void;
  onOpenAccessibility: () => void;
  onRequestExit: () => void;
}

export function TraineeGestorHeader({
  userName,
  activeTab,
  onSelectTab,
  onOpenTour,
  onOpenAccessibility,
  onRequestExit,
}: TraineeGestorHeaderProps) {
  const { language, t } = useLanguage();

  return (
    <div className="sticky top-0 z-40">
      <div
        data-tour="gestor-banner"
        className="bg-emerald-800 text-white px-3 sm:px-6 py-2 text-xs sm:text-base font-bold flex items-center justify-center gap-2 shadow-xs"
      >
        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200 shrink-0" aria-hidden="true" />
        <span className="text-center leading-tight truncate">
          {t('dash.training_banner', 'Você está no espaço de treino. Nada vai para o site público.')}
        </span>
      </div>

      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
        <div className="flex md:hidden items-center justify-between h-16 px-3 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center border border-emerald-300 dark:border-emerald-700 shrink-0">
              <Leaf className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />
            </div>
            <div className="min-w-0">
              <span className="font-black text-sm text-stone-900 dark:text-white truncate block">
                {language === 'pt' ? 'Treino Gestão' : 'Trainee Mgmt'}
              </span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 truncate block">
                {userName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenTour}
              aria-label={language === 'pt' ? 'Abrir tour guiado passo a passo' : 'Open step-by-step guided tour'}
              className="h-11 px-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
              <span>{language === 'pt' ? 'Tour' : 'Tour'}</span>
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center border-2 border-emerald-300 dark:border-emerald-700 shrink-0">
                <Leaf className="w-7 h-7 text-emerald-800 dark:text-emerald-300" />
              </div>
              <div>
                <span className="font-black text-xl lg:text-2xl tracking-tight text-stone-900 dark:text-white block leading-tight">
                  Associação Julieta Barros
                </span>
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400 block truncate">
                  Treino de Gestão · {userName} (Aprendiz)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
                data-tour="gestor-accessibility"
                onClick={onOpenAccessibility}
                aria-label={t('accessibility.title', 'Acessibilidade')}
                className="min-h-[48px] px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Eye className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>{t('accessibility.title', 'Acessibilidade')}</span>
              </button>

              <button
                type="button"
                onClick={onRequestExit}
                aria-label={t('dash.logout_btn', 'Sair')}
                className="min-h-[48px] px-4 py-2.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('dash.logout_btn', 'Sair')}</span>
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 py-2">
            <button
              type="button"
              onClick={() => onSelectTab('inicio')}
              className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === 'inicio'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('dash.tab_home', 'Início')}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('textos')}
              className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === 'textos'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Edit2 className="w-4 h-4" />
              <span>{language === 'pt' ? 'Textos do site' : 'Site Texts'}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('midia')}
              className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === 'midia'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{language === 'pt' ? 'Fotos e vídeos' : 'Photos & Videos'}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('aprovar')}
              className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === 'aprovar'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('dash.tab_approve', 'Aprovar peças')}</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
