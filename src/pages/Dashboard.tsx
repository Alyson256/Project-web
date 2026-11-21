import { Suspense, lazy, useState } from 'react';
import { useAuth, type UserRole } from '../contexts';
import { useCooperativeDashboardStore } from '../hooks';
import { DevRoleSwitcher, InactivityTracker } from '../components/dashboard/shared';

const AdmDashboard = lazy(() => import('../components/dashboard/adm/AdmDashboard'));
const StandardDashboard = lazy(() => import('../components/dashboard/producer/StandardDashboard'));
const VisitorDashboard = lazy(() => import('../components/dashboard/visitor/VisitorDashboard'));
const TraineeGestorDashboard = lazy(() => import('../components/dashboard/trainee/TraineeGestorDashboard'));
const HelpSupportModal = lazy(() =>
  import('../components/HelpSupportModal').then((m) => ({ default: m.HelpSupportModal }))
);
const RoleGuideModal = lazy(() =>
  import('../components/guide/RoleGuideModal').then((m) => ({ default: m.RoleGuideModal }))
);

function DashboardLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-canvas dark:bg-stone-950 flex items-center justify-center p-6"
    >
      <div className="flex flex-col items-center gap-3 text-stone-700 dark:text-stone-300">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-200 dark:border-emerald-900 border-t-emerald-700 dark:border-t-emerald-400 animate-spin" />
        <span className="text-base font-bold">Carregando painel...</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { role, loading, userProfile, logout, setRole, getIdToken } = useAuth();

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [roleOverride, setRoleOverride] = useState<UserRole | null>(null);
  const [showDevSwitcher, setShowDevSwitcher] = useState(false);

  const activeRole: UserRole = roleOverride || role || 'aprendiz';
  const actorName =
    userProfile?.display_name?.trim() ||
    userProfile?.first_name?.trim() ||
    (activeRole === 'adm'
      ? 'Suporte técnico'
      : activeRole === 'gestor'
        ? 'Gestão'
        : activeRole === 'visitante'
          ? 'Visitante'
          : 'Participante');

  const {
    usersList,
    setUsersList,
    eventsList,
    setEventsList,
    announcementsList,
    ticketsList,
    setTicketsList,
    handleAddTicket,
    handleReplyTicket,
    handleAdminApproval,
    handleTraineeGestorTaskCompleted,
  } = useCooperativeDashboardStore({ activeRole, actorName, getIdToken });

  const [isTutorialOpen, setIsTutorialOpen] = useState(() => {
    const roleKey = roleOverride || role || 'aprendiz';
    return localStorage.getItem(`guide_dismissed_${roleKey}`) !== 'true';
  });

  const handleRoleSwitch = (newRole: UserRole) => {
    setRoleOverride(newRole);
    if (setRole) setRole(newRole);
    const saved = localStorage.getItem('potengi_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.role = newRole;
        localStorage.setItem('potengi_current_user', JSON.stringify(parsed));
      } catch {
        // Ignora erros de armazenamento local
      }
    }
    if (newRole && localStorage.getItem(`guide_dismissed_${newRole}`) !== 'true') {
      setIsTutorialOpen(true);
    }
  };

  if (loading) return <DashboardLoadingFallback />;
  if (!role) return null;

  return (
    <>
      <InactivityTracker role={activeRole} logout={logout} />

      <DevRoleSwitcher
        activeRole={activeRole}
        isOpen={showDevSwitcher}
        onOpen={() => setShowDevSwitcher(true)}
        onClose={() => setShowDevSwitcher(false)}
        onSelectRole={handleRoleSwitch}
      />

      <Suspense fallback={<DashboardLoadingFallback />}>
        {activeRole === 'aprendiz_gestor' ? (
          <TraineeGestorDashboard
            userName={actorName}
            logout={logout}
            onTaskCompleted={handleTraineeGestorTaskCompleted}
          />
        ) : activeRole === 'adm' || activeRole === 'gestor' ? (
          <AdmDashboard
            role={activeRole}
            usersList={usersList}
            setUsersList={setUsersList}
            eventsList={eventsList}
            setEventsList={setEventsList}
            ticketsList={ticketsList}
            setTicketsList={setTicketsList}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onOpenHelpModal={() => setIsHelpModalOpen(true)}
            onAdminApproval={handleAdminApproval}
          />
        ) : activeRole === 'visitante' ? (
          <VisitorDashboard
            logout={logout}
            eventsList={eventsList}
            announcementsList={announcementsList}
            onOpenTutorial={() => setIsTutorialOpen(true)}
          />
        ) : (
          <StandardDashboard
            role={activeRole}
            logout={logout}
            usersList={usersList}
            setUsersList={setUsersList}
            onSwitchToManager={() => handleRoleSwitch('gestor')}
            onOpenTutorial={activeRole === 'aprendiz' ? undefined : () => setIsTutorialOpen(true)}
            onOpenHelpModal={activeRole === 'aprendiz' ? undefined : () => setIsHelpModalOpen(true)}
          />
        )}
      </Suspense>

      {activeRole !== 'aprendiz' && activeRole !== 'aprendiz_gestor' && (
        <>
          {isTutorialOpen && (
            <Suspense fallback={null}>
              <RoleGuideModal
                isOpen={isTutorialOpen}
                onClose={() => setIsTutorialOpen(false)}
                role={activeRole}
              />
            </Suspense>
          )}

          {isHelpModalOpen && (
            <Suspense fallback={null}>
              <HelpSupportModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                currentUserRole={activeRole}
                currentUserName={actorName}
                currentScreenName={
                  activeRole === 'adm'
                    ? 'Administração Técnica'
                    : activeRole === 'gestor'
                      ? 'Painel de Gestão'
                      : 'Meus Produtos'
                }
                ticketsList={ticketsList}
                onAddTicket={handleAddTicket}
                onReplyTicket={handleReplyTicket}
              />
            </Suspense>
          )}
        </>
      )}
    </>
  );
}