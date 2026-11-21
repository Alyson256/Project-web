import React from 'react';
import {
  Activity,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  HelpCircle,
  Printer,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import type { UserRole } from '../../../contexts';
import type { ProductItem, UserItem } from '../../../types';
import { TraineeProgressCard } from './TraineeProgressCard';

export interface RecentPromotion {
  id: string;
  sentence: string;
  promotedUserName: string;
  promotedUserId: number;
  promotedToRole: 'gestor' | 'produtor';
  previousRole: 'aprendiz' | 'aprendiz_gestor';
  timestamp: number;
}

interface AdmTrainingTabProps {
  allTrainees: UserItem[];
  completedTrainees: UserItem[];
  inProgressTrainees: UserItem[];
  allProducts: ProductItem[];
  onOpenAddTraineeModal: () => void;
  onPromoteClick: (user: UserItem) => void;
  onIncompleteActionClick: (user: UserItem) => void;
}

export const AdmTrainingTab: React.FC<AdmTrainingTabProps> = ({
  allTrainees,
  completedTrainees,
  inProgressTrainees,
  allProducts,
  onOpenAddTraineeModal,
  onPromoteClick,
  onIncompleteActionClick,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-300 dark:border-emerald-700 shrink-0">
            <Sparkles className="w-7 h-7 text-emerald-800 dark:text-emerald-300" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight">
              Pessoas em treinamento
            </h2>
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1">
              Acompanhe o progresso e promova quando a pessoa estiver pronta.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenAddTraineeModal}
            className="min-h-[56px] px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg inline-flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer w-full sm:w-auto active:scale-95"
          >
            <UserPlus className="w-5 h-5 shrink-0" />
            <span>Adicionar pessoa</span>
          </button>
        </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0 border border-emerald-300 dark:border-emerald-700">
              <Shield className="w-6 h-6 text-emerald-800 dark:text-emerald-300" />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-950 dark:text-emerald-100">
                Ambiente Seguro de Treinamento
              </h3>
              <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1 leading-relaxed">
                Peças criadas aqui são testes protegidos e <strong>nunca aparecem na vitrine Rosa Mística</strong> até a conclusão do aprendizado.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <div className="px-4 py-2 bg-emerald-200/80 dark:bg-emerald-900/60 rounded-xl text-emerald-950 dark:text-emerald-100 font-black text-base border border-emerald-300 dark:border-emerald-700">
              {allTrainees.length} {allTrainees.length === 1 ? 'pessoa em treinamento' : 'pessoas em treinamento'}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {completedTrainees.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                Concluíram o treino ({completedTrainees.length})
              </h3>
            </div>

            <div className="space-y-6">
              {completedTrainees.map((trainee) => (
                <TraineeProgressCard
                  key={trainee.id}
                  trainee={trainee}
                  isCompleted={true}
                  allProducts={allProducts}
                  variant="training_tab"
                  onPromoteClick={onPromoteClick}
                  onIncompleteActionClick={onIncompleteActionClick}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-black text-sm">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white">
              Em andamento ({inProgressTrainees.length})
            </h3>
          </div>

          <div className="space-y-6">
            {inProgressTrainees.length === 0 ? (
              <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-800/40 border-2 border-stone-200 dark:border-stone-800 text-center text-stone-600 dark:text-stone-400 font-medium text-lg">
                Nenhuma pessoa com treinamento em andamento no momento.
              </div>
            ) : (
              inProgressTrainees.map((trainee) => (
                <TraineeProgressCard
                  key={trainee.id}
                  trainee={trainee}
                  isCompleted={false}
                  allProducts={allProducts}
                  variant="training_tab"
                  onPromoteClick={onPromoteClick}
                  onIncompleteActionClick={onIncompleteActionClick}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdmUsersTabProps {
  role: UserRole;
  teamMembers: UserItem[];
  allTrainees: UserItem[];
  completedTrainees: UserItem[];
  inProgressTrainees: UserItem[];
  allVisitors: UserItem[];
  allProducts: ProductItem[];
  completedAwaitingCount: number;
  usersSubTab: 'equipe' | 'treinamento' | 'procurar';
  setUsersSubTab: React.Dispatch<React.SetStateAction<'equipe' | 'treinamento' | 'procurar'>>;
  userRoleFilter: 'todos' | 'produtor' | 'aprendiz' | 'aprendiz_gestor' | 'gestor';
  setUserRoleFilter: React.Dispatch<React.SetStateAction<'todos' | 'produtor' | 'aprendiz' | 'aprendiz_gestor' | 'gestor'>>;
  visitorSearchTerm: string;
  setVisitorSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  visitorVisibleCount: number;
  setVisitorVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  recentPromotions: RecentPromotion[];
  onOpenUndoPromotion: (promo: RecentPromotion) => void;
  onOpenAddTraineeModal: (visitor?: UserItem) => void;
  onChangeRole: (id: number, newRole: string) => void;
  onPromoteClick: (user: UserItem) => void;
  onIncompleteActionClick: (user: UserItem) => void;
  onPrint: () => void;
  onExportUsersToCSV: () => void;
  onOpenHelpModal?: () => void;
  actorName?: string;
}

export const AdmUsersTab: React.FC<AdmUsersTabProps> = ({
  role,
  teamMembers,
  allTrainees,
  completedTrainees,
  inProgressTrainees,
  allVisitors,
  allProducts,
  completedAwaitingCount,
  usersSubTab,
  setUsersSubTab,
  userRoleFilter,
  setUserRoleFilter,
  visitorSearchTerm,
  setVisitorSearchTerm,
  visitorVisibleCount,
  setVisitorVisibleCount,
  recentPromotions,
  onOpenUndoPromotion,
  onOpenAddTraineeModal,
  onChangeRole,
  onPromoteClick,
  onIncompleteActionClick,
  onPrint,
  onExportUsersToCSV,
  onOpenHelpModal,
  actorName,
}) => {
  const currentActorName = actorName || (role === 'adm' ? 'Administrador' : 'Gestão');

  const filteredTeamMembers = teamMembers.filter((u) => {
    if (userRoleFilter === 'todos') return true;
    if (userRoleFilter === 'aprendiz') return u.role === 'aprendiz';
    if (userRoleFilter === 'aprendiz_gestor') return u.role === 'aprendiz_gestor';
    if (userRoleFilter === 'produtor') return u.role === 'produtor' || u.role === 'colaborador';
    if (userRoleFilter === 'gestor') return u.role === 'gestor';
    return true;
  });

  const matchingVisitors = allVisitors.filter(
    (v) =>
      v.name.toLowerCase().includes(visitorSearchTerm.toLowerCase()) ||
      (v.email && v.email.toLowerCase().includes(visitorSearchTerm.toLowerCase()))
  );
  const visibleVisitors = matchingVisitors.slice(0, visitorVisibleCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Cabeçalho */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
            Pessoas e Cadastros
          </h2>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium mt-1">
            Gerenciar equipe, pessoas em treinamento e cadastros da nossa associação
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full xl:w-auto no-print">
          <button
            type="button"
            onClick={() => onOpenAddTraineeModal()}
            className="min-h-[56px] px-5 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl font-black text-base inline-flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <UserPlus className="w-5 h-5 shrink-0" />
            <span>Adicionar pessoa</span>
          </button>
          <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={onPrint}
              className="min-h-[56px] flex items-center justify-center gap-2 px-4 sm:px-5 py-3 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-2xl font-black text-base transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
              aria-label="Imprimir Pessoas e Cadastros"
            >
              <Printer className="w-5 h-5 shrink-0" />
              <span>Imprimir</span>
            </button>
            <button
              type="button"
              onClick={onExportUsersToCSV}
              className="min-h-[56px] flex items-center justify-center gap-2 px-4 sm:px-5 py-3 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-2xl font-black text-base transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
              aria-label="Exportar pessoas para CSV"
            >
              <Download className="w-5 h-5 shrink-0" />
              <span>Salvar Planilha</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setUsersSubTab('equipe')}
          className="bg-white dark:bg-stone-900 rounded-3xl p-5 border-2 border-stone-200 dark:border-stone-800 hover:border-emerald-500 shadow-xs flex items-center gap-4 text-left transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold text-stone-500 dark:text-stone-400 block uppercase tracking-wider">
              Equipe Ativa
            </span>
            <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight block">
              {teamMembers.length}
            </span>
            <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">integrantes cadastrados</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setUsersSubTab('treinamento')}
          className="bg-white dark:bg-stone-900 rounded-3xl p-5 border-2 border-stone-200 dark:border-stone-800 hover:border-emerald-500 shadow-xs flex items-center gap-4 text-left transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold text-stone-500 dark:text-stone-400 block uppercase tracking-wider">
              Em Treinamento
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 leading-tight block">
              {allTrainees.length}
            </span>
            <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              {completedAwaitingCount > 0 ? `${completedAwaitingCount} aguardando promoção` : 'acompanhamento ativo'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setUsersSubTab('procurar')}
          className="bg-white dark:bg-stone-900 rounded-3xl p-5 border-2 border-stone-200 dark:border-stone-800 hover:border-emerald-500 shadow-xs flex items-center gap-4 text-left transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 shrink-0">
            <Search className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold text-stone-500 dark:text-stone-400 block uppercase tracking-wider">
              Visitantes
            </span>
            <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight block">
              {allVisitors.length}
            </span>
            <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">disponíveis para convite</span>
          </div>
        </button>
      </div>

      {/* Sub-abas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full">
        <button
          type="button"
          onClick={() => setUsersSubTab('equipe')}
          className={`min-h-[56px] px-4 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
            usersSubTab === 'equipe'
              ? 'bg-emerald-700 text-white border-2 border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
          }`}
        >
          <Users className="w-5 h-5 shrink-0" />
          <span>Equipe ({teamMembers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setUsersSubTab('treinamento')}
          className={`min-h-[56px] px-4 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
            usersSubTab === 'treinamento'
              ? 'bg-emerald-700 text-white border-2 border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
          }`}
        >
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>Em treinamento ({allTrainees.length})</span>
          {completedAwaitingCount > 0 && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                usersSubTab === 'treinamento'
                  ? 'bg-white text-emerald-800'
                  : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
              }`}
            >
              {completedAwaitingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setUsersSubTab('procurar')}
          className={`min-h-[56px] px-4 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
            usersSubTab === 'procurar'
              ? 'bg-emerald-700 text-white border-2 border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
          }`}
        >
          <Search className="w-5 h-5 shrink-0" />
          <span>Procurar pessoa</span>
        </button>
      </div>

      {/* Últimas promoções */}
      {recentPromotions.length > 0 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight">
                Últimas promoções
              </h3>
              <p className="text-base text-stone-600 dark:text-stone-400 font-medium">
                Decisões recentes com prazo de 7 dias para revisão segura
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {recentPromotions.slice(0, 5).map((promo) => {
              const daysPassed = Math.floor((Date.now() - promo.timestamp) / (1000 * 60 * 60 * 24));
              const daysRemaining = Math.max(0, 7 - daysPassed);
              const canUndo = daysPassed < 7 && !promo.id.startsWith('undo-');

              return (
                <div
                  key={promo.id}
                  className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-lg font-black text-stone-900 dark:text-white leading-snug">{promo.sentence}</p>
                    <p className="text-base font-bold text-stone-600 dark:text-stone-300 mt-1">
                      {canUndo ? (
                        <span className="text-emerald-700 dark:text-emerald-400">
                          Você pode desfazer até 7 dias depois (restam {daysRemaining}{' '}
                          {daysRemaining === 1 ? 'dia' : 'dias'})
                        </span>
                      ) : (
                        <span className="text-stone-500 dark:text-stone-400">
                          {promo.id.startsWith('undo-') ? 'Reversão registrada no histórico' : 'Prazo expirado'}
                        </span>
                      )}
                    </p>
                  </div>

                  {canUndo ? (
                    <button
                      type="button"
                      onClick={() => onOpenUndoPromotion(promo)}
                      className="min-h-[56px] px-6 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-600 hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-800 dark:text-stone-200 font-black text-base inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0 w-full sm:w-auto justify-center"
                    >
                      <RotateCcw className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
                      <span>Desfazer</span>
                    </button>
                  ) : promo.id.startsWith('undo-') ? (
                    <span className="text-sm font-bold text-stone-500 dark:text-stone-400 px-4 py-2 rounded-xl bg-stone-200/50 dark:bg-stone-800 shrink-0">
                      Desfeito
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenHelpModal}
                      className="min-h-[46px] px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                      <span>Pedir ajuda ao suporte</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. EQUIPE */}
      {usersSubTab === 'equipe' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              Equipe Cadastrada ({filteredTeamMembers.length})
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setUserRoleFilter('todos')}
              className={`min-h-[48px] px-4 py-2.5 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition-all cursor-pointer inline-flex items-center gap-2 ${
                userRoleFilter === 'todos'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
              }`}
            >
              <span>Todos da Equipe ({teamMembers.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setUserRoleFilter('produtor')}
              className={`min-h-[48px] px-4 py-2.5 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition-all cursor-pointer inline-flex items-center gap-2 ${
                userRoleFilter === 'produtor'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
              }`}
            >
              <span>
                Produtores ({teamMembers.filter((u) => u.role === 'produtor' || u.role === 'colaborador').length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setUserRoleFilter('aprendiz')}
              className={`min-h-[48px] px-4 py-2.5 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition-all cursor-pointer inline-flex items-center gap-2 ${
                userRoleFilter === 'aprendiz'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Aprendizes Artesãos ({teamMembers.filter((u) => u.role === 'aprendiz').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setUserRoleFilter('aprendiz_gestor')}
              className={`min-h-[48px] px-4 py-2.5 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition-all cursor-pointer inline-flex items-center gap-2 ${
                userRoleFilter === 'aprendiz_gestor'
                  ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-teal-500'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Aprendizes Gestão ({teamMembers.filter((u) => u.role === 'aprendiz_gestor').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setUserRoleFilter('gestor')}
              className={`min-h-[48px] px-4 py-2.5 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition-all cursor-pointer inline-flex items-center gap-2 ${
                userRoleFilter === 'gestor'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
              }`}
            >
              <span>Gestores ({teamMembers.filter((u) => u.role === 'gestor').length})</span>
            </button>
          </div>

          {filteredTeamMembers.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center space-y-2">
              <Users className="w-12 h-12 mx-auto text-stone-400" />
              <p className="text-xl font-black text-stone-900 dark:text-white">
                Nenhuma pessoa encontrada neste filtro
              </p>
              <p className="text-base text-stone-600 dark:text-stone-400 font-medium">
                Selecione outro cargo acima ou adicione um visitante para iniciar o treinamento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTeamMembers.map((u) => {
                const isSelf = u.name === currentActorName;
                const isAprendizArtesao = u.role === 'aprendiz';
                const isAprendizGestao = u.role === 'aprendiz_gestor';
                const isProdutor = u.role === 'produtor' || u.role === 'colaborador';

                return (
                  <div
                    key={u.id}
                    className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border-2 border-stone-200 dark:border-stone-800 shadow-xs hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 border-2 ${
                          isAprendizGestao
                            ? 'bg-teal-100 dark:bg-teal-900/60 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200'
                            : isAprendizArtesao || isProdutor
                              ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                              : 'bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {u.name.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h4 className="font-black text-xl text-stone-900 dark:text-white leading-tight break-words">
                            {u.name}
                          </h4>

                          {isAprendizArtesao ? (
                            <span className="px-3.5 py-1 rounded-full text-sm font-black bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-700 inline-flex items-center gap-1.5 whitespace-nowrap">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 shrink-0" />
                              <span>Aprendiz (Artesão)</span>
                            </span>
                          ) : isAprendizGestao ? (
                            <span className="px-3.5 py-1 rounded-full text-sm font-black bg-teal-100 text-teal-950 dark:bg-teal-950/60 dark:text-teal-200 border border-teal-400 dark:border-teal-700 inline-flex items-center gap-1.5 whitespace-nowrap">
                              <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300 shrink-0" />
                              <span>Aprendiz (Gestão)</span>
                            </span>
                          ) : (
                            <span
                              className={`px-3.5 py-1 rounded-full text-sm font-black inline-flex items-center gap-1.5 border whitespace-nowrap ${
                                isProdutor
                                  ? 'bg-green-100 text-green-900 border-green-300 dark:bg-green-950/50 dark:text-green-200 dark:border-green-700'
                                  : 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-700'
                              }`}
                            >
                              {isProdutor ? 'Produtor' : 'Gestor'}
                            </span>
                          )}
                        </div>

                        {u.email && (
                          <p className="text-sm font-medium text-stone-600 dark:text-stone-400 truncate">{u.email}</p>
                        )}

                        {u.stepText && (
                          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                            Progresso: {u.stepText}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto pt-3 xl:pt-0 border-t xl:border-t-0 border-stone-200 dark:border-stone-800 shrink-0">
                      <div className="flex flex-col gap-1 sm:w-[220px]">
                        <label
                          htmlFor={`role-select-${u.id}`}
                          className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 xl:sr-only"
                        >
                          Cargo
                        </label>
                        <select
                          id={`role-select-${u.id}`}
                          value={u.role === 'colaborador' ? 'produtor' : u.role}
                          aria-label={`Alterar cargo de ${u.name}`}
                          disabled={isSelf}
                          onChange={(e) => onChangeRole(u.id, e.target.value)}
                          className="w-full min-h-[52px] px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-emerald-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="aprendiz">Aprendiz (Artesão)</option>
                          <option value="aprendiz_gestor">Aprendiz (Gestão)</option>
                          <option value="produtor">Produtor</option>
                          <option value="gestor">Gestor</option>
                        </select>
                      </div>

                      <div className="shrink-0 flex items-center">
                        {isSelf ? (
                          <span className="w-full sm:w-auto min-h-[52px] px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-bold text-sm inline-flex items-center justify-center border border-stone-200 dark:border-stone-700 whitespace-nowrap">
                            Seu próprio perfil
                          </span>
                        ) : isAprendizArtesao ? (
                          <button
                            type="button"
                            onClick={() => onPromoteClick(u)}
                            className="w-full sm:w-auto min-h-[52px] px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-base inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                          >
                            <UserCheck className="w-5 h-5 shrink-0" />
                            <span>Promover para Produtor</span>
                          </button>
                        ) : isAprendizGestao ? (
                          <button
                            type="button"
                            onClick={() => onPromoteClick(u)}
                            className="w-full sm:w-auto min-h-[52px] px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-black text-base inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                          >
                            <UserCheck className="w-5 h-5 shrink-0" />
                            <span>Promover para Gestor</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. EM TREINAMENTO */}
      {usersSubTab === 'treinamento' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                Concluíram o treino ({completedTrainees.length})
              </h3>
            </div>

            <div className="space-y-4">
              {completedTrainees.length === 0 ? (
                <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-center text-stone-600 dark:text-stone-400 font-medium text-lg">
                  Nenhuma pessoa concluiu todas as etapas até o momento.
                </div>
              ) : (
                completedTrainees.map((trainee) => (
                  <TraineeProgressCard
                    key={trainee.id}
                    trainee={trainee}
                    isCompleted={true}
                    allProducts={allProducts}
                    variant="users_tab"
                    isSelf={trainee.name === currentActorName}
                    onPromoteClick={onPromoteClick}
                    onIncompleteActionClick={onIncompleteActionClick}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                Em andamento ({inProgressTrainees.length})
              </h3>
            </div>

            <div className="space-y-4">
              {inProgressTrainees.length === 0 ? (
                <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-center text-stone-600 dark:text-stone-400 font-medium text-lg">
                  Nenhuma pessoa com treinamento em andamento no momento.
                </div>
              ) : (
                inProgressTrainees.map((trainee) => (
                  <TraineeProgressCard
                    key={trainee.id}
                    trainee={trainee}
                    isCompleted={false}
                    allProducts={allProducts}
                    variant="users_tab"
                    isSelf={trainee.name === currentActorName}
                    onPromoteClick={onPromoteClick}
                    onIncompleteActionClick={onIncompleteActionClick}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. PROCURAR PESSOA */}
      {usersSubTab === 'procurar' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
              <Search className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              <span>Procurar visitante cadastrado</span>
            </h3>
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium mt-1">
              Visitantes não aparecem na tabela da equipe. Para achá-los e colocá-los em treinamento, busque pelo nome ou e-mail:
            </p>
          </div>

          <div className="relative">
            <Search className="w-6 h-6 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={visitorSearchTerm}
              onChange={(e) => {
                setVisitorSearchTerm(e.target.value);
                setVisitorVisibleCount(3);
              }}
              placeholder="Procurar pessoa pelo nome ou e-mail"
              aria-label="Procurar pessoa pelo nome ou e-mail"
              className="w-full min-h-[56px] pl-14 pr-4 py-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-lg focus:outline-none focus:border-green-600"
            />
          </div>

          {matchingVisitors.length === 0 ? (
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 text-center border-2 border-stone-200 dark:border-stone-700">
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 font-medium">
                Nenhum visitante encontrado com este termo de busca.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-base font-bold text-stone-600 dark:text-stone-400">
                <span>Visitantes encontrados ({matchingVisitors.length})</span>
                <span>
                  Mostrando {visibleVisitors.length} de {matchingVisitors.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {visibleVisitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-xl font-black text-stone-800 dark:text-stone-200 shrink-0">
                        {visitor.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-lg text-stone-900 dark:text-white leading-tight truncate">
                          {visitor.name}
                        </h4>
                        <p className="text-sm font-bold text-stone-600 dark:text-stone-400 truncate mt-0.5">
                          {visitor.email}
                        </p>
                        <span className="inline-block px-3 py-1 mt-2 rounded-full text-xs font-black bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-200">
                          Visitante
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenAddTraineeModal(visitor)}
                      className="w-full min-h-[56px] px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-base inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-5 h-5 shrink-0" />
                      <span>Colocar em treinamento</span>
                    </button>
                  </div>
                ))}
              </div>

              {matchingVisitors.length > visitorVisibleCount && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setVisitorVisibleCount((prev) => prev + 3)}
                    className="min-h-[56px] px-8 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-black text-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <ChevronDown className="w-5 h-5" />
                    <span>Ver mais ({matchingVisitors.length - visitorVisibleCount} restantes)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
