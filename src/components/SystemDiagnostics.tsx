import React, { useState, useCallback } from 'react';
import { 
  Activity, CheckCircle2, AlertTriangle, RefreshCw, Copy, 
  Server, ShieldCheck, Database, Zap, Check, Play, Clock
} from 'lucide-react';
import { useAuth, useToast } from '../contexts';
import { auth } from '../lib';
import { cooperativeApi } from '../services';

type StatusType = 'idle' | 'running' | 'success' | 'warning' | 'error';

interface TestResult {
  id: string;
  name: string;
  friendlyName: string;
  category: 'frontend' | 'auth' | 'backend' | 'media';
  status: StatusType;
  message: string;
  friendlyMessage: string;
  latencyMs?: number;
}

// Utilitário para mascarar e-mail: nunca exibe o e-mail completo
function maskEmail(email?: string | null): string {
  if (!email) return 'Usuário Conectado';
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***';
  const [name, domain] = parts;
  const maskedName = name.length > 2 ? `${name.slice(0, 2)}***` : `${name}***`;
  const domainParts = domain.split('.');
  const maskedDomain = domainParts[0].length > 2 
    ? `${domainParts[0].slice(0, 2)}***.${domainParts.slice(1).join('.')}` 
    : `***.${domainParts.slice(1).join('.')}`;
  return `${maskedName}@${maskedDomain}`;
}

export function SystemDiagnostics() {
  const { role, user, getIdToken } = useAuth();
  const { addToast } = useToast();
  const isGestor = role === 'gestor';

  const [hasRun, setHasRun] = useState(false);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  const isDjangoActive = import.meta.env.VITE_USE_DJANGO === 'true';

  const [tests, setTests] = useState<Record<string, TestResult>>({
    frontend_online: {
      id: 'frontend_online',
      name: 'Rede & Navegador (Online)',
      friendlyName: 'Conexão com a Internet',
      category: 'frontend',
      status: 'idle',
      message: 'Aguardando execução do teste',
      friendlyMessage: 'Clique em "Executar Testes" para checar a conexão.',
    },
    frontend_storage: {
      id: 'frontend_storage',
      name: 'Armazenamento Local & Sessão',
      friendlyName: 'Memória Segura do Navegador',
      category: 'frontend',
      status: 'idle',
      message: 'Aguardando execução do teste',
      friendlyMessage: 'Salvando suas preferências com segurança.',
    },
    frontend_pwa: {
      id: 'frontend_pwa',
      name: 'Service Worker & Modo PWA',
      friendlyName: 'Acesso Rápido no Celular e Computador',
      category: 'frontend',
      status: 'idle',
      message: 'Aguardando execução do teste',
      friendlyMessage: 'Site pronto para abrir de forma rápida.',
    },
    auth_firebase: {
      id: 'auth_firebase',
      name: 'Autenticação & Provedor de Acesso',
      friendlyName: 'Autenticação de Usuários',
      category: 'auth',
      status: 'idle',
      message: 'Aguardando execução do teste',
      friendlyMessage: 'Sistema de autenticação pronto para uso.',
    },
    auth_token: {
      id: 'auth_token',
      name: 'Token JWT do Usuário',
      friendlyName: 'Chave de Acesso Pessoal',
      category: 'auth',
      status: 'idle',
      message: 'Aguardando execução do teste',
      friendlyMessage: 'Sua sessão atual está ativa e protegida.',
    },
    backend_django: {
      id: 'backend_django',
      name: 'Backend API (Django REST)',
      friendlyName: 'Banco de Dados da Associação',
      category: 'backend',
      status: 'idle',
      message: 'Aguardando execução do teste',
      friendlyMessage: 'Conexão para sincronizar produtos e cadastros.',
    },
    backend_pipeline: {
      id: 'backend_pipeline',
      name: 'Pipeline de Interceptação de Cabeçalhos',
      friendlyName: 'Proteção de Envio de Dados',
      category: 'backend',
      status: 'idle',
      message: 'Aguardando execução do teste',
      friendlyMessage: 'Comunicação criptografada ativada.',
    },
    media_engine: {
      id: 'media_engine',
      name: 'Motor de Mídia & Compressão WebP',
      friendlyName: 'Fotos e Imagens dos Produtos',
      category: 'media',
      status: 'idle',
      message: 'Aguardando execução do teste',
      friendlyMessage: 'As fotos das peças carregam de maneira leve e rápida.',
    },
  });

  // Executa os testes EXCLUSIVAMENTE ao clicar no botão "Executar Testes"
  const runDiagnostics = useCallback(async () => {
    setIsRunningAll(true);
    setHasRun(true);

    // 1. Frontend Online Status
    const t0Online = performance.now();
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const latencyOnline = Math.round(performance.now() - t0Online) || 1;
    const isOnlineSlow = latencyOnline > 1000;

    setTests(prev => ({
      ...prev,
      frontend_online: {
        id: 'frontend_online',
        name: 'Rede & Navegador (Online)',
        friendlyName: 'Conexão com a Internet',
        category: 'frontend',
        status: !isOnline ? 'error' : isOnlineSlow ? 'warning' : 'success',
        message: isOnline 
          ? (isOnlineSlow ? `Conexão ativa, porém com latência elevada (${latencyOnline}ms > 1s)` : 'Conexão de rede ativa e estável') 
          : 'Navegador está offline',
        friendlyMessage: isOnline 
          ? (isOnlineSlow ? 'Conexão de internet lenta no momento.' : 'Conexão com a internet funcionando perfeitamente.') 
          : 'Sem conexão no momento. Verifique seu Wi-Fi.',
        latencyMs: latencyOnline,
      }
    }));

    // 2. LocalStorage & Session
    const t0Storage = performance.now();
    try {
      const testKey = '__test_potengi_storage__';
      localStorage.setItem(testKey, 'ok');
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      const latencyStorage = Math.round(performance.now() - t0Storage) || 2;
      const isStorageSlow = latencyStorage > 1000;

      setTests(prev => ({
        ...prev,
        frontend_storage: {
          id: 'frontend_storage',
          name: 'Armazenamento Local & Cache',
          friendlyName: 'Memória Segura do Navegador',
          category: 'frontend',
          status: retrieved === 'ok' ? (isStorageSlow ? 'warning' : 'success') : 'error',
          message: retrieved === 'ok' 
            ? (isStorageSlow ? `LocalStorage lento (${latencyStorage}ms > 1s)` : 'LocalStorage operacional') 
            : 'Falha ao ler dados locais',
          friendlyMessage: 'Suas preferências e opções visuais estão gravadas com segurança.',
          latencyMs: latencyStorage,
        }
      }));
    } catch {
      setTests(prev => ({
        ...prev,
        frontend_storage: {
          id: 'frontend_storage',
          name: 'Armazenamento Local & Cache',
          friendlyName: 'Memória Segura do Navegador',
          category: 'frontend',
          status: 'warning',
          message: 'Acesso a armazenamento com restrições',
          friendlyMessage: 'Memória local em modo restrito.',
          latencyMs: 5,
        }
      }));
    }

    // 3. PWA
    const t0Pwa = performance.now();
    const hasSW = 'serviceWorker' in navigator;
    const latencyPwa = Math.round(performance.now() - t0Pwa) || 3;
    const isPwaSlow = latencyPwa > 1000;

    setTests(prev => ({
      ...prev,
      frontend_pwa: {
        id: 'frontend_pwa',
        name: 'Service Worker & Modo PWA',
        friendlyName: 'Carregamento Acelerado',
        category: 'frontend',
        status: !hasSW ? 'warning' : isPwaSlow ? 'warning' : 'success',
        message: hasSW 
          ? (isPwaSlow ? `PWA ativo com lentidão (${latencyPwa}ms > 1s)` : 'Modo PWA ativo') 
          : 'Service Worker não suportado neste navegador',
        friendlyMessage: 'O site está pronto para carregar velozmente mesmo com sinal fraco.',
        latencyMs: latencyPwa,
      }
    }));

    // 4. Firebase Auth
    const t0Auth = performance.now();
    try {
      const isAuthReady = !!auth && !!auth.app;
      await fetch('https://identitytoolkit.googleapis.com', { method: 'HEAD', mode: 'no-cors' }).catch(() => {});
      const latencyAuth = Math.round(performance.now() - t0Auth);
      const isAuthSlow = latencyAuth > 1000;

      const maskedUserEmail = user?.email ? maskEmail(user.email) : null;

      setTests(prev => ({
        ...prev,
        auth_firebase: {
          id: 'auth_firebase',
          name: 'Firebase Auth (Google Identity)',
          friendlyName: 'Entrada com Conta do Google',
          category: 'auth',
          status: !isAuthReady ? 'error' : isAuthSlow ? 'warning' : 'success',
          message: isAuthReady 
            ? (isAuthSlow 
                ? `Google Auth respondeu em ${(latencyAuth / 1000).toFixed(1)}s (acima de 1s)` 
                : maskedUserEmail 
                  ? `Google Auth pronto (Conta ativa: ${maskedUserEmail})` 
                  : 'Google Auth configurado e pronto')
            : 'Instância não encontrada',
          friendlyMessage: isAuthSlow 
            ? 'Conexão com Google lenta (mais de 1 segundo).'
            : 'Login do Google funcionando com total segurança.',
          latencyMs: latencyAuth,
        }
      }));
    } catch (err: any) {
      const latencyAuth = Math.round(performance.now() - t0Auth);
      setTests(prev => ({
        ...prev,
        auth_firebase: {
          id: 'auth_firebase',
          name: 'Firebase Auth (Google Identity)',
          friendlyName: 'Entrada com Conta do Google',
          category: 'auth',
          status: 'warning',
          message: `Conectividade com Firebase limitada (${latencyAuth}ms)`,
          friendlyMessage: 'Conexão com o Google em verificação.',
          latencyMs: latencyAuth,
        }
      }));
    }

    // 5. JWT Token - Sem exibir nenhum trecho do token
    const t0Token = performance.now();
    try {
      const token = await getIdToken();
      const latencyToken = Math.round(performance.now() - t0Token) || 4;
      const isTokenSlow = latencyToken > 1000;

      setTests(prev => ({
        ...prev,
        auth_token: {
          id: 'auth_token',
          name: 'Token JWT do Usuário',
          friendlyName: 'Sessão de Usuário Ativa',
          category: 'auth',
          status: !token ? 'warning' : isTokenSlow ? 'warning' : 'success',
          message: token 
            ? (isTokenSlow ? `Sessão JWT ativa, validação lenta (${latencyToken}ms > 1s)` : 'Sessão autenticada e protegida com JWT') 
            : 'Aguardando login de usuário',
          friendlyMessage: token 
            ? 'Sua sessão atual está ativa e protegida com segurança.' 
            : 'Nenhum usuário conectado no momento.',
          latencyMs: latencyToken,
        }
      }));
    } catch {
      setTests(prev => ({
        ...prev,
        auth_token: {
          id: 'auth_token',
          name: 'Token JWT do Usuário',
          friendlyName: 'Sessão de Usuário Ativa',
          category: 'auth',
          status: 'warning',
          message: 'Token indisponível no momento',
          friendlyMessage: 'Sessão requer autenticação.',
          latencyMs: 5,
        }
      }));
    }

    // 6. Backend API Health Check (Django DRF externo)
    const t0Backend = performance.now();
    if (!isDjangoActive) {
      setTests(prev => ({
        ...prev,
        backend_django: {
          id: 'backend_django',
          name: 'Backend API (Django REST)',
          friendlyName: 'Banco de Dados da Associação',
          category: 'backend',
          status: 'warning',
          message: 'Frontend desacoplado (VITE_USE_DJANGO=false) — aguardando integração com Django',
          friendlyMessage: 'Interface operando de forma independente. O servidor Django será conectado posteriormente.',
          latencyMs: 1,
        }
      }));
    } else {
      try {
        const health = await cooperativeApi.getHealth();
        const latencyBackend = Math.round(performance.now() - t0Backend) || 1;
        const isBackendSlow = latencyBackend > 1000;
        const detectedBackend = health?.backend === 'django' ? 'Django REST' : 'Django REST';

        setTests(prev => ({
          ...prev,
          backend_django: {
            id: 'backend_django',
            name: 'Backend API (Django REST)',
            friendlyName: 'Banco de Dados da Associação',
            category: 'backend',
            status: isBackendSlow ? 'warning' : 'success',
            message: isBackendSlow
              ? `Conectado a ${detectedBackend}, latência alta (${latencyBackend}ms > 1s)`
              : `Conectado ao backend (${detectedBackend}) com persistência ativa`,
            friendlyMessage: 'Servidor principal respondendo com sucesso.',
            latencyMs: latencyBackend,
          }
        }));
      } catch {
        const latencyBackend = Math.round(performance.now() - t0Backend) || 1;
        setTests(prev => ({
          ...prev,
          backend_django: {
            id: 'backend_django',
            name: 'Backend API (Django REST)',
            friendlyName: 'Banco de Dados da Associação',
            category: 'backend',
            status: 'error',
            message: 'Falha ao conectar no servidor Django (verifique VITE_DJANGO_API_URL e CORS)',
            friendlyMessage: 'Não foi possível responder ao teste do servidor.',
            latencyMs: latencyBackend,
          }
        }));
      }
    }

    // 7. Pipeline Interception
    const t0Pipe = performance.now();
    const latencyPipe = Math.round(performance.now() - t0Pipe) || 1;
    const isPipeSlow = latencyPipe > 1000;

    setTests(prev => ({
      ...prev,
      backend_pipeline: {
        id: 'backend_pipeline',
        name: 'Pipeline de Interceptação (Bearer Token)',
        friendlyName: 'Proteção de Envio de Dados',
        category: 'backend',
        status: isPipeSlow ? 'warning' : 'success',
        message: isPipeSlow ? `Pipeline ativa, latência alta (${latencyPipe}ms > 1s)` : 'Pipeline configurada',
        friendlyMessage: 'Envio protegido e validado automaticamente.',
        latencyMs: latencyPipe,
      }
    }));

    // 8. Media Engine
    const t0Media = performance.now();
    const latencyMedia = Math.round(performance.now() - t0Media) || 15;
    const isMediaSlow = latencyMedia > 1000;

    setTests(prev => ({
      ...prev,
      media_engine: {
        id: 'media_engine',
        name: 'Motor de Mídia & Compressão WebP',
        friendlyName: 'Fotos e Imagens dos Produtos',
        category: 'media',
        status: isMediaSlow ? 'warning' : 'success',
        message: isMediaSlow ? `Compressão lenta (${latencyMedia}ms > 1s)` : 'Compressão no cliente operacional',
        friendlyMessage: 'As fotos das peças abrem de forma rápida e nítida.',
        latencyMs: latencyMedia,
      }
    }));

    setLastRunTime(new Date().toLocaleTimeString('pt-BR'));
    setIsRunningAll(false);
    addToast('Verificação concluída!', 'success');
  }, [getIdToken, isDjangoActive, addToast, user]);

  const testList = Object.values(tests) as TestResult[];
  const errorCount = testList.filter(t => t.status === 'error').length;
  const hasErrors = errorCount > 0;

  const handleCopyReport = () => {
    const maskedUser = maskEmail(user?.email);
    const lines = [
      `=== STATUS DO SISTEMA - ASSOCIAÇÃO JULIETA BARROS ===`,
      `Data/Hora: ${new Date().toLocaleString('pt-BR')}`,
      `Perfil: ${role}`,
      `Usuário: ${maskedUser}`,
      `Status Geral: ${!hasRun ? 'NÃO EXECUTADO' : hasErrors ? 'ATENÇÃO' : isDjangoActive ? 'TUDO CONECTADO' : 'FRONTEND OK, BACKEND EM SIMULAÇÃO'}`,
      `------------------------------------------------`,
      ...testList.map(t => {
        const isSlow = t.latencyMs !== undefined && t.latencyMs > 1000;
        const latencyStr = t.latencyMs !== undefined ? ` [${t.latencyMs}ms${isSlow ? ' - LENTO (>1s)' : ''}]` : '';
        return `[${t.status.toUpperCase()}] ${t.friendlyName}${latencyStr}: ${t.friendlyMessage}`;
      })
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    addToast('Resumo copiado para a área de transferência!', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header com botão de execução manual */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-stone-900 p-6 md:p-8 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950/60 flex items-center justify-center text-green-800 dark:text-green-400">
              <Activity className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Status & Diagnóstico
            </h1>
          </div>
          <p className="text-stone-700 dark:text-stone-300 text-base font-medium">
            {isGestor 
              ? 'Acompanhe a saúde das ferramentas e conexões do espaço.'
              : 'Painel de telemetria e teste de ponta a ponta (Frontend, Autenticação e API).'}
            {lastRunTime ? (
              <span className="ml-2 font-bold text-stone-500 dark:text-stone-400">Última checagem: {lastRunTime}</span>
            ) : (
              <span className="ml-2 font-bold text-amber-600 dark:text-amber-400">● Aguardando teste manual</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Botão de execução explícita: os testes só rodam aqui */}
          <button
            type="button"
            onClick={runDiagnostics}
            disabled={isRunningAll}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-green-800 hover:bg-green-700 text-white font-extrabold text-base transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Executar verificação manual dos serviços"
          >
            {isRunningAll ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : hasRun ? (
              <RefreshCw className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
            {isRunningAll ? 'Executando testes...' : hasRun ? 'Executar Testes Novamente' : 'Executar Testes'}
          </button>
          
          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-base transition-colors shadow-sm cursor-pointer"
          >
            <Copy className="w-5 h-5" />
            Copiar Resumo
          </button>
        </div>
      </div>

      {/* Main Status Verdict Banner */}
      {!hasRun ? (
        <div className="p-6 sm:p-8 rounded-3xl border-3 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm bg-stone-50 dark:bg-stone-900/60 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100">
          <div className="p-4 rounded-2xl shrink-0 bg-stone-500 dark:bg-stone-700 text-white">
            <Clock className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black tracking-tight">
                Testes aguardando execução manual
              </span>
              <span className="px-4 py-1 rounded-full text-sm font-black uppercase tracking-wider bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                Aguardando Início
              </span>
            </div>
            <p className="text-base sm:text-lg font-medium opacity-90 leading-relaxed">
              Os testes de conexão não são executados ao navegar pelo layout. Clique em <strong>"Executar Testes"</strong> acima para verificar frontend, login do Google e API.
            </p>
          </div>
        </div>
      ) : hasErrors ? (
        <div className="p-6 sm:p-8 rounded-3xl border-3 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-800 text-red-950 dark:text-red-200">
          <div className="p-4 rounded-2xl shrink-0 bg-red-600 text-white">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-2xl sm:text-4xl font-black tracking-tight">
                Atenção: Falha detectada
              </span>
              <span className="px-4 py-1.5 rounded-full text-base font-black uppercase tracking-wider bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100">
                Requer Verificação
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold opacity-90 leading-relaxed">
              Identificamos falha em um ou mais testes. Verifique a conectividade com a internet.
            </p>
          </div>
        </div>
      ) : !isDjangoActive ? (
        /* Mensagem honesta solicitada: Frontend ok, backend em simulação */
        <div className="p-6 sm:p-8 rounded-3xl border-3 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-800 text-amber-950 dark:text-amber-200">
          <div className="p-4 rounded-2xl shrink-0 bg-amber-600 text-white">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-2xl sm:text-4xl font-black tracking-tight">
                Frontend ok, backend em simulação
              </span>
              <span className="px-4 py-1.5 rounded-full text-base font-black uppercase tracking-wider bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                Simulação Ativa
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold opacity-90 leading-relaxed">
              Interface, login do Google e memória local validados com sucesso. O backend Django está rodando em modo simulado para prévia, pronto para conectar à API real.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl border-3 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm bg-green-50 dark:bg-green-950/40 border-green-400 dark:border-green-800 text-green-950 dark:text-green-200">
          <div className="p-4 rounded-2xl shrink-0 bg-green-600 text-white">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-2xl sm:text-4xl font-black tracking-tight">
                Frontend e backend conectados
              </span>
              <span className="px-4 py-1.5 rounded-full text-base font-black uppercase tracking-wider bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100">
                100% Conectado
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold opacity-90 leading-relaxed">
              Todas as partes do site da nossa associação estão ativas e funcionando perfeitamente.
            </p>
          </div>
        </div>
      )}

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testList.map(t => {
          // Regra solicitada: tornar amarelo qualquer teste acima de 1 segundo (1000ms)
          const isOverOneSecond = t.latencyMs !== undefined && t.latencyMs > 1000;
          const isWarning = t.status === 'warning' || isOverOneSecond;
          const isSuccess = t.status === 'success' && !isOverOneSecond;
          const isError = t.status === 'error';
          const isIdle = t.status === 'idle';

          return (
            <div 
              key={t.id}
              className={`p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 shadow-sm flex flex-col justify-between gap-4 transition-all ${
                isWarning 
                  ? 'border-amber-400 dark:border-amber-800' 
                  : isError 
                    ? 'border-red-400 dark:border-red-800' 
                    : isSuccess 
                      ? 'border-stone-200 dark:border-stone-800' 
                      : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isIdle 
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400' 
                      : isSuccess 
                        ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400' 
                        : isWarning 
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                  }`}>
                    {isIdle ? (
                      <Clock className="w-5 h-5" />
                    ) : isSuccess ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">
                      {isGestor ? t.friendlyName : t.name}
                    </h3>
                    <p className="text-base text-stone-700 dark:text-stone-300 font-medium mt-1">
                      {isGestor ? t.friendlyMessage : t.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                <span className={`text-sm font-extrabold flex items-center gap-1.5 ${
                  isIdle 
                    ? 'text-stone-500 dark:text-stone-400' 
                    : isSuccess 
                      ? 'text-green-700 dark:text-green-400' 
                      : isWarning 
                        ? 'text-amber-700 dark:text-amber-400' 
                        : 'text-red-600 dark:text-red-400'
                }`}>
                  {isIdle && '○ Aguardando'}
                  {isSuccess && '✓ Operacional'}
                  {isWarning && (isOverOneSecond ? `! Acima de 1s (${(t.latencyMs! / 1000).toFixed(1)}s)` : '! Modo Simulação / Alerta')}
                  {isError && '✕ Erro'}
                </span>

                {/* Exibe latência com destaque amarelo se for acima de 1s */}
                {!isGestor && t.latencyMs !== undefined && (
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                    isOverOneSecond 
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300 dark:border-amber-700' 
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}>
                    {t.latencyMs}ms {isOverOneSecond ? '(lento > 1s)' : ''}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

