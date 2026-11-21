export type SocialNetworkId = 'instagram' | 'facebook';

export interface SocialLinkItem {
  id: SocialNetworkId;
  label: string;
  url: string;
}

/**
 * Normaliza e valida URLs externas lidas de variáveis de ambiente.
 * Bloqueia esquemas inseguros (ex.: javascript:, data:) e garante protocolo HTTP/HTTPS válido.
 */
export function normalizeExternalUrl(rawValue?: string): string | null {
  if (!rawValue) return null;

  const trimmed = rawValue.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:')
  ) {
    return null;
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Monta os links das redes sociais configuradas via arquivo .env (VITE_SOCIAL_*).
 * Redes sem URL configurada ou com formato inválido são omitidas com segurança.
 */
export function getConfiguredSocialLinks(): SocialLinkItem[] {
  const candidates: Array<{ id: SocialNetworkId; label: string; raw?: string }> = [
    {
      id: 'instagram',
      label: 'Instagram',
      raw: import.meta.env.VITE_SOCIAL_INSTAGRAM_URL,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      raw: import.meta.env.VITE_SOCIAL_FACEBOOK_URL,
    },
  ];

  return candidates.reduce<SocialLinkItem[]>((acc, item) => {
    const safeUrl = normalizeExternalUrl(item.raw);
    if (safeUrl) {
      acc.push({
        id: item.id,
        label: item.label,
        url: safeUrl,
      });
    }
    return acc;
  }, []);
}

/**
 * Abre URL externa segura em nova aba usando elemento <a> programático
 * para evitar bloqueios de pop-up em navegadores restritivos e respeitar iframes.
 */
export function openExternalUrl(rawUrl: string): void {
  const safeUrl = normalizeExternalUrl(rawUrl);
  if (!safeUrl || typeof document === 'undefined') return;

  const anchor = document.createElement('a');
  anchor.href = safeUrl;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
