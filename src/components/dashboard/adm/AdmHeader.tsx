import React from 'react';
import { BookOpen, HelpCircle, Leaf, Shield } from 'lucide-react';
import { useLanguage } from '../../../contexts';

interface AdmTopBannerProps {
  isAdm: boolean;
}

export const AdmTopBanner: React.FC<AdmTopBannerProps> = ({ isAdm }) => {
  if (!isAdm) return null;

  return (
    <div className="w-full bg-teal-950 dark:bg-stone-900 text-teal-100 py-2.5 px-6 flex items-center justify-between text-base font-extrabold border-b border-teal-800 dark:border-teal-700 shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        <Shield className="w-5 h-5 text-teal-300 shrink-0" />
        <span className="tracking-normal text-base sm:text-lg">Administração · área técnica</span>
      </div>
      <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-teal-200">
        <span className="px-3 py-1 rounded-full bg-teal-800/90 dark:bg-teal-900/90 text-teal-100 text-xs font-black border border-teal-600 dark:border-teal-500">
          Área Técnica
        </span>
      </div>
    </div>
  );
};

interface AdmHeaderProps {
  isAdm: boolean;
  isTraineeManager: boolean;
  userName?: string;
  activeTabLabel?: string;
  onOpenHelpModal?: () => void;
  onOpenTutorial?: () => void;
}

export const AdmHeader: React.FC<AdmHeaderProps> = ({
  isAdm,
  isTraineeManager,
  userName,
  activeTabLabel,
  onOpenHelpModal,
  onOpenTutorial,
}) => {
  const { language } = useLanguage();
  const displayUserName =
    userName?.trim() || (isAdm ? 'Administrador' : isTraineeManager ? 'Aprendiz Gestão' : 'Gestor');
  const avatarInitial = displayUserName.charAt(0).toUpperCase();

  return (
    <header className="h-16 md:h-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-3 sm:px-6 lg:px-8 shrink-0 transition-colors">
      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              isAdm
                ? 'bg-teal-100 dark:bg-teal-950 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300'
                : 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            {isAdm ? <Shield className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <span className="font-black text-sm text-stone-900 dark:text-white truncate block">
              {isAdm
                ? language === 'pt'
                  ? 'Administração'
                  : 'Administration'
                : language === 'pt'
                  ? 'Gestão'
                  : 'Management'}
            </span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 truncate block">
              {isAdm ? (language === 'pt' ? 'Área Técnica' : 'Technical Area') : displayUserName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(!isAdm ? onOpenHelpModal : onOpenTutorial) && (
            <button
              type="button"
              onClick={!isAdm ? onOpenHelpModal : onOpenTutorial}
              aria-label={language === 'pt' ? 'Pedir ajuda ao suporte' : 'Ask support for help'}
              className="h-11 px-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>{language === 'pt' ? 'Pedir ajuda' : 'Ask help'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between w-full gap-3">
        <h2 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 truncate">{activeTabLabel}</h2>
        <div className="flex items-center gap-3">
          {!isAdm && onOpenHelpModal && (
            <button
              type="button"
              onClick={onOpenHelpModal}
              aria-label={language === 'pt' ? 'Pedir ajuda ao suporte técnico' : 'Ask technical support for help'}
              className="min-h-[46px] px-4 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-700 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <HelpCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>{language === 'pt' ? 'Pedir ajuda' : 'Ask help'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenTutorial}
            aria-label={language === 'pt' ? 'Abrir guia passo a passo' : 'Open step-by-step guide'}
            className="min-h-[46px] px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              {isAdm
                ? language === 'pt'
                  ? 'Guia Técnico'
                  : 'Technical Guide'
                : language === 'pt'
                  ? 'Guia da Gestão'
                  : 'Management Guide'}
            </span>
          </button>

          <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-700">
            <div
              className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-black text-base shadow-xs shrink-0 ${
                isAdm || isTraineeManager ? 'bg-teal-700' : 'bg-green-800'
              }`}
            >
              {avatarInitial}
            </div>
            <div className="text-left">
              <p className="font-black text-base text-stone-900 dark:text-stone-100 leading-tight">
                {displayUserName}
              </p>
              <p
                className={`text-xs font-bold ${
                  isAdm ? 'text-teal-600 dark:text-teal-400' : 'text-green-700 dark:text-green-400'
                }`}
              >
                {isAdm
                  ? language === 'pt'
                    ? 'Administrador Técnico'
                    : 'Technical Admin'
                  : isTraineeManager
                    ? language === 'pt'
                      ? 'Aprendiz de Gestão'
                      : 'Management Trainee'
                    : language === 'pt'
                      ? 'Equipe de gestão'
                      : 'Management Team'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
