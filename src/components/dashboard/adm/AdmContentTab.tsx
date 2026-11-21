import React, { useRef } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  Film,
  ImagePlus,
  Loader2,
  Minimize2,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  GALLERY_MAX_TOTAL_BYTES,
  estimateImageUrlBytes,
  formatStorageSize,
  isValidImageSource,
  parseYouTubeUrl,
} from '../../../lib';

export interface GalleryPhoto {
  id: number;
  title: string;
  url: string;
}

interface AdmContentTabProps {
  siteStoryTitle: string;
  setSiteStoryTitle: React.Dispatch<React.SetStateAction<string>>;
  siteStoryText: string;
  setSiteStoryText: React.Dispatch<React.SetStateAction<string>>;
  siteTeamPhoto: string;
  setSiteTeamPhoto: React.Dispatch<React.SetStateAction<string>>;
  siteVideoUrl: string;
  setSiteVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  siteGalleryPhotos: GalleryPhoto[];
  setSiteGalleryPhotos: React.Dispatch<React.SetStateAction<GalleryPhoto[]>>;
  newPhotoTitle: string;
  setNewPhotoTitle: React.Dispatch<React.SetStateAction<string>>;
  newPhotoUrl: string;
  setNewPhotoUrl: React.Dispatch<React.SetStateAction<string>>;
  totalMediaBytes: number;
  isCompressingPhotos: boolean;
  onUploadTeamPhoto: (file: File | null) => Promise<void>;
  onUploadGalleryPhotos: (files: FileList | null) => Promise<void>;
  onCompressAllPhotos: () => Promise<void>;
  onRequestTrashPhoto: (photo: GalleryPhoto) => void;
  onRequestTrashVideo: () => void;
  onSaveContent: () => void;
  onAddToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdmContentTab: React.FC<AdmContentTabProps> = ({
  siteStoryTitle,
  setSiteStoryTitle,
  siteStoryText,
  setSiteStoryText,
  siteTeamPhoto,
  setSiteTeamPhoto,
  siteVideoUrl,
  setSiteVideoUrl,
  siteGalleryPhotos,
  setSiteGalleryPhotos,
  newPhotoTitle,
  setNewPhotoTitle,
  newPhotoUrl,
  setNewPhotoUrl,
  totalMediaBytes,
  isCompressingPhotos,
  onUploadTeamPhoto,
  onUploadGalleryPhotos,
  onCompressAllPhotos,
  onRequestTrashPhoto,
  onRequestTrashVideo,
  onSaveContent,
  onAddToast,
}) => {
  const teamPhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryFilesInputRef = useRef<HTMLInputElement>(null);

  const parsedYouTube = parseYouTubeUrl(siteVideoUrl);
  const hasVideoInput = Boolean(siteVideoUrl.trim());
  const isVideoInvalid = hasVideoInput && !parsedYouTube.valid;
  const isVideoValid = hasVideoInput && parsedYouTube.valid && Boolean(parsedYouTube.videoId);

  const usagePercent = Math.min(100, Math.round((totalMediaBytes / GALLERY_MAX_TOTAL_BYTES) * 100));
  const isOverLimit = totalMediaBytes > GALLERY_MAX_TOTAL_BYTES;
  const isNearLimit = !isOverLimit && usagePercent >= 75;
  const hasEmbeddedPhotos =
    siteTeamPhoto.startsWith('data:image/') ||
    siteGalleryPhotos.some((photo) => photo.url.startsWith('data:image/'));

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 high-contrast:bg-yellow-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-700 high-contrast:border-white shrink-0">
            <Camera className="w-6 h-6 text-emerald-800 dark:text-emerald-300 high-contrast:text-black" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
              Textos, Fotos e Vídeo
            </h2>
            <p className="text-base text-stone-700 dark:text-stone-300 high-contrast:text-white font-medium mt-0.5">
              Gerencie a seção Nossa História exibida na página inicial do site e no painel do Visitante
            </p>
          </div>
        </div>
      </div>

      {/* Bloco 1: Textos da Apresentação (NOSSA HISTÓRIA - Início do Site e Visitante) */}
      <div className="bg-white dark:bg-stone-900 high-contrast:bg-black rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 shadow-sm space-y-6">
        <div className="border-b border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
              Textos Institucionais (Nossa História)
            </h3>
            <p className="text-base text-stone-600 dark:text-stone-400 high-contrast:text-white font-medium mt-1">
              Apresentação da nossa associação e do nosso trabalho artesanal
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 high-contrast:bg-yellow-400 border border-emerald-300 dark:border-emerald-700 high-contrast:border-white text-emerald-900 dark:text-emerald-200 high-contrast:text-black text-xs sm:text-sm font-black shrink-0">
            <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Visível em Nossa História (Início e Visitante)</span>
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="adm-story-title"
              className="block text-base font-extrabold text-stone-800 dark:text-stone-200 high-contrast:text-white mb-2"
            >
              Título da Seção
            </label>
            <input
              id="adm-story-title"
              type="text"
              value={siteStoryTitle}
              onChange={(e) => setSiteStoryTitle(e.target.value)}
              className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 high-contrast:bg-black border-2 border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 text-stone-900 dark:text-white high-contrast:text-white font-bold text-lg focus:outline-none focus:border-green-600"
              placeholder="Ex: Nossa História e Raízes"
            />
          </div>

          <div>
            <label
              htmlFor="adm-story-text"
              className="block text-base font-extrabold text-stone-800 dark:text-stone-200 high-contrast:text-white mb-2"
            >
              Texto de Apresentação
            </label>
            <textarea
              id="adm-story-text"
              rows={5}
              value={siteStoryText}
              onChange={(e) => setSiteStoryText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 high-contrast:bg-black border-2 border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 text-stone-900 dark:text-white high-contrast:text-white font-medium text-base focus:outline-none focus:border-green-600 resize-y leading-relaxed"
              placeholder="Conte a história do ateliê, mestres artesãos e projetos comunitários..."
            />
          </div>
        </div>
      </div>

      {/* Bloco 2: Foto Principal da Equipe */}
      <div className="bg-white dark:bg-stone-900 high-contrast:bg-black rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 shadow-sm space-y-6">
        <div className="border-b border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
              Foto Principal da Equipe e Ateliê
            </h3>
            <p className="text-base text-stone-600 dark:text-stone-400 high-contrast:text-white font-medium mt-1">
              Imagem de destaque exibida na seção Nossa História (com compressão automática)
            </p>
          </div>
          {siteTeamPhoto && (
            <span className="self-start sm:self-center text-xs sm:text-sm font-black px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 tabular-nums">
              {siteTeamPhoto.startsWith('data:image/')
                ? formatStorageSize(estimateImageUrlBytes(siteTeamPhoto))
                : 'Link externo'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 high-contrast:border-yellow-400 shadow-sm bg-stone-100 dark:bg-stone-800">
            {siteTeamPhoto ? (
              <img src={siteTeamPhoto} alt="Foto da Equipe do Ateliê" className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-stone-400 high-contrast:text-white p-6 text-center">
                <Camera className="w-10 h-10 opacity-60" aria-hidden="true" />
                <span className="font-bold text-base">Nenhuma foto de destaque configurada</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <input
              ref={teamPhotoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                void onUploadTeamPhoto(file);
                e.currentTarget.value = '';
              }}
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={isCompressingPhotos}
                onClick={() => teamPhotoInputRef.current?.click()}
                className="min-h-[52px] px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 high-contrast:bg-yellow-400 high-contrast:text-black text-white font-extrabold text-base inline-flex items-center gap-2.5 shadow-sm transition-colors motion-reduce:transition-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCompressingPhotos ? (
                  <Loader2 className="w-5 h-5 animate-spin motion-reduce:animate-none shrink-0" aria-hidden="true" />
                ) : (
                  <Upload className="w-5 h-5 shrink-0" aria-hidden="true" />
                )}
                <span>Enviar foto do celular/PC</span>
              </button>

              {siteTeamPhoto && (
                <button
                  type="button"
                  onClick={() => setSiteTeamPhoto('')}
                  className="min-h-[52px] px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:border-red-300 dark:hover:border-red-700 text-red-700 dark:text-red-300 font-bold text-base inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Remover foto</span>
                </button>
              )}
            </div>

            <div>
              <label
                htmlFor="adm-team-photo-url"
                className="block text-base font-extrabold text-stone-800 dark:text-stone-200 high-contrast:text-white mb-2"
              >
                Ou cole o link (URL) da imagem
              </label>
              <input
                id="adm-team-photo-url"
                type="text"
                value={siteTeamPhoto}
                onChange={(e) => setSiteTeamPhoto(e.target.value)}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 high-contrast:bg-black border-2 border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-600"
                placeholder="https://..."
              />
            </div>

            <p className="text-sm font-medium text-stone-600 dark:text-stone-400 high-contrast:text-white">
              Ao enviar um arquivo, a imagem é automaticamente redimensionada e comprimida para economizar espaço no banco.
            </p>
          </div>
        </div>
      </div>

      {/* Bloco 3: Galeria de Fotos + Controle e Compressão de MB Totais */}
      <div className="bg-white dark:bg-stone-900 high-contrast:bg-black rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 shadow-sm space-y-6">
        <div className="border-b border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
              Galeria de Fotos das Atividades
            </h3>
            <p className="text-base text-stone-600 dark:text-stone-400 high-contrast:text-white font-medium mt-1">
              Fotos de cursos, produção no ateliê e eventos comunitários (exibidas no início do site e para Visitantes)
            </p>
          </div>
          <span className="text-sm font-black text-emerald-800 dark:text-emerald-300 high-contrast:text-black bg-emerald-50 dark:bg-emerald-950/60 high-contrast:bg-yellow-400 px-3.5 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-700 high-contrast:border-white self-start sm:self-auto shrink-0">
            {siteGalleryPhotos.length} {siteGalleryPhotos.length === 1 ? 'foto' : 'fotos'}
          </span>
        </div>

        {/* Medidor de MB Totais + Botão de Compressão em Lote */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 ${
            isOverLimit
              ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
              : isNearLimit
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
              : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700'
          } high-contrast:bg-black high-contrast:border-yellow-400`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-base font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 tabular-nums">
                Espaço total das fotos: {formatStorageSize(totalMediaBytes)} de{' '}
                {formatStorageSize(GALLERY_MAX_TOTAL_BYTES)} ({usagePercent}%)
              </p>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400 high-contrast:text-white">
                {isOverLimit
                  ? 'Limite ultrapassado! Comprima as fotos abaixo ou remova alguma imagem antes de salvar.'
                  : 'Otimização automática via Canvas ativada: fotos são redimensionadas e comprimidas para garantir carregamento rápido do site.'}
              </p>
            </div>

            <button
              type="button"
              disabled={isCompressingPhotos || !hasEmbeddedPhotos}
              onClick={() => void onCompressAllPhotos()}
              className="min-h-[48px] px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 text-white dark:text-stone-900 high-contrast:text-black font-extrabold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-colors motion-reduce:transition-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isCompressingPhotos ? (
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none shrink-0" aria-hidden="true" />
              ) : (
                <Minimize2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>{isCompressingPhotos ? 'Comprimindo...' : 'Comprimir fotos agora'}</span>
            </button>
          </div>

          <div
            role="progressbar"
            aria-label="Espaço total usado pelas fotos da galeria"
            aria-valuenow={usagePercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
          >
            <div
              className={`h-full transition-all duration-300 motion-reduce:transition-none ${
                isOverLimit ? 'bg-red-600' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-600'
              } high-contrast:bg-yellow-400`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {siteGalleryPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteGalleryPhotos.map((photo) => {
              const photoBytes = estimateImageUrlBytes(photo.url);
              const isEmbedded = photo.url.startsWith('data:image/');
              return (
                <div
                  key={photo.id}
                  className="rounded-2xl border-2 border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 bg-stone-50 dark:bg-stone-800/50 high-contrast:bg-black overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative">
                    <img src={photo.url} alt={photo.title} className="w-full h-44 object-cover" />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-black bg-stone-900/80 text-white backdrop-blur-xs tabular-nums">
                      {isEmbedded ? formatStorageSize(photoBytes) : 'URL'}
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <span className="font-extrabold text-base text-stone-900 dark:text-white high-contrast:text-white truncate">
                      {photo.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRequestTrashPhoto(photo)}
                      className="min-h-[48px] px-3.5 py-2 text-red-700 dark:text-red-300 high-contrast:text-black hover:text-red-800 dark:hover:text-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 high-contrast:bg-yellow-400 border border-red-200 dark:border-red-800 high-contrast:border-white rounded-2xl font-bold text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      aria-label={`Mover foto ${photo.title} para a lixeira`}
                    >
                      <Trash2 className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 high-contrast:text-black" aria-hidden="true" />
                      <span>Lixeira</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 high-contrast:bg-black border border-stone-200 dark:border-stone-700 high-contrast:border-yellow-400 space-y-4">
          <h4 className="text-lg font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
            Adicionar Nova Foto à Galeria
          </h4>

          <input
            ref={galleryFilesInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              void onUploadGalleryPhotos(e.target.files);
              e.currentTarget.value = '';
            }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              disabled={isCompressingPhotos}
              onClick={() => galleryFilesInputRef.current?.click()}
              className="min-h-[52px] px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 high-contrast:bg-yellow-400 high-contrast:text-black text-white font-extrabold text-base inline-flex items-center justify-center gap-2 shadow-sm transition-colors motion-reduce:transition-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCompressingPhotos ? (
                <Loader2 className="w-5 h-5 animate-spin motion-reduce:animate-none shrink-0" aria-hidden="true" />
              ) : (
                <ImagePlus className="w-5 h-5 shrink-0" aria-hidden="true" />
              )}
              <span>Enviar foto(s) com compressão automática</span>
            </button>
            <span className="text-sm font-medium text-stone-600 dark:text-stone-400 high-contrast:text-white">
              Você pode selecionar uma ou várias fotos de uma vez.
            </span>
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-700/80 space-y-3">
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300 high-contrast:text-white">
              Ou adicione pelo título e link (URL) da imagem:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                aria-label="Título ou legenda da nova foto"
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                placeholder="Título / Legenda (Ex: Feira de Artesanato)"
                className="w-full min-h-[52px] px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 high-contrast:bg-black border-2 border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-600"
              />
              <input
                type="text"
                aria-label="Endereço URL da nova foto"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Endereço da imagem (https://...)"
                className="w-full min-h-[52px] px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 high-contrast:bg-black border-2 border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-600"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!newPhotoTitle.trim() || !newPhotoUrl.trim()) {
                  onAddToast('Preencha título e URL da foto para adicionar.', 'error');
                  return;
                }
                if (!isValidImageSource(newPhotoUrl)) {
                  onAddToast('Informe um link válido (https://...) para a foto.', 'error');
                  return;
                }
                setSiteGalleryPhotos((prev) => [
                  { id: Date.now(), title: newPhotoTitle.trim(), url: newPhotoUrl.trim() },
                  ...prev,
                ]);
                setNewPhotoTitle('');
                setNewPhotoUrl('');
                onAddToast('Foto adicionada à galeria com sucesso!', 'success');
              }}
              className="min-h-[52px] px-6 py-3 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white high-contrast:bg-yellow-400 high-contrast:text-black text-white dark:text-stone-900 rounded-xl font-extrabold text-base transition-colors cursor-pointer"
            >
              Adicionar por Link (URL)
            </button>
          </div>
        </div>
      </div>

      {/* Bloco 4: Vídeo (Somente YouTube) */}
      <div className="bg-white dark:bg-stone-900 high-contrast:bg-black rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 shadow-sm space-y-6">
        <div className="border-b border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 flex items-center gap-2.5">
              <Film className="w-6 h-6 text-red-600 dark:text-red-400 high-contrast:text-yellow-300 shrink-0" aria-hidden="true" />
              <span>Vídeo do YouTube da Associação</span>
            </h3>
            <p className="text-base text-stone-600 dark:text-stone-400 high-contrast:text-white font-medium mt-1">
              Suporte exclusivo a links do YouTube (economiza armazenamento no banco de dados)
            </p>
          </div>
          <span className="self-start sm:self-center text-xs sm:text-sm font-black px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 shrink-0">
            Somente YouTube
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="adm-youtube-url"
              className="block text-base font-extrabold text-stone-800 dark:text-stone-200 high-contrast:text-white mb-2"
            >
              Link do Vídeo no YouTube
            </label>
            <input
              id="adm-youtube-url"
              type="url"
              value={siteVideoUrl}
              onChange={(e) => setSiteVideoUrl(e.target.value)}
              aria-invalid={isVideoInvalid}
              className={`w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 high-contrast:bg-black border-2 text-stone-900 dark:text-white font-bold text-base focus:outline-none ${
                isVideoInvalid
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 focus:border-green-600'
              }`}
              placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
            />
          </div>

          {isVideoInvalid && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border-2 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 font-bold text-base flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Este endereço não é um link válido do YouTube. Aceitamos apenas links do tipo{' '}
                <strong>youtube.com/watch?v=...</strong>, <strong>youtu.be/...</strong> ou{' '}
                <strong>youtube.com/shorts/...</strong>.
              </span>
            </div>
          )}

          {isVideoValid && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Link do YouTube reconhecido! Pré-visualização de como aparecerá no site:</span>
              </div>
              <div className="max-w-xl aspect-video rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 bg-black shadow-sm">
                <iframe
                  src={parsedYouTube.embedUrl}
                  title="Pré-visualização do vídeo do YouTube da associação"
                  className="w-full h-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {siteVideoUrl && (
            <div className="pt-1 flex justify-start">
              <button
                type="button"
                onClick={onRequestTrashVideo}
                className="min-h-[56px] px-6 py-3 border-2 border-stone-300 dark:border-stone-700 hover:border-red-300 dark:hover:border-red-800 text-stone-700 hover:text-red-700 dark:text-stone-300 dark:hover:text-red-400 bg-white dark:bg-stone-900 rounded-2xl font-extrabold text-base inline-flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" aria-hidden="true" />
                <span>Mover vídeo atual para a lixeira (30 dias)</span>
              </button>
            </div>
          )}

          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 high-contrast:bg-black border border-stone-200 dark:border-stone-700 high-contrast:border-yellow-400 text-sm font-medium text-stone-700 dark:text-stone-300 high-contrast:text-white">
            O vídeo do YouTube configurado aparece na seção <strong>Nossa História</strong> (página inicial e área do Visitante). Apenas o endereço leve do YouTube é salvo no banco de dados.
          </div>
        </div>
      </div>

      {/* Botão de Salvar Alterações */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSaveContent}
          disabled={isCompressingPhotos || isVideoInvalid || isOverLimit}
          className="min-h-[56px] px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 text-white high-contrast:text-black rounded-2xl font-black text-[18px] inline-flex items-center gap-2.5 shadow-md transition-all motion-reduce:transition-none cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Salvar e Publicar em Nossa História</span>
        </button>
      </div>
    </div>
  );
};
