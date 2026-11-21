import React from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts';

export function LocationMap() {
  const { language, t } = useLanguage();

  return (
    <section id="como-chegar" className="py-20 md:py-28 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 mb-6">
            <MapPin className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
            {t('localizacao.title', 'Como Chegar')}
          </h2>
          <p className="text-xl sm:text-2xl text-stone-600 dark:text-stone-300 font-medium mt-3 leading-relaxed">
            {t('localizacao.subtitle', 'Venha nos visitar e ver de perto as peças feitas com carinho pela nossa gente.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Endereço em texto grande */}
          <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                  {t('localizacao.address_label', 'Nosso Endereço')}
                </h3>
              </div>
              <p className="text-xl sm:text-2xl text-stone-800 dark:text-stone-200 font-bold leading-relaxed">
                Av. Dr. João Medeiros Filho, 07 <br />
                Bairro Potengi, Zona Norte <br />
                Natal - RN, CEP 59104-200
              </p>
            </div>
            
            <a
              href="https://maps.google.com/?q=Av.+Dr.+Jo%C3%A3o+Medeiros+Filho,+07+-+Potengi,+Natal+-+RN"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[56px] px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ExternalLink className="w-6 h-6 shrink-0" />
              <span>{t('localizacao.maps_btn', 'Abrir no Google Maps')}</span>
            </a>
          </div>

          {/* Horário de Funcionamento em texto grande */}
          <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                  {t('localizacao.hours_label', 'Horário de Funcionamento')}
                </h3>
              </div>
              <div className="space-y-3 text-lg sm:text-xl text-stone-800 dark:text-stone-200 font-bold leading-relaxed">
                <div className="flex justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span>{t('localizacao.weekdays', 'Segunda a Sexta')}</span>
                  <span className="text-emerald-800 dark:text-emerald-400">{t('localizacao.hours_weekdays_val', '08h às 18h')}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span>{t('localizacao.saturday', 'Sábado')}</span>
                  <span className="text-emerald-800 dark:text-emerald-400">{t('localizacao.hours_saturday_val', '08h às 12h')}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>{t('localizacao.sunday', 'Domingo')}</span>
                  <span>{t('localizacao.closed', 'Fechado')}</span>
                </div>
              </div>
            </div>
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
              {t('localizacao.fair_note', '* Nos domingos de feira, a gente abre das 08h às 14h para receber você.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
