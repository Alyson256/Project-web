import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

export const LGPD_POLICY_VERSION = '2026.1';
export const CONSENT_STORAGE_KEY = 'potengi_lgpd_consent_v1';
export const CONSENT_COOKIE_NAME = 'ajb_lgpd_consent';
export const SHOWCASE_PREFS_STORAGE_KEY = 'potengi_showcase_prefs_v1';

export const EXPERIENCE_STORAGE_KEYS = [
  'theme',
  'theme_preference',
  'highContrast',
  'letterSpacing',
  'dyslexiaFont',
  'fontSize',
  'app_language',
] as const;

export const SHOWCASE_STORAGE_KEYS = [SHOWCASE_PREFS_STORAGE_KEY] as const;

export type ConsentCenterTab = 'preferences' | 'rights' | 'data';

export interface ConsentPreferences {
  version: string;
  decided: boolean;
  essential: true;
  experience: boolean;
  showcase: boolean;
  updatedAt: string | null;
}

interface ConsentContextType {
  consent: ConsentPreferences;
  hasDecided: boolean;
  canStoreExperience: boolean;
  canStoreShowcase: boolean;
  isPreferencesOpen: boolean;
  activeTab: ConsentCenterTab;
  setActiveTab: (tab: ConsentCenterTab) => void;
  openPreferences: (tab?: ConsentCenterTab) => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  saveCustomPreferences: (options: { experience: boolean; showcase: boolean }) => void;
  revokeOptionalConsent: () => void;
}

const DEFAULT_CONSENT: ConsentPreferences = {
  version: LGPD_POLICY_VERSION,
  decided: false,
  essential: true,
  experience: false,
  showcase: false,
  updatedAt: null,
};

function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const cookie of cookies) {
    const eqIndex = cookie.indexOf('=');
    if (eqIndex === -1) continue;
    const key = decodeURIComponent(cookie.slice(0, eqIndex));
    if (key === name) {
      return decodeURIComponent(cookie.slice(eqIndex + 1));
    }
  }
  return null;
}

function writeConsentCookie(prefs: ConsentPreferences): void {
  if (typeof document === 'undefined') return;
  try {
    const summary = `v:${prefs.version}|dec:${prefs.decided ? 1 : 0}|exp:${prefs.experience ? 1 : 0}|vit:${prefs.showcase ? 1 : 0}`;
    const maxAgeSeconds = 180 * 24 * 60 * 60; // 180 dias (renovável)
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(summary)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secureFlag}`;
  } catch {
    // Ignora falha caso cookies estejam bloqueados pelo navegador
  }
}

function parseConsentCookie(): ConsentPreferences | null {
  try {
    const raw = readCookieValue(CONSENT_COOKIE_NAME);
    if (!raw) return null;
    const parts = Object.fromEntries(
      raw.split('|').map((chunk) => {
        const [k, v] = chunk.split(':');
        return [k, v];
      })
    );
    if (parts.v !== LGPD_POLICY_VERSION || parts.dec !== '1') return null;
    return {
      version: LGPD_POLICY_VERSION,
      decided: true,
      essential: true,
      experience: parts.exp === '1',
      showcase: parts.vit === '1',
      updatedAt: null,
    };
  } catch {
    return null;
  }
}

export function clearOptionalExperienceStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    for (const key of EXPERIENCE_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore storage errors
  }
}

export function clearOptionalShowcaseStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    for (const key of SHOWCASE_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore storage errors
  }
}

export function readStoredConsent(): ConsentPreferences {
  if (typeof window === 'undefined') return DEFAULT_CONSENT;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
      if (parsed && parsed.version === LGPD_POLICY_VERSION && typeof parsed.decided === 'boolean') {
        return {
          version: LGPD_POLICY_VERSION,
          decided: parsed.decided,
          essential: true,
          experience: Boolean(parsed.experience),
          showcase: Boolean(parsed.showcase),
          updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
        };
      }
    }
  } catch {
    // Fallback para cookie essencial caso localStorage esteja indisponível
  }
  return parseConsentCookie() ?? DEFAULT_CONSENT;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentPreferences>(() => readStoredConsent());
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ConsentCenterTab>('preferences');

  const persistConsent = useCallback((next: ConsentPreferences) => {
    setConsent(next);
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
    writeConsentCookie(next);

    if (!next.experience) {
      clearOptionalExperienceStorage();
    }
    if (!next.showcase) {
      clearOptionalShowcaseStorage();
    }
  }, []);

  useEffect(() => {
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key === CONSENT_STORAGE_KEY) {
        setConsent(readStoredConsent());
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  const openPreferences = useCallback((tab: ConsentCenterTab = 'preferences') => {
    setActiveTab(tab);
    setIsPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    persistConsent({
      version: LGPD_POLICY_VERSION,
      decided: true,
      essential: true,
      experience: true,
      showcase: true,
      updatedAt: new Date().toISOString(),
    });
    setIsPreferencesOpen(false);
  }, [persistConsent]);

  const rejectOptional = useCallback(() => {
    persistConsent({
      version: LGPD_POLICY_VERSION,
      decided: true,
      essential: true,
      experience: false,
      showcase: false,
      updatedAt: new Date().toISOString(),
    });
    setIsPreferencesOpen(false);
  }, [persistConsent]);

  const saveCustomPreferences = useCallback(
    (options: { experience: boolean; showcase: boolean }) => {
      persistConsent({
        version: LGPD_POLICY_VERSION,
        decided: true,
        essential: true,
        experience: options.experience,
        showcase: options.showcase,
        updatedAt: new Date().toISOString(),
      });
      setIsPreferencesOpen(false);
    },
    [persistConsent]
  );

  const revokeOptionalConsent = useCallback(() => {
    persistConsent({
      version: LGPD_POLICY_VERSION,
      decided: true,
      essential: true,
      experience: false,
      showcase: false,
      updatedAt: new Date().toISOString(),
    });
  }, [persistConsent]);

  const hasDecided = consent.decided && consent.version === LGPD_POLICY_VERSION;
  const canStoreExperience = hasDecided && consent.experience;
  const canStoreShowcase = hasDecided && consent.showcase;

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasDecided,
        canStoreExperience,
        canStoreShowcase,
        isPreferencesOpen,
        activeTab,
        setActiveTab,
        openPreferences,
        closePreferences,
        acceptAll,
        rejectOptional,
        saveCustomPreferences,
        revokeOptionalConsent,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextType {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
