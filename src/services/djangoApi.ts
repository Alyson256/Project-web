import { auth } from './firebase';
import type { ProductItem } from '../types';

export interface GoogleUserPayload {
  uid: string;
  email: string | null;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  display_name: string;
  picture: string;
  id_token?: string;
}

export interface CreateProductPayload {
  title: string;
  technique: string;
  description?: string;
  image?: string;
  stock: number;
  price: number;
  isAvailable?: boolean;
}

export interface UpdateProductPayload {
  title?: string;
  technique?: string;
  description?: string;
  image?: string;
  stock?: number;
  price?: number;
  isAvailable?: boolean;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export function isDjangoBackendEnabled(): boolean {
  return import.meta.env.VITE_USE_DJANGO === 'true';
}

export const isBackendConfigured = isDjangoBackendEnabled;

export function getApiBaseUrl(): string {
  if (isDjangoBackendEnabled()) {
    return (import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');
  }
  return '';
}

let backendSessionToken: string | null = null;

export function setBackendSessionToken(token: string | null): void {
  if (!isDjangoBackendEnabled()) {
    backendSessionToken = null;
    return;
  }
  backendSessionToken = token && token.trim() ? token.trim() : null;
}

export function getBackendSessionToken(): string | null {
  if (!isDjangoBackendEnabled()) {
    return null;
  }
  return backendSessionToken;
}

async function resolveAuthToken(overrideToken?: string | null): Promise<string | null> {
  if (overrideToken) return overrideToken;
  const activeSessionJwt = getBackendSessionToken();
  if (activeSessionJwt) {
    return activeSessionJwt;
  }
  if (auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken();
    } catch {
      // Fallback handled below
    }
  }
  if (import.meta.env.DEV) {
    try {
      const saved = localStorage.getItem('potengi_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const uid = parsed?.profile?.uid || parsed?.user?.uid;
        if (typeof uid === 'string' && uid.startsWith('dev_')) {
          return uid;
        }
      }
    } catch {
      // Ignore storage error
    }
  }
  return null;
}

function extractApiErrorMessage(errData: unknown, fallbackStatus: number): string {
  if (!errData || typeof errData !== 'object') {
    return `Erro na API (${fallbackStatus})`;
  }
  const record = errData as Record<string, unknown>;
  if (typeof record.error === 'string' && record.error.trim()) return record.error;
  if (typeof record.detail === 'string' && record.detail.trim()) return record.detail;
  const nestedError = record.error && typeof record.error === 'object' ? (record.error as Record<string, unknown>) : record;
  for (const val of Object.values(nestedError)) {
    if (typeof val === 'string' && val.trim()) return val;
    if (Array.isArray(val) && typeof val[0] === 'string' && val[0].trim()) return val[0];
  }
  return `Erro na API (${fallbackStatus})`;
}

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  overrideToken?: string | null
): Promise<T> {
  if (!isDjangoBackendEnabled()) {
    const offlineBackendError: ApiError = new Error(
      'Modo somente Frontend ativo. Conecte o backend Django (VITE_USE_DJANGO=true) para sincronizar com o servidor.'
    );
    offlineBackendError.status = 503;
    offlineBackendError.code = 'BACKEND_NOT_CONNECTED';
    throw offlineBackendError;
  }

  const token = await resolveAuthToken(overrideToken);
  const baseUrl = getApiBaseUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${baseUrl}${normalizedEndpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Erro na API (${response.status})`;
    try {
      const errData = await response.json();
      errorMessage = extractApiErrorMessage(errData, response.status);
    } catch {
      // Ignore JSON parse error on error response
    }
    const apiError: ApiError = new Error(errorMessage);
    apiError.status = response.status;
    throw apiError;
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Cliente REST unificado da Cooperativa.
 * Quando `VITE_USE_DJANGO=true`, comunica diretamente com `VITE_DJANGO_API_URL`.
 * Em modo apenas Frontend (`VITE_USE_DJANGO=false`), falha de forma controlada sem chamar rotas inexistentes.
 */
export const cooperativeApi = {
  getHealth: () => apiRequest<{ status: string; service?: string; backend?: string }>('/health'),

  // === AUTENTICAÇÃO E MEMBROS ===
  syncGoogleUser: (data: GoogleUserPayload, token?: string | null) =>
    apiRequest<{
      user?: Record<string, any> | null;
      role?: string | null;
      access?: string | null;
      access_token?: string | null;
      token?: string | null;
      session_token?: string | null;
    }>('/auth/google-sync', { method: 'POST', body: JSON.stringify(data) }, token),

  syncUser: (token?: string | null) =>
    apiRequest('/auth/sync', { method: 'POST' }, token),

  getMembers: async (token?: string | null) => {
    const data = await apiRequest<{ success?: boolean; members?: any[] } | any[]>('/cooperative/members', {}, token);
    if (Array.isArray(data)) return { success: true, members: data };
    return { success: Boolean(data?.success ?? true), members: Array.isArray(data?.members) ? data.members : [] };
  },

  getMyContactSettings: (token?: string | null) =>
    apiRequest<{
      success: boolean;
      settings: { whatsapp: string; authorized: boolean; receiveContactsNow: boolean };
    }>('/cooperative/members/me/contact', {}, token),

  updateMyContactSettings: (
    settings: { whatsapp: string; authorized: boolean; receiveContactsNow: boolean },
    token?: string | null
  ) =>
    apiRequest<{
      success: boolean;
      settings: { whatsapp: string; authorized: boolean; receiveContactsNow: boolean };
    }>('/cooperative/members/me/contact', { method: 'PATCH', body: JSON.stringify(settings) }, token),

  updateMemberRole: (
    emailOrId: string | number,
    role: string,
    statusOrMeta?:
      | string
      | {
          status?: string;
          stepText?: string;
          trainingTarget?: 'produtor' | 'colaborador' | 'gestor';
          completedStepsCount?: number;
          totalStepsCount?: number;
          lastActivityDate?: string;
          reason?: string;
          actionLabel?: string;
        },
    token?: string | null
  ) => {
    const encoded = encodeURIComponent(String(emailOrId));
    const meta = typeof statusOrMeta === 'string' ? { status: statusOrMeta } : statusOrMeta || {};
    return apiRequest(
      `/cooperative/members/${encoded}/role`,
      { method: 'PATCH', body: JSON.stringify({ role, ...meta }) },
      token
    );
  },

  //Compatibilidade com nomes legados
  getUsers: (token?: string | null) =>
    apiRequest('/cooperative/members', {}, token),
  updateUserRole: (id: string | number, role: string, token?: string | null) =>
    apiRequest(
      `/cooperative/members/${encodeURIComponent(String(id))}/role`,
      { method: 'PATCH', body: JSON.stringify({ role }) },
      token
    ),

  // === PRODUTOS / CATÁLOGO (REST GRANULAR + RBAC) ===
  getProducts: async (token?: string | null): Promise<ProductItem[]> => {
    const data = await apiRequest<{ products?: ProductItem[]; results?: ProductItem[] } | ProductItem[]>(
      '/products',
      {},
      token
    );
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    return Array.isArray(data?.results) ? data.results : [];
  },

  createProduct: async (payload: CreateProductPayload, token?: string | null): Promise<ProductItem> => {
    const data = await apiRequest<{ product?: ProductItem } | ProductItem>(
      '/products',
      { method: 'POST', body: JSON.stringify(payload) },
      token
    );
    return ('product' in (data as any) && (data as any).product ? (data as any).product : data) as ProductItem;
  },

  updateProduct: async (
    id: string | number,
    payload: UpdateProductPayload,
    token?: string | null
  ): Promise<ProductItem> => {
    const data = await apiRequest<{ product?: ProductItem } | ProductItem>(
      `/products/${id}`,
      { method: 'PATCH', body: JSON.stringify(payload) },
      token
    );
    return ('product' in (data as any) && (data as any).product ? (data as any).product : data) as ProductItem;
  },

  approveProduct: async (id: string | number, token?: string | null): Promise<ProductItem> => {
    const data = await apiRequest<{ product?: ProductItem } | ProductItem>(
      `/products/${id}/approve`,
      { method: 'POST', body: JSON.stringify({}) },
      token
    );
    return ('product' in (data as any) && (data as any).product ? (data as any).product : data) as ProductItem;
  },

  requestProductAdjustment: async (
    id: string | number,
    reason: string,
    token?: string | null
  ): Promise<ProductItem> => {
    const data = await apiRequest<{ product?: ProductItem } | ProductItem>(
      `/products/${id}/request-adjustment`,
      { method: 'POST', body: JSON.stringify({ reason }) },
      token
    );
    return ('product' in (data as any) && (data as any).product ? (data as any).product : data) as ProductItem;
  },

  deleteProduct: (id: string | number, token?: string | null) =>
    apiRequest(`/products/${id}`, { method: 'DELETE' }, token),

  // === AUDITORIA ===
  getAuditLogs: (token?: string | null) =>
    apiRequest<{ success: boolean; logs: any[] }>('/audit-logs', {}, token),

  // === EVENTOS, AVISOS E TICKETS ===
  getEvents: (token?: string | null) => apiRequest('/events', {}, token),
  createEvent: (data: unknown, token?: string | null) =>
    apiRequest('/events', { method: 'POST', body: JSON.stringify(data) }, token),

  getAnnouncements: (token?: string | null) => apiRequest('/announcements', {}, token),

  getTickets: (token?: string | null) => apiRequest('/tickets', {}, token),
  createTicket: (data: unknown, token?: string | null) =>
    apiRequest('/tickets', { method: 'POST', body: JSON.stringify(data) }, token),
  updateTicketStatus: (id: string | number, status: string, token?: string | null) =>
    apiRequest(`/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token),
};

// Alias retrocompatível para código legado
export const djangoApi = cooperativeApi;
