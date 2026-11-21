import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, MessageCircle } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../../../lib';
import {
  SITE_CONTENT_UPDATED_EVENT,
  fetchCooperativeStore,
  normalizeSiteContent,
  readCachedSiteContent,
  type CooperativeSiteContent,
} from '../../../services';

export interface VisitorHistoryTabProps {
  language: string;
  associationSpaceWhatsappUrl: string;
}

export function VisitorHistoryTab({
  language,
  associationSpaceWhatsappUrl,
}: VisitorHistoryTabProps) {
  const isPt = language === 'pt';
  const associationEmail = (import.meta.env.VITE_ASSOCIATION_EMAIL || '').trim() || null;

  const [siteContent, setSiteContent] = useState<CooperativeSiteContent>(() => readCachedSiteContent());

  useEffect(() => {
    let active = true;

    const handleLocalUpdate = (event: Event) => {
      const detail = (event as CustomEvent<Partial<CooperativeSiteContent>>).detail;
      if (detail) {
        setSiteContent(normalizeSiteContent(detail));
      } else {
        setSiteContent(readCachedSiteContent());
      }
    };

    const handleStorageSync = () => {
      setSiteContent(readCachedSiteContent());
    };

    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, handleLocalUpdate);
    window.addEventListener('storage', handleStorageSync);

    void fetchCooperativeStore().then((store) => {
      if (!active || !store?.siteContent) return;
      setSiteContent(normalizeSiteContent(store.siteContent));
    });

    return () => {
      active = false;
      window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, handleLocalUpdate);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  const hasTeamPhoto = Boolean(siteContent.teamPhoto && siteContent.teamPhoto.trim().length > 0);
  const embedVideoUrl = getYouTubeEmbedUrl(siteContent.videoUrl);
  const hasGallery = siteContent.galleryPhotos.length > 0;
  const resolvedTitle = isPt
    ? siteContent.storyTitle?.trim() || 'Nossa História e Raízes'
    : 'Our Story and Visits';

  return (
    <div className="space-y-8 animate-in fade-in duration-200 motion-reduce:animate-none">
      <div className="bg-white dark:bg-stone-900 high-contrast:bg-black border-2 border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
            {resolvedTitle}
          </h2>
          <div
            aria-hidden="true"
            className="w-16 h-1.5 rounded-full bg-emerald-700 dark:bg-emerald-400 high-contrast:bg-yellow-400"
          />
          <p className="text-[18px] text-stone-700 dark:text-stone-300 high-contrast:text-white font-medium">
            {isPt
              ? 'Conheça a história, a tradição e as informações de visitação da Associação Julieta Barros.'
              : 'Learn about the history, tradition, and visiting hours of Associação Julieta Barros.'}
          </p>
        </div>

        <div className={hasTeamPhoto ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' : ''}>
          <div className={hasTeamPhoto ? 'lg:col-span-7' : ''}>
            <div className="max-w-none text-stone-700 dark:text-stone-300 high-contrast:text-white text-[18px] font-medium leading-relaxed whitespace-pre-line">
              {siteContent.storyText}
            </div>
          </div>

          {hasTeamPhoto && (
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 high-contrast:border-yellow-400 bg-stone-100 dark:bg-stone-800 shadow-sm">
                <img
                  src={siteContent.teamPhoto}
                  alt={
                    isPt
                      ? 'Equipe e espaço da Associação Julieta Barros'
                      : 'Team and studio of Associação Julieta Barros'
                  }
                  className="w-full h-64 sm:h-72 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          )}
        </div>

        {embedVideoUrl && (
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 space-y-4">
            <h3 className="text-xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
              {isPt ? 'Vídeo da Associação (YouTube)' : 'Association Video (YouTube)'}
            </h3>
            <div className="aspect-video w-full max-w-3xl rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 high-contrast:border-yellow-400 bg-black shadow-sm">
              <iframe
                src={embedVideoUrl}
                title={
                  isPt
                    ? 'Vídeo institucional da Associação Julieta Barros no YouTube'
                    : 'Associação Julieta Barros YouTube video'
                }
                className="w-full h-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {hasGallery && (
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 space-y-4">
            <h3 className="text-xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
              {isPt ? 'Galeria de Fotos das Atividades' : 'Community Photo Gallery'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {siteContent.galleryPhotos.map((photo) => (
                <figure
                  key={photo.id}
                  className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 high-contrast:border-yellow-400 bg-stone-50 dark:bg-stone-800/50 high-contrast:bg-black flex flex-col"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {photo.title && (
                    <figcaption className="px-4 py-3 text-base font-bold text-stone-800 dark:text-stone-200 high-contrast:text-white truncate">
                      {photo.title}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400">
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 high-contrast:bg-black border border-stone-200 dark:border-stone-700 high-contrast:border-yellow-400 space-y-2">
            <h4 className="text-lg font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-700 dark:text-emerald-400 high-contrast:text-yellow-300" aria-hidden="true" />
              <span>{isPt ? 'Horários de Visitação Pública' : 'Public Visiting Hours'}</span>
            </h4>
            <ul className="text-[16px] text-stone-700 dark:text-stone-300 high-contrast:text-white font-medium space-y-1">
              <li>{isPt ? 'Segunda a Sexta: 08:00 às 18:00' : 'Monday to Friday: 08:00 AM to 06:00 PM'}</li>
              <li>{isPt ? 'Sábados: 08:00 às 12:00' : 'Saturdays: 08:00 AM to 12:00 PM'}</li>
              <li>
                {isPt
                  ? 'Domingos: Fechado (em domingos de feira, aberto das 08:00 às 14:00)'
                  : 'Sundays: Closed (on fair Sundays, open 08:00 AM to 02:00 PM)'}
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 high-contrast:bg-black border border-stone-200 dark:border-stone-700 high-contrast:border-yellow-400 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-lg font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400 high-contrast:text-yellow-300" aria-hidden="true" />
                <span>{isPt ? 'Atendimento sobre o Espaço e Eventos' : 'Space and Events Support'}</span>
              </h4>
              <p className="text-[16px] text-stone-700 dark:text-stone-300 high-contrast:text-white font-medium leading-relaxed">
                Associação Julieta Barros · Av. Dr. João Medeiros Filho, 07, Bairro Potengi, Zona Norte, Natal/RN · CEP 59104-200
                <br />
                {isPt
                  ? 'Para dúvidas sobre visitas, oficinas ou eventos do espaço, fale com a coordenação. (Produtos da Vitrine Rosa Mística são combinados diretamente com cada vendedor).'
                  : 'For questions about visits, workshops, or space events, talk to our coordination team. (Rosa Mística Showcase pieces are arranged directly with each seller).'}
                {associationEmail && (
                  <>
                    <br />
                    {isPt ? 'E-mail: ' : 'Email: '}
                    {associationEmail}
                  </>
                )}
              </p>
            </div>
            <a
              href={associationSpaceWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                isPt
                  ? 'Falar com a associação pelo WhatsApp sobre o espaço e visitas (abre em nova janela)'
                  : 'Contact the association via WhatsApp about the space and visits (opens in a new window)'
              }
              className="w-full min-h-[52px] px-5 py-3 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 dark:bg-emerald-700 dark:hover:bg-emerald-600 high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 text-white high-contrast:text-black rounded-2xl font-black text-base flex items-center justify-center gap-2.5 shadow-sm border border-emerald-600 dark:border-emerald-500 high-contrast:border-white focus:outline-none focus:ring-4 focus:ring-emerald-400 transition-colors motion-reduce:transition-none active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{isPt ? 'Tirar dúvidas sobre o espaço' : 'Ask about the space'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
