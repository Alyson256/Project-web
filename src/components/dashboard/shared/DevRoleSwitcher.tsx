import { Box, Settings, Shield, Sparkles, User, Users } from 'lucide-react';
import type { UserRole } from '../../../contexts';

export interface DevRoleSwitcherProps {
  activeRole: UserRole;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

export function DevRoleSwitcher({
  activeRole,
  isOpen,
  onOpen,
  onClose,
  onSelectRole,
}: DevRoleSwitcherProps) {
  if (!import.meta.env.DEV) return null;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="fixed top-20 right-3 z-30 bg-stone-900/90 text-stone-200 hover:text-white hover:bg-stone-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-amber-500/80 backdrop-blur-md flex items-center gap-1.5 transition-all no-print cursor-pointer"
        title="Ativar alternador de cargos (Modo Debugger)"
      >
        <Settings className="w-3.5 h-3.5 text-amber-400" />
        <span>Alternar Cargos</span>
      </button>
    );
  }

  return (
    <div className="bg-stone-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm border-b-2 border-amber-500/70 z-50 sticky top-0 no-print animate-in fade-in shadow-lg">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="font-black text-amber-400 text-sm flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Debugger de Cargos:</span>
        </span>
        <span className="text-stone-300 text-xs sm:text-sm">
          Vendo como:{' '}
          <strong className="text-white uppercase font-black tracking-wide">
            {activeRole === 'produtor' || activeRole === 'colaborador'
              ? 'Produtor'
              : activeRole === 'aprendiz_gestor'
                ? 'Aprendiz Gestor'
                : activeRole === 'adm'
                  ? 'Admin'
                  : activeRole}
          </strong>
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onSelectRole('visitante')}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
            activeRole === 'visitante'
              ? 'bg-stone-100 text-stone-900 ring-2 ring-white shadow-sm'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          <User className="w-4 h-4 text-stone-400" />
          <span>Visitante</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('aprendiz')}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
            activeRole === 'aprendiz'
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-sm'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Aprendiz Artesão (Laura)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('aprendiz_gestor')}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
            activeRole === 'aprendiz_gestor'
              ? 'bg-teal-600 text-white ring-2 ring-teal-400 shadow-sm'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-teal-300" />
          <span>Aprendiz Gestor (Mariana)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('produtor')}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
            activeRole === 'produtor' || activeRole === 'colaborador'
              ? 'bg-green-700 text-white ring-2 ring-green-400 shadow-sm'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          <Box className="w-4 h-4 text-green-300" />
          <span>Produtor</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('gestor')}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
            activeRole === 'gestor'
              ? 'bg-amber-600 text-white ring-2 ring-amber-400 shadow-sm'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          <Users className="w-4 h-4 text-amber-300" />
          <span>Gestor (Ana / Carlos)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('adm')}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
            activeRole === 'adm'
              ? 'bg-purple-600 text-white ring-2 ring-purple-400 shadow-sm'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          <Shield className="w-4 h-4 text-purple-300" />
          <span>Admin</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-2.5 py-1 text-xs text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer ml-1"
        >
          Ocultar
        </button>
      </div>
    </div>
  );
}
