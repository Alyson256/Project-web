import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Volume2, Square, VolumeX } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface SpeechContextType {
  isSpeechEnabled: boolean;
  toggleSpeech: () => void;
  speechRate: number;
  toggleSpeechRate: () => void;
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export function SpeechProvider({ children }: { children: ReactNode }) {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.8);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const { language } = useLanguage();

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentSpokenText('');
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const cleanText = text.replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.lang = language === 'pt' ? 'pt-BR' : 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpokenText(cleanText);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpokenText('');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpokenText('');
    };

    setCurrentSpokenText(cleanText);
    window.speechSynthesis.speak(utterance);
  }, [speechRate, language]);

  const toggleSpeech = () => {
    const newState = !isSpeechEnabled;
    setIsSpeechEnabled(newState);
    if (!newState) {
      stop();
    } else {
      const msg = language === 'pt'
        ? 'Leitura em voz alta ativada. Toque em qualquer texto para ouvir.'
        : 'Read aloud enabled. Tap any text to hear it.';

      window.setTimeout(() => {
        speak(msg);
      }, 100);
    }
  };

  const toggleSpeechRate = () => {
    setSpeechRate(prev => {
      if (prev === 0.6) return 0.8;
      if (prev === 0.8) return 1.0;
      return 0.6;
    });
  };

  useEffect(() => {
    if (!isSpeechEnabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Não interromper nem ler os próprios botões da barra de controle de fala
      if (target.closest('[data-speech-control="true"]')) {
        return;
      }

      if (
        target.tagName === 'BODY' ||
        target.tagName === 'HTML' ||
        target.tagName === 'MAIN' ||
        target.tagName === 'SECTION'
      ) {
        return;
      }

      const button = target.closest('button');
      const anchor = target.closest('a');

      let textToRead = '';

      if (button) {
        textToRead = button.getAttribute('aria-label') || button.innerText || '';
      } else if (anchor) {
        textToRead = anchor.getAttribute('aria-label') || anchor.innerText || '';
      } else {
        const textElement = target.closest('h1, h2, h3, h4, h5, h6, p, li, label, td, th, span');
        if (textElement) {
          textToRead = textElement.textContent || '';
        }
      }

      if (textToRead && textToRead.trim()) {
        // Evita ler blocos gigantes acidentalmente (limita ao trecho selecionado)
        speak(textToRead.trim().slice(0, 450));
      }
    };

    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      stop();
    };
  }, [isSpeechEnabled, speak, stop]);

  return (
    <SpeechContext.Provider value={{ isSpeechEnabled, toggleSpeech, speechRate, toggleSpeechRate, speak, stop, isSpeaking }}>
      {children}

      {/* Barra Flutuante Acessível de Controle de Voz quando a Leitura em Voz Alta está ativa */}
      {isSpeechEnabled && (
        <div
          data-speech-control="true"
          role="region"
          aria-live="polite"
          aria-label={language === 'pt' ? 'Controle de leitura em voz alta' : 'Read aloud controls'}
          className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-2rem)] max-w-md bg-stone-900 text-white border-2 border-emerald-400 rounded-2xl shadow-2xl px-4 py-3 flex items-center justify-between gap-3 no-print"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSpeaking ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-emerald-400'}`}>
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                {isSpeaking
                  ? (language === 'pt' ? 'Lendo em voz alta' : 'Reading aloud')
                  : (language === 'pt' ? 'Voz ativa · toque em um texto' : 'Voice active · tap any text')}
              </p>
              {currentSpokenText && (
                <p className="text-sm font-bold text-stone-100 truncate">
                  {currentSpokenText}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isSpeaking && (
              <button
                type="button"
                onClick={stop}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                aria-label={language === 'pt' ? 'Parar fala' : 'Stop speaking'}
              >
                <Square className="w-4 h-4 fill-current shrink-0" aria-hidden="true" />
                <span>{language === 'pt' ? 'Parar' : 'Stop'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={toggleSpeech}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
              aria-label={language === 'pt' ? 'Desativar voz' : 'Disable voice'}
            >
              <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{language === 'pt' ? 'Desligar' : 'Off'}</span>
            </button>
          </div>
        </div>
      )}
    </SpeechContext.Provider>
  );
}

export function useSpeech() {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
}
