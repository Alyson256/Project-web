import { useState, useEffect } from 'react';

// Gerenciamento seguro de contatos com vendedores e limite por hora
const MAX_CONTACTS_PER_HOUR = 5;
const STORAGE_KEY = 'potengi_seller_contact_timestamps';
const SETTINGS_KEY = 'potengi_seller_contact_settings';

export interface SellerContactSettings {
  whatsapp: string;
  authorized: boolean;
  receiveContactsNow: boolean;
}

export const ASSOCIATION_WHATSAPP_NUMBER: string =
  import.meta.env.VITE_ASSOCIATION_WHATSAPP || '';

export const DEFAULT_SELLER_SETTINGS: SellerContactSettings = {
  whatsapp: '',
  authorized: false,
  receiveContactsNow: true,
};

export function formatWhatsAppNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function buildWhatsAppUrl(phone: string | undefined | null, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) {
    return `https://wa.me/?text=${encodedMessage}`;
  }
  const normalizedDigits = digits.length >= 12 && digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${normalizedDigits}?text=${encodedMessage}`;
}

export function getSellerContactTimestamps(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: number[] = JSON.parse(raw);
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return list.filter(t => typeof t === 'number' && t > oneHourAgo);
  } catch {
    return [];
  }
}

export function canContactSeller(): boolean {
  const activeTimestamps = getSellerContactTimestamps();
  return activeTimestamps.length < MAX_CONTACTS_PER_HOUR;
}

export function recordSellerContact(): boolean {
  const activeTimestamps = getSellerContactTimestamps();
  if (activeTimestamps.length >= MAX_CONTACTS_PER_HOUR) {
    return false;
  }
  activeTimestamps.push(Date.now());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTimestamps));
  } catch {
    // Ignora erros de armazenamento local
  }
  return true;
}

export function getSellerContactSettings(): SellerContactSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SELLER_SETTINGS;
    return { ...DEFAULT_SELLER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SELLER_SETTINGS;
  }
}

export function saveSellerContactSettings(settings: SellerContactSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('potengi_seller_settings_changed', { detail: settings }));
  } catch {
    // Ignora erros de armazenamento local
  }
}

export function useSellerSettings() {
  const [settings, setSettings] = useState<SellerContactSettings>(getSellerContactSettings);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getSellerContactSettings());
    };
    window.addEventListener('potengi_seller_settings_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('potengi_seller_settings_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateSettings = (newSettings: SellerContactSettings) => {
    saveSellerContactSettings(newSettings);
    setSettings(newSettings);
  };

  return { settings, updateSettings };
}

export function getArtistPhoto(artist?: string): string {
  const seed = (artist || 'Artesão').trim();
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=047857,0f766e,b45309&textColor=ffffff`;
}
