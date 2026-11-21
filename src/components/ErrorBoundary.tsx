import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 high-contrast:bg-black p-4"
        >
          <div className="bg-white dark:bg-stone-900 high-contrast:bg-black rounded-3xl p-8 max-w-md w-full shadow-xl border border-stone-200 dark:border-stone-800 high-contrast:border-2 high-contrast:border-yellow-400 text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 high-contrast:bg-yellow-400 text-red-600 dark:text-red-400 high-contrast:text-black rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white high-contrast:text-yellow-300 mb-2">
                Ops! Algo deu errado.
              </h2>
              <p className="text-base text-stone-600 dark:text-stone-400 high-contrast:text-white">
                Ocorreu um erro inesperado ao carregar esta página.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-stone-100 dark:bg-stone-800 high-contrast:bg-black high-contrast:border high-contrast:border-yellow-400 p-4 rounded-xl text-left overflow-auto max-h-32 text-xs font-mono text-stone-700 dark:text-stone-300 high-contrast:text-yellow-200">
                {this.state.error.message}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 text-white dark:text-stone-900 high-contrast:text-black px-6 py-4 rounded-xl font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-400 high-contrast:focus-visible:ring-white"
            >
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
