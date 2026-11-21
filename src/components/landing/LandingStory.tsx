import React from 'react';
import { useLanguage } from '../../contexts';
import { getYouTubeEmbedUrl } from '../../lib';

export interface LandingStoryProps {
  storyTitle?: string | null;
  story: string | null;
  teamPhoto?: string | null;
  videoUrl?: string | null;
}

export interface LandingGalleryProps {
  gallery: Array<{ id: number; url: string; alt: string }>;
}

export function LandingStory({
  storyTitle,
  story,
  teamPhoto,
  videoUrl,
}: LandingStoryProps) {
  const { language, t } = useLanguage();
  const isPt = language === 'pt';
  const hasStory = Boolean(story && story.trim().length > 0);
  const hasTeamPhoto = Boolean(teamPhoto && teamPhoto.trim().length > 0);
  const embedVideoUrl = getYouTubeEmbedUrl(videoUrl);

  if (!hasStory && !hasTeamPhoto && !embedVideoUrl) return null;

  const resolvedHeading =
    (storyTitle && storyTitle.trim()) || t('historia.title', 'Nossa História e Raízes');

  return (
    <section
      id="historia"
      className="py-20 md:py-28 bg-white dark:bg-stone-950 high-contrast:bg-black border-t border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 transition-colors motion-reduce:transition-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {hasTeamPhoto ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 tracking-tight leading-tight">
                {resolvedHeading}
              </h2>

              {hasStory && (
                <div className="text-xl sm:text-2xl text-stone-600 dark:text-stone-300 high-contrast:text-white font-medium leading-relaxed whitespace-pre-line">
                  {story}
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 bg-stone-100 dark:bg-stone-900">
                <img
                  src={teamPhoto || ''}
                  alt={
                    isPt
                      ? 'Equipe e espaço da Associação Julieta Barros'
                      : 'Team and studio of Associação Julieta Barros'
                  }
                  className="w-full h-72 sm:h-80 lg:h-96 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 tracking-tight">
              {resolvedHeading}
            </h2>

            {hasStory && (
              <div className="text-xl sm:text-2xl text-stone-600 dark:text-stone-300 high-contrast:text-white max-w-3xl mx-auto font-medium leading-relaxed whitespace-pre-line">
                {story}
              </div>
            )}
          </div>
        )}

        {embedVideoUrl && (
          <div className="max-w-4xl mx-auto space-y-5">
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 tracking-tight text-center">
              {isPt ? 'Conheça nosso trabalho em vídeo' : 'Watch our craft on video'}
            </h3>
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 bg-black">
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
      </div>
    </section>
  );
}

export function LandingGallery({ gallery }: LandingGalleryProps) {
  const { t } = useLanguage();
  const hasGallery = Boolean(gallery && gallery.length > 0);

  if (!hasGallery) return null;

  return (
    <section
      id="galeria"
      className="py-20 md:py-28 bg-stone-100 dark:bg-stone-900/60 high-contrast:bg-black px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
            {t('galeria.title', 'Nosso Espaço em Fotos')}
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 high-contrast:text-white font-medium max-w-2xl mx-auto">
            {t(
              'galeria.subtitle',
              'Momentos de criação, vivências e oficinas que constroem a história da nossa comunidade.'
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((photo) => (
            <figure
              key={photo.id}
              className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 bg-white dark:bg-stone-900 high-contrast:bg-black shadow-xs flex flex-col"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {photo.alt && (
                <figcaption className="px-4 py-3 text-base font-bold text-stone-800 dark:text-stone-200 high-contrast:text-white truncate">
                  {photo.alt}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
