import { useState } from 'react';
import { Bell, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import type { AnnouncementItem } from '../../../types';

export interface VisitorAnnouncementsTabProps {
  announcements: AnnouncementItem[];
}

export function VisitorAnnouncementsTab({ announcements }: VisitorAnnouncementsTabProps) {
  const [expandedNoticeId, setExpandedNoticeId] = useState<number | null>(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Avisos e Comunicados Oficiais
        </h2>
        <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium mt-1 max-w-3xl leading-relaxed">
          Avisos, comunicados e informes da Associação Julieta Barros.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
        {announcements.map((notice) => {
          const isExpanded = expandedNoticeId === notice.id;

          return (
            <article
              key={notice.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm transition-all flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 inline-flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 shrink-0" />
                      <span>Aviso</span>
                    </span>
                    <span className="text-[16px] font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 shrink-0" />
                      {notice.date}
                    </span>
                  </div>
                  <span className="text-[16px] font-bold text-stone-600 dark:text-stone-400">
                    {notice.author}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mb-2 leading-tight">
                  {notice.title}
                </h3>

                <p className="text-stone-700 dark:text-stone-300 text-[18px] font-medium leading-relaxed mb-3">
                  {notice.summary}
                </p>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 p-5 rounded-2xl">
                    <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                  className="min-h-[46px] px-5 py-2.5 rounded-xl font-black text-[16px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-5 h-5 shrink-0" />
                      <span>Recolher</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5 shrink-0" />
                      <span>Ler completo</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
