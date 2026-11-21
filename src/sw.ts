// Service Worker customizado — Associação Julieta Barros
// Monitora conectividade real, gerencia cache offline da Vitrine/Dashboard
// e notifica abas ativas imediatamente em caso de queda ou retorno de conexão.

interface PrecacheEntry {
  url: string;
  revision?: string | null;
}

interface SwExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}

interface SwFetchEvent extends SwExtendableEvent {
  readonly request: Request;
  readonly clientId: string;
  respondWith(response: Promise<Response> | Response): void;
}

interface SwMessageEvent extends SwExtendableEvent {
  readonly data: any;
  readonly source: SwWindowClient | null;
}

interface SwWindowClient {
  id: string;
  postMessage(message: unknown): void;
}

interface SwClients {
  claim(): Promise<void>;
  matchAll(options?: { type?: 'window' | 'worker' | 'sharedworker' | 'all'; includeUncontrolled?: boolean }): Promise<SwWindowClient[]>;
}

interface SwGlobalScope {
  readonly __WB_MANIFEST: Array<PrecacheEntry | string>;
  readonly location: Location;
  readonly clients: SwClients;
  skipWaiting(): Promise<void>;
  addEventListener(type: 'install' | 'activate', listener: (event: SwExtendableEvent) => void): void;
  addEventListener(type: 'fetch', listener: (event: SwFetchEvent) => void): void;
  addEventListener(type: 'message', listener: (event: SwMessageEvent) => void): void;
}

const sw = self as unknown as SwGlobalScope;

const APP_SHELL_CACHE = 'potengi-shell-v1';
const API_CACHE = 'potengi-api-v1';
const MEDIA_CACHE = 'potengi-media-v1';
const ACTIVE_CACHES = new Set([APP_SHELL_CACHE, API_CACHE, MEDIA_CACHE]);
const CONNECTIVITY_CHANNEL = 'potengi-connectivity';

export interface SwConnectivityPayload {
  type: 'SW_CONNECTIVITY';
  online: boolean;
  reason:
    | 'navigator-offline'
    | 'api-fallback'
    | 'api-unreachable'
    | 'mutation-failed'
    | 'navigation-fallback'
    | 'ping-failed'
    | 'network-ok';
  servedFromCache?: boolean;
  mutationBlocked?: boolean;
  url?: string;
  timestamp: number;
}

let lastBroadcastOnline: boolean | null = null;
let lastBroadcastReason: string | null = null;
let lastBroadcastAt = 0;

function extractPrecacheUrls(): string[] {
  const wbManifest = (self as unknown as { __WB_MANIFEST?: Array<PrecacheEntry | string> }).__WB_MANIFEST;
  const manifest = Array.isArray(wbManifest) ? wbManifest : [];
  const urls = new Set<string>(['/', '/index.html', '/manifest.webmanifest']);
  for (const entry of manifest) {
    const rawUrl = typeof entry === 'string' ? entry : entry?.url;
    if (!rawUrl) continue;
    const normalized = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
    urls.add(normalized);
  }
  return Array.from(urls);
}

async function broadcastConnectivity(
  payload: Omit<SwConnectivityPayload, 'type' | 'timestamp'>,
  force = false
): Promise<void> {
  const now = Date.now();
  const isDuplicateSameState =
    !force &&
    lastBroadcastOnline === payload.online &&
    lastBroadcastReason === payload.reason &&
    now - lastBroadcastAt < 1500;

  if (isDuplicateSameState) return;

  lastBroadcastOnline = payload.online;
  lastBroadcastReason = payload.reason;
  lastBroadcastAt = now;

  const message: SwConnectivityPayload = {
    type: 'SW_CONNECTIVITY',
    ...payload,
    timestamp: now,
  };

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const channel = new BroadcastChannel(CONNECTIVITY_CHANNEL);
      channel.postMessage(message);
      channel.close();
    } catch {
      // Ignora restrições do BroadcastChannel em contextos isolados
    }
  }

  try {
    const clientList = await sw.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });
    for (const client of clientList) {
      client.postMessage(message);
    }
  } catch {
    // Ignora erros de envio de mensagem aos clientes
  }
}

async function pingServerHealth(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);
  const probeUrl = '/manifest.webmanifest';
  try {
    const response = await fetch(probeUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'X-SW-Connectivity-Check': '1' },
    });
    if (response.ok) {
      await broadcastConnectivity({ online: true, reason: 'network-ok', url: probeUrl }, true);
      return true;
    }
    if (response.status >= 500) {
      await broadcastConnectivity(
        { online: false, reason: 'ping-failed', url: probeUrl },
        true
      );
      return false;
    }
    await broadcastConnectivity({ online: true, reason: 'network-ok', url: probeUrl }, true);
    return true;
  } catch {
    await broadcastConnectivity(
      { online: false, reason: 'ping-failed', servedFromCache: false, url: probeUrl },
      true
    );
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

function shouldSkipInterception(request: Request, url: URL): boolean {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return true;

  // Nunca interceptar módulos HMR/dev do Vite ou fluxos de autenticação Google/Firebase
  if (
    url.origin === sw.location.origin &&
    (url.pathname.startsWith('/@vite/') ||
      url.pathname.startsWith('/@fs/') ||
      url.pathname.startsWith('/node_modules/') ||
      url.pathname.startsWith('/src/') ||
      url.pathname.includes('hot-update'))
  ) {
    return true;
  }

  if (
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('accounts.google.com') ||
    url.hostname.includes('apis.google.com') ||
    url.pathname.startsWith('/api/auth/')
  ) {
    return true;
  }

  // Ignora requisições Range (vídeo/áudio streaming)
  if (request.headers.has('range')) return true;

  return false;
}

function isCacheablePublicReadApi(pathname: string): boolean {
  return (
    pathname === '/api/products' ||
    pathname.startsWith('/api/products/') ||
    pathname === '/api/events' ||
    pathname === '/api/announcements' ||
    pathname.startsWith('/api/cooperative/store/')
  );
}

function isImageOrFontRequest(request: Request, url: URL): boolean {
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'images.unsplash.com' ||
    url.hostname === 'api.dicebear.com'
  ) {
    return true;
  }
  return (
    request.destination === 'image' ||
    request.destination === 'font' ||
    /\.(?:png|jpe?g|svg|webp|ico|woff2?)$/i.test(url.pathname)
  );
}

function buildOfflineJsonResponse(message: string, mutationBlocked = false): Response {
  return new Response(
    JSON.stringify({
      success: false,
      offline: true,
      mutationBlocked,
      error: message,
    }),
    {
      status: 503,
      statusText: 'Service Unavailable (Offline)',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Potengi-Offline': '1',
      },
    }
  );
}

async function handleApiHealthRequest(request: Request, pathname: string): Promise<Response> {
  try {
    const response = await fetch(request);
    if (response.ok) {
      void broadcastConnectivity({ online: true, reason: 'network-ok', url: pathname });
    }
    return response;
  } catch {
    void broadcastConnectivity(
      { online: false, reason: 'ping-failed', servedFromCache: false, url: pathname },
      true
    );
    return buildOfflineJsonResponse('Servidor indisponível ou sem internet no momento.');
  }
}

async function handleApiRequest(request: Request, url: URL): Promise<Response> {
  const { pathname } = url;

  if (pathname === '/api/health') {
    return handleApiHealthRequest(request, pathname);
  }

  // Escritas/mutações no Dashboard nunca devem parecer concluídas offline
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const response = await fetch(request);
      if (response.status < 500) {
        void broadcastConnectivity({ online: true, reason: 'network-ok', url: pathname });
      }
      return response;
    } catch {
      void broadcastConnectivity(
        {
          online: false,
          reason: 'mutation-failed',
          mutationBlocked: true,
          servedFromCache: false,
          url: pathname,
        },
        true
      );
      return buildOfflineJsonResponse(
        'Você está sem conexão com a internet. Aguarde a conexão voltar para salvar esta alteração.',
        true
      );
    }
  }

  // Leituras GET: Network-First com fallback de cache para Vitrine / Produtos
  const canCacheRead = isCacheablePublicReadApi(pathname);
  try {
    const response = await fetch(request);
    if (response.ok) {
      void broadcastConnectivity({ online: true, reason: 'network-ok', url: pathname });
      if (canCacheRead) {
        const cache = await caches.open(API_CACHE);
        void cache.put(request, response.clone());
      }
    } else if (response.status < 500) {
      void broadcastConnectivity({ online: true, reason: 'network-ok', url: pathname });
    }
    return response;
  } catch {
    if (canCacheRead) {
      const cache = await caches.open(API_CACHE);
      const cached = await cache.match(request);
      if (cached) {
        void broadcastConnectivity(
          { online: false, reason: 'api-fallback', servedFromCache: true, url: pathname },
          true
        );
        const headers = new Headers(cached.headers);
        headers.set('X-Potengi-Cache', 'offline-fallback');
        return new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers,
        });
      }
    }

    void broadcastConnectivity(
      { online: false, reason: 'api-unreachable', servedFromCache: false, url: pathname },
      true
    );
    return buildOfflineJsonResponse('Sem conexão com a internet no momento.');
  }
}

async function handleMediaRequest(request: Request): Promise<Response> {
  const cache = await caches.open(MEDIA_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === 'opaque')) {
        void cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    void networkPromise;
    return cached;
  }

  const fresh = await networkPromise;
  if (fresh) return fresh;

  return new Response('', { status: 504, statusText: 'Media Offline Fallback' });
}

async function handleNavigationRequest(request: Request, url: URL): Promise<Response> {
  try {
    const response = await fetch(request);
    if (response.ok) {
      void broadcastConnectivity({ online: true, reason: 'network-ok', url: url.pathname });
      const cache = await caches.open(APP_SHELL_CACHE);
      void cache.put('/index.html', response.clone());
    }
    return response;
  } catch {
    const cache = await caches.open(APP_SHELL_CACHE);
    const cachedPage =
      (await cache.match(request)) ||
      (await cache.match('/index.html')) ||
      (await cache.match('/'));

    if (cachedPage) {
      void broadcastConnectivity(
        {
          online: false,
          reason: 'navigation-fallback',
          servedFromCache: true,
          url: url.pathname,
        },
        true
      );
      return cachedPage;
    }

    void broadcastConnectivity(
      {
        online: false,
        reason: 'api-unreachable',
        servedFromCache: false,
        url: url.pathname,
      },
      true
    );
    return new Response(
      '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Modo Offline — Associação Julieta Barros</title></head><body style="font-family:sans-serif;padding:2rem;text-align:center;"><h1>Sem conexão com a internet</h1><p>Verifique sua conexão e tente atualizar a página.</p></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

async function handleStaticAssetRequest(request: Request): Promise<Response> {
  const shellCache = await caches.open(APP_SHELL_CACHE);
  const cached = await shellCache.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  if (response.ok) {
    void shellCache.put(request, response.clone());
  }
  return response;
}

sw.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const urls = extractPrecacheUrls();
      const cache = await caches.open(APP_SHELL_CACHE);
      await Promise.allSettled(
        urls.map(async (assetUrl) => {
          try {
            await cache.add(assetUrl);
          } catch {
            // Ignora falha individual no precache para não travar a instalação em dev
          }
        })
      );
      await sw.skipWaiting();
    })()
  );
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const existingCaches = await caches.keys();
      await Promise.all(
        existingCaches.map((cacheKey) => {
          if (!ACTIVE_CACHES.has(cacheKey)) {
            return caches.delete(cacheKey);
          }
          return Promise.resolve(false);
        })
      );
      await sw.clients.claim();
    })()
  );
});

sw.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'SW_PING') {
    event.waitUntil(pingServerHealth());
  } else if (data.type === 'SW_CLEAR_API_CACHE') {
    event.waitUntil(caches.delete(API_CACHE));
  }
});

sw.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (shouldSkipInterception(request, url)) {
    return;
  }

  if (url.origin === sw.location.origin && url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request, url));
    return;
  }

  if (request.mode === 'navigate' && url.origin === sw.location.origin && !url.pathname.startsWith('/api/')) {
    event.respondWith(handleNavigationRequest(request, url));
    return;
  }

  if (isImageOrFontRequest(request, url)) {
    event.respondWith(handleMediaRequest(request));
    return;
  }

  if (url.origin === sw.location.origin && request.method === 'GET') {
    event.respondWith(handleStaticAssetRequest(request));
  }
});
