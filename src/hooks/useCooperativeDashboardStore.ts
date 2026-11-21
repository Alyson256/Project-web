import { useCallback, useEffect, useState } from 'react';
import { useProducts, type UserRole } from '../contexts';
import type { HelpTicket } from '../components';
import type { AnnouncementItem, EventItem, UserItem } from '../types';
import { mockUsers } from '../data';
import {
  cooperativeApi,
  fetchCooperativeStore,
  isDjangoBackendEnabled,
  persistCooperativeSection,
  readCachedStore,
} from '../services';

interface UseCooperativeDashboardStoreOptions {
  activeRole: UserRole;
  actorName?: string;
  getIdToken: () => Promise<string | null>;
}

function mapServerMembersToUserItems(members: any[]): UserItem[] {
  return members.map((m, idx) => ({
    id: typeof m.numericId === 'number' ? m.numericId : typeof m.id === 'number' ? m.id : 200 + idx,
    uid: m.uid,
    name: m.display_name || `${m.first_name || ''} ${m.last_name || ''}`.trim() || m.email || 'Membro',
    email: m.email || undefined,
    role: m.role || 'visitante',
    cooperativeStatus: m.cooperative_status ?? null,
    stepText: m.stepText || undefined,
    trainingTarget: m.trainingTarget || undefined,
    completedStepsCount: typeof m.completedStepsCount === 'number' ? m.completedStepsCount : undefined,
    totalStepsCount: typeof m.totalStepsCount === 'number' ? m.totalStepsCount : undefined,
    completedAt: m.completedAt || undefined,
    lastActivityDate: m.lastActivityDate || undefined,
    practicedItems: Array.isArray(m.practicedItems) ? m.practicedItems : undefined,
  }));
}

export function useCooperativeDashboardStore({
  activeRole,
  actorName = 'Gestão',
  getIdToken,
}: UseCooperativeDashboardStoreOptions) {
  const isTrainingRole = activeRole === 'aprendiz' || activeRole === 'aprendiz_gestor';
  const { allProducts, refreshProducts } = useProducts();

  const [usersList, setUsersList] = useState<UserItem[]>(() => (isTrainingRole ? mockUsers : []));
  const [eventsList, setEventsList] = useState<EventItem[]>(() => {
    const cached = readCachedStore();
    return Array.isArray(cached.events) ? cached.events : [];
  });
  const [announcementsList, setAnnouncementsList] = useState<AnnouncementItem[]>(() => {
    const cached = readCachedStore();
    return Array.isArray(cached.announcements) ? cached.announcements : [];
  });
  const [ticketsList, setTicketsList] = useState<HelpTicket[]>(() => {
    const cached = readCachedStore();
    return Array.isArray(cached.tickets) ? cached.tickets : [];
  });

  const syncStoreFromServer = useCallback(
    async (isActive?: () => boolean) => {
      const token = await getIdToken().catch(() => null);
      if (isActive && !isActive()) return;

      if ((activeRole === 'gestor' || activeRole === 'adm') && isDjangoBackendEnabled()) {
        const membersResponse = await cooperativeApi.getMembers(token).catch(() => null);
        if (isActive && !isActive()) return;
        if (membersResponse && Array.isArray(membersResponse.members)) {
          setUsersList(mapServerMembersToUserItems(membersResponse.members));
        }
      } else if (isTrainingRole) {
        setUsersList((prev) => (prev.length > 0 ? prev : mockUsers));
      }

      const store = await fetchCooperativeStore();
      if (!store || (isActive && !isActive())) return;
      if (Array.isArray(store.events)) {
        setEventsList(store.events);
      }
      if (Array.isArray(store.announcements)) {
        setAnnouncementsList(store.announcements);
      }
      if (Array.isArray(store.tickets)) {
        setTicketsList(store.tickets);
      }
    },
    [activeRole, getIdToken, isTrainingRole]
  );

  useEffect(() => {
    let active = true;
    const isActive = () => active;
    void syncStoreFromServer(isActive);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        void syncStoreFromServer(isActive);
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      active = false;
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [activeRole, syncStoreFromServer]);

  const persistTicketsSafe = async (nextTickets: HelpTicket[]) => {
    if (isTrainingRole) return;
    const token = await getIdToken().catch(() => null);
    await persistCooperativeSection('tickets', nextTickets, token);
  };

  const handleAddTicket = (newTicket: HelpTicket) => {
    setTicketsList((prev) => {
      const next = [newTicket, ...prev];
      void persistTicketsSafe(next);
      return next;
    });
  };

  const handleReplyTicket = (ticketId: number, messageText: string) => {
    setTicketsList((prev) => {
      const next: HelpTicket[] = prev.map((t) => {
        if (t.id === ticketId) {
          const isSupportUser = activeRole === 'adm';
          const senderName = isSupportUser ? 'Suporte técnico' : activeRole === 'gestor' ? actorName : 'Você';
          return {
            ...t,
            messages: [
              ...t.messages,
              {
                author: senderName,
                text: messageText,
                date:
                  new Date().toLocaleDateString('pt-BR') +
                  ' às ' +
                  new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                isSystemOrSupport: isSupportUser,
              },
            ],
            displayStatus: isSupportUser ? ('Estamos vendo' as const) : t.displayStatus,
          };
        }
        return t;
      });
      void persistTicketsSafe(next);
      return next;
    });
  };

  const handleAdminApproval = (ticketId: number, approved: boolean, reason: string) => {
    const resultLabel = approved ? 'Aprovado' : 'Não aprovado';
    setTicketsList((prev) => {
      const next: HelpTicket[] = prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            approvalStatus: approved ? ('aprovado' as const) : ('rejeitado' as const),
            approvalReason: reason,
            displayStatus: 'Resolvido' as const,
            messages: [
              ...t.messages,
              {
                author: 'Suporte técnico',
                text: `Resultado da análise técnica: ${resultLabel}.${reason.trim() ? ` Motivo: ${reason.trim()}` : ''}`,
                date:
                  new Date().toLocaleDateString('pt-BR') +
                  ' às ' +
                  new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                isSystemOrSupport: true,
              },
            ],
          };
        }
        return t;
      });
      void persistTicketsSafe(next);
      return next;
    });
  };

  const handleTraineeGestorTaskCompleted = (taskTitle: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.role === 'aprendiz_gestor') {
          const current = u.practicedItems || [];
          const updated = current.includes(taskTitle) ? current : [...current, taskTitle];
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
  };

  return {
    usersList,
    setUsersList,
    allProducts,
    refreshProducts,
    eventsList,
    setEventsList,
    announcementsList,
    setAnnouncementsList,
    ticketsList,
    setTicketsList,
    handleAddTicket,
    handleReplyTicket,
    handleAdminApproval,
    handleTraineeGestorTaskCompleted,
  };
}
