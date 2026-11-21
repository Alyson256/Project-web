export const GALLERY_MAX_TOTAL_BYTES = 2 * 1024 * 1024; // 2 MB máximo total para carregamento rápido da página
export const GALLERY_RECOMMENDED_PHOTO_MAX_BYTES = 160 * 1024; // ~160 KB alvo por foto comprimida via canvas
export const MAX_IMAGE_FILE_BYTES = 12 * 1024 * 1024; // 12 MB máximo do arquivo original selecionado

export interface CompressedImageResult {
  dataUrl: string;
  originalBytes: number;
  compressedBytes: number;
  width: number;
  height: number;
}

export interface CompressOptions {
  maxDimension?: number;
  targetMaxBytes?: number;
  initialQuality?: number;
  minQuality?: number;
}

export interface GalleryBudgetCompressionInput<T extends { id: number; title: string; url: string }> {
  teamPhoto: string;
  galleryPhotos: T[];
  maxTotalBytes?: number;
  perPhotoTargetBytes?: number;
}

export interface GalleryBudgetCompressionResult<T extends { id: number; title: string; url: string }> {
  teamPhoto: string;
  galleryPhotos: T[];
  beforeBytes: number;
  afterBytes: number;
  savedBytes: number;
  withinBudget: boolean;
}

export function estimateImageUrlBytes(url: string | null | undefined): number {
  const trimmed = (url || '').trim();
  if (!trimmed) return 0;

  if (trimmed.startsWith('data:')) {
    const commaIdx = trimmed.indexOf(',');
    if (commaIdx === -1) return trimmed.length;
    const base64Part = trimmed.slice(commaIdx + 1);
    const padding = base64Part.endsWith('==') ? 2 : base64Part.endsWith('=') ? 1 : 0;
    return Math.max(0, Math.floor((base64Part.length * 3) / 4) - padding);
  }

  return new TextEncoder().encode(trimmed).length;
}

export function calculateContentMediaBytes(
  teamPhoto: string | null | undefined,
  galleryPhotos: Array<{ url: string }>
): number {
  const teamBytes = estimateImageUrlBytes(teamPhoto);
  const galleryBytes = galleryPhotos.reduce((acc, photo) => acc + estimateImageUrlBytes(photo.url), 0);
  return teamBytes + galleryBytes;
}

export function formatStorageSize(bytes: number, language: 'pt' | 'en' = 'pt'): string {
  if (bytes <= 0) {
    return '0 KB';
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.max(1, Math.round(kb))} KB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2).replace('.', language === 'pt' ? ',' : '.')} MB`;
}

export function isValidImageSource(value: string | null | undefined): boolean {
  const trimmed = (value || '').trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('data:image/')) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function getPreferredOutputFormat(canvas: HTMLCanvasElement): 'image/webp' | 'image/jpeg' {
  try {
    const probe = canvas.toDataURL('image/webp', 0.8);
    if (probe.startsWith('data:image/webp')) {
      return 'image/webp';
    }
  } catch {
    // Fallback para formato JPEG
  }
  return 'image/jpeg';
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Não foi possível abrir a imagem selecionada.'));
    img.src = src;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo de imagem.'));
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Formato de imagem inválido.'));
      }
    };
    reader.readAsDataURL(file);
  });
}

function compressLoadedImageWithCanvas(
  img: HTMLImageElement,
  originalBytes: number,
  fallbackSrc: string | null,
  options: CompressOptions = {}
): CompressedImageResult {
  const maxDimension = options.maxDimension ?? 1200;
  const targetMaxBytes = options.targetMaxBytes ?? GALLERY_RECOMMENDED_PHOTO_MAX_BYTES;
  const initialQuality = options.initialQuality ?? 0.8;
  const minQuality = options.minQuality ?? 0.46;

  const naturalWidth = img.naturalWidth || img.width;
  const naturalHeight = img.naturalHeight || img.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    if (!fallbackSrc) {
      throw new Error('Seu navegador não conseguiu processar a imagem no canvas.');
    }
    return {
      dataUrl: fallbackSrc,
      originalBytes,
      compressedBytes: originalBytes,
      width: naturalWidth,
      height: naturalHeight,
    };
  }

  let currentMaxDim = maxDimension;
  let currentQuality = initialQuality;
  let bestDataUrl = fallbackSrc || '';
  let bestBytes = fallbackSrc ? originalBytes : Number.POSITIVE_INFINITY;
  let bestWidth = naturalWidth;
  let bestHeight = naturalHeight;

  const format = getPreferredOutputFormat(canvas);

  for (let pass = 0; pass < 7; pass += 1) {
    const longestSide = Math.max(naturalWidth, naturalHeight, 1);
    const scale = Math.min(1, currentMaxDim / longestSide);
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));

    canvas.width = width;
    canvas.height = height;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    const candidate = canvas.toDataURL(format, currentQuality);
    const candidateBytes = estimateImageUrlBytes(candidate);

    if (candidateBytes < bestBytes || !bestDataUrl) {
      bestDataUrl = candidate;
      bestBytes = candidateBytes;
      bestWidth = width;
      bestHeight = height;
    }

    if (candidateBytes <= targetMaxBytes) {
      break;
    }

    if (currentQuality > minQuality + 0.04) {
      currentQuality = Math.max(minQuality, Number((currentQuality - 0.1).toFixed(2)));
    } else {
      currentMaxDim = Math.max(480, Math.round(currentMaxDim * 0.78));
    }
  }

  // Libera memória de buffer do canvas imediatamente após uso
  canvas.width = 0;
  canvas.height = 0;

  return {
    dataUrl: bestDataUrl,
    originalBytes,
    compressedBytes: bestBytes,
    width: bestWidth,
    height: bestHeight,
  };
}

export async function compressDataUrl(
  sourceDataUrl: string,
  options: CompressOptions = {}
): Promise<CompressedImageResult> {
  const originalBytes = estimateImageUrlBytes(sourceDataUrl);
  const img = await loadImageElement(sourceDataUrl);
  return compressLoadedImageWithCanvas(img, originalBytes, sourceDataUrl, options);
}

export async function compressImageFileToDataUrl(
  file: File,
  options: CompressOptions = {}
): Promise<CompressedImageResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Escolha um arquivo de foto válido (JPG, PNG ou WebP).');
  }
  if (file.size > MAX_IMAGE_FILE_BYTES) {
    throw new Error('A foto escolhida é muito grande. Escolha uma imagem de até 12 MB.');
  }

  const canUseObjectUrl =
    typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function';

  if (canUseObjectUrl) {
    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await loadImageElement(objectUrl);
      const result = compressLoadedImageWithCanvas(img, file.size, null, options);
      return {
        ...result,
        originalBytes: Math.max(file.size, result.originalBytes),
      };
    } catch {
      // Fallback para FileReader caso ObjectURL falhe em algum navegador restrito
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  const rawDataUrl = await readFileAsDataUrl(file);
  const result = await compressDataUrl(rawDataUrl, options);
  return {
    ...result,
    originalBytes: Math.max(file.size, result.originalBytes),
  };
}

export async function compressGalleryToBudget<T extends { id: number; title: string; url: string }>({
  teamPhoto,
  galleryPhotos,
  maxTotalBytes = GALLERY_MAX_TOTAL_BYTES,
  perPhotoTargetBytes,
}: GalleryBudgetCompressionInput<T>): Promise<GalleryBudgetCompressionResult<T>> {
  const beforeBytes = calculateContentMediaBytes(teamPhoto, galleryPhotos);
  const embeddedCount =
    (teamPhoto.startsWith('data:image/') ? 1 : 0) +
    galleryPhotos.filter((photo) => photo.url.startsWith('data:image/')).length;

  if (embeddedCount === 0) {
    return {
      teamPhoto,
      galleryPhotos,
      beforeBytes,
      afterBytes: beforeBytes,
      savedBytes: 0,
      withinBudget: beforeBytes <= maxTotalBytes,
    };
  }

  const dynamicTargetBytes = Math.max(
    45 * 1024,
    Math.min(
      perPhotoTargetBytes ?? GALLERY_RECOMMENDED_PHOTO_MAX_BYTES,
      Math.floor((maxTotalBytes * 0.9) / embeddedCount)
    )
  );
  const adaptiveMaxDim = dynamicTargetBytes <= 85 * 1024 ? 800 : 1024;

  let nextTeamPhoto = teamPhoto;
  if (teamPhoto.startsWith('data:image/')) {
    const compressedTeam = await compressDataUrl(teamPhoto, {
      maxDimension: adaptiveMaxDim,
      targetMaxBytes: dynamicTargetBytes,
      initialQuality: 0.76,
      minQuality: 0.44,
    });
    if (compressedTeam.compressedBytes < compressedTeam.originalBytes) {
      nextTeamPhoto = compressedTeam.dataUrl;
    }
  }

  const nextGallery: T[] = [];
  for (const photo of galleryPhotos) {
    if (!photo.url.startsWith('data:image/')) {
      nextGallery.push(photo);
      continue;
    }
    const compressed = await compressDataUrl(photo.url, {
      maxDimension: adaptiveMaxDim,
      targetMaxBytes: dynamicTargetBytes,
      initialQuality: 0.76,
      minQuality: 0.44,
    });
    nextGallery.push(
      compressed.compressedBytes < compressed.originalBytes
        ? { ...photo, url: compressed.dataUrl }
        : photo
    );
  }

  const afterBytes = calculateContentMediaBytes(nextTeamPhoto, nextGallery);
  return {
    teamPhoto: nextTeamPhoto,
    galleryPhotos: nextGallery,
    beforeBytes,
    afterBytes,
    savedBytes: Math.max(0, beforeBytes - afterBytes),
    withinBudget: afterBytes <= maxTotalBytes,
  };
}
