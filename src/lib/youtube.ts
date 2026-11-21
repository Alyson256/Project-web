export interface ParsedYouTubeUrl {
  valid: boolean;
  videoId: string | null;
  watchUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
}

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

const ALLOWED_YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

export function parseYouTubeUrl(rawUrl: string | null | undefined): ParsedYouTubeUrl {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return {
      valid: true,
      videoId: null,
      watchUrl: '',
      embedUrl: '',
      thumbnailUrl: '',
    };
  }

  let parsed: URL;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsed = new URL(withProtocol);
  } catch {
    return {
      valid: false,
      videoId: null,
      watchUrl: '',
      embedUrl: '',
      thumbnailUrl: '',
    };
  }

  const host = parsed.hostname.toLowerCase();
  if (!ALLOWED_YOUTUBE_HOSTS.has(host)) {
    return {
      valid: false,
      videoId: null,
      watchUrl: '',
      embedUrl: '',
      thumbnailUrl: '',
    };
  }

  let videoId: string | null = null;
  const pathSegments = parsed.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be' || host === 'www.youtu.be') {
    videoId = pathSegments[0] || null;
  } else {
    if (parsed.pathname === '/watch' || parsed.pathname.startsWith('/watch/')) {
      videoId = parsed.searchParams.get('v');
    } else if (
      pathSegments[0] === 'embed' ||
      pathSegments[0] === 'shorts' ||
      pathSegments[0] === 'live' ||
      pathSegments[0] === 'v'
    ) {
      videoId = pathSegments[1] || null;
    }
  }

  if (!videoId || !YOUTUBE_ID_REGEX.test(videoId)) {
    return {
      valid: false,
      videoId: null,
      watchUrl: '',
      embedUrl: '',
      thumbnailUrl: '',
    };
  }

  return {
    valid: true,
    videoId,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

export function getYouTubeEmbedUrl(rawUrl: string | null | undefined): string | null {
  const parsed = parseYouTubeUrl(rawUrl);
  return parsed.valid && parsed.embedUrl ? parsed.embedUrl : null;
}

export function getYouTubeWatchUrl(rawUrl: string | null | undefined): string | null {
  const parsed = parseYouTubeUrl(rawUrl);
  return parsed.valid && parsed.watchUrl ? parsed.watchUrl : null;
}
