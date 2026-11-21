import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Calendar as CalendarIcon,
  Camera,
  ClipboardList,
  LayoutDashboard,
  Shield,
  Ticket,
  Users,
} from 'lucide-react';
import { useProducts, type UserRole } from '../contexts';
import { downloadCsvFile } from '../lib';
import {
  cooperativeApi,
  fetchCooperativeStore,
  isDjangoBackendEnabled,
  persistCooperativeSection,
  readCachedStore,
} from '../services';
import type { EventItem, ProductItem, UserItem } from '../types';
import type { HelpTicket } from '../components';
import type { AdmOverviewTabTarget } from '../components/dashboard/adm/AdmOverviewTab';
import type { RecentPromotion } from '../components/dashboard/adm/AdmUsersTab';
import { useAdmContentAndTrash } from './useAdmContentAndTrash';
import { useFocusTrap } from './useFocusTrap';

export type AdmTabType = AdmOverviewTabTarget;

export interface AdmNavItem {
  id: AdmTabType;
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  badge?: string;
}

export interface AdmAuditLogEntry {
  id: string;
  action: string;
  details: string;
  date: string;
  user: string;
}

const ROLE_NAME_MAP: Record<string, string> = {
  visitante: 'Visitante',
  aprendiz: 'Aprendiz (Artesão)',
  aprendiz_gestor: 'Aprendiz (Gestão)',
  produtor: 'Produtor Oficial',
  colaborador: 'Produtor Oficial',
  gestor: 'Gestor',
};

const isTraineeUser = (u: UserItem) => u.role === 'aprendiz' || u.role === 'aprendiz_gestor';
const isTraineeCompleted = (u: UserItem) =>
  (u.completedStepsCount !== undefined && u.completedStepsCount >= (u.totalStepsCount || 3)) ||
  (u.stepText?.includes('3 de 3') ?? false) ||
  Boolean(u.completedAt);

interface UseAdmDashboardOptions {
  role?: UserRole;
  actorName: string;
  isTraineeManager: boolean;
  usersList: UserItem[];
  setUsersList: React.Dispatch<React.SetStateAction<UserItem[]>>;
  externalEventsList?: EventItem[];
  externalSetEventsList?: React.Dispatch<React.SetStateAction<EventItem[]>>;
  externalTicketsList?: HelpTicket[];
  externalSetTicketsList?: React.Dispatch<React.SetStateAction<HelpTicket[]>>;
  getIdToken: () => Promise<string | null>;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function useAdmDashboard({
  role,
  actorName,
  isTraineeManager,
  usersList,
  setUsersList,
  externalEventsList,
  externalSetEventsList,
  externalTicketsList,
  externalSetTicketsList,
  getIdToken,
  addToast,
}: UseAdmDashboardOptions) {
  const isAdm = role === 'adm';
  const {
    allProducts,
    approveProduct,
    requestProductAdjustment,
    updateTrainingProduct,
  } = useProducts();

  const [activeTab, setActiveTab] = useState<AdmTabType>('overview');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isAtelieGroupOpen, setIsAtelieGroupOpen] = useState(false);
  const [approvalReasonInputs, setApprovalReasonInputs] = useState<Record<number, string>>({});
  const [catalogFilter, setCatalogFilter] = useState<'aguardando' | 'ajustes' | 'publicadas' | 'todas'>('aguardando');
  const [adjustingProductId, setAdjustingProductId] = useState<number | null>(null);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [processingProductId, setProcessingProductId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrintingSales, setIsPrintingSales] = useState(false);

  const [isAddTraineeModalOpen, setIsAddTraineeModalOpen] = useState(false);
  const [traineeSearchTerm, setTraineeSearchTerm] = useState('');
  const [traineeVisibleCount, setTraineeVisibleCount] = useState(3);
  const [selectedVisitorForTraining, setSelectedVisitorForTraining] = useState<UserItem | null>(null);
  const [newTraineeTrainingFor, setNewTraineeTrainingFor] = useState<'produtor' | 'gestor'>('produtor');
  const [confirmTrainingModal, setConfirmTrainingModal] = useState<{
    isOpen: boolean;
    visitor: UserItem | null;
    targetRole: 'produtor' | 'gestor';
  }>({
    isOpen: false,
    visitor: null,
    targetRole: 'produtor',
  });

  const [visitorSearchTerm, setVisitorSearchTerm] = useState('');
  const [visitorVisibleCount, setVisitorVisibleCount] = useState(3);
  const [usersSubTab, setUsersSubTab] = useState<'equipe' | 'treinamento' | 'procurar'>('equipe');
  const [userRoleFilter, setUserRoleFilter] = useState<
    'todos' | 'produtor' | 'aprendiz' | 'aprendiz_gestor' | 'gestor'
  >('todos');

  const [recentPromotions, setRecentPromotions] = useState<RecentPromotion[]>(() => {
    if (isTraineeManager) return [];
    const cached = readCachedStore();
    return Array.isArray(cached.promotions) ? (cached.promotions as RecentPromotion[]) : [];
  });
  const [undoPromotionTarget, setUndoPromotionTarget] = useState<RecentPromotion | null>(null);
  const [undoReason, setUndoReason] = useState('');

  const [internalTicketsList, setInternalTicketsList] = useState<HelpTicket[]>([]);
  const ticketsList = externalTicketsList || internalTicketsList;
  const setTicketsList = externalSetTicketsList || setInternalTicketsList;
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [ticketReplyMessage, setTicketReplyMessage] = useState('');

  const [internalEventsList, setInternalEventsList] = useState<EventItem[]>([]);
  const eventsList = externalEventsList || internalEventsList;
  const setEventsList = externalSetEventsList || setInternalEventsList;

  const [auditLogs, setAuditLogs] = useState<AdmAuditLogEntry[]>([]);

  const addAuditLog = useCallback(
    (action: string, details: string) => {
      setAuditLogs((prev) => [
        {
          id: Date.now().toString(),
          action,
          details,
          date: new Date().toLocaleString('pt-BR'),
          user: isAdm ? 'Suporte técnico' : actorName,
        },
        ...prev,
      ]);
    },
    [actorName, isAdm]
  );

  const persistPromotionsSafe = useCallback(
    (nextPromotions: RecentPromotion[]) => {
      if (isTraineeManager) return;
      void getIdToken()
        .catch(() => null)
        .then((token) => persistCooperativeSection('promotions', nextPromotions, token));
    },
    [getIdToken, isTraineeManager]
  );

  useEffect(() => {
    if (isTraineeManager) return;
    let active = true;
    fetchCooperativeStore().then((store) => {
      if (!active || !store) return;
      if (Array.isArray(store.promotions)) {
        setRecentPromotions(store.promotions as RecentPromotion[]);
      }
    });
    if (isAdm && isDjangoBackendEnabled()) {
      getIdToken()
        .then((token) => cooperativeApi.getAuditLogs(token))
        .then((res) => {
          if (!active || !res?.logs) return;
          setAuditLogs(res.logs);
        })
        .catch(() => {
          // Keep current in-memory logs if unavailable
        });
    }
    return () => {
      active = false;
    };
  }, [getIdToken, isAdm, isTraineeManager]);

  const contentAndTrash = useAdmContentAndTrash({
    role,
    actorName,
    isTraineeManager,
    getIdToken,
    addToast,
    addAuditLog,
  });

  const photoTrashModalRef = useRef<HTMLDivElement>(null);
  const videoTrashModalRef = useRef<HTMLDivElement>(null);
  const addTraineeModalRef = useRef<HTMLDivElement>(null);
  const undoPromotionModalRef = useRef<HTMLDivElement>(null);
  const mobileMenuDrawerRef = useRef<HTMLElement>(null);
  const admMoreModalRef = useRef<HTMLDivElement>(null);

  const closeAddTraineeModal = useCallback(() => {
    setIsAddTraineeModalOpen(false);
    setSelectedVisitorForTraining(null);
    setTraineeSearchTerm('');
  }, []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const closeAdmMore = useCallback(() => setIsMoreOpen(false), []);
  const closePhotoTrash = useCallback(() => contentAndTrash.setPhotoToTrash(null), [contentAndTrash]);
  const closeVideoTrash = useCallback(() => contentAndTrash.setVideoToTrashConfirm(false), [contentAndTrash]);
  const closeUndoPromotion = useCallback(() => {
    setUndoPromotionTarget(null);
    setUndoReason('');
  }, []);

  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const requestConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      confirmText?: string,
      cancelText?: string
    ) => {
      setConfirmAction({ isOpen: true, title, message, onConfirm, confirmText, cancelText });
    },
    []
  );
  const closeConfirm = useCallback(
    () => setConfirmAction((prev) => ({ ...prev, isOpen: false })),
    []
  );

  useFocusTrap(Boolean(contentAndTrash.photoToTrash), photoTrashModalRef, closePhotoTrash);
  useFocusTrap(contentAndTrash.videoToTrashConfirm, videoTrashModalRef, closeVideoTrash);
  useFocusTrap(isAddTraineeModalOpen && !confirmTrainingModal.isOpen, addTraineeModalRef, closeAddTraineeModal);
  useFocusTrap(Boolean(undoPromotionTarget), undoPromotionModalRef, closeUndoPromotion);
  useFocusTrap(isMobileMenuOpen && !confirmAction.isOpen, mobileMenuDrawerRef, closeMobileMenu);
  useFocusTrap(isMoreOpen && !confirmAction.isOpen, admMoreModalRef, closeAdmMore);

  const manageableUsers = useMemo(() => usersList.filter((u) => u.role !== 'adm'), [usersList]);
  const teamMembers = useMemo(() => manageableUsers.filter((u) => u.role !== 'visitante'), [manageableUsers]);
  const allVisitors = useMemo(() => manageableUsers.filter((u) => u.role === 'visitante'), [manageableUsers]);
  const allTrainees = useMemo(() => manageableUsers.filter(isTraineeUser), [manageableUsers]);
  const completedTrainees = useMemo(() => allTrainees.filter(isTraineeCompleted), [allTrainees]);
  const inProgressTrainees = useMemo(() => allTrainees.filter((u) => !isTraineeCompleted(u)), [allTrainees]);
  const completedAwaitingCount = completedTrainees.length;

  const openTechTicketsCount = useMemo(
    () => ticketsList.filter((tk) => tk.category === 'tecnico' && tk.status === 'aberto').length,
    [ticketsList]
  );
  const openProdutorTicketsCount = useMemo(
    () => ticketsList.filter((tk) => tk.category === 'produtor' && tk.status === 'aberto').length,
    [ticketsList]
  );
  const openTicketsCount = isAdm ? openTechTicketsCount : openProdutorTicketsCount;
  const pendingApprovalProducts = useMemo(
    () => allProducts.filter((p) => !p.isTraining && p.status === 'em_revisao'),
    [allProducts]
  );

  const gestorNavItems: AdmNavItem[] = useMemo(
    () => [
      { id: 'overview', label: 'Início', icon: LayoutDashboard },
      {
        id: 'catalog',
        label: 'Verificar produtos',
        icon: AlertTriangle,
        badge: pendingApprovalProducts.length > 0 ? String(pendingApprovalProducts.length) : undefined,
      },
      { id: 'agenda', label: 'Agenda', icon: CalendarIcon },
      {
        id: 'users',
        label: 'Pessoas e cadastros',
        icon: Users,
        badge: completedAwaitingCount > 0 ? String(completedAwaitingCount) : undefined,
      },
      { id: 'content', label: 'Textos, fotos e vídeos', icon: Camera },
      {
        id: 'tickets',
        label: 'Dúvidas dos produtores',
        icon: Ticket,
        badge: openProdutorTicketsCount > 0 ? String(openProdutorTicketsCount) : undefined,
      },
    ],
    [pendingApprovalProducts.length, completedAwaitingCount, openProdutorTicketsCount]
  );

  const adminSystemNavItems: AdmNavItem[] = useMemo(
    () => [
      { id: 'overview', label: 'Início', icon: LayoutDashboard },
      {
        id: 'tech_tickets',
        label: 'Chamados técnicos',
        icon: Ticket,
        badge: openTechTicketsCount > 0 ? String(openTechTicketsCount) : undefined,
      },
      { id: 'diagnostics', label: 'Status do sistema', icon: Activity },
      { id: 'audit', label: 'Histórico do sistema', icon: ClipboardList },
      { id: 'permissions', label: 'Cargos e permissões', icon: Shield },
    ],
    [openTechTicketsCount]
  );

  const atelieNavItems: AdmNavItem[] = useMemo(
    () => [
      {
        id: 'catalog',
        label: 'Verificar produtos',
        icon: AlertTriangle,
        badge: pendingApprovalProducts.length > 0 ? String(pendingApprovalProducts.length) : undefined,
      },
      { id: 'agenda', label: 'Agenda', icon: CalendarIcon },
      {
        id: 'users',
        label: 'Pessoas e cadastros',
        icon: Users,
        badge: completedAwaitingCount > 0 ? String(completedAwaitingCount) : undefined,
      },
      { id: 'content', label: 'Textos, fotos e vídeos', icon: Camera },
    ],
    [pendingApprovalProducts.length, completedAwaitingCount]
  );

  const navItems = useMemo(
    () => (isAdm ? [...adminSystemNavItems, ...atelieNavItems] : gestorNavItems),
    [isAdm, adminSystemNavItems, atelieNavItems, gestorNavItems]
  );

  const persistMemberRoleChange = async (
    targetUser: UserItem,
    nextRole: string,
    meta: {
      status?: string;
      stepText?: string;
      trainingTarget?: 'produtor' | 'colaborador' | 'gestor';
      completedStepsCount?: number;
      totalStepsCount?: number;
      lastActivityDate?: string;
      reason?: string;
      actionLabel?: string;
    }
  ): Promise<boolean> => {
    if (isTraineeManager) return true;
    const identifier = targetUser.email || targetUser.uid || targetUser.id;
    try {
      const token = await getIdToken().catch(() => null);
      await cooperativeApi.updateMemberRole(identifier, nextRole, meta, token);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível salvar a mudança de cargo no servidor.';
      addToast(message, 'error');
      return false;
    }
  };

  const handleExecuteAddTrainee = async (visitor: UserItem, targetRole: 'produtor' | 'gestor') => {
    const targetRoleLabel = targetRole === 'gestor' ? 'Gestor' : 'Produtor';
    const nextRole = targetRole === 'gestor' ? 'aprendiz_gestor' : 'aprendiz';
    const ok = await persistMemberRoleChange(visitor, nextRole, {
      status: 'treinamento',
      trainingTarget: targetRole,
      completedStepsCount: 0,
      totalStepsCount: 3,
      stepText: '0 de 3 etapas',
      lastActivityDate: 'Hoje',
      actionLabel: 'Treinamento',
    });
    if (!ok) return;

    setUsersList((prev) =>
      prev.map((u) =>
        u.id === visitor.id
          ? {
              ...u,
              role: nextRole,
              trainingTarget: targetRole,
              completedStepsCount: 0,
              totalStepsCount: 3,
              stepText: '0 de 3 etapas',
              lastActivityDate: 'Hoje',
            }
          : u
      )
    );
    setConfirmTrainingModal({ isOpen: false, visitor: null, targetRole: 'produtor' });
    setIsAddTraineeModalOpen(false);
    setSelectedVisitorForTraining(null);
    setTraineeSearchTerm('');
    addToast(`${visitor.name} foi colocado(a) em treinamento para ${targetRoleLabel}!`, 'success');
    addAuditLog('Treinamento', `${visitor.name} colocado(a) em treinamento para ${targetRoleLabel}.`);
  };

  const persistAdmTickets = (nextTickets: HelpTicket[]) => {
    if (isTraineeManager) return;
    void getIdToken()
      .catch(() => null)
      .then((token) => persistCooperativeSection('tickets', nextTickets, token));
  };

  const handleReplyMensagem = (e: React.FormEvent, ticketId: number) => {
    e.preventDefault();
    if (!ticketReplyMessage.trim()) return;

    setTicketsList((list) => {
      const next = list.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        const replyAuthor = isAdm ? 'Suporte técnico' : actorName;
        return {
          ...ticket,
          messages: [
            ...(ticket.messages || []),
            {
              author: replyAuthor,
              text: ticketReplyMessage.trim(),
              date:
                new Date().toLocaleDateString('pt-BR') +
                ' às ' +
                new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              isSystemOrSupport: isAdm,
            },
          ],
          displayStatus: isAdm ? ('Estamos vendo' as const) : ticket.displayStatus,
        };
      });
      persistAdmTickets(next);
      return next;
    });
    setTicketReplyMessage('');
    addToast('Resposta enviada com sucesso.', 'success');
  };

  const exportAuditLogsToCSV = () => {
    downloadCsvFile(
      'audit_logs',
      ['Data / Hora', 'Ação', 'Detalhes', 'Pessoa'],
      auditLogs.map((log) => [log.date, log.action, log.details, log.user])
    );
    addToast('Registros exportados com sucesso!', 'success');
  };

  const exportUsersToCSV = () => {
    downloadCsvFile(
      'usuarios',
      ['ID', 'Nome da Pessoa', 'Cargo'],
      manageableUsers.map((u) => [u.id, u.name, u.role])
    );
    addToast('Lista de usuários exportada!', 'success');
  };

  const exportProductsToCSV = () => {
    downloadCsvFile(
      'produtos',
      ['ID', 'Título', 'Técnica', 'Artista', 'Preço', 'Disponível'],
      allProducts.map((p) => [p.id, p.title, p.technique, p.artist, p.price, p.isAvailable ? 'Sim' : 'Não'])
    );
    addToast('Lista de produtos exportada!', 'success');
  };

  const exportEventsToCSV = () => {
    downloadCsvFile(
      'agenda',
      ['ID', 'Título', 'Data', 'Horário', 'Tipo'],
      eventsList.map((e) => [e.id, e.title, e.date, e.time, e.type])
    );
    addToast('Agenda exportada!', 'success');
  };

  const handlePromoteClick = (userToPromote: UserItem) => {
    const currentActorName = isAdm ? 'Administrador' : actorName;
    if (userToPromote.name === currentActorName) {
      addToast('Não é possível promover a si mesmo.', 'error');
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (userToPromote.role === 'aprendiz_gestor' || userToPromote.trainingTarget === 'gestor') {
      requestConfirm(
        'Confirmar Promoção para Gestor',
        `Deseja promover ${userToPromote.name} para Gestor? Ele poderá editar textos, fotos e vídeos do site.`,
        async () => {
          const ok = await persistMemberRoleChange(userToPromote, 'gestor', {
            status: 'ativo',
            stepText: 'Promovido para Gestor',
            actionLabel: 'Promoção de Cargo',
          });
          if (!ok) {
            closeConfirm();
            return;
          }
          setUsersList((prev) =>
            prev.map((u) =>
              u.id === userToPromote.id ? { ...u, role: 'gestor', stepText: 'Promovido para Gestor' } : u
            )
          );
          const newSentence = `${currentActorName} promoveu ${userToPromote.name} para Gestor · ${dateStr} às ${timeStr}`;
          setRecentPromotions((prev) => {
            const next = [
              {
                id: `promo-${Date.now()}`,
                sentence: newSentence,
                promotedUserName: userToPromote.name,
                promotedUserId: userToPromote.id,
                promotedToRole: 'gestor' as const,
                previousRole: 'aprendiz_gestor' as const,
                timestamp: Date.now(),
              },
              ...prev,
            ];
            persistPromotionsSafe(next);
            return next;
          });
          addAuditLog('Promoção de Cargo', newSentence);
          addToast(`${userToPromote.name} promovido(a) para Gestor com sucesso!`, 'success');
          closeConfirm();
        },
        'Sim, promover',
        'Não, voltar'
      );
      return;
    }

    requestConfirm(
      'Confirmar Promoção para a Equipe de Produção',
      `Deseja promover ${userToPromote.name} para a Equipe de Produção? A pessoa poderá cadastrar e gerenciar peças para publicação no Departamento de Vendas Rosa Mística da nossa associação.`,
      async () => {
        const ok = await persistMemberRoleChange(userToPromote, 'produtor', {
          status: 'ativo',
          stepText: 'Promovida para a Equipe de Produção',
          actionLabel: 'Promoção de Cargo',
        });
        if (!ok) {
          closeConfirm();
          return;
        }
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === userToPromote.id
              ? { ...u, role: 'produtor', stepText: 'Promovida para a Equipe de Produção' }
              : u
          )
        );
        const newSentence = `${currentActorName} promoveu ${userToPromote.name} para a Equipe de Produção · ${dateStr} às ${timeStr}`;
        setRecentPromotions((prev) => {
          const next = [
            {
              id: `promo-${Date.now()}`,
              sentence: newSentence,
              promotedUserName: userToPromote.name,
              promotedUserId: userToPromote.id,
              promotedToRole: 'produtor' as const,
              previousRole: 'aprendiz' as const,
              timestamp: Date.now(),
            },
            ...prev,
          ];
          persistPromotionsSafe(next);
          return next;
        });
        addAuditLog('Promoção de Cargo', newSentence);
        addToast(`${userToPromote.name} na Equipe de Produção com sucesso!`, 'success');
        closeConfirm();
      },
      'Sim, promover',
      'Não, voltar'
    );
  };

  const handleIncompleteActionClick = (trainee: UserItem) => {
    const stepsCount =
      trainee.completedStepsCount ??
      (trainee.stepText?.includes('2 de 3') ? 2 : trainee.stepText?.includes('1 de 3') ? 1 : 0);
    const totalSteps = trainee.totalStepsCount || 3;
    const missing = Math.max(1, totalSteps - stepsCount);
    const isTargetGestor = trainee.role === 'aprendiz_gestor' || trainee.trainingTarget === 'gestor';
    const targetLabel = isTargetGestor ? 'Gestor' : 'Produtor';

    requestConfirm(
      'Ainda faltam etapas de treino',
      `${trainee.name} ainda está em treinamento e ${
        missing === 1 ? 'ainda falta 1 etapa' : `ainda faltam ${missing} etapas`
      } para a conclusão recomendada.\n\nDeseja realizar a promoção para ${targetLabel} mesmo antes do término de todas as etapas?`,
      () => {
        closeConfirm();
        handlePromoteClick(trainee);
      },
      'Sim, prosseguir com a decisão',
      'Aguardar conclusão do treino'
    );
  };

  const handleExecuteUndoPromotion = async () => {
    if (!undoPromotionTarget) return;
    const target = undoPromotionTarget;
    const targetUser = usersList.find((u) => u.id === target.promotedUserId);
    if (targetUser) {
      const ok = await persistMemberRoleChange(targetUser, target.previousRole, {
        status: 'treinamento',
        stepText: 'Em treinamento',
        reason: undoReason.trim(),
        actionLabel: 'Reversão de Promoção',
      });
      if (!ok) return;
    }

    const currentActorName = isAdm ? 'Administrador' : actorName;
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setUsersList((prev) =>
      prev.map((u) =>
        u.id === target.promotedUserId ? { ...u, role: target.previousRole, stepText: 'Em treinamento' } : u
      )
    );

    const undoSentence = `${currentActorName} desfez a promoção de ${target.promotedUserName}${
      undoReason.trim() ? ` · Motivo: ${undoReason.trim()}` : ''
    } · ${dateStr} às ${timeStr}`;

    setRecentPromotions((prev) => {
      const next = [
        {
          id: `undo-${Date.now()}`,
          sentence: undoSentence,
          promotedUserName: target.promotedUserName,
          promotedUserId: target.promotedUserId,
          promotedToRole: target.previousRole as 'gestor' | 'produtor',
          previousRole: target.promotedToRole as 'aprendiz' | 'aprendiz_gestor',
          timestamp: Date.now(),
        },
        ...prev,
      ];
      persistPromotionsSafe(next);
      return next;
    });

    addAuditLog('Reversão de Promoção', undoSentence);
    addToast(`Promoção desfeita com sucesso. ${target.promotedUserName} voltou a ser Aprendiz.`, 'success');
    setUndoPromotionTarget(null);
    setUndoReason('');
  };

  const handleChangeRole = (id: number, newRole: string) => {
    if (newRole === 'adm') {
      addToast('A gestão não pode definir administradores. O cargo máximo é Gestor.', 'error');
      return;
    }
    const targetUser = usersList.find((u) => u.id === id);
    if (!targetUser || targetUser.role === newRole) return;

    const dateStr = new Date().toLocaleDateString('pt-BR');
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    requestConfirm(
      'Confirmar Mudança na Equipe',
      `Mudança na equipe:\n\nPessoa: ${targetUser.name}\nQuando: ${dateStr} às ${timeStr}\nFunção anterior: ${
        ROLE_NAME_MAP[targetUser.role] || targetUser.role
      }\nNova função: ${ROLE_NAME_MAP[newRole] || newRole}\n\nA gente vai guardar esse registro com cuidado. Quer confirmar a mudança?`,
      async () => {
        const ok = await persistMemberRoleChange(targetUser, newRole, {
          status: newRole === 'aprendiz' || newRole === 'aprendiz_gestor' ? 'treinamento' : 'ativo',
          actionLabel: 'Alteração de Acesso',
        });
        if (!ok) {
          closeConfirm();
          return;
        }
        setUsersList((users) => users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
        addAuditLog(
          'Alteração de Acesso',
          `Função de "${targetUser.name}" atualizada de "${ROLE_NAME_MAP[targetUser.role] || targetUser.role}" para "${
            ROLE_NAME_MAP[newRole] || newRole
          }". Registrado por: ${role === 'adm' ? 'Administrador' : actorName} em ${dateStr} às ${timeStr}.`
        );
        addToast(`Função de ${targetUser.name} atualizada para ${ROLE_NAME_MAP[newRole] || newRole}.`, 'success');
        closeConfirm();
      },
      'Sim, mudar função',
      'Não, voltar'
    );
  };

  const handleApprovePiece = async (product: ProductItem) => {
    if (processingProductId === product.id) return;

    if (isTraineeManager) {
      updateTrainingProduct(product.id, (current) => ({
        ...current,
        status: 'publicado',
        adjustmentFeedback: undefined,
        updatedAt: new Date().toISOString(),
      }));
      addToast(`Peça "${product.title}" aprovada e publicada na vitrine de treino com sucesso!`, 'success');
      addAuditLog('Aprovação de Peça', `Peça "${product.title}" de ${product.artist} aprovada para a vitrine.`);
      return;
    }

    setProcessingProductId(product.id);
    try {
      await approveProduct(product.id);
      addToast(`Peça "${product.title}" aprovada e publicada na vitrine Rosa Mística com sucesso!`, 'success');
      addAuditLog('Aprovação de Peça', `Peça "${product.title}" de ${product.artist} aprovada para a vitrine.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível aprovar a peça no servidor.';
      addToast(message, 'error');
    } finally {
      setProcessingProductId(null);
    }
  };

  const handleSendAdjustment = async (productId: number) => {
    if (processingProductId === productId) return;
    const cleanReason = adjustmentReason.trim();
    if (!cleanReason) {
      addToast('Por favor, informe o que precisa mudar na peça.', 'error');
      return;
    }
    const targetProduct = allProducts.find((p) => p.id === productId);

    if (isTraineeManager) {
      updateTrainingProduct(productId, (current) => ({
        ...current,
        status: 'ajuste_solicitado',
        adjustmentFeedback: cleanReason,
        updatedAt: new Date().toISOString(),
      }));
      addToast(`Pedido de ajuste enviado para ${targetProduct?.artist || 'o artesão'} com sucesso!`, 'info');
      addAuditLog('Pedido de Ajuste', `Ajuste solicitado na peça "${targetProduct?.title}": ${cleanReason}`);
      setAdjustingProductId(null);
      setAdjustmentReason('');
      return;
    }

    setProcessingProductId(productId);
    try {
      await requestProductAdjustment(productId, cleanReason);
      addToast(`Pedido de ajuste enviado para ${targetProduct?.artist || 'o artesão'} com sucesso!`, 'info');
      addAuditLog('Pedido de Ajuste', `Ajuste solicitado na peça "${targetProduct?.title}": ${cleanReason}`);
      setAdjustingProductId(null);
      setAdjustmentReason('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível enviar o pedido de ajuste.';
      addToast(message, 'error');
    } finally {
      setProcessingProductId(null);
    }
  };

  const closeMensagem = async (id: number) => {
    const ticket = ticketsList.find((tk) => tk.id === id);
    if (ticket) {
      addAuditLog('Atendimento Fechado', `Mensagem #${id} ("${ticket.title}") foi marcado como fechado.`);
      addToast('Mensagem resolvida com sucesso.', 'success');
    }

    setTicketsList((list) => {
      const next = list.map((tk) => (tk.id === id ? { ...tk, status: 'fechado' as const } : tk));
      persistAdmTickets(next);
      return next;
    });
  };

  const openMensagem = async (id: number) => {
    const ticket = ticketsList.find((tk) => tk.id === id);
    if (ticket) {
      addAuditLog('Atendimento Reaberto', `Mensagem #${id} ("${ticket.title}") foi reaberta.`);
      addToast('Mensagem reaberta com sucesso.', 'success');
    }

    setTicketsList((list) => {
      const next = list.map((tk) => (tk.id === id ? { ...tk, status: 'aberto' as const } : tk));
      persistAdmTickets(next);
      return next;
    });
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const eventTitle = (form.elements[0] as HTMLInputElement).value;
    const eventDate = (form.elements[1] as HTMLInputElement).value;
    const eventTime = (form.elements[2] as HTMLInputElement).value;
    const eventType = (form.elements[3] as HTMLSelectElement).value;

    const newEventItem: EventItem = {
      id: Date.now(),
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      type: eventType,
      description: 'Evento da nossa associação aberto à comunidade.',
    };
    setEventsList((prev) => {
      const next = [...prev, newEventItem];
      if (!isTraineeManager) {
        void getIdToken()
          .catch(() => null)
          .then((token) => persistCooperativeSection('events', next, token));
      }
      return next;
    });

    if (!isTraineeManager) {
      try {
        const existing = localStorage.getItem('potengi_public_events');
        const list = existing ? JSON.parse(existing) : [];
        const formattedDay = eventDate
          ? new Date(eventDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })
          : 'A definir';
        const normalizedType: 'Curso' | 'Oficina' | 'Outro Evento' = eventType.toLowerCase().includes('curso')
          ? 'Curso'
          : eventType.toLowerCase().includes('oficina')
            ? 'Oficina'
            : 'Outro Evento';
        const newEventForPublic = {
          id: newEventItem.id,
          title: eventTitle,
          date: eventDate,
          day: formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1),
          time: eventTime,
          type: normalizedType,
          description: 'Evento presencial na Associação Julieta Barros.',
          location: 'Espaço Comunitário · Associação Julieta Barros',
          instructor: 'Associação Julieta Barros',
          vacancies: 'Vagas abertas · Presencial',
        };
        const updatedPublicEvents = [newEventForPublic, ...list];
        localStorage.setItem('potengi_public_events', JSON.stringify(updatedPublicEvents));
        void getIdToken()
          .catch(() => null)
          .then((token) => persistCooperativeSection('publicEvents', updatedPublicEvents, token));
      } catch {
        // ignore storage errors
      }
    }

    if (isTraineeManager) {
      addToast('Evento de treino adicionado à agenda! A gestão registrou sua prática de agenda.', 'success');
      setUsersList((prev) =>
        prev.map((u) => {
          if (u.role === 'aprendiz_gestor') {
            const currentPractices = u.practicedItems || [];
            const updated = currentPractices.includes('Simulou evento na Agenda comunitária')
              ? currentPractices
              : [...currentPractices, 'Simulou evento na Agenda comunitária'];
            return {
              ...u,
              stepText: `${Math.min(4, updated.length)} de 4 tarefas`,
              completedStepsCount: Math.min(4, updated.length),
              practicedItems: updated,
            };
          }
          return u;
        })
      );
    } else {
      addToast('Evento adicionado à agenda com sucesso!', 'success');
    }
    form.reset();
  };

  const handleOpenAddTraineeModal = (visitor?: UserItem) => {
    setTraineeSearchTerm('');
    setSelectedVisitorForTraining(visitor ?? null);
    setTraineeVisibleCount(3);
    setNewTraineeTrainingFor('produtor');
    setIsAddTraineeModalOpen(true);
  };

  const filteredModalVisitors = useMemo(
    () =>
      allVisitors.filter(
        (v) =>
          v.name.toLowerCase().includes(traineeSearchTerm.toLowerCase()) ||
          (v.email && v.email.toLowerCase().includes(traineeSearchTerm.toLowerCase()))
      ),
    [allVisitors, traineeSearchTerm]
  );
  const visibleModalVisitors = useMemo(
    () => filteredModalVisitors.slice(0, traineeVisibleCount),
    [filteredModalVisitors, traineeVisibleCount]
  );

  const handlePrint = () => {
    window.print();
  };

  return {
    isAdm,
    allProducts,
    activeTab,
    setActiveTab,
    isMoreOpen,
    setIsMoreOpen,
    isAtelieGroupOpen,
    setIsAtelieGroupOpen,
    approvalReasonInputs,
    setApprovalReasonInputs,
    catalogFilter,
    setCatalogFilter,
    adjustingProductId,
    setAdjustingProductId,
    adjustmentReason,
    setAdjustmentReason,
    processingProductId,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isPrintingSales,
    setIsPrintingSales,
    isAddTraineeModalOpen,
    traineeSearchTerm,
    setTraineeSearchTerm,
    traineeVisibleCount,
    setTraineeVisibleCount,
    selectedVisitorForTraining,
    setSelectedVisitorForTraining,
    newTraineeTrainingFor,
    setNewTraineeTrainingFor,
    confirmTrainingModal,
    setConfirmTrainingModal,
    visitorSearchTerm,
    setVisitorSearchTerm,
    visitorVisibleCount,
    setVisitorVisibleCount,
    usersSubTab,
    setUsersSubTab,
    userRoleFilter,
    setUserRoleFilter,
    recentPromotions,
    undoPromotionTarget,
    setUndoPromotionTarget,
    undoReason,
    setUndoReason,
    ticketsList,
    setTicketsList,
    selectedTicketId,
    setSelectedTicketId,
    ticketReplyMessage,
    setTicketReplyMessage,
    eventsList,
    auditLogs,
    teamMembers,
    allVisitors,
    allTrainees,
    completedTrainees,
    inProgressTrainees,
    completedAwaitingCount,
    openTechTicketsCount,
    openProdutorTicketsCount,
    openTicketsCount,
    pendingApprovalProducts,
    gestorNavItems,
    adminSystemNavItems,
    atelieNavItems,
    navItems,
    filteredModalVisitors,
    visibleModalVisitors,
    confirmAction,
    requestConfirm,
    closeConfirm,
    photoTrashModalRef,
    videoTrashModalRef,
    addTraineeModalRef,
    undoPromotionModalRef,
    mobileMenuDrawerRef,
    admMoreModalRef,
    closeAddTraineeModal,
    closeMobileMenu,
    closeAdmMore,
    closePhotoTrash,
    closeVideoTrash,
    closeUndoPromotion,
    handleExecuteAddTrainee,
    handleReplyMensagem,
    exportAuditLogsToCSV,
    exportUsersToCSV,
    exportProductsToCSV,
    exportEventsToCSV,
    handleIncompleteActionClick,
    handlePromoteClick,
    handleExecuteUndoPromotion,
    handleChangeRole,
    handleApprovePiece,
    handleSendAdjustment,
    closeMensagem,
    openMensagem,
    handleAddEventSubmit,
    handleOpenAddTraineeModal,
    handlePrint,
    ...contentAndTrash,
  };
}
