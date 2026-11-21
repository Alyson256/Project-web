import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
export const isFirebaseConfigured = Boolean(rawApiKey && rawApiKey.trim().length > 5);

const firebaseConfig: FirebaseOptions = {
  apiKey: rawApiKey || 'AIzaSyDemoPlaceholderKeyForLocalDevelopment99',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'potengi-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'potengi-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'potengi-demo.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

// Padrão singleton para evitar o erro 'Firebase App [DEFAULT] already exists'
export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export async function loginWithGoogle(): Promise<User> {
  try {
    await setPersistence(auth, browserLocalPersistence).catch(() => {
      // Fallback para persistência padrão do navegador caso storage restrito bloqueie IndexedDB/localStorage
    });
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    const authError = error as { code?: string };
    if (
      authError?.code !== 'auth/popup-closed-by-user' &&
      authError?.code !== 'auth/cancelled-popup-request'
    ) {
      console.error('Erro ao autenticar com o Google via Firebase:', error);
    }
    throw error;
  }
}

export async function loginWithGoogleRedirect(): Promise<void> {
  await setPersistence(auth, browserLocalPersistence).catch(() => {
    // Fallback para persistência padrão do navegador
  });
  await signInWithRedirect(auth, googleProvider);
}

export async function consumeGoogleRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch (error) {
    console.error('Erro ao concluir redirecionamento de login Google:', error);
    throw error;
  }
}

export async function logoutFromGoogle(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao desconectar do Firebase:', error);
    throw error;
  }
}

export function getFriendlyGoogleAuthErrorMessage(
  error: unknown,
  language: 'pt' | 'en' = 'pt'
): string {
  const code = (error as { code?: string } | null)?.code;
  const isPt = language === 'pt';

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return isPt
        ? 'A janela de login do Google foi fechada antes de concluir. Toque em "Entrar com Google" para tentar novamente.'
        : 'The Google sign-in window was closed before finishing. Tap "Sign in with Google" to try again.';
    case 'auth/popup-blocked':
      return isPt
        ? 'O navegador bloqueou a janela do Google. Permita pop-ups para este site e tente novamente.'
        : 'Your browser blocked the Google window. Please allow pop-ups for this site and try again.';
    case 'auth/network-request-failed':
      return isPt
        ? 'Não foi possível conectar. Verifique sua internet e tente novamente mais tarde.'
        : 'Could not connect. Please check your internet connection and try again later.';
    case 'auth/too-many-requests':
      return isPt
        ? 'Muitas tentativas em sequência. Aguarde alguns instantes e tente novamente.'
        : 'Too many attempts in a row. Please wait a moment and try again.';
    case 'auth/unauthorized-domain':
    case 'auth/operation-not-allowed':
      return isPt
        ? 'O acesso com Google precisa ser liberado para este endereço. Procure a equipe da associação.'
        : 'Google sign-in needs authorization for this address. Please contact the association team.';
    case 'auth/account-exists-with-different-credential':
    case 'auth/user-disabled':
      return isPt
        ? 'Não foi possível usar esta conta Google no momento. Procure a equipe da associação para conferir seu cadastro.'
        : 'This Google account cannot be used right now. Please contact the association team to verify your account.';
    case 'auth/session-rejected':
      return isPt
        ? 'Não foi possível validar sua sessão Google com segurança. Tente entrar novamente.'
        : 'Could not securely validate your Google session. Please sign in again.';
    default:
      return isPt
        ? 'Não foi possível conectar. Tente novamente mais tarde.'
        : 'Could not connect. Please try again later.';
  }
}
