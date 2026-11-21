import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import {
  AuthProvider,
  ConsentProvider,
  LanguageProvider,
  ProductProvider,
  SpeechProvider,
  ThemeProvider,
  ToastProvider,
} from './contexts';
import {
  AccessibilityMenu,
  BackToTop,
  CookieConsentCenter,
  ErrorBoundary,
  OfflineIndicator,
  ProtectedRoute,
} from './components';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function RouteLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 gap-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-sm">
        <Loader2 className="w-8 h-8 text-emerald-700 dark:text-emerald-400 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      </div>
      <p className="text-lg font-black text-stone-900 dark:text-white">
        Carregando tela...
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ConsentProvider>
        <ThemeProvider>
          <LanguageProvider>
            <SpeechProvider>
              <ToastProvider>
                <AuthProvider>
                  <ProductProvider>
                    <Router>
                      <Suspense fallback={<RouteLoadingFallback />}>
                        <Routes>
                          <Route path="/" element={<Landing />} />
                          <Route path="/login" element={<Login />} />
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/*"
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Suspense>
                      <AccessibilityMenu />
                      <BackToTop />
                      <OfflineIndicator />
                      <CookieConsentCenter />
                    </Router>
                  </ProductProvider>
                </AuthProvider>
              </ToastProvider>
            </SpeechProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ConsentProvider>
    </ErrorBoundary>
  );
}
