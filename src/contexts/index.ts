export { AuthProvider, useAuth, type AuthSignInStage, type UserProfile, type UserRole } from './AuthProvider';
export {
  CONSENT_COOKIE_NAME,
  CONSENT_STORAGE_KEY,
  ConsentProvider,
  LGPD_POLICY_VERSION,
  SHOWCASE_PREFS_STORAGE_KEY,
  readStoredConsent,
  useConsent,
  type ConsentCenterTab,
  type ConsentPreferences,
} from './ConsentContext';
export {
  LanguageProvider,
  useLanguage,
  type Language,
  type LanguageContextType,
} from './LanguageContext';
export {
  ProductContext,
  ProductProvider,
  useProducts,
  type ProductContextValue,
} from './ProductContext';
export { SpeechProvider, useSpeech } from './SpeechContext';
export { ThemeProvider, useTheme } from './ThemeContext';
export { ToastProvider, useToast } from './ToastContext';
