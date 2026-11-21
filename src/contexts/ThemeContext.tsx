import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useConsent } from './ConsentContext';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

type LetterSpacing = 'normal' | 'wide' | 'widest';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: FontSize;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setFontSize: (size: FontSize) => void;
  letterSpacing: LetterSpacing;
  setLetterSpacing: (spacing: LetterSpacing) => void;
  increaseLetterSpacing: () => void;
  isAccessibilityOpen: boolean;
  openAccessibility: () => void;
  closeAccessibility: () => void;
  toggleAccessibility: () => void;
  dyslexiaFont: boolean;
  toggleDyslexiaFont: () => void;
};

const fontSizes: FontSize[] = ['small', 'medium', 'large', 'xlarge'];
const letterSpacings: LetterSpacing[] = ['normal', 'wide', 'widest'];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { canStoreExperience } = useConsent();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && canStoreExperience) {
      const explicitPref = localStorage.getItem('theme_preference');
      if (explicitPref) {
        return explicitPref === 'dark';
      }
    }
    return false;
  });

  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window !== 'undefined' && canStoreExperience) {
      return localStorage.getItem('highContrast') === 'true';
    }
    return false;
  });

  const [letterSpacing, setLetterSpacing] = useState<LetterSpacing>(() => {
    if (typeof window !== 'undefined' && canStoreExperience) {
      return (localStorage.getItem('letterSpacing') as LetterSpacing) || 'normal';
    }
    return 'normal';
  });

  const [dyslexiaFont, setDyslexiaFont] = useState(() => {
    if (typeof window !== 'undefined' && canStoreExperience) {
      return localStorage.getItem('dyslexiaFont') === 'true';
    }
    return false;
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window !== 'undefined' && canStoreExperience) {
      return (localStorage.getItem('fontSize') as FontSize) || 'medium';
    }
    return 'medium';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      if (canStoreExperience) {
        localStorage.setItem('theme', 'dark');
        localStorage.setItem('theme_preference', 'dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
      if (canStoreExperience) {
        localStorage.setItem('theme', 'light');
        localStorage.setItem('theme_preference', 'light');
      }
    }
  }, [isDarkMode, canStoreExperience]);

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
      if (canStoreExperience) {
        localStorage.setItem('highContrast', 'true');
      }
    } else {
      document.documentElement.classList.remove('high-contrast');
      if (canStoreExperience) {
        localStorage.setItem('highContrast', 'false');
      }
    }
  }, [isHighContrast, canStoreExperience]);

  useEffect(() => {
    document.documentElement.classList.remove('text-small', 'text-medium', 'text-large', 'text-xlarge');
    document.documentElement.classList.add(`text-${fontSize}`);
    if (canStoreExperience) {
      localStorage.setItem('fontSize', fontSize);
    }
  }, [fontSize, canStoreExperience]);

  useEffect(() => {
    document.documentElement.classList.remove('tracking-normal', 'tracking-wide', 'tracking-widest');
    document.documentElement.classList.add(`tracking-${letterSpacing}`);
    if (canStoreExperience) {
      localStorage.setItem('letterSpacing', letterSpacing);
    }
  }, [letterSpacing, canStoreExperience]);

  useEffect(() => {
    if (dyslexiaFont) {
      document.documentElement.classList.add('font-dyslexic');
      if (canStoreExperience) {
        localStorage.setItem('dyslexiaFont', 'true');
      }
    } else {
      document.documentElement.classList.remove('font-dyslexic');
      if (canStoreExperience) {
        localStorage.setItem('dyslexiaFont', 'false');
      }
    }
  }, [dyslexiaFont, canStoreExperience]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

  const increaseFontSize = () => {
    setFontSize((prev) => {
      const idx = fontSizes.indexOf(prev);
      return idx < fontSizes.length - 1 ? fontSizes[idx + 1] : prev;
    });
  };

  const increaseLetterSpacing = () => {
    setLetterSpacing((prev) => {
      const idx = letterSpacings.indexOf(prev);
      return idx < letterSpacings.length - 1 ? letterSpacings[idx + 1] : letterSpacings[0]; // cycle
    });
  };
  
  const toggleDyslexiaFont = () => setDyslexiaFont((prev) => !prev);

  const decreaseFontSize = () => {
    setFontSize((prev) => {
      const idx = fontSizes.indexOf(prev);
      return idx > 0 ? fontSizes[idx - 1] : prev;
    });
  };

  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const openAccessibility = () => setIsAccessibilityOpen(true);
  const closeAccessibility = () => setIsAccessibilityOpen(false);
  const toggleAccessibility = () => setIsAccessibilityOpen(prev => !prev);

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      isHighContrast, 
      toggleHighContrast, 
      fontSize, 
      increaseFontSize, 
      decreaseFontSize, 
      setFontSize, 
      letterSpacing, 
      setLetterSpacing,
      increaseLetterSpacing, 
      isAccessibilityOpen,
      openAccessibility,
      closeAccessibility,
      toggleAccessibility,
      dyslexiaFont, 
      toggleDyslexiaFont 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
