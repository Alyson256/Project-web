import { useSyncExternalStore } from 'react';

export type ConnectivityReason =
  | 'navigator-offline'
  | 'api-fallback'
  | 'api-unreachable'
  | 'mutation-failed'
  | 'navigation-fallback'
  | 'ping-failed'
  | 'network-ok';

export interface SwConnectivityMessage {
  type: 'SW_CONNECTIVITY';
  online: boolean;
  reason: ConnectivityReason;
  servedFromCache?: boolean;
  mutationBlocked?: boolean;
  url?: string;
  timestamp: number;
}

export interface ConnectivitySnapshot {
  isOnline: boolean;
  statusSource: 'navigator' | 'service-worker' | 'health-ping';
  lastChangedAt: number | null;
  lastOfflineReason: ConnectivityReason | null;
  servedFromCache: boolean;
  mutationBlocked: boolean;
  isChecking: boolean;
  swReady: boolean;
  justReconnected: boolean;
}

const CONNECTIVITY_CHANNEL = 'potengi-connectivity';
const OFFLINE_RECOVERY_POLL_MS = 15000;

let snapshot: ConnectivitySnapshot = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  statusSource: 'navigator',
  lastChangedAt: null,
  lastOfflineReason: typeof navigator !== 'undefined' && !navigator.onLine ? 'navigator-offline' : null,
  servedFromCache: false,
  mutationBlocked: false,
  isChecking: false,
  swReady: false,
  justReconnected: false,
};

const listeners = new Set<() => void>();
let initialized = false;
let recoveryPollId: number | null = null;
let reconnectedBannerTimerId: number | null = null;
let broadcastChannel: BroadcastChannel | null = null;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function updateSnapshot(partial: Partial<ConnectivitySnapshot>) {
  snapshot = { ...snapshot, ...partial };
  emitChange();
}

function stopRecoveryPolling() {
  if (recoveryPollId !== null && typeof window !== 'undefined') {
    window.clearInterval(recoveryPollId);
    recoveryPollId = null;
  }
}

function startRecoveryPolling() {
  if (typeof window === 'undefined' || recoveryPollId !== null) return;
  recoveryPollId = window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      void verifyConnection();
    }
  }, OFFLINE_RECOVERY_POLL_MS);
}

function scheduleReconnectedClear() {
  if (typeof window === 'undefined') return;
  if (reconnectedBannerTimerId !== null) {
    window.clearTimeout(reconnectedBannerTimerId);
  }
  reconnectedBannerTimerId = window.setTimeout(() => {
    reconnectedBannerTimerId = null;
    if (snapshot.justReconnected) {
      updateSnapshot({ justReconnected: false });
    }
  }, 5000);
}

function applyConnectivityState(
  online: boolean,
  source: ConnectivitySnapshot['statusSource'],
  reason: ConnectivityReason,
  options?: { servedFromCache?: boolean; mutationBlocked?: boolean }
) {
  const wasOnline = snapshot.isOnline;

  if (!online) {
    if (reconnectedBannerTimerId !== null && typeof window !== 'undefined') {
      window.clearTimeout(reconnectedBannerTimerId);
      reconnectedBannerTimerId = null;
    }
    updateSnapshot({
      isOnline: false,
      statusSource: source,
      lastChangedAt: wasOnline ? Date.now() : snapshot.lastChangedAt,
      lastOfflineReason: reason,
      servedFromCache: options?.servedFromCache ?? snapshot.servedFromCache,
      mutationBlocked: Boolean(options?.mutationBlocked),
      isChecking: false,
      justReconnected: false,
    });
    startRecoveryPolling();
    return;
  }

  stopRecoveryPolling();
  const recovered = !wasOnline;
  updateSnapshot({
    isOnline: true,
    statusSource: source,
    lastChangedAt: recovered ? Date.now() : snapshot.lastChangedAt,
    lastOfflineReason: recovered ? null : snapshot.lastOfflineReason,
    servedFromCache: false,
    mutationBlocked: false,
    isChecking: false,
    justReconnected: recovered ? true : snapshot.justReconnected,
  });

  if (recovered) {
    scheduleReconnectedClear();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('potengi:sw-online'));
    }
  }
}

function handleSwMessageData(data: unknown) {
  if (!data || typeof data !== 'object') return;
  const msg = data as Partial<SwConnectivityMessage>;
  if (msg.type !== 'SW_CONNECTIVITY' || typeof msg.online !== 'boolean') return;

  applyConnectivityState(msg.online, 'service-worker', msg.reason || (msg.online ? 'network-ok' : 'api-unreachable'), {
    servedFromCache: msg.servedFromCache,
    mutationBlocked: msg.mutationBlocked,
  });
}

function getHealthCheckUrl(): string {
  if (import.meta.env.VITE_USE_DJANGO === 'true') {
    const base = (import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');
    return `${base}/health`;
  }
  return '/manifest.webmanifest';
}

async function pingDirectHealth(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 4500);
  const healthUrl = getHealthCheckUrl();
  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    const ok = response.ok || response.status < 500;
    applyConnectivityState(ok, 'health-ping', ok ? 'network-ok' : 'ping-failed');
    return ok;
  } catch {
    applyConnectivityState(false, 'health-ping', 'ping-failed', { servedFromCache: false });
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function verifyConnection(): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  updateSnapshot({ isChecking: true });

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    applyConnectivityState(false, 'navigator', 'navigator-offline');
    return false;
  }

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({ type: 'SW_PING' });
    } catch {
      // Fallback tratado abaixo
    }
  }

  return pingDirectHealth();
}

export function setServiceWorkerReady(ready: boolean): void {
  if (snapshot.swReady !== ready) {
    updateSnapshot({ swReady: ready });
  }
}

export function clearServiceWorkerApiCache(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    navigator.serviceWorker.controller?.postMessage({ type: 'SW_CLEAR_API_CACHE' });
  } catch {
    // Ignora erro de envio de mensagem ao Service Worker
  }
}

export function clearReconnectedNotice(): void {
  if (snapshot.justReconnected) {
    updateSnapshot({ justReconnected: false });
  }
}

function ensureInitialized() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const handleBrowserOnline = () => {
    void verifyConnection();
  };

  const handleBrowserOffline = () => {
    applyConnectivityState(false, 'navigator', 'navigator-offline');
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && (!navigator.onLine || !snapshot.isOnline)) {
      void verifyConnection();
    }
  };

  window.addEventListener('online', handleBrowserOnline);
  window.addEventListener('offline', handleBrowserOffline);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      broadcastChannel = new BroadcastChannel(CONNECTIVITY_CHANNEL);
      broadcastChannel.addEventListener('message', (event) => handleSwMessageData(event.data));
    } catch {
      broadcastChannel = null;
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      handleSwMessageData(event.data);
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setServiceWorkerReady(true);
    });
    if (navigator.serviceWorker.controller) {
      setServiceWorkerReady(true);
    }
  }

  if (!snapshot.isOnline) {
    startRecoveryPolling();
  }
}

function subscribe(listener: () => void) {
  ensureInitialized();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ConnectivitySnapshot {
  return snapshot;
}

export function useConnectivityStatus() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    ...current,
    checkConnection: verifyConnection,
    clearReconnectedNotice,
  };
}

export function useOnlineStatus(): boolean {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return current.isOnline;
}
