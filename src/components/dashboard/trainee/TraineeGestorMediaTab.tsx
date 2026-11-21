import React from 'react';
import { Camera, Video } from 'lucide-react';

export interface TraineeGestorMediaTabProps {
  samplePhotoTitle: string;
  onChangeSamplePhotoTitle: (value: string) => void;
  onSubmitPhoto: (e: React.FormEvent) => void;
  sampleVideoUrl: string;
  onChangeSampleVideoUrl: (value: string) => void;
  onSubmitVideo: (e: React.FormEvent) => void;
}

export function TraineeGestorMediaTab({
  samplePhotoTitle,
  onChangeSamplePhotoTitle,
  onSubmitPhoto,
  sampleVideoUrl,
  onChangeSampleVideoUrl,
  onSubmitVideo,
}: TraineeGestorMediaTabProps) {
  return (
    <div data-tour="gestor-media-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between h-full space-y-6">
        <div>
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 mb-2">
              <span>Exemplo de Treino</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Enviar uma foto de teste
            </h3>
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1">
              Simule o envio de uma foto de oficina ou exposição artesanal.
            </p>
          </div>

          <form id="photo-form" onSubmit={onSubmitPhoto} className="space-y-4">
            <div>
              <label className="block text-lg font-extrabold text-stone-800 dark:text-stone-200 mb-2">
                Legenda da Foto
              </label>
              <input
                type="text"
                value={samplePhotoTitle}
                onChange={(e) => onChangeSamplePhotoTitle(e.target.value)}
                placeholder="Ex: Mestre modelando o vaso na bancada"
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-lg focus:outline-none focus:border-green-600"
              />
            </div>
          </form>
        </div>

        <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
          <button
            type="submit"
            form="photo-form"
            className="w-full min-h-[56px] px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg inline-flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Camera className="w-5 h-5 shrink-0" />
            <span>Publicar foto (simulação)</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between h-full space-y-6">
        <div>
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 mb-2">
              <span>Exemplo de Treino</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Colar um link de vídeo
            </h3>
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1">
              Cole o endereço de um vídeo educativo ou de apresentação do ateliê.
            </p>
          </div>

          <form id="video-form" onSubmit={onSubmitVideo} className="space-y-4">
            <div>
              <label className="block text-lg font-extrabold text-stone-800 dark:text-stone-200 mb-2">
                Link do Vídeo
              </label>
              <input
                type="text"
                value={sampleVideoUrl}
                onChange={(e) => onChangeSampleVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-lg focus:outline-none focus:border-green-600"
              />
            </div>
          </form>
        </div>

        <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
          <button
            type="submit"
            form="video-form"
            className="w-full min-h-[56px] px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg inline-flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Video className="w-5 h-5 shrink-0" />
            <span>Publicar vídeo (simulação)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
