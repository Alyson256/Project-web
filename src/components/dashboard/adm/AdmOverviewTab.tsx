import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  Sparkles,
  Ticket,
  UserCheck,
} from 'lucide-react';
import type { ProductItem, UserItem } from '../../../types';

export type AdmOverviewTabTarget =
  | 'overview'
  | 'training'
  | 'catalog'
  | 'agenda'
  | 'users'
  | 'content'
  | 'tickets'
  | 'tech_tickets'
  | 'permissions'
  | 'audit'
  | 'diagnostics';

interface AdmOverviewTabProps {
  isAdm: boolean;
  openTechTicketsCount: number;
  openTicketsCount: number;
  openProdutorTicketsCount: number;
  recentPromotionsCount: number;
  completedTrainees: UserItem[];
  pendingApprovalProducts: ProductItem[];
  onSelectTab: (tab: AdmOverviewTabTarget) => void;
  onOpenTeamUsers: () => void;
  onPromoteClick: (user: UserItem) => void;
}

export const AdmOverviewTab: React.FC<AdmOverviewTabProps> = ({
  isAdm,
  openTechTicketsCount,
  openTicketsCount,
  openProdutorTicketsCount,
  recentPromotionsCount,
  completedTrainees,
  pendingApprovalProducts,
  onSelectTab,
  onOpenTeamUsers,
  onPromoteClick,
}) => {
  if (isAdm) {
    return (
      <div className="space-y-6 w-full">
        <div>
          <h2 className="text-3xl font-black text-stone-900 dark:text-white">Painel da Administração Técnica</h2>
          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1">
            Monitoramento de integridade, chamados e suporte à equipe do ateliê
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 1. Sistema: Tudo funcionando */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/60 border border-teal-300 dark:border-teal-700 flex items-center justify-center text-teal-800 dark:text-teal-300 shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight">
                  Sistema: Tudo funcionando
                </h4>
                <p className="text-base font-bold text-teal-800 dark:text-teal-300 mt-1 flex flex-wrap items-center gap-2">
                  <span>Última verificação: hoje às 08:30</span>
                  <span className="text-teal-600 dark:text-teal-400 font-extrabold">•</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-200/90 text-teal-950 dark:bg-teal-900 dark:text-teal-200 border border-teal-400 dark:border-teal-600">
                    Modo desacoplado
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('diagnostics')}
              className="w-full sm:w-auto min-h-[56px] px-7 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-black text-base inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Activity className="w-5 h-5" />
              <span>Ver status</span>
            </button>
          </div>

          {/* 2. Chamados técnicos abertos */}
          <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                <Ticket className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight">
                  Chamados técnicos abertos: {openTechTicketsCount}
                </h4>
                <p className="text-base font-medium text-stone-600 dark:text-stone-400 mt-0.5">
                  Chamados técnicos aguardando resposta do suporte
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('tech_tickets')}
              className="w-full sm:w-auto self-start min-h-[56px] px-8 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black text-base inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Eye className="w-5 h-5" />
              <span>Ver chamados</span>
            </button>
          </div>

          {/* 4. Promoções recentes de Gestor */}
          <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shrink-0">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight">
                  Promoções recentes de Gestor: {recentPromotionsCount}
                </h4>
                <p className="text-base font-medium text-stone-600 dark:text-stone-400 mt-0.5">
                  Histórico de promoções e mudanças da nossa associação
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenTeamUsers}
              className="w-full sm:w-auto self-start min-h-[56px] px-8 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black text-base inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Eye className="w-5 h-5" />
              <span>Ver equipe</span>
            </button>
          </div>

          {/* 3. Últimas alterações no site */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
              <h4 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                <span>Últimas alterações no site</span>
              </h4>
              <button
                type="button"
                onClick={() => onSelectTab('audit')}
                className="text-base font-extrabold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver tudo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-base font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Ana editou o texto &apos;Nossa História&apos; · hoje às 14:05</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-base font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Carlos Ferreira atualizou a foto &apos;Oficina de Argila e Renda&apos; · ontem às 16:20</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-base font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Ana promoveu Carlos Ferreira para Gestor · 31/10 às 10:15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasPendingProducts = pendingApprovalProducts.length > 0;
  const hasOpenTickets = openTicketsCount > 0;
  const totalPending = completedTrainees.length + (hasPendingProducts ? 1 : 0) + (hasOpenTickets ? 1 : 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-stone-900 dark:text-white">Painel de Gestão</h2>
        <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1">
          Acompanhe as prioridades do ateliê de forma simples e direta.
        </p>
      </div>

      {/* Seção Principal: O que precisa da sua atenção hoje */}
      <div className="bg-transparent sm:bg-white dark:sm:bg-stone-900 rounded-none sm:rounded-3xl p-0 sm:p-8 border-0 sm:border-2 border-stone-200 dark:border-stone-800 shadow-none sm:shadow-sm space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight">
              O que precisa da sua atenção hoje
            </h3>
            <p className="text-xs sm:text-base text-stone-600 dark:text-stone-400 font-medium">
              Pendências e ações que necessitam de acompanhamento
            </p>
          </div>
        </div>

        {totalPending === 0 ? (
          <div className="py-8 sm:py-12 px-4 sm:px-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-700 text-center space-y-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-700">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h4 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white">Tudo em dia.</h4>
            <p className="text-sm sm:text-lg text-stone-600 dark:text-stone-400 font-medium max-w-md mx-auto">
              Não há peças para aprovar, mensagens abertas nem pessoas aguardando promoção no momento.
            </p>
          </div>
        ) : (
          <div className={totalPending > 1 ? 'grid grid-cols-1 xl:grid-cols-2 gap-4' : 'space-y-4'}>
            {completedTrainees.map((trainee) => (
              <div
                key={`attention-trainee-${trainee.id}`}
                className="p-4 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shrink-0">
                    <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug line-clamp-2">
                      {trainee.name} concluiu o treino
                    </h4>
                    <p className="text-xs sm:text-base font-bold text-emerald-800 dark:text-emerald-300 mt-0.5 line-clamp-2">
                      Todas as etapas concluídas e aguardam decisão
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onPromoteClick(trainee)}
                  className="min-h-[56px] px-6 sm:px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <UserCheck className="w-5 h-5 shrink-0" />
                  <span>Promover</span>
                </button>
              </div>
            ))}

            {hasPendingProducts && (
              <div className="p-4 sm:p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                    <AlertTriangle className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug line-clamp-2">
                      {pendingApprovalProducts.length}{' '}
                      {pendingApprovalProducts.length === 1 ? 'peça para aprovação' : 'peças para aprovação'}
                    </h4>
                    <p className="text-xs sm:text-base font-bold text-amber-800 dark:text-amber-300 mt-0.5 line-clamp-2">
                      Novas criações enviadas pelos produtores
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTab('catalog')}
                  className="min-h-[56px] px-6 sm:px-8 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <Eye className="w-5 h-5 shrink-0" />
                  <span>Ver</span>
                </button>
              </div>
            )}

            {openProdutorTicketsCount > 0 && (
              <div className="p-4 sm:p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-300 dark:border-blue-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-700 flex items-center justify-center text-blue-800 dark:text-blue-300 shrink-0">
                    <Ticket className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug line-clamp-2">
                      {openProdutorTicketsCount}{' '}
                      {openProdutorTicketsCount === 1 ? 'dúvida de produtor' : 'dúvidas de produtores'}
                    </h4>
                    <p className="text-xs sm:text-base font-bold text-blue-800 dark:text-blue-300 mt-0.5 line-clamp-2">
                      Dúvidas enviadas para a gestão
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTab('tickets')}
                  className="min-h-[56px] px-6 sm:px-8 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <Eye className="w-5 h-5 shrink-0" />
                  <span>Ver</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
