import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode } from 'react';
import { User, onAuthStateChanged, getIdToken } from 'firebase/auth';
import {
  auth,
  consumeGoogleRedirectResult,
  loginWithGoogle as firebaseLoginWithGoogle,
  loginWithGoogleRedirect,
  logoutFromGoogle,
} from '../services/firebase';
import { djangoApi, setBackendSessionToken } from '../services/djangoApi';
import { clearServiceWorkerApiCache } from '../hooks/useOnlineStatus';

export type UserRole =
  | 'produtor'
  | 'colaborador'
  | 'gestor'
  | 'adm'
  | 'visitante'
  | 'aprendiz'
  | 'aprendiz_gestor'
  | null;

export interface UserProfile {
  uid: string;
  email: string | null;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  display_name: string;
  picture: string;
  role: UserRole;
  cooperative_status?: 'ativo' | 'em_aprovacao' | 'treinamento' | null;
}

export type AuthSignInStage = 'popup' | 'verifying' | 'completed';

type AuthContextType = {
  role: UserRole;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isLoading: boolean;
  signInWithGoogle: (onStageChange?: (stage: AuthSignInStage) => void) => Promise<User>;
  loginWithGoogle: (onStageChange?: (stage: AuthSignInStage) => void) => Promise<User>;
  signInWithGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  setRole: (role: UserRole) => void;
  loginAsRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUserRole = (rawRole: unknown): UserRole => {
  if (rawRole === 'colaborador') return 'produtor';
  if (
    rawRole === 'produtor' ||
    rawRole === 'gestor' ||
    rawRole === 'adm' ||
    rawRole === 'visitante' ||
    rawRole === 'aprendiz' ||
    rawRole === 'aprendiz_gestor'
  ) {
    return rawRole;
  }
  return 'visitante';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Toggle para backend externo Django (opcional via .env)
  const USE_DJANGO_BACKEND = import.meta.env.VITE_USE_DJANGO === 'true';
  const inflightSyncRef = useRef<Map<string, Promise<UserProfile>>>(new Map());

  const syncUserWithBackend = useCallback(async (currentUser: User): Promise<UserProfile> => {
    const existingSync = inflightSyncRef.current.get(currentUser.uid);
    if (existingSync) {
      return existingSync;
    }

    const syncPromise = (async () => {
      const googleProviderProfile =
        currentUser.providerData?.find((p) => p?.providerId === 'google.com') || currentUser.providerData?.[0];
      const rawDisplayName = (currentUser.displayName || googleProviderProfile?.displayName || '').trim();
      const nameParts = rawDisplayName ? rawDisplayName.split(/\s+/) : [];
      const fallbackEmail = currentUser.email || googleProviderProfile?.email || null;
      const firstName = nameParts[0] || (fallbackEmail ? fallbackEmail.split('@')[0] : 'Usuário');
      const lastName = nameParts.slice(1).join(' ') || '';
      const picture =
        currentUser.photoURL ||
        googleProviderProfile?.photoURL ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName)}`;
      const emailVerified = Boolean(currentUser.emailVerified);

      let idToken = '';
      try {
        idToken = await getIdToken(currentUser);
      } catch (tokenErr) {
        console.warn('Não foi possível obter idToken do Firebase:', tokenErr);
      }

      const googlePayload = {
        uid: currentUser.uid,
        email: fallbackEmail,
        email_verified: emailVerified,
        first_name: firstName,
        last_name: lastName,
        display_name: rawDisplayName || `${firstName} ${lastName}`.trim(),
        picture,
        id_token: idToken,
      };

      let backendUser: Record<string, any> | null = null;
      let rawRole: unknown = null;
      let authRejected = false;

      if (USE_DJANGO_BACKEND) {
        try {
          const backendData = await djangoApi.syncGoogleUser(
            googlePayload,
            idToken || null
          );
          backendUser = backendData?.user || null;
          rawRole = backendUser?.role || backendData?.role;
          const issuedJwt =
            backendData?.access ||
            backendData?.access_token ||
            backendData?.token ||
            backendData?.session_token ||
            null;
          setBackendSessionToken(typeof issuedJwt === 'string' ? issuedJwt : null);
        } catch (apiErr: any) {
          if (apiErr?.status === 401) {
            try {
              const refreshedToken = await getIdToken(currentUser, true);
              const retryData = await djangoApi.syncGoogleUser(
                { ...googlePayload, id_token: refreshedToken },
                refreshedToken
              );
              backendUser = retryData?.user || null;
              rawRole = backendUser?.role || retryData?.role;
              const issuedJwt =
                retryData?.access ||
                retryData?.access_token ||
                retryData?.token ||
                retryData?.session_token ||
                null;
              setBackendSessionToken(typeof issuedJwt === 'string' ? issuedJwt : null);
            } catch (retryErr: any) {
              if (retryErr?.status === 401) {
                authRejected = true;
              } else {
                console.warn('Backend Django indisponível ao tentar renovar token:', retryErr);
              }
            }
          } else {
            console.warn('Backend Django indisponível, aplicando perfil padrão:', apiErr);
          }
        }
      } else {
        // Backend desligado: mantém JWT interno e status cooperativo nulos até interligação futura
        setBackendSessionToken(null);
        try {
          const saved = localStorage.getItem('potengi_current_user');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.profile?.uid === currentUser.uid) {
              backendUser = parsed.profile;
              rawRole = parsed.profile.role;
            }
          }
        } catch {
          // Ignore storage error
        }
      }

      if (authRejected) {
        setBackendSessionToken(null);
        localStorage.removeItem('potengi_current_user');
        try {
          await logoutFromGoogle();
        } catch {
          // Ignore secondary signOut errors
        }
        setUser(null);
        setRole(null);
        setUserProfile(null);
        setLoading(false);
        const sessionError = new Error('Sua sessão Google expirou ou não pôde ser validada. Faça login novamente.') as Error & { code?: string };
        sessionError.code = 'auth/session-rejected';
        throw sessionError;
      }

      const resolvedRole = normalizeUserRole(rawRole);
      const coopStatus: UserProfile['cooperative_status'] =
        (backendUser?.cooperative_status as UserProfile['cooperative_status']) ?? null;
      const canonicalFirstName = String(backendUser?.first_name || '').trim() || firstName;
      const canonicalLastName = String(backendUser?.last_name ?? lastName).trim();
      const canonicalDisplayName =
        String(backendUser?.display_name || '').trim() ||
        rawDisplayName ||
        `${canonicalFirstName} ${canonicalLastName}`.trim();
      const canonicalPicture = String(backendUser?.picture || '').trim() || picture;
      const canonicalEmail = (backendUser?.email as string | null | undefined) ?? fallbackEmail;
      const canonicalEmailVerified = Boolean(backendUser?.email_verified ?? emailVerified);

      const fullProfile: UserProfile = {
        uid: String(backendUser?.uid || currentUser.uid),
        email: canonicalEmail,
        email_verified: canonicalEmailVerified,
        first_name: canonicalFirstName,
        last_name: canonicalLastName,
        display_name: canonicalDisplayName,
        picture: canonicalPicture,
        role: resolvedRole,
        cooperative_status: coopStatus,
      };

      setUser(currentUser);
      setRole(resolvedRole);
      setUserProfile(fullProfile);

      try {
        localStorage.setItem('potengi_current_user', JSON.stringify({
          user: {
            uid: currentUser.uid,
            email: canonicalEmail,
            displayName: canonicalDisplayName,
            photoURL: canonicalPicture,
            emailVerified: canonicalEmailVerified,
          },
          role: resolvedRole,
          profile: fullProfile,
        }));
      } catch {
        // Ignore storage quota errors
      }

      setLoading(false);
      return fullProfile;
    })();

    inflightSyncRef.current.set(currentUser.uid, syncPromise);
    try {
      return await syncPromise;
    } finally {
      inflightSyncRef.current.delete(currentUser.uid);
    }
  }, [USE_DJANGO_BACKEND]);

  useEffect(() => {
    let active = true;
    let restoredDevSession = false;

    setLoading(true);

    // 1. Restaurar sessão persistida se existir (descarta sessões dev em produção)
    const savedSession = localStorage.getItem('potengi_current_user');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        const isDevUid = typeof parsed?.profile?.uid === 'string' && parsed.profile.uid.startsWith('dev_');
        if (!import.meta.env.DEV && isDevUid) {
          localStorage.removeItem('potengi_current_user');
        } else if (parsed?.user && parsed?.role) {
          const restoredRole = normalizeUserRole(parsed.role);
          setUser(parsed.user as User);
          setRole(restoredRole);
          if (parsed.profile) {
            setUserProfile({ ...parsed.profile, role: restoredRole });
          }
          if (isDevUid) {
            restoredDevSession = true;
            setLoading(false);
          }
        }
      } catch (e) {
        console.error('Erro ao restaurar sessão:', e);
        localStorage.removeItem('potengi_current_user');
      }
    }

    // 2. Consome eventual retorno de login via redirect em navegadores móveis / WebView
    void consumeGoogleRedirectResult().catch(() => {
      // Erros de redirect são registrados no serviço Firebase sem travar inicialização
    });

    // 3. Ouvinte nativo do Firebase Auth para sincronizar estado global de usuário e loading inicial
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!active) return;
        try {
          if (currentUser) {
            setUser(currentUser);
            try {
              await syncUserWithBackend(currentUser);
            } catch (syncErr) {
              console.warn('Não foi possível manter a sessão Google sincronizada:', syncErr);
            }
          } else {
            let isDevSession = restoredDevSession;
            if (import.meta.env.DEV && !isDevSession) {
              try {
                const localSession = localStorage.getItem('potengi_current_user');
                if (localSession) {
                  const parsed = JSON.parse(localSession);
                  isDevSession = typeof parsed?.profile?.uid === 'string' && parsed.profile.uid.startsWith('dev_');
                }
              } catch {
                isDevSession = false;
              }
            }

            if (!isDevSession && active) {
              setBackendSessionToken(null);
              localStorage.removeItem('potengi_current_user');
              setUser(null);
              setRole(null);
              setUserProfile(null);
            }
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      },
      (authError) => {
        console.error('Erro ao observar estado de autenticação do Firebase:', authError);
        if (active) {
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      unsubscribeAuth();
    };
  }, [syncUserWithBackend]);

  // Função exclusiva de Login com Google usando Firebase Auth
  const signInWithGoogle = useCallback(async (onStageChange?: (stage: AuthSignInStage) => void): Promise<User> => {
    try {
      onStageChange?.('popup');
      const googleUser = await firebaseLoginWithGoogle();
      if (googleUser) {
        onStageChange?.('verifying');
        await syncUserWithBackend(googleUser);
        onStageChange?.('completed');
      }
      return googleUser;
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error('Falha na autenticação com Google via Firebase Auth:', error);
      }
      throw error;
    }
  }, [syncUserWithBackend]);

  const signInWithGoogleRedirect = useCallback(async () => {
    await loginWithGoogleRedirect();
  }, []);

  // Atalho de demonstração / testes rápidos para simulação de cargos (apenas em desenvolvimento)
  const loginAsRole = useCallback((targetRole: UserRole) => {
    if (!import.meta.env.DEV) {
      return;
    }
    if (!targetRole) {
      localStorage.removeItem('potengi_current_user');
      setUser(null);
      setRole(null);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    const normalizedRole = normalizeUserRole(targetRole);
    let email = 'visitante@potengi.org';
    let displayName = 'Visitante';
    if (normalizedRole === 'aprendiz') {
      email = 'laura@potengi.org';
      displayName = 'Dona Laura (Aprendiz Artesã)';
    } else if (normalizedRole === 'aprendiz_gestor') {
      email = 'carlos@potengi.org';
      displayName = 'Carlos (Aprendiz de Gestão)';
    } else if (normalizedRole === 'produtor') {
      email = 'maria@potengi.org';
      displayName = 'Maria Artesã';
    } else if (normalizedRole === 'gestor') {
      email = 'ana@potengi.org';
      displayName = 'Ana Gestora';
    } else if (normalizedRole === 'adm') {
      email = 'admin@potengi.org';
      displayName = 'Administrador Geral';
    }

    const nameParts = displayName.split(/\s+/);
    const firstName = nameParts[0] || 'Usuário';
    const lastName = nameParts.slice(1).join(' ') || '';
    const picture = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName)}`;

    const mockProfile: UserProfile = {
      uid: 'dev_' + normalizedRole,
      email: email,
      email_verified: true,
      first_name: firstName,
      last_name: lastName,
      display_name: displayName,
      picture: picture,
      role: normalizedRole,
      cooperative_status: normalizedRole === 'aprendiz' ? 'treinamento' : 'ativo',
    };

    const mockUser = {
      uid: mockProfile.uid,
      email: email,
      displayName: displayName,
      photoURL: picture,
      emailVerified: true,
      isAnonymous: false,
    } as unknown as User;

    setUser(mockUser);
    setRole(normalizedRole);
    setUserProfile(mockProfile);
    setLoading(false);

    localStorage.setItem('potengi_current_user', JSON.stringify({
      user: {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoURL: picture,
        emailVerified: true,
      },
      role: normalizedRole,
      profile: mockProfile,
    }));
  }, []);

  const logout = useCallback(async () => {
    setBackendSessionToken(null);
    localStorage.removeItem('potengi_current_user');
    clearServiceWorkerApiCache();
    try {
      await logoutFromGoogle();
    } catch (error) {
      console.error('Error signing out from Firebase Auth:', error);
    }
    setUser(null);
    setRole(null);
    setUserProfile(null);
  }, []);

  const getFirebaseIdToken = useCallback(async () => {
    if (auth.currentUser) {
      return await getIdToken(auth.currentUser);
    }
    if (user && typeof (user as unknown as { getIdToken?: unknown }).getIdToken === 'function') {
      return await getIdToken(user);
    }
    if (import.meta.env.DEV && userProfile?.uid?.startsWith('dev_')) {
      return userProfile.uid;
    }
    return null;
  }, [user, userProfile]);

  const contextValue = useMemo(
    () => ({
      role,
      user,
      userProfile,
      loading,
      isLoading: loading,
      signInWithGoogle,
      loginWithGoogle: signInWithGoogle,
      signInWithGoogleRedirect,
      logout,
      getIdToken: getFirebaseIdToken,
      setRole,
      loginAsRole,
    }),
    [role, user, userProfile, loading, signInWithGoogle, signInWithGoogleRedirect, logout, getFirebaseIdToken, loginAsRole]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
