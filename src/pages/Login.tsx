import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthSignInStage, useAuth, useLanguage, useTheme, useToast } from '../contexts';
import { getFriendlyGoogleAuthErrorMessage } from '../services';
import {
  Leaf,
  ArrowLeft,
  RefreshCw,
  User,
  Box,
  Users,
  Shield,
  Sparkles,
  Settings,
  Globe,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

function GoogleMark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function Login() {
  const { user, role, loading, loginAsRole, signInWithGoogle, signInWithGoogleRedirect } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { openAccessibility } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState('');
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);

  // Login com Google
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
  const [authStage, setAuthStage] = useState<AuthSignInStage>('popup');
  const [isTakingTooLong, setIsTakingTooLong] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(0);

  const attemptIdRef = useRef(0);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (!loading && user && role) {
      const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      const safeTarget = fromPath && fromPath.startsWith('/dashboard') ? fromPath : '/dashboard';
      navigate(safeTarget, { replace: true });
    }
  }, [loading, user, role, navigate, location.state]);

  useEffect(() => {
    return () => {
      attemptIdRef.current += 1;
      isSubmittingRef.current = false;
    };
  }, []);

  // Timer de recuperação (8s) para evitar ansiedade enquanto o usuário lê a janela do Google
  useEffect(() => {
    if (!isLoggingInGoogle || authStage === 'completed') {
      setIsTakingTooLong(false);
      return;
    }

    setIsTakingTooLong(false);
    const timer = setTimeout(() => {
      setIsTakingTooLong(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isLoggingInGoogle, authStage, loginAttempt]);

  const handleGoogleLogin = async (force = false) => {
    if ((isSubmittingRef.current || isLoggingInGoogle) && !force) return;
    isSubmittingRef.current = true;
    const currentAttemptId = ++attemptIdRef.current;
    setErrorMsg('');
    setIsPopupBlocked(false);
    setAuthStage('popup');
    setIsTakingTooLong(false);
    setIsLoggingInGoogle(true);
    setLoginAttempt((prev) => prev + 1);

    try {
      await signInWithGoogle((stage) => {
        if (attemptIdRef.current === currentAttemptId) {
          setAuthStage(stage);
        }
      });
      if (attemptIdRef.current !== currentAttemptId) return;
      isSubmittingRef.current = false;
      setIsTakingTooLong(false);
    } catch (error: unknown) {
      if (attemptIdRef.current !== currentAttemptId) return;
      isSubmittingRef.current = false;
      setIsTakingTooLong(false);
      setIsLoggingInGoogle(false);
      setAuthStage('popup');

      const authErrorCode = (error as { code?: string } | null)?.code;
      if (
        authErrorCode !== 'auth/popup-closed-by-user' &&
        authErrorCode !== 'auth/cancelled-popup-request'
      ) {
        console.error(error);
      }

      setIsPopupBlocked(authErrorCode === 'auth/popup-blocked');
      const friendlyMessage = getFriendlyGoogleAuthErrorMessage(error, language);
      setErrorMsg(friendlyMessage);
      addToast(friendlyMessage, 'error');
    }
  };

  const handleGoogleRedirectFallback = async () => {
    if (isSubmittingRef.current || isLoggingInGoogle) return;
    isSubmittingRef.current = true;
    setErrorMsg('');
    setIsLoggingInGoogle(true);
    try {
      await signInWithGoogleRedirect();
    } catch (error: unknown) {
      isSubmittingRef.current = false;
      setIsLoggingInGoogle(false);
      const friendlyMessage = getFriendlyGoogleAuthErrorMessage(error, language);
      setErrorMsg(friendlyMessage);
      addToast(friendlyMessage, 'error');
    }
  };

  const handleRetry = () => {
    setErrorMsg('');
    setIsTakingTooLong(false);
    handleGoogleLogin(true);
  };

  const handleCancelLogin = () => {
    attemptIdRef.current += 1;
    isSubmittingRef.current = false;
    setIsTakingTooLong(false);
    setIsLoggingInGoogle(false);
    setAuthStage('popup');
  };

  const stageTitle =
    authStage === 'completed'
      ? language === 'pt'
        ? 'Tudo certo! Entrando...'
        : 'All set! Signing you in...'
      : authStage === 'verifying'
      ? language === 'pt'
        ? 'Preparando seu acesso...'
        : 'Preparing your access...'
      : language === 'pt'
      ? 'Escolha sua conta Google'
      : 'Choose your Google account';

  const stageSubtitle =
    authStage === 'completed'
      ? language === 'pt'
        ? 'Abrindo seu painel da associação.'
        : 'Opening your association dashboard.'
      : authStage === 'verifying'
      ? language === 'pt'
        ? 'Confirmando seu nome, foto e permissões na Associação Julieta Barros.'
        : 'Confirming your name, photo, and permissions at Associação Julieta Barros.'
      : language === 'pt'
      ? 'Uma janela segura do Google foi aberta. Selecione seu e-mail para continuar.'
      : 'A secure Google window has opened. Select your email to continue.';

  const isStep1Done = authStage === 'verifying' || authStage === 'completed';
  const isStep2Done = authStage === 'completed';

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 gap-6 text-center transition-colors duration-300"
      >
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-2 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60" aria-hidden="true" />
          <svg
            className="absolute inset-0 w-full h-full motion-safe:animate-[spin_1.6s_linear_infinite]"
            viewBox="0 0 96 96"
            aria-hidden="true"
          >
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-stone-200 dark:text-stone-800"
            />
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray="88 180"
              className="text-emerald-700 dark:text-emerald-400"
            />
          </svg>
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <Leaf className="w-8 h-8 text-emerald-800 dark:text-emerald-400" aria-hidden="true" />
          </div>
        </div>
        <div className="space-y-1.5 max-w-sm">
          <p className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
            {language === 'pt' ? 'Verificando seu acesso...' : 'Checking your access...'}
          </p>
          <p className="text-base font-medium text-stone-600 dark:text-stone-400 leading-relaxed">
            {language === 'pt'
              ? 'Aguarde um instante enquanto confirmamos sua sessão.'
              : 'Please wait a moment while we confirm your session.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col pt-4 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      {/* Barra superior: Rota de fuga (esquerda), Acessibilidade mobile e Idioma (direita) */}
      <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl text-sm sm:text-base font-bold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-200/70 dark:hover:bg-stone-800/80 transition-colors motion-reduce:transition-none"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{language === 'pt' ? 'Voltar para a vitrine' : 'Back to showcase'}</span>
        </Link>

        <div className="w-full md:w-auto flex flex-wrap items-center justify-between md:justify-end gap-4">
          <button
            type="button"
            onClick={openAccessibility}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 rounded-2xl bg-stone-100 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 font-extrabold text-xs sm:text-sm shadow-sm transition-colors motion-reduce:transition-none cursor-pointer"
            aria-label={t('access.floating_btn', 'Acessibilidade')}
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            <span>{t('access.floating_btn', 'Acessibilidade')}</span>
          </button>

          <div className="inline-flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-2xl shadow-sm min-h-[44px]">
            <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-400 ml-1.5 shrink-0" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setLanguage('pt')}
              className={`min-h-[44px] min-w-[44px] px-2.5 py-1 text-xs font-black rounded-xl transition-all motion-reduce:transition-none cursor-pointer flex items-center justify-center ${
                language === 'pt'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
              aria-pressed={language === 'pt'}
            >
              PT
            </button>
            <span className="text-stone-400 dark:text-stone-600 font-bold" aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`min-h-[44px] min-w-[44px] px-2.5 py-1 text-xs font-black rounded-xl transition-all motion-reduce:transition-none cursor-pointer flex items-center justify-center ${
                language === 'en'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
              aria-pressed={language === 'en'}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex justify-center p-4 bg-green-100 dark:bg-green-950/50 rounded-3xl mb-4 border border-green-200 dark:border-green-900 shadow-xs">
          <Leaf className="w-16 h-16 text-green-800 dark:text-green-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
          {t('login.title', 'Entrar')}
        </h1>
        <p className="mt-3 text-xl font-bold text-stone-800 dark:text-stone-300">
          {t('brand.name', 'Associação Julieta Barros')}
        </p>
        <p className="text-base font-semibold text-emerald-800 dark:text-emerald-400">
          {t('brand.dept', 'Departamento de Vendas Rosa Mística')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-stone-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border-2 border-stone-200 dark:border-stone-800 transition-colors duration-500">
          <div className="space-y-6">
            {!isLoggingInGoogle && (
              <p className="text-center text-[18px] leading-relaxed text-stone-800 dark:text-stone-200 font-medium">
                {language === 'pt'
                  ? 'Acesse a plataforma com sua conta Google. Rápido, seguro e sem precisar memorizar senhas.'
                  : 'Access the platform with your Google account. Quick, secure, and password-free.'}
              </p>
            )}

            {errorMsg && (
              <div
                aria-live="off"
                className="bg-red-50 dark:bg-red-950/50 border-2 border-red-300 dark:border-red-800 high-contrast:border-current text-red-800 dark:text-red-300 high-contrast:text-current p-4 rounded-2xl font-bold text-base text-center leading-normal space-y-3"
              >
                <p>{errorMsg}</p>
                {isPopupBlocked && !isLoggingInGoogle && (
                  <button
                    type="button"
                    onClick={handleGoogleRedirectFallback}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 high-contrast:bg-yellow-400 high-contrast:text-black text-white font-extrabold text-sm sm:text-base transition-colors cursor-pointer"
                  >
                    {language === 'pt' ? 'Abrir login na mesma aba' : 'Open sign-in in the same tab'}
                  </button>
                )}
              </div>
            )}

            {/* BOTÃO PRINCIPAL: ENTRAR COM GOOGLE (COM FEEDBACK VISUAL E TRAVA ANTI-DUPLO CLIQUE) */}
            <div>
              <button
                type="button"
                onClick={() => handleGoogleLogin(false)}
                disabled={isLoggingInGoogle}
                aria-disabled={isLoggingInGoogle}
                aria-busy={isLoggingInGoogle}
                className="w-full min-h-[56px] h-14 flex justify-center items-center gap-3.5 px-6 border-2 border-stone-300 dark:border-stone-700 high-contrast:border-current rounded-2xl shadow-sm text-lg sm:text-xl font-extrabold text-stone-800 dark:text-white bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700/80 focus:outline-none focus:ring-4 focus:ring-green-600/30 transition-all motion-reduce:transition-none duration-150 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-stone-100 dark:disabled:bg-stone-800/90 active:scale-[0.99] cursor-pointer"
                aria-label={
                  isLoggingInGoogle
                    ? language === 'pt'
                      ? 'Autenticando com Google...'
                      : 'Authenticating with Google...'
                    : language === 'pt'
                    ? 'Entrar com Conta Google'
                    : 'Sign in with Google Account'
                }
              >
                {isLoggingInGoogle ? (
                  <Loader2
                    className="w-6 h-6 text-emerald-700 dark:text-emerald-400 high-contrast:text-current animate-spin motion-reduce:animate-none shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <GoogleMark className="w-7 h-7 shrink-0" />
                )}
                <span>
                  {isLoggingInGoogle
                    ? language === 'pt'
                      ? 'Autenticando...'
                      : 'Authenticating...'
                    : language === 'pt'
                    ? 'Entrar com Google'
                    : 'Sign in with Google'}
                </span>
              </button>

              {!isLoggingInGoogle && (
                <div className="mt-3.5 flex items-center justify-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>
                    {language === 'pt'
                      ? 'Identificação segura com nome, e-mail verificado e foto de perfil'
                      : 'Secure sign-in with verified email, name and profile picture'}
                  </span>
                </div>
              )}
            </div>

            {/* EXPERIÊNCIA DE CARREGAMENTO EM ETAPAS REAIS DURANTE LOGIN GOOGLE */}
            {isLoggingInGoogle && (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center text-center gap-6 pt-4 border-t border-stone-200 dark:border-stone-800 transition-opacity duration-200"
              >
                {/* Medalhão Orbital com Anel Duplo Google + Cooperativa */}
                <div className="relative flex items-center justify-center w-24 h-24">
                  <div
                    className={`absolute inset-2 rounded-full transition-colors duration-300 ${
                      authStage === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/70'
                        : 'bg-stone-100/90 dark:bg-stone-800/70'
                    }`}
                    aria-hidden="true"
                  />
                  {authStage !== 'completed' ? (
                    <svg
                      className="absolute inset-0 w-full h-full motion-safe:animate-[spin_1.5s_linear_infinite]"
                      viewBox="0 0 96 96"
                      aria-hidden="true"
                    >
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-stone-200 dark:text-stone-800"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke={authStage === 'verifying' ? '#15803d' : '#4285F4'}
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeDasharray="96 172"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke="#34A853"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeDasharray="34 234"
                        strokeDashoffset="-126"
                      />
                    </svg>
                  ) : (
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 96 96" aria-hidden="true">
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4.5"
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                    </svg>
                  )}

                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm">
                    {authStage === 'completed' ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    ) : authStage === 'verifying' ? (
                      <ShieldCheck className="w-8 h-8 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <GoogleMark className="w-8 h-8" />
                    )}
                  </div>
                </div>

                {/* Título e instrução contextual da etapa atual */}
                <div className="space-y-1.5 max-w-xs">
                  <p className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                    {stageTitle}
                  </p>
                  <p className="text-base font-medium text-stone-700 dark:text-stone-300 leading-relaxed">
                    {stageSubtitle}
                  </p>
                </div>

                {/* Linha do tempo real de 2 passos (sem caixas aninhadas) */}
                <ol
                  aria-label={language === 'pt' ? 'Etapas do acesso com Google' : 'Google sign-in steps'}
                  className="w-full text-left border-t border-b border-stone-200 dark:border-stone-800 divide-y divide-stone-200/80 dark:divide-stone-800/80"
                >
                  <li className="flex items-center gap-3.5 py-3.5">
                    <div className="shrink-0 flex items-center justify-center w-7 h-7">
                      {isStep1Done ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                      ) : (
                        <Loader2
                          className="w-6 h-6 text-blue-600 dark:text-blue-400 motion-safe:animate-spin"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-base font-extrabold leading-tight ${
                          isStep1Done
                            ? 'text-emerald-800 dark:text-emerald-300'
                            : 'text-stone-900 dark:text-white'
                        }`}
                      >
                        {language === 'pt' ? '1. Conta Google' : '1. Google Account'}
                      </p>
                      <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-0.5">
                        {isStep1Done
                          ? language === 'pt'
                            ? 'Conta selecionada com sucesso'
                            : 'Account selected successfully'
                          : language === 'pt'
                          ? 'Aguardando confirmação na janela do Google'
                          : 'Waiting for confirmation in the Google window'}
                      </p>
                    </div>
                    {!isStep1Done && (
                      <ExternalLink className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0" aria-hidden="true" />
                    )}
                  </li>

                  <li className="flex items-center gap-3.5 py-3.5">
                    <div className="shrink-0 flex items-center justify-center w-7 h-7">
                      {isStep2Done ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                      ) : authStage === 'verifying' ? (
                        <Loader2
                          className="w-6 h-6 text-emerald-700 dark:text-emerald-400 motion-safe:animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="w-6 h-6 rounded-full border-2 border-stone-300 dark:border-stone-600 text-xs font-black text-stone-500 dark:text-stone-400 flex items-center justify-center tabular-nums">
                          2
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-base font-extrabold leading-tight ${
                          authStage === 'verifying' || isStep2Done
                            ? 'text-stone-900 dark:text-white'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {language === 'pt' ? '2. Perfil na Associação' : '2. Association Profile'}
                      </p>
                      <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-0.5">
                        {isStep2Done
                          ? language === 'pt'
                            ? 'Nome, e-mail e cargo sincronizados'
                            : 'Name, email, and role synced'
                          : authStage === 'verifying'
                          ? language === 'pt'
                            ? 'Validando token e carregando seus dados'
                            : 'Validating token and loading your profile'
                          : language === 'pt'
                          ? 'Nome, foto e permissão de acesso'
                          : 'Name, photo, and access permission'}
                      </p>
                    </div>
                  </li>
                </ol>

                {/* Ajuda contextual e recuperação após 8s (sem gerar ansiedade nos primeiros 8s) */}
                {authStage !== 'completed' && (
                  isTakingTooLong ? (
                    <div className="w-full space-y-3 pt-1">
                      <p className="text-base font-bold text-amber-800 dark:text-amber-300">
                        {language === 'pt'
                          ? 'Demorando mais que o normal? Você pode tentar de novo.'
                          : 'Taking longer than usual? You can try again.'}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                        <button
                          type="button"
                          onClick={handleRetry}
                          className="min-h-[48px] px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-base flex items-center gap-2 shadow-sm transition-colors duration-150 cursor-pointer whitespace-nowrap"
                        >
                          <RefreshCw className="w-5 h-5" aria-hidden="true" />
                          <span>{language === 'pt' ? 'Tentar de novo' : 'Try again'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelLogin}
                          className="min-h-[48px] px-6 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-base transition-colors duration-150 cursor-pointer whitespace-nowrap"
                        >
                          {language === 'pt' ? 'Cancelar' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={handleCancelLogin}
                        className="min-h-[48px] px-6 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-base transition-colors duration-150 cursor-pointer"
                      >
                        {language === 'pt' ? 'Cancelar' : 'Cancel'}
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* FERRAMENTAS DE DEPURAÇÃO / TESTES RÁPIDOS (somente em desenvolvimento) */}
          {import.meta.env.DEV && (
          <div className={`mt-8 pt-6 border-t-2 border-dashed border-stone-200 dark:border-stone-800 transition-opacity ${isLoggingInGoogle ? 'opacity-45 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>{language === 'pt' ? 'Ferramentas de Debug / Testes' : 'Debug / Test Tools'}</span>
              </span>
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                {language === 'pt' ? 'Alternar cargo' : 'Switch role'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginAsRole('visitante')}
                className="min-h-[46px] px-3 py-2 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <User className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                <span>{t('login.role_visitante', 'Visitante')}</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsRole('aprendiz')}
                className="min-h-[46px] px-3 py-2 rounded-xl border-2 border-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{language === 'pt' ? 'Aprendiz (Artesão)' : 'Trainee (Artisan)'}</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsRole('aprendiz_gestor')}
                className="min-h-[46px] px-3 py-2 rounded-xl border-2 border-teal-400 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-950 dark:text-teal-200 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>{language === 'pt' ? 'Aprendiz (Gestor)' : 'Trainee (Manager)'}</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsRole('produtor')}
                className="min-h-[46px] px-3 py-2 rounded-xl border-2 border-green-400 bg-green-50 hover:bg-green-100 dark:bg-green-950/60 dark:hover:bg-green-900/60 text-green-950 dark:text-green-200 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Box className="w-4 h-4 text-green-700 dark:text-green-400" />
                <span>{language === 'pt' ? 'Produtor' : 'Producer'}</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsRole('gestor')}
                className="min-h-[46px] px-3 py-2 rounded-xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Users className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>{t('login.role_gestor', 'Equipe de Gestão')}</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsRole('adm')}
                className="min-h-[46px] px-3 py-2 rounded-xl border-2 border-purple-400 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-950 dark:text-purple-200 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Shield className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                <span>{t('login.role_adm', 'Admin')}</span>
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
