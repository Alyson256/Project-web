import { useEffect, useMemo, useState } from 'react';
import type { UserRole } from '../contexts';
import type { TrashItem } from '../data';
import {
  GALLERY_MAX_TOTAL_BYTES,
  GALLERY_RECOMMENDED_PHOTO_MAX_BYTES,
  calculateContentMediaBytes,
  compressDataUrl,
  compressGalleryToBudget,
  compressImageFileToDataUrl,
  formatStorageSize,
  parseYouTubeUrl,
} from '../lib';
import {
  DEFAULT_SITE_CONTENT,
  fetchCooperativeStore,
  normalizeSiteContent,
  persistCooperativeSection,
  readCachedSiteContent,
  readCachedStore,
} from '../services';
import type { GalleryPhoto } from '../components/dashboard/adm/AdmContentTab';

interface UseAdmContentAndTrashOptions {
  role?: UserRole;
  actorName: string;
  isTraineeManager: boolean;
  getIdToken: () => Promise<string | null>;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  addAuditLog: (action: string, details: string) => void;
}

function getInitialTrash(): TrashItem[] {
  try {
    const cached = readCachedStore();
    if (Array.isArray(cached.trash)) {
      return cached.trash as TrashItem[];
    }
  } catch {
    // Ignora erros de armazenamento local
  }
  return [];
}

function formatPhotoTitleFromFilename(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
  if (!base) return 'Atividade do Ateliê';
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function useAdmContentAndTrash({
  role,
  actorName,
  isTraineeManager,
  getIdToken,
  addToast,
  addAuditLog,
}: UseAdmContentAndTrashOptions) {
  const initialContent = useMemo(() => readCachedSiteContent(), []);

  const [siteStoryTitle, setSiteStoryTitle] = useState(
    () => initialContent.storyTitle || DEFAULT_SITE_CONTENT.storyTitle || 'Nossa História e Raízes'
  );
  const [siteStoryText, setSiteStoryText] = useState<string>(() => initialContent.storyText);
  const [siteTeamPhoto, setSiteTeamPhoto] = useState<string>(() => initialContent.teamPhoto || '');
  const [siteVideoUrl, setSiteVideoUrl] = useState<string>(() => initialContent.videoUrl || '');
  const [siteGalleryPhotos, setSiteGalleryPhotos] = useState<GalleryPhoto[]>(() => initialContent.galleryPhotos);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isCompressingPhotos, setIsCompressingPhotos] = useState(false);

  const [trashList, setTrashList] = useState<TrashItem[]>(getInitialTrash);
  const [photoToTrash, setPhotoToTrash] = useState<GalleryPhoto | null>(null);
  const [videoToTrashConfirm, setVideoToTrashConfirm] = useState(false);

  const totalMediaBytes = useMemo(
    () => calculateContentMediaBytes(siteTeamPhoto, siteGalleryPhotos),
    [siteTeamPhoto, siteGalleryPhotos]
  );

  useEffect(() => {
    if (isTraineeManager) return;
    let active = true;
    fetchCooperativeStore().then((store) => {
      if (!active || !store) return;
      if (store.siteContent) {
        const normalized = normalizeSiteContent(store.siteContent);
        setSiteStoryTitle(normalized.storyTitle || DEFAULT_SITE_CONTENT.storyTitle || 'Nossa História e Raízes');
        setSiteStoryText(normalized.storyText);
        setSiteTeamPhoto(normalized.teamPhoto || '');
        setSiteGalleryPhotos(normalized.galleryPhotos);
        setSiteVideoUrl(normalized.videoUrl);
      }
      if (Array.isArray(store.trash)) {
        setTrashList(store.trash as TrashItem[]);
      }
    });
    return () => {
      active = false;
    };
  }, [isTraineeManager]);

  const persistTrashAndContent = (
    nextTrash: TrashItem[],
    nextGallery: GalleryPhoto[],
    nextVideoUrl: string,
    nextStory: string,
    nextStoryTitle: string = siteStoryTitle,
    nextTeamPhoto: string = siteTeamPhoto
  ) => {
    if (isTraineeManager) return;
    const cleanTitle = nextStoryTitle.trim() || DEFAULT_SITE_CONTENT.storyTitle || 'Nossa História e Raízes';
    const cleanText = nextStory.trim();
    const cleanTeamPhoto = nextTeamPhoto.trim();
    const parsedVideo = parseYouTubeUrl(nextVideoUrl);
    const cleanVideoUrl = parsedVideo.valid ? parsedVideo.watchUrl : '';

    try {
      // Remove chaves legadas para evitar duplicar Data URLs em base64 no localStorage
      localStorage.removeItem('potengi_public_story');
      localStorage.removeItem('potengi_public_gallery');
    } catch {
      // Ignora erros de armazenamento local
    }
    void getIdToken()
      .catch(() => null)
      .then((token) => {
        void persistCooperativeSection('trash', nextTrash, token);
        void persistCooperativeSection(
          'siteContent',
          {
            storyTitle: cleanTitle,
            storyText: cleanText,
            teamPhoto: cleanTeamPhoto,
            galleryPhotos: nextGallery,
            videoUrl: cleanVideoUrl,
          },
          token
        );
      });
  };

  const handleUploadTeamPhoto = async (file: File | null) => {
    if (!file) return;
    setIsCompressingPhotos(true);
    try {
      const existingGalleryBytes = calculateContentMediaBytes('', siteGalleryPhotos);
      const remainingForTeam = Math.max(60 * 1024, GALLERY_MAX_TOTAL_BYTES - existingGalleryBytes);
      const compressed = await compressImageFileToDataUrl(file, {
        maxDimension: 1200,
        targetMaxBytes: Math.min(GALLERY_RECOMMENDED_PHOTO_MAX_BYTES, remainingForTeam),
      });

      const projectedTotal = calculateContentMediaBytes(compressed.dataUrl, siteGalleryPhotos);
      if (projectedTotal > GALLERY_MAX_TOTAL_BYTES) {
        const rebalanced = await compressGalleryToBudget({
          teamPhoto: compressed.dataUrl,
          galleryPhotos: siteGalleryPhotos,
          maxTotalBytes: GALLERY_MAX_TOTAL_BYTES,
        });
        if (!rebalanced.withinBudget) {
          addToast(
            `Esta foto faria a galeria passar do limite de ${formatStorageSize(GALLERY_MAX_TOTAL_BYTES)}. Remova uma foto antiga para liberar espaço.`,
            'error'
          );
          return;
        }
        setSiteTeamPhoto(rebalanced.teamPhoto);
        setSiteGalleryPhotos(rebalanced.galleryPhotos);
        addToast(
          `Foto da equipe otimizada via Canvas e galeria ajustada para ${formatStorageSize(rebalanced.afterBytes)}.`,
          'success'
        );
        return;
      }

      setSiteTeamPhoto(compressed.dataUrl);
      addToast(
        `Foto da equipe otimizada para ${formatStorageSize(compressed.compressedBytes)} (de ${formatStorageSize(compressed.originalBytes)}).`,
        'success'
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Não foi possível processar a foto selecionada.';
      addToast(msg, 'error');
    } finally {
      setIsCompressingPhotos(false);
    }
  };

  const handleUploadGalleryPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsCompressingPhotos(true);
    try {
      const fileArray = Array.from(files);
      const nextAdded: GalleryPhoto[] = [];
      let runningBytes = totalMediaBytes;
      let totalSavedBytes = 0;

      for (let i = 0; i < fileArray.length; i += 1) {
        const file = fileArray[i];
        const remainingFiles = Math.max(1, fileArray.length - i);
        const remainingBudget = Math.max(55 * 1024, GALLERY_MAX_TOTAL_BYTES - runningBytes);
        const adaptiveTarget = Math.min(
          GALLERY_RECOMMENDED_PHOTO_MAX_BYTES,
          Math.max(55 * 1024, Math.floor(remainingBudget / remainingFiles))
        );

        const compressed = await compressImageFileToDataUrl(file, {
          maxDimension: 1120,
          targetMaxBytes: adaptiveTarget,
        });

        runningBytes += compressed.compressedBytes;
        totalSavedBytes += Math.max(0, compressed.originalBytes - compressed.compressedBytes);
        const title =
          fileArray.length === 1 && newPhotoTitle.trim()
            ? newPhotoTitle.trim()
            : formatPhotoTitleFromFilename(file.name);

        nextAdded.push({
          id: Date.now() + i,
          title,
          url: compressed.dataUrl,
        });
      }

      if (nextAdded.length > 0) {
        const combinedGallery = [...nextAdded, ...siteGalleryPhotos];
        const combinedBytes = calculateContentMediaBytes(siteTeamPhoto, combinedGallery);

        if (combinedBytes > GALLERY_MAX_TOTAL_BYTES) {
          const rebalanced = await compressGalleryToBudget({
            teamPhoto: siteTeamPhoto,
            galleryPhotos: combinedGallery,
            maxTotalBytes: GALLERY_MAX_TOTAL_BYTES,
          });

          if (!rebalanced.withinBudget) {
            addToast(
              `Limite total de ${formatStorageSize(GALLERY_MAX_TOTAL_BYTES)} atingido mesmo após compressão. Envie menos fotos por vez ou remova imagens antigas.`,
              'error'
            );
            return;
          }

          setSiteTeamPhoto(rebalanced.teamPhoto);
          setSiteGalleryPhotos(rebalanced.galleryPhotos);
          if (fileArray.length === 1) {
            setNewPhotoTitle('');
          }
          addToast(
            `${nextAdded.length} ${nextAdded.length === 1 ? 'foto adicionada' : 'fotos adicionadas'} e galeria reequilibrada para ${formatStorageSize(rebalanced.afterBytes)}!`,
            'success'
          );
          return;
        }

        setSiteGalleryPhotos(combinedGallery);
        if (fileArray.length === 1) {
          setNewPhotoTitle('');
        }
        addToast(
          `${nextAdded.length} ${nextAdded.length === 1 ? 'foto comprimida e adicionada' : 'fotos comprimidas e adicionadas'} (${formatStorageSize(totalSavedBytes)} economizados)!`,
          'success'
        );
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Não foi possível comprimir uma das fotos.';
      addToast(msg, 'error');
    } finally {
      setIsCompressingPhotos(false);
    }
  };

  const handleCompressAllGalleryPhotos = async () => {
    const hasEmbeddedPhotos =
      siteTeamPhoto.startsWith('data:image/') ||
      siteGalleryPhotos.some((photo) => photo.url.startsWith('data:image/'));

    if (!hasEmbeddedPhotos) {
      addToast('Suas fotos usam links leves da internet (menos de 1 KB no banco).', 'info');
      return;
    }

    setIsCompressingPhotos(true);
    try {
      const result = await compressGalleryToBudget({
        teamPhoto: siteTeamPhoto,
        galleryPhotos: siteGalleryPhotos,
        maxTotalBytes: GALLERY_MAX_TOTAL_BYTES,
        perPhotoTargetBytes: 130 * 1024,
      });

      setSiteTeamPhoto(result.teamPhoto);
      setSiteGalleryPhotos(result.galleryPhotos);
      if (!isTraineeManager && result.savedBytes > 0) {
        persistTrashAndContent(
          trashList,
          result.galleryPhotos,
          siteVideoUrl,
          siteStoryText,
          siteStoryTitle,
          result.teamPhoto
        );
      }

      if (result.savedBytes > 1024) {
        addToast(
          `Galeria comprimida via Canvas! Economia de ${formatStorageSize(result.savedBytes)} (total atual: ${formatStorageSize(result.afterBytes)}).`,
          'success'
        );
      } else {
        addToast('Todas as fotos já estão no menor tamanho ideal sem perder nitidez.', 'info');
      }
    } catch {
      addToast('Não foi possível comprimir algumas fotos no momento.', 'error');
    } finally {
      setIsCompressingPhotos(false);
    }
  };

  const handleConfirmTrashPhoto = (photo: GalleryPhoto) => {
    const actor = role === 'adm' ? 'Administrador' : actorName;
    const trashedItem: TrashItem = {
      id: `trash-p-${Date.now()}`,
      title: photo.title,
      type: 'foto',
      url: photo.url,
      removedDate:
        new Date().toLocaleDateString('pt-BR') +
        ' às ' +
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      deletedTimestamp: Date.now(),
      daysRemaining: 30,
      removedBy: actor,
      originalData: photo,
    };
    const nextTrash = [trashedItem, ...trashList];
    const nextGallery = siteGalleryPhotos.filter((p) => p.id !== photo.id);
    setTrashList(nextTrash);
    setSiteGalleryPhotos(nextGallery);
    persistTrashAndContent(nextTrash, nextGallery, siteVideoUrl, siteStoryText, siteStoryTitle, siteTeamPhoto);
    addToast(`Foto "${photo.title}" movida para a lixeira (guardada por 30 dias).`, 'info');
    if (role === 'adm') {
      addAuditLog(
        'Foto movida para a lixeira',
        `${actor} moveu a foto '${photo.title}' para a lixeira (proteção de 30 dias).`
      );
    }
    setPhotoToTrash(null);
  };

  const handleConfirmTrashVideo = () => {
    if (!siteVideoUrl) return;
    const actor = role === 'adm' ? 'Administrador' : actorName;
    const trashedItem: TrashItem = {
      id: `trash-v-${Date.now()}`,
      title: 'Vídeo do YouTube da Associação',
      type: 'video',
      url: siteVideoUrl,
      removedDate:
        new Date().toLocaleDateString('pt-BR') +
        ' às ' +
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      deletedTimestamp: Date.now(),
      daysRemaining: 30,
      removedBy: actor,
      originalData: siteVideoUrl,
    };
    const nextTrash = [trashedItem, ...trashList];
    setTrashList(nextTrash);
    setSiteVideoUrl('');
    persistTrashAndContent(nextTrash, siteGalleryPhotos, '', siteStoryText, siteStoryTitle, siteTeamPhoto);
    addToast('Vídeo movido para a lixeira (guardado por 30 dias).', 'info');
    if (role === 'adm') {
      addAuditLog(
        'Vídeo movido para a lixeira',
        `${actor} moveu o vídeo do YouTube para a lixeira (proteção de 30 dias).`
      );
    }
    setVideoToTrashConfirm(false);
  };

  const handleRestoreFromTrash = async (item: TrashItem) => {
    let nextGallery = siteGalleryPhotos;
    let nextTeam = siteTeamPhoto;
    let nextVideo = siteVideoUrl;
    if (item.type === 'foto') {
      let restoredUrl = item.url;
      if (restoredUrl.startsWith('data:image/')) {
        try {
          const compressed = await compressDataUrl(restoredUrl, {
            maxDimension: 1120,
            targetMaxBytes: GALLERY_RECOMMENDED_PHOTO_MAX_BYTES,
          });
          if (compressed.compressedBytes < compressed.originalBytes) {
            restoredUrl = compressed.dataUrl;
          }
        } catch {
          // Keep original URL if canvas compression is skipped
        }
      }

      const candidateGallery = [
        {
          id: Date.now(),
          title: item.title,
          url: restoredUrl,
        },
        ...siteGalleryPhotos,
      ];

      if (calculateContentMediaBytes(nextTeam, candidateGallery) > GALLERY_MAX_TOTAL_BYTES) {
        const rebalanced = await compressGalleryToBudget({
          teamPhoto: nextTeam,
          galleryPhotos: candidateGallery,
          maxTotalBytes: GALLERY_MAX_TOTAL_BYTES,
        });
        if (!rebalanced.withinBudget) {
          addToast(
            `Não há espaço no limite de ${formatStorageSize(GALLERY_MAX_TOTAL_BYTES)} para restaurar "${item.title}". Remova uma foto antes.`,
            'error'
          );
          return;
        }
        nextTeam = rebalanced.teamPhoto;
        nextGallery = rebalanced.galleryPhotos;
        setSiteTeamPhoto(nextTeam);
      } else {
        nextGallery = candidateGallery;
      }

      setSiteGalleryPhotos(nextGallery);
      addToast(`Foto "${item.title}" restaurada na galeria do site!`, 'success');
    } else if (item.type === 'video') {
      nextVideo = item.url;
      setSiteVideoUrl(nextVideo);
      addToast(`Vídeo "${item.title}" restaurado com sucesso no site!`, 'success');
    }
    const nextTrash = trashList.filter((t) => t.id !== item.id);
    setTrashList(nextTrash);
    persistTrashAndContent(nextTrash, nextGallery, nextVideo, siteStoryText, siteStoryTitle, nextTeam);
    if (role === 'adm') {
      addAuditLog(
        'Item Restaurado da Lixeira',
        `Administrador restaurou ${item.type === 'foto' ? 'a foto' : 'o vídeo'} '${item.title}' de volta para o site.`
      );
    }
  };

  const handlePermanentDeleteFromTrash = (item: TrashItem) => {
    const nextTrash = trashList.filter((t) => t.id !== item.id);
    setTrashList(nextTrash);
    if (!isTraineeManager) {
      void getIdToken()
        .catch(() => null)
        .then((token) => persistCooperativeSection('trash', nextTrash, token));
    }
    if (role === 'adm') {
      addAuditLog(
        'Exclusão Definitiva',
        `Administrador excluiu definitivamente ${item.type === 'foto' ? 'a foto' : 'o vídeo'} '${item.title}' do sistema.`
      );
    }
    addToast(`${item.type === 'foto' ? 'Foto' : 'Vídeo'} "${item.title}" excluído(a) definitivamente.`, 'info');
  };

  const handleSaveContent = () => {
    const parsedVideo = parseYouTubeUrl(siteVideoUrl);
    if (!parsedVideo.valid) {
      addToast(
        'Somente links do YouTube são aceitos para vídeo (ex: youtube.com/watch?v=... ou youtu.be/...).',
        'error'
      );
      return;
    }
    if (totalMediaBytes > GALLERY_MAX_TOTAL_BYTES) {
      addToast(
        `O total das fotos (${formatStorageSize(totalMediaBytes)}) passa do limite de ${formatStorageSize(GALLERY_MAX_TOTAL_BYTES)}. Clique em "Comprimir fotos agora" antes de salvar.`,
        'error'
      );
      return;
    }

    const normalizedVideo = parsedVideo.watchUrl;
    if (normalizedVideo !== siteVideoUrl) {
      setSiteVideoUrl(normalizedVideo);
    }

    if (!isTraineeManager) {
      persistTrashAndContent(
        trashList,
        siteGalleryPhotos,
        normalizedVideo,
        siteStoryText,
        siteStoryTitle,
        siteTeamPhoto
      );
    }
    addToast('Textos, fotos e vídeo salvos e publicados em Nossa História!', 'success');
    if (role === 'adm') {
      addAuditLog('Conteúdo Atualizado', 'Textos, fotos e vídeo institucional foram atualizados pela gestão.');
    }
  };

  return {
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
    handleUploadTeamPhoto,
    handleUploadGalleryPhotos,
    handleCompressAllGalleryPhotos,
    trashList,
    photoToTrash,
    setPhotoToTrash,
    videoToTrashConfirm,
    setVideoToTrashConfirm,
    handleConfirmTrashPhoto,
    handleConfirmTrashVideo,
    handleRestoreFromTrash,
    handlePermanentDeleteFromTrash,
    handleSaveContent,
  };
}
