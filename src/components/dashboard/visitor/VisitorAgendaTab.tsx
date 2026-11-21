import { CalendarDays, MessageCircle } from 'lucide-react';
import type { EventItem } from '../../../types';

export interface VisitorAgendaTabProps {
  events: EventItem[];
  language: string;
  associationEventsWhatsappUrl: string;
}

export function VisitorAgendaTab({
  events,
  language,
  associationEventsWhatsappUrl,
}: VisitorAgendaTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Agenda e Oficinas
          </h2>
          <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium mt-1 max-w-2xl">
            Programação de oficinas, feiras comunitárias e encontros culturais abertos ao público na Associação Julieta Barros.
          </p>
        </div>
        <a
          href={associationEventsWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            language === 'pt'
              ? 'Tirar dúvidas sobre eventos e oficinas com a associação pelo WhatsApp (abre em nova janela)'
              : 'Ask the association about events and workshops via WhatsApp (opens in a new window)'
          }
          className="min-h-[52px] px-5 py-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl font-black text-base inline-flex items-center justify-center gap-2.5 shrink-0 transition-colors cursor-pointer w-full md:w-auto"
        >
          <MessageCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span>{language === 'pt' ? 'Dúvidas sobre eventos' : 'Event questions'}</span>
        </a>
      </div>

      {events.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border-2 border-stone-200 dark:border-stone-800">
          <CalendarDays className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-xl font-black text-stone-900 dark:text-white mb-1">
            Nenhum evento agendado no momento
          </h3>
          <p className="text-[18px] text-stone-600 dark:text-stone-400">
            Assim que a gestão cadastrar oficinas ou encontros, eles aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-start space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  {event.type}
                </span>
                <span className="text-sm font-bold text-stone-500 dark:text-stone-400">
                  Horário: {event.time}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-stone-900 dark:text-white leading-tight">
                  {event.title}
                </h3>
                <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                  Data: {event.date}
                </p>
              </div>

              <p className="text-[18px] text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
