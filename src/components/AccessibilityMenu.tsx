import React, { useEffect, useRef } from 'react';
import { Sun, Moon, Type, X, Eye, SpellCheck, Volume2, VolumeX, Globe } from 'lucide-react';
import { useLanguage, useSpeech, useTheme } from '../contexts';
import { useFocusTrap } from '../hooks';

const vibrate = (pattern: number | number[] = 50) => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try { window.navigator.vibrate(pattern); } catch (e) {}
  }
};

// Componente Visual de Toggle Switch (Interruptor Deslizante)
interface ToggleSwitchProps {
  id?: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}

function ToggleSwitch({ id, checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => {
        vibrate(40);
        onChange();
      }}
      className={`relative inline-flex items-center h-11 w-[76px] shrink-0 cursor-pointer rounded-full p-1 border-2 transition-colors duration-200 ease-in-out motion-reduce:transition-none focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50 shadow-inner ${
        checked
          ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700 dark:border-emerald-400'
          : 'bg-stone-300 dark:bg-stone-700 border-stone-400 dark:border-stone-600'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white dark:bg-stone-100 shadow-md ring-1 ring-black/10 transition-transform duration-200 ease-in-out motion-reduce:transition-none flex items-center justify-center ${
          checked ? 'translate-x-8' : 'translate-x-0'
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            checked ? 'bg-emerald-600 dark:bg-emerald-600' : 'bg-stone-400 dark:bg-stone-500'
          }`}
        />
      </span>
    </button>
  );
}

// Linha de configuração com interruptor deslizante e textos de alto contraste
interface SettingToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
  extraAction?: React.ReactNode;
}

function SettingToggleRow({
  icon,
  title,
  description,
  isActive,
  onToggle,
  extraAction
}: SettingToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-800/90 border-2 border-stone-200 dark:border-stone-700/80 shadow-xs hover:border-emerald-500/40 transition-colors">
      <div className="flex items-start gap-3 min-w-0 pr-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
          {icon}
        </div>
        <div>
          <span className="font-black text-lg sm:text-xl text-stone-900 dark:text-white block leading-tight">
            {title}
          </span>
          <p className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200 mt-1 leading-snug">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {extraAction}
        <ToggleSwitch
          checked={isActive}
          onChange={onToggle}
          label={`${title}: ${isActive ? 'ativado' : 'desativado'}`}
        />
      </div>
    </div>
  );
}

export function AccessibilityMenu() {
  const { 
    isDarkMode,
    toggleTheme,
    isHighContrast, 
    toggleHighContrast, 
    fontSize, 
    setFontSize,
    dyslexiaFont,
    toggleDyslexiaFont,
    letterSpacing,
    setLetterSpacing,
    isAccessibilityOpen,
    openAccessibility,
    closeAccessibility
  } = useTheme();

  const { isSpeechEnabled, toggleSpeech, speechRate, toggleSpeechRate } = useSpeech();
  const { language, setLanguage, t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isAccessibilityOpen, modalRef, closeAccessibility);

  // Trava a rolagem da página de fundo no mobile enquanto o modal estiver aberto
  useEffect(() => {
    if (isAccessibilityOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAccessibilityOpen]);

  const fontOptions: Array<{ id: 'small' | 'medium' | 'large' | 'xlarge'; symbol: string; labelKey: string; defaultLabel: string; textClass: string }> = [
    { id: 'small', symbol: 'A-', labelKey: 'access.font_small', defaultLabel: 'Pequena', textClass: 'text-sm' },
    { id: 'medium', symbol: 'A', labelKey: 'access.font_normal', defaultLabel: 'Normal', textClass: 'text-base' },
    { id: 'large', symbol: 'A+', labelKey: 'access.font_large', defaultLabel: 'Grande', textClass: 'text-lg' },
    { id: 'xlarge', symbol: 'A++', labelKey: 'access.font_xlarge', defaultLabel: 'Maior', textClass: 'text-xl' }
  ];

  const languageOptions = [
    { code: 'pt' as const, label: t('access.lang_pt', 'Português 🇧🇷') },
    { code: 'en' as const, label: t('access.lang_en', 'English 🇺🇸') }
  ];

  const themeOptions = [
    { isDark: false, label: t('access.theme_light', 'Tema claro'), icon: Sun },
    { isDark: true, label: t('access.theme_dark', 'Tema escuro'), icon: Moon }
  ];

  return (
    <>
      {isAccessibilityOpen && (
        <>
          {/* Fundo escurecido com toque para fechar */}
          <div
            onClick={() => { vibrate(); closeAccessibility(); }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] no-print animate-in fade-in"
            aria-hidden="true"
          />

          {/* Janela Modal de Acessibilidade */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-modal-title"
            className="fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] bg-surface-nav dark:bg-stone-900 border-t-2 sm:border-2 border-stone-300 dark:border-stone-700 shadow-2xl rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[88vh] flex flex-col overflow-hidden no-print animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
          >
            {/* Cabeçalho do modal - Fixo e separado, nunca sobrepõe o conteúdo */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b-2 border-stone-200 dark:border-stone-800 bg-surface-nav dark:bg-stone-900 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 flex items-center justify-center font-black text-lg border border-emerald-300 dark:border-emerald-700 shrink-0" aria-hidden="true">
                  Aa
                </span>
                <div>
                  <h3 id="accessibility-modal-title" className="font-black text-xl sm:text-2xl text-stone-900 dark:text-white leading-tight">
                    {t('access.modal_title', 'Acessibilidade')}
                  </h3>
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                    {t('access.modal_subtitle', 'Ajuste a tela para o seu conforto')}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => { vibrate(); closeAccessibility(); }}
                className="min-h-[56px] px-4 py-2.5 rounded-2xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white flex items-center gap-2 text-base font-black transition-colors cursor-pointer shrink-0"
                aria-label={t('nav.fechar', 'Fechar')}
              >
                <X className="w-5 h-5 shrink-0" />
                <span>{t('nav.fechar', 'Fechar')}</span>
              </button>
            </div>

            {/* Corpo do modal - rolagem independente, componentes dinâmicos e modulares */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* 1. Idioma do Site (Language Selector) */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-stone-900 dark:text-white">
                  <Globe className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <label className="text-base sm:text-lg font-black">
                    {t('access.lang_title', 'Idioma do site (Language)')}
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => { vibrate(); setLanguage(opt.code); }}
                      className={`min-h-[56px] px-4 py-3 rounded-2xl border-2 flex items-center justify-center gap-2.5 text-base font-black transition-all cursor-pointer ${
                        language === opt.code
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/60'
                      }`}
                      aria-pressed={language === opt.code}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-stone-200 dark:border-stone-800" />

              {/* 2. Tema da Tela: Claro ou Escuro */}
              <div className="space-y-2.5">
                <label className="block text-base sm:text-lg font-black text-stone-900 dark:text-white">
                  {t('access.theme_title', 'Cores da tela (Tema)')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {themeOptions.map((theme) => {
                    const ThemeIcon = theme.icon;
                    const isSelected = theme.isDark ? isDarkMode : !isDarkMode;
                    return (
                      <button
                        key={theme.label}
                        type="button"
                        onClick={() => {
                          vibrate();
                          if (theme.isDark !== isDarkMode) toggleTheme();
                        }}
                        className={`min-h-[56px] px-4 py-3 rounded-2xl border-2 flex items-center justify-center gap-2.5 text-base font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                            : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                        }`}
                      >
                        <ThemeIcon className="w-5 h-5 shrink-0" />
                        <span>{theme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-stone-200 dark:border-stone-800" />

              {/* 3. Tamanho da Letra (Mínimo 16px, até A++) */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-stone-900 dark:text-white">
                  <Type className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <label className="text-base sm:text-lg font-black">
                    {t('access.font_size_title', 'Tamanho da letra')}
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {fontOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => { vibrate(); setFontSize(opt.id); }}
                      className={`min-h-[56px] flex flex-col items-center justify-center p-1.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        fontSize === opt.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 font-black'
                          : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold'
                      }`}
                      aria-label={t(opt.labelKey, opt.defaultLabel)}
                    >
                      <span className={`${opt.textClass} font-black`}>{opt.symbol}</span>
                      <span className="text-xs font-bold">{t(opt.labelKey, opt.defaultLabel)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-stone-200 dark:border-stone-800" />

              {/* 4. Alto Contraste (Toggle Switch Deslizante) */}
              <SettingToggleRow
                icon={<Eye className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />}
                title={t('access.contrast_title', 'Alto contraste')}
                description={t('access.contrast_desc', 'Bordas e cores mais fortes para facilitar a visão')}
                isActive={isHighContrast}
                onToggle={toggleHighContrast}
              />

              {/* 5. Fonte para Dislexia (Toggle Switch Deslizante) */}
              <SettingToggleRow
                icon={<SpellCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />}
                title={t('access.dyslexia_title', 'Fonte para dislexia')}
                description={t('access.dyslexia_desc', 'Letras com desenho mais fácil de diferenciar')}
                isActive={dyslexiaFont}
                onToggle={toggleDyslexiaFont}
              />

              {/* 6. Espaçamento entre Letras */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-800/90 border-2 border-stone-200 dark:border-stone-700/80 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800 font-black text-lg">
                    ↔
                  </div>
                  <div>
                    <span className="font-black text-lg sm:text-xl text-stone-900 dark:text-white block leading-tight">
                      {t('access.spacing_title', 'Espaço entre letras')}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200 mt-1 leading-snug">
                      {t('access.spacing_desc', 'Mais respiro no texto')}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { vibrate(); setLetterSpacing('normal'); }}
                    aria-pressed={letterSpacing === 'normal'}
                    className={`min-h-[52px] px-3 py-2 text-sm sm:text-base font-black rounded-xl border-2 transition-all cursor-pointer ${
                      letterSpacing === 'normal'
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    {t('access.spacing_normal', 'Normal')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { vibrate(); setLetterSpacing('wide'); }}
                    aria-pressed={letterSpacing === 'wide'}
                    className={`min-h-[52px] px-3 py-2 text-sm sm:text-base font-black rounded-xl border-2 transition-all cursor-pointer ${
                      letterSpacing === 'wide'
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    {t('access.spacing_wide', 'Largo')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { vibrate(); setLetterSpacing('widest'); }}
                    aria-pressed={letterSpacing === 'widest'}
                    className={`min-h-[52px] px-3 py-2 text-sm sm:text-base font-black rounded-xl border-2 transition-all cursor-pointer ${
                      letterSpacing === 'widest'
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    {t('access.spacing_widest', 'Muito Largo')}
                  </button>
                </div>
              </div>

              {/* 7. Leitura em Voz Alta (Toggle Switch Deslizante) */}
              <SettingToggleRow
                icon={isSpeechEnabled ? <Volume2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" /> : <VolumeX className="w-5 h-5 text-stone-400 shrink-0" />}
                title={t('access.speech_title', 'Leitura em voz alta')}
                description={t('access.speech_desc', 'Ouvir os textos da tela')}
                isActive={isSpeechEnabled}
                onToggle={toggleSpeech}
                extraAction={isSpeechEnabled ? (
                  <button
                    type="button"
                    onClick={() => { vibrate(); toggleSpeechRate(); }}
                    className="min-h-[44px] text-sm font-black bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 cursor-pointer"
                    title="Velocidade da narração"
                  >
                    {speechRate}x
                  </button>
                ) : undefined}
              />

              {/* Botão de Fechar no final do conteúdo com rolagem */}
              <div className="pt-6 mt-6 border-t-2 border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => { vibrate(); closeAccessibility(); }}
                  className="w-full min-h-[56px] px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <X className="w-5 h-5 shrink-0" />
                  <span>{t('access.close_btn', 'Pronto, fechar')}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
