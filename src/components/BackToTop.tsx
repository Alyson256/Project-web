import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../contexts';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    if (isDashboardRoute) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Aparece apenas ao chegar bem perto do final da página
      // Garante que a página seja longa o suficiente e o usuário esteja a menos de 380px do rodapé
      const isScrollable = docHeight > windowHeight + 250;
      const isNearEnd = scrollY + windowHeight >= docHeight - 380;

      setIsVisible(isScrollable && isNearEnd);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDashboardRoute]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (isDashboardRoute || !isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-5 right-4 md:bottom-6 md:right-6 z-[45] min-h-[48px] px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 rounded-2xl flex items-center gap-2 shadow-2xl border-2 border-stone-700/80 dark:border-stone-300 focus:outline-none focus:ring-4 focus:ring-stone-500/40 transition-all motion-reduce:transition-none active:scale-95 text-sm sm:text-base font-black cursor-pointer no-print animate-fade-in high-contrast:bg-black high-contrast:text-white high-contrast:border-white"
      aria-label={t('nav.back_to_top_aria', 'Voltar ao início da página')}
    >
      <ArrowUp className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span className="sm:hidden">{t('nav.back_to_top_short', 'Início')}</span>
      <span className="hidden sm:inline">{t('nav.back_to_top', 'Voltar ao início')}</span>
    </button>
  );
}
