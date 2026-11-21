import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts';
import { useAuth, type UserRole } from '../contexts/AuthProvider';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Exclude<UserRole, null>[];
  redirectTo?: string;
  loadingFallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
  loadingFallback,
}: ProtectedRouteProps) {
  const { user, role, loading, isLoading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  // Evita que o conteúdo do Dashboard seja renderizado antes da verificação de autenticação terminar
  if (loading || isLoading) {
    if (loadingFallback !== undefined) {
      return <>{loadingFallback}</>;
    }

    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="min-h-screen bg-canvas dark:bg-stone-950 high-contrast:bg-white dark:high-contrast:bg-black flex flex-col items-center justify-center px-4 gap-4 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-200 dark:border-emerald-800 high-contrast:border-current flex items-center justify-center shadow-sm">
          <Loader2
            className="w-8 h-8 text-emerald-700 dark:text-emerald-400 high-contrast:text-current animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-1 max-w-sm">
          <p className="text-xl font-black text-stone-900 dark:text-white high-contrast:text-current">
            {t('auth.checking_access', 'Verificando seu acesso...')}
          </p>
          <p className="text-base font-medium text-stone-600 dark:text-stone-400 high-contrast:text-current">
            {t('auth.checking_access_hint', 'Aguarde um instante enquanto confirmamos sua sessão.')}
          </p>
        </div>
      </div>
    );
  }

  if (!user || !role) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
