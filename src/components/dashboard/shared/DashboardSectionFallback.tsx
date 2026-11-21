export interface DashboardSectionFallbackProps {
  label?: string;
}

export function DashboardSectionFallback({ label = 'Carregando seção...' }: DashboardSectionFallbackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-white dark:bg-stone-900 rounded-3xl p-10 sm:p-12 border-2 border-stone-200 dark:border-stone-800 shadow-xs flex flex-col items-center justify-center gap-3 text-stone-700 dark:text-stone-300"
    >
      <div className="w-9 h-9 rounded-full border-4 border-emerald-200 dark:border-emerald-900 border-t-emerald-700 dark:border-t-emerald-400 animate-spin motion-reduce:animate-none" />
      <span className="text-base font-bold">{label}</span>
    </div>
  );
}
