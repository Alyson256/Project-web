import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Menu, X, ArrowRight, Globe, SlidersHorizontal } from 'lucide-react';
import { useAuth, useLanguage, useTheme } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { useFocusTrap } from '../hooks';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  hasStory?: boolean;
  hasGallery?: boolean;
}

export function Header({ hasStory = false, hasGallery = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const { openAccessibility } = useTheme();
  const { role } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useFocusTrap(isMenuOpen, mobileDrawerRef, () => setIsMenuOpen(false));

  // Fecha o menu automaticamente apenas se a tela passar para desktop (xl+) e trava o fundo quando aberto
  useEffect(() => {
    if (!isMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleViewportChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsMenuOpen(false);
      }
    };
    mediaQuery.addEventListener('change', handleViewportChange);

    return () => {
      document.body.style.overflow = originalOverflow;
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Cabeçalho Público: exatamente 1 linha só, altura máxima 64px (h-16) */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 max-h-16 bg-surface-nav/95 backdrop-blur-md border-b-2 border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          
          {/* Nome curto da associação com ícone (uma linha, sem quebra) */}
          <a 
            href="#" 
            className="flex items-center gap-2 min-w-0 shrink focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-xl p-0.5"
            aria-label={`${t('brand.short', 'Julieta Barros')} - Página Inicial`}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center border-2 border-emerald-300 dark:border-emerald-700 shrink-0">
              <Leaf className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />
            </div>
            <span className="font-black text-sm sm:text-xl lg:text-2xl tracking-tight text-stone-900 dark:text-white truncate">
              {t('brand.short', 'Julieta Barros')}
            </span>
          </a>

          {/* Ações Mobile e Tablet (< xl): Seletor PT | EN (sm+), Menu e Entrar */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Seletor Visual de Idioma (PT | EN) visível a partir de sm; em telas menores fica acessível no topo do Menu */}
            <div 
              className="hidden sm:flex items-center rounded-xl bg-stone-100 dark:bg-stone-800 p-0.5 border-2 border-stone-300 dark:border-stone-700 shadow-xs min-h-[44px]"
              role="group" 
              aria-label={language === 'pt' ? 'Selecionar idioma' : 'Select language'}
            >
              <Globe className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 ml-1 mr-0.5 shrink-0" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`min-h-[40px] min-w-[44px] px-2 rounded-lg text-xs font-black transition-all motion-reduce:transition-none cursor-pointer flex items-center justify-center ${
                  language === 'pt'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
                aria-pressed={language === 'pt'}
                title="Português"
              >
                PT
              </button>
              <span className="text-stone-400 dark:text-stone-600 font-bold select-none text-xs px-0.5" aria-hidden="true">|</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`min-h-[40px] min-w-[44px] px-2 rounded-lg text-xs font-black transition-all motion-reduce:transition-none cursor-pointer flex items-center justify-center ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
                aria-pressed={language === 'en'}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Botão: Menu */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white border-2 border-stone-300 dark:border-stone-700 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-xs whitespace-nowrap"
              aria-label={isMenuOpen ? t('nav.fechar', 'Fechar') : t('nav.menu', 'Menu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-4 h-4 shrink-0" /> : <Menu className="w-4 h-4 shrink-0" />}
              <span>{t('nav.menu', 'Menu')}</span>
            </button>

            {/* Botão: Entrar (ou Painel se autenticado) */}
            <button
              type="button"
              onClick={() => navigate(role ? '/dashboard' : '/login')}
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-xs whitespace-nowrap"
              aria-label={role ? t('nav.painel', 'Painel') : t('nav.entrar', 'Entrar')}
            >
              <span>{role ? t('nav.painel', 'Painel') : t('nav.entrar', 'Entrar')}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* Navegação Desktop (xl+) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-5 shrink-0" aria-label="Navegação principal">
            <a 
              href="#vitrine" 
              className="text-base xl:text-lg font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              {t('nav.vitrine', 'Vitrine')}
            </a>

            <a 
              href="#agenda" 
              className="text-base xl:text-lg font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              {t('nav.agenda', 'Agenda do Espaço')}
            </a>

            {hasStory && (
              <a 
                href="#historia" 
                className="text-base xl:text-lg font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
              >
                {t('nav.historia', 'Nossa História')}
              </a>
            )}

            {hasGallery && (
              <a 
                href="#galeria" 
                className="text-base xl:text-lg font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
              >
                {t('nav.galeria', 'Galeria')}
              </a>
            )}

            <a 
              href="#como-chegar" 
              className="text-base xl:text-lg font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              {t('nav.como_chegar', 'Como Chegar')}
            </a>

            {/* Seletor Visual de Idioma Desktop (PT | EN) perto de Entrar */}
            <div 
              className="flex items-center rounded-xl bg-stone-100 dark:bg-stone-800 p-1 border-2 border-stone-300 dark:border-stone-700 shadow-xs"
              role="group" 
              aria-label={language === 'pt' ? 'Selecionar idioma' : 'Select language'}
            >
              <Globe className="w-4 h-4 text-stone-500 dark:text-stone-400 ml-1.5 mr-1 shrink-0" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`min-h-[44px] min-w-[44px] px-2.5 py-1 rounded-lg text-sm font-black transition-all motion-reduce:transition-none cursor-pointer flex items-center justify-center ${
                  language === 'pt'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
                aria-pressed={language === 'pt'}
                title="Português"
              >
                PT
              </button>
              <span className="text-stone-400 dark:text-stone-600 font-bold select-none text-xs px-0.5" aria-hidden="true">|</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`min-h-[44px] min-w-[44px] px-2.5 py-1 rounded-lg text-sm font-black transition-all motion-reduce:transition-none cursor-pointer flex items-center justify-center ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
                aria-pressed={language === 'en'}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Botão Acessibilidade integrado ao cabeçalho desktop */}
            <button
              type="button"
              onClick={openAccessibility}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white border-2 border-stone-300 dark:border-stone-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-xs shrink-0"
              aria-label={t('nav.acessibilidade', 'Acessibilidade')}
              title={t('nav.acessibilidade', 'Acessibilidade')}
            >
              <SlidersHorizontal className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            </button>

            {/* Botão Instalar App PWA (quando instalável ou iOS) */}
            <PWAInstallButton variant="header" />

            {/* Botão Entrar / Painel Desktop */}
            <button 
              type="button"
              onClick={() => navigate(role ? '/dashboard' : '/login')} 
              className="min-h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white px-5 xl:px-6 py-2.5 rounded-2xl font-black text-base xl:text-lg transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>{role ? t('nav.painel', 'Painel') : t('nav.entrar', 'Entrar')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Menu Aberto Mobile e Tablet (Gaveta Completa) */}
      {isMenuOpen && (
        <div
          className="fixed inset-x-0 top-16 bottom-0 z-[49] xl:hidden bg-stone-900/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            ref={mobileDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={language === 'pt' ? 'Menu de navegação' : 'Navigation menu'}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-nav border-b-2 border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-3" aria-label="Menu móvel">
              {/* Seletor de Idioma dentro do Menu Móvel */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 mb-1">
                <div className="flex items-center gap-2.5 text-stone-900 dark:text-white font-black text-base">
                  <Globe className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>{language === 'pt' ? 'Idioma do site' : 'Site language'}</span>
                </div>
                <div className="flex items-center rounded-xl bg-stone-100 dark:bg-stone-900 p-1 border-2 border-stone-300 dark:border-stone-700 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setLanguage('pt')}
                    aria-pressed={language === 'pt'}
                    className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg text-sm font-black transition-all motion-reduce:transition-none cursor-pointer flex items-center justify-center ${
                      language === 'pt'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                  <span className="text-stone-300 dark:text-stone-600 px-1 font-bold text-xs select-none">|</span>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    aria-pressed={language === 'en'}
                    className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg text-sm font-black transition-all motion-reduce:transition-none cursor-pointer flex items-center justify-center ${
                      language === 'en'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
              <a
                href="#vitrine"
                onClick={() => setIsMenuOpen(false)}
                className="min-h-[56px] px-5 py-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-black text-lg flex items-center justify-between"
              >
                <span>{t('nav.vitrine', 'Vitrine de Peças')}</span>
                <ArrowRight className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </a>

              <a
                href="#agenda"
                onClick={() => setIsMenuOpen(false)}
                className="min-h-[56px] px-5 py-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-black text-lg flex items-center justify-between"
              >
                <span>{t('nav.agenda', 'Agenda do Espaço')}</span>
                <ArrowRight className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </a>

              {hasStory && (
                <a
                  href="#historia"
                  onClick={() => setIsMenuOpen(false)}
                  className="min-h-[56px] px-5 py-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-black text-lg flex items-center justify-between"
                >
                  <span>{t('nav.historia', 'Nossa História')}</span>
                  <ArrowRight className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </a>
              )}

              {hasGallery && (
                <a
                  href="#galeria"
                  onClick={() => setIsMenuOpen(false)}
                  className="min-h-[56px] px-5 py-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-black text-lg flex items-center justify-between"
                >
                  <span>{t('nav.galeria', 'Galeria')}</span>
                  <ArrowRight className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </a>
              )}

              <a
                href="#como-chegar"
                onClick={() => setIsMenuOpen(false)}
                className="min-h-[56px] px-5 py-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-black text-lg flex items-center justify-between"
              >
                <span>{t('nav.como_chegar', 'Como Chegar')}</span>
                <ArrowRight className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </a>

              {/* Botão Acessibilidade dentro do menu móvel */}
              <button
                type="button"
                onClick={() => { setIsMenuOpen(false); openAccessibility(); }}
                className="min-h-[56px] px-5 py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 border-2 border-emerald-400 dark:border-emerald-700 font-black text-lg flex items-center justify-between cursor-pointer"
              >
                <span>{t('nav.acessibilidade', 'Acessibilidade')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <PWAInstallButton variant="drawer" onAction={() => setIsMenuOpen(false)} />

              {/* Botão Fechar Menu */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="min-h-[56px] px-5 py-3.5 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-black text-base flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <X className="w-5 h-5" />
                <span>{t('nav.fechar', 'Fechar')}</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
