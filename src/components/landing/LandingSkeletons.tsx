import React from 'react';
import { useLanguage } from '../../contexts';

const SHOWCASE_SKELETON_COUNT = 6;
const AGENDA_SKELETON_COUNT = 2;

export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-sm border-2 border-stone-200 dark:border-stone-800 high-contrast:border-current flex flex-col"
    >
      {/* Área da Imagem (mesma altura h-64 sm:h-72 do card real) */}
      <div className="relative h-64 sm:h-72 bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none">
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="h-8 w-24 rounded-full bg-stone-300/90 dark:bg-stone-700" />
          <div className="h-8 w-24 rounded-full bg-stone-300/90 dark:bg-stone-700" />
        </div>
      </div>

      {/* Corpo do Cartão (p-6 sm:p-8 e espaçamentos idênticos ao card real) */}
      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Título (2 linhas equivalentes a text-2xl) */}
          <div className="space-y-2 mb-2">
            <div className="h-7 w-4/5 rounded-lg bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
            <div className="h-7 w-1/2 rounded-lg bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
          </div>

          {/* Técnica */}
          <div className="h-5 w-3/5 rounded-lg bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none mb-3" />

          {/* Preço */}
          <div className="h-9 w-32 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none mb-6" />
        </div>

        {/* Mini perfil do artesão */}
        <div className="flex items-center justify-between gap-4 mb-6 border-t border-stone-100 dark:border-stone-800 pt-5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-800 shrink-0 animate-pulse motion-reduce:animate-none" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-16 rounded bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
              <div className="h-5 w-28 rounded bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
            </div>
          </div>
          <div className="h-5 w-24 rounded bg-stone-200 dark:bg-stone-800 shrink-0 animate-pulse motion-reduce:animate-none" />
        </div>

        {/* Botão Principal (min-h-[56px]) e linha auxiliar */}
        <div className="space-y-2 pt-1">
          <div className="w-full min-h-[56px] rounded-2xl bg-stone-200 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 high-contrast:border-current animate-pulse motion-reduce:animate-none" />
          <div className="h-4 w-4/5 mx-auto rounded bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}

export function LandingShowcaseSkeleton() {
  const { t } = useLanguage();
  const loadingLabel = t('vitrine.loading_aria', 'Carregando peças da vitrine...');

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={loadingLabel}
      className="space-y-10 sm:space-y-12"
    >
      <span className="sr-only">{loadingLabel}</span>

      {/* Esqueleto da Barra de Busca e Filtros */}
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6" aria-hidden="true">
        <div className="h-[56px] w-full rounded-2xl bg-stone-200 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 high-contrast:border-current animate-pulse motion-reduce:animate-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 high-contrast:border-current shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="h-[44px] w-24 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
            <div className="h-[44px] w-28 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
            <div className="h-[44px] w-24 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-800 pt-3 sm:pt-0 sm:pl-6">
            <div className="h-5 w-16 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
            <div className="h-[42px] w-full sm:w-40 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
      </div>

      {/* Grid de 6 Cartões Esqueleto (mesma proporção da Vitrine real) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
        {Array.from({ length: SHOWCASE_SKELETON_COUNT }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function LandingAgendaSkeleton() {
  const { t } = useLanguage();
  const loadingLabel = t('agenda.loading_aria', 'Carregando programação do espaço...');

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={loadingLabel}
    >
      <span className="sr-only">{loadingLabel}</span>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch" aria-hidden="true">
        {Array.from({ length: AGENDA_SKELETON_COUNT }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-stone-800 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-700 high-contrast:border-current shadow-md flex flex-col h-full"
          >
            <div className="space-y-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="h-9 w-28 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse motion-reduce:animate-none" />
                <div className="h-8 w-44 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse motion-reduce:animate-none" />
              </div>
              <div className="h-8 w-3/4 rounded-lg bg-stone-200 dark:bg-stone-700 animate-pulse motion-reduce:animate-none" />
              <div className="space-y-2">
                <div className="h-5 w-full rounded-lg bg-stone-200 dark:bg-stone-700 animate-pulse motion-reduce:animate-none" />
                <div className="h-5 w-5/6 rounded-lg bg-stone-200 dark:bg-stone-700 animate-pulse motion-reduce:animate-none" />
              </div>
            </div>

            <div className="mt-auto bg-stone-50 dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 high-contrast:border-current space-y-3.5">
              <div className="h-6 w-2/3 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
              <div className="h-6 w-1/3 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
              <div className="h-5 w-4/5 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
              <div className="h-5 w-1/2 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse motion-reduce:animate-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
