import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts';
import type { SocialLinkItem, SocialNetworkId } from '../lib';

function SocialBrandIcon({ network }: { network: SocialNetworkId }) {
  if (network === 'instagram') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 sm:w-5 sm:h-5 high-contrast:stroke-[2.5]"
        aria-hidden="true"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4 sm:w-5 sm:h-5"
      aria-hidden="true"
    >
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
    </svg>
  );
}

export interface FooterSocialLinksProps {
  socialLinks: SocialLinkItem[];
}

export function FooterSocialLinks({ socialLinks }: FooterSocialLinksProps) {
  const { t } = useLanguage();

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="pt-1 space-y-2.5 no-print">
      <p className="text-sm font-extrabold uppercase tracking-wider text-stone-400 high-contrast:text-white">
        {t('footer.social_title', 'Nossas Redes Sociais')}
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        {socialLinks.map((social) => {
          const isInstagram = social.id === 'instagram';
          const ariaLabel = isInstagram
            ? t('footer.social_instagram_aria', 'Abrir Instagram da Associação em nova aba')
            : t('footer.social_facebook_aria', 'Abrir Facebook da Associação em nova aba');

          return (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              className={`group inline-flex items-center gap-2.5 min-h-[48px] min-w-[44px] pl-2 pr-3.5 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 border-2 border-stone-700 text-white font-bold text-sm sm:text-base transition-colors motion-reduce:transition-none high-contrast:bg-black high-contrast:text-white high-contrast:border-2 high-contrast:border-white high-contrast:hover:bg-white high-contrast:hover:text-black high-contrast:hover:border-black ${
                isInstagram
                  ? 'hover:border-pink-400 focus-visible:border-pink-400'
                  : 'hover:border-sky-400 focus-visible:border-sky-400'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm border border-transparent high-contrast:bg-none high-contrast:bg-white high-contrast:text-black high-contrast:border-2 high-contrast:border-black high-contrast:group-hover:bg-black high-contrast:group-hover:text-white high-contrast:group-hover:border-white ${
                  isInstagram
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                    : 'bg-[#1877F2]'
                }`}
              >
                <SocialBrandIcon network={social.id} />
              </span>
              <span>{social.label}</span>
              <ArrowUpRight
                className="w-4 h-4 text-stone-300 group-hover:text-white high-contrast:text-white high-contrast:group-hover:text-black transition-colors motion-reduce:transition-none shrink-0"
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
