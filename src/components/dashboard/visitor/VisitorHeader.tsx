import { Bell, BookOpen, Box, Calendar as CalendarIcon, HelpCircle, Leaf, LogOut, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../../../contexts';

export type VisitorTab = 'vitrine' | 'agenda' | 'historia' | 'avisos';

export interface VisitorHeaderProps {
  activeTab: VisitorTab;
  onSelectTab: (tab: VisitorTab) => void;
  hasRealAnnouncements: boolean;
  associationWhatsappUrl: string;
  onOpenAccessibility?: () => void;
  onOpenTutorial?: () => void;
  onRequestExit: () => void;
}

export function VisitorHeader({
  activeTab,
  onSelectTab,
  hasRealAnnouncements,
  associationWhatsappUrl,
  onOpenAccessibility,
  onOpenTutorial,
  onRequestExit,
}: VisitorHeaderProps) {
  const { t, language } = useLanguage();

  return (
    <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm sticky top-0 z-40 transition-colors">
      <div className="flex md:hidden items-center justify-between h-16 px-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center border border-emerald-300 dark:border-emerald-700 shrink-0">
            <Leaf className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />
          </div>
          <div className="min-w-0">
            <span className="font-black text-sm text-stone-900 dark:text-white truncate block">
              {language === 'pt' ? 'Visitante' : 'Visitor'}
            </span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 truncate block">
              {t('brand.name')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={associationWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={language === 'pt' ? 'Dúvidas sobre o espaço ou eventos da associação' : 'Questions about the space or events'}
            aria-label={
              language === 'pt'
                ? 'Entrar em contato com a associação pelo WhatsApp para dúvidas sobre o espaço ou eventos'
                : 'Contact the association via WhatsApp for space or event questions'
            }
            className="h-11 px-3 rounded-xl border border-emerald-600 dark:border-emerald-500 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-white shrink-0" />
            <span>{language === 'pt' ? 'Contato' : 'Contact'}</span>
          </a>

          {onOpenTutorial && (
            <button
              type="button"
              onClick={onOpenTutorial}
              aria-label={language === 'pt' ? 'Abrir guia do visitante' : 'Open visitor guide'}
              className="h-11 px-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>{language === 'pt' ? 'Pedir ajuda' : 'Ask help'}</span>
            </button>
          )}
        </div>
      </div>

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
              <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400 block">
                {t('brand.tagline', 'Espaço Cultural & Ateliê de Artesanato Comunitário')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 lg:gap-3 shrink-0">
            <a
              href={associationWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={language === 'pt' ? 'Dúvidas sobre o espaço, visitas ou eventos da associação' : 'Questions about space, visits, or events'}
              aria-label={
                language === 'pt'
                  ? 'Entrar em contato com a associação pelo WhatsApp para dúvidas sobre o espaço ou eventos (abre em nova janela)'
                  : 'Contact the association via WhatsApp about space or events (opens in a new window)'
              }
              className="min-h-[48px] px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs border border-emerald-600 dark:border-emerald-500 transition-colors active:scale-95"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>{language === 'pt' ? 'Entrar em contato com a associação' : 'Contact the association'}</span>
            </a>

            {onOpenAccessibility && (
              <button
                type="button"
                onClick={onOpenAccessibility}
                aria-label={language === 'pt' ? 'Abrir opções de acessibilidade' : 'Open accessibility settings'}
                title={language === 'pt' ? 'Acessibilidade' : 'Accessibility'}
                className="min-h-[48px] px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white border-2 border-stone-300 dark:border-stone-700 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                <span>{language === 'pt' ? 'Acessibilidade' : 'Accessibility'}</span>
              </button>
            )}

            {onOpenTutorial && (
              <button
                type="button"
                onClick={onOpenTutorial}
                aria-label={language === 'pt' ? 'Abrir guia do visitante passo a passo' : 'Open step-by-step visitor guide'}
                className="min-h-[48px] px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>{language === 'pt' ? 'Guia da Tela' : 'Screen Guide'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onRequestExit}
              aria-label="Sair da conta"
              className="min-h-[48px] px-4 py-2.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 py-2">
          <button
            type="button"
            onClick={() => onSelectTab('vitrine')}
            className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
              activeTab === 'vitrine'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Box className="w-4 h-4 shrink-0" />
            <span>Vitrine</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('agenda')}
            className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
              activeTab === 'agenda'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4 shrink-0" />
            <span>Agenda</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('historia')}
            className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
              activeTab === 'historia'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>História</span>
          </button>

          {hasRealAnnouncements && (
            <button
              type="button"
              onClick={() => onSelectTab('avisos')}
              className={`min-h-[44px] px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === 'avisos'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Avisos</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
