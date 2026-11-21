import React from 'react';
import { ArrowRight, Sparkles, CalendarDays } from 'lucide-react';
import { useLanguage } from '../../contexts';

export function LandingHero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32 bg-stone-50 dark:bg-stone-950 transition-colors">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
          {t('hero.title', 'Associação Julieta Barros')}
        </h1>

        <p className="mt-8 text-2xl sm:text-3xl text-stone-700 dark:text-stone-300 max-w-3xl mx-auto font-medium leading-relaxed">
          {t('hero.subtitle', 'Arte feita à mão no Rio Grande do Norte pelo Departamento de Vendas Rosa Mística. Conheça e valorize as peças criadas por artesãos e mestres da nossa terra.')}
        </p>

        {/* Botões de Ação Principal (Mínimo 56px de altura, espaçamento de 12px, foco claro) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <a
            href="#vitrine"
            className="w-full sm:w-auto min-h-[56px] px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xl font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-6 h-6 shrink-0" />
            <span>{t('hero.btn_vitrine', 'Ver Peças da Vitrine')}</span>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </a>
          <a
            href="#agenda"
            className="w-full sm:w-auto min-h-[56px] px-8 py-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white text-xl font-bold rounded-2xl border-2 border-stone-300 dark:border-stone-700 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-95"
          >
            <CalendarDays className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{t('hero.btn_agenda', 'Ver Agenda do Espaço')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
