import React from 'react';
import { CalendarDays, Clock, MapPin, Users, BookOpen, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '../../contexts';
import { type SpaceEvent, getTranslatedEvent } from '../../data';
import { LandingAgendaSkeleton } from './LandingSkeletons';

export interface LandingAgendaProps {
  spaceEvents: SpaceEvent[];
  selectedCategory: 'todos' | 'Curso' | 'Oficina' | 'Outro Evento';
  onSelectCategory: (category: 'todos' | 'Curso' | 'Oficina' | 'Outro Evento') => void;
  filteredEvents: SpaceEvent[];
  coursesCount: number;
  workshopsCount: number;
  otherEventsCount: number;
  isLoading?: boolean;
}

export function LandingAgenda({
  spaceEvents,
  selectedCategory,
  onSelectCategory,
  filteredEvents,
  coursesCount,
  workshopsCount,
  otherEventsCount,
  isLoading = false
}: LandingAgendaProps) {
  const { t, language } = useLanguage();

  const categoryOptions = [
    { id: 'todos' as const, label: t('agenda.all', 'Todos'), count: spaceEvents.length, icon: CalendarDays, iconColor: '' },
    { id: 'Curso' as const, label: t('agenda.courses', 'Cursos'), count: coursesCount, icon: BookOpen, iconColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'Oficina' as const, label: t('agenda.workshops', 'Oficinas'), count: workshopsCount, icon: Sparkles, iconColor: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'Outro Evento' as const, label: t('agenda.other_events', 'Outros Eventos'), count: otherEventsCount, icon: Users, iconColor: 'text-purple-600 dark:text-purple-400' }
  ];

  const getTranslatedVacancy = (vacancies?: string) => {
    if (!vacancies) return null;
    switch (vacancies) {
      case 'Vagas abertas · Presencial':
        return t('agenda.vacancies_open', 'Vagas abertas · Presencial');
      case 'Material incluso · Gratuito':
        return t('agenda.material_included', 'Material incluso · Gratuito');
      case 'Entrada livre para toda a família':
        return t('agenda.free_entry', 'Entrada livre para toda a família');
      case 'Iniciantes e praticantes':
        return t('agenda.beginners', 'Iniciantes e praticantes');
      case 'Aberto à comunidade':
        return t('agenda.open_community', 'Aberto à comunidade');
      default:
        return vacancies;
    }
  };

  return (
    <section id="agenda" className="py-20 md:py-28 bg-stone-100/80 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white tracking-tight mb-4">
            {t('agenda.title', 'Agenda do Espaço Local')}
          </h2>
          <p className="text-xl sm:text-2xl text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
            {t('agenda.subtitle', 'Nossa programação presencial comunitária com cursos, oficinas práticas e encontros abertos. A gente se reúne para ensinar, criar e conviver com a nossa arte.')}
          </p>

          {/* Filtro de Categorias da Agenda (min-h-[56px], botões grandes acessíveis) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {categoryOptions.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = selectedCategory === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectCategory(opt.id)}
                  className={`min-h-[56px] px-6 py-3.5 rounded-2xl font-black text-lg transition-all border-2 flex items-center gap-2.5 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 dark:bg-emerald-700 dark:border-emerald-500 shadow-md'
                      : 'bg-white text-stone-800 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                  }`}
                >
                  <IconComp className={`w-5 h-5 shrink-0 ${opt.iconColor}`} />
                  <span>{opt.label} ({opt.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid dos Eventos do Espaço */}
        {isLoading && spaceEvents.length === 0 ? (
          <LandingAgendaSkeleton />
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {filteredEvents.map((rawEvent) => {
              const event = getTranslatedEvent(rawEvent, language);
              const isCourse = event.type === 'Curso';
              const isWorkshop = event.type === 'Oficina';

              return (
                <article
                  key={event.id}
                  className="bg-white dark:bg-stone-800 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-700 shadow-md flex flex-col h-full hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
                >
                  <div className="space-y-4 mb-6">
                    {/* Linha de Etiquetas do Evento */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-black border ${
                          isCourse
                            ? 'bg-amber-100 text-amber-950 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                            : isWorkshop
                            ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                            : 'bg-purple-100 text-purple-950 dark:bg-purple-950/80 dark:text-purple-200 border-purple-300 dark:border-purple-700'
                        }`}
                      >
                        {isCourse ? (
                          <BookOpen className="w-5 h-5 shrink-0" />
                        ) : isWorkshop ? (
                          <Sparkles className="w-5 h-5 shrink-0" />
                        ) : (
                          <Users className="w-5 h-5 shrink-0" />
                        )}
                        <span>
                          {isCourse 
                            ? t('agenda.type_course', 'Curso') 
                            : isWorkshop 
                            ? t('agenda.type_workshop', 'Oficina') 
                            : t('agenda.type_other', 'Outro Evento')}
                        </span>
                      </span>

                      {event.vacancies && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm sm:text-base font-bold bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{getTranslatedVacancy(event.vacancies)}</span>
                        </span>
                      )}
                    </div>

                    {/* Título e Descrição */}
                    <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-lg sm:text-xl text-stone-700 dark:text-stone-200 font-medium leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Caixa de Detalhes Práticos (Data, Horário, Local, Ministrante) */}
                  <div className="mt-auto bg-stone-50 dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 space-y-3.5">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-lg text-stone-900 dark:text-white">
                        <span className="font-black">{event.day}</span>
                        {event.date && (
                          <span className="text-stone-600 dark:text-stone-300 font-semibold"> · {event.date}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span className="font-black text-lg text-stone-900 dark:text-white">{event.time}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-semibold">
                          {event.location}
                        </span>
                      </div>
                    )}

                    {event.instructor && (
                      <div className="flex items-start gap-3">
                        <Users className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-semibold">
                          {event.instructor}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-3xl p-8 border-2 border-stone-200 dark:border-stone-700 max-w-xl mx-auto space-y-4">
            <p className="text-2xl text-stone-700 dark:text-stone-300 font-bold">
              {t('agenda.empty', 'Nenhum evento desta categoria cadastrado no momento.')}
            </p>
            <button
              type="button"
              onClick={() => onSelectCategory('todos')}
              className="min-h-[56px] px-8 py-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-emerald-800 dark:text-emerald-300 font-black text-lg rounded-2xl border border-stone-300 dark:border-stone-700 cursor-pointer"
            >
              {t('agenda.view_all', 'Ver todos os eventos')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
