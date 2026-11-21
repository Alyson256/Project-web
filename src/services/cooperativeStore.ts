import type { AnnouncementItem, EventItem, ProductItem } from '../types';
import type { HelpTicket } from '../components';
import type { SpaceEvent } from '../data';
import { getApiBaseUrl, isDjangoBackendEnabled } from './djangoApi';

export interface CooperativeSiteContent {
  storyTitle?: string;
  storyText: string;
  teamPhoto?: string;
  galleryPhotos: Array<{ id: number; title: string; url: string }>;
  videoUrl: string;
}

export const DEFAULT_SITE_CONTENT: CooperativeSiteContent = {
  storyTitle: 'Nossa História e Raízes',
  storyText:
    'A Associação Julieta Barros nasceu com o propósito de valorizar a arte manual e as tradições potiguares. Aqui, diferentes gerações se encontram para preservar saberes como a modelagem da argila no barro vermelho, a renda de bilro tecida com esmero e o trançado de fibras naturais.\n\nNo nosso Departamento de Vendas Rosa Mística, cada peça é exposta com carinho para que quem produz receba o justo valor por seu trabalho, fortalecendo a nossa comunidade.',
  teamPhoto: '',
  galleryPhotos: [],
  videoUrl: '',
};

export const SITE_CONTENT_UPDATED_EVENT = 'potengi:site-content-updated';

export interface CooperativeStorePayload {
  products?: ProductItem[];
  events?: EventItem[];
  publicEvents?: SpaceEvent[];
  announcements?: AnnouncementItem[];
  tickets?: HelpTicket[];
  promotions?: unknown[];
  trash?: unknown[];
  auditLogs?: Array<{ id: string; action: string; details: string; date: string; user: string }>;
  siteContent?: CooperativeSiteContent;
  updatedAt?: string;
}

const LOCAL_STORE_CACHE_KEY = 'potengi_cooperative_store_cache_v1';

export function readCachedStore(): CooperativeStorePayload {
  try {
    const raw = localStorage.getItem(LOCAL_STORE_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CooperativeStorePayload;
  } catch {
    return {};
  }
}

export function normalizeSiteContent(raw?: Partial<CooperativeSiteContent> | null): CooperativeSiteContent {
  let legacyStory = '';
  let legacyGallery: Array<{ id: number; title: string; url: string }> = [];

  try {
    const savedStory = localStorage.getItem('potengi_public_story');
    if (savedStory && savedStory.trim()) {
      legacyStory = savedStory.trim();
    }
    const savedGallery = localStorage.getItem('potengi_public_gallery');
    if (savedGallery) {
      const parsed = JSON.parse(savedGallery);
      if (Array.isArray(parsed)) {
        legacyGallery = parsed
          .filter((p: { url?: string }) => typeof p?.url === 'string' && p.url.trim().length > 0)
          .map((p: { id?: number; title?: string; alt?: string; url?: string }) => ({
            id: typeof p.id === 'number' ? p.id : Date.now(),
            title: String(p.title || p.alt || 'Atividade do Ateliê'),
            url: String(p.url || '').trim(),
          }));
      }
    }
  } catch {
    // Ignore storage read errors
  }

  const cachedSite = raw ?? readCachedStore().siteContent;
  const resolvedTitle =
    typeof cachedSite?.storyTitle === 'string' && cachedSite.storyTitle.trim()
      ? cachedSite.storyTitle.trim()
      : DEFAULT_SITE_CONTENT.storyTitle || 'Nossa História e Raízes';
  const resolvedText =
    typeof cachedSite?.storyText === 'string' && cachedSite.storyText.trim()
      ? cachedSite.storyText.trim()
      : legacyStory || DEFAULT_SITE_CONTENT.storyText;
  const resolvedTeamPhoto = typeof cachedSite?.teamPhoto === 'string' ? cachedSite.teamPhoto.trim() : '';
  const resolvedGallery = Array.isArray(cachedSite?.galleryPhotos)
    ? cachedSite.galleryPhotos
        .filter((p) => p && typeof p.url === 'string' && p.url.trim().length > 0)
        .map((p) => ({
          id: typeof p.id === 'number' ? p.id : Date.now(),
          title: String(p.title || 'Atividade do Ateliê'),
          url: p.url.trim(),
        }))
    : legacyGallery;
  const resolvedVideoUrl = typeof cachedSite?.videoUrl === 'string' ? cachedSite.videoUrl.trim() : '';

  return {
    storyTitle: resolvedTitle,
    storyText: resolvedText,
    teamPhoto: resolvedTeamPhoto,
    galleryPhotos: resolvedGallery,
    videoUrl: resolvedVideoUrl,
  };
}

export function readCachedSiteContent(): CooperativeSiteContent {
  return normalizeSiteContent(readCachedStore().siteContent);
}

export function writeCachedStore(patch: Partial<CooperativeStorePayload>): void {
  try {
    const current = readCachedStore();
    localStorage.setItem(
      LOCAL_STORE_CACHE_KEY,
      JSON.stringify({ ...current, ...patch, updatedAt: new Date().toISOString() })
    );
    if (patch.siteContent && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SITE_CONTENT_UPDATED_EVENT, { detail: patch.siteContent }));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchCooperativeStore(): Promise<CooperativeStorePayload | null> {
  if (!isDjangoBackendEnabled()) {
    return readCachedStore();
  }
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return readCachedStore();

  try {
    const response = await fetch(`${baseUrl}/cooperative/store`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data?.store) {
      writeCachedStore(data.store);
      return data.store as CooperativeStorePayload;
    }
    return null;
  } catch {
    return null;
  }
}

export async function persistCooperativeSection<K extends keyof CooperativeStorePayload>(
  section: K,
  value: CooperativeStorePayload[K],
  authToken?: string | null
): Promise<boolean> {
  writeCachedStore({ [section]: value });
  if (!isDjangoBackendEnabled()) {
    return true;
  }
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return true;

  try {
    const response = await fetch(`${baseUrl}/cooperative/store/${section}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ data: value }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
