import React, { Suspense, lazy } from 'react';
import { AlertTriangle, ChevronLeft } from 'lucide-react';
import { useAuth, useLanguage, useTheme, useToast, type UserRole } from '../../../contexts';
import { useAdmDashboard } from '../../../hooks';
import type { EventItem, UserItem } from '../../../types';
import type { HelpTicket } from '../../../components';
import { ConfirmModal, DashboardSectionFallback } from '../shared';
import { AdmHeader, AdmTopBanner } from './AdmHeader';
import { AdmMobileNav } from './AdmMobileNav';
import { AdmOverviewTab } from './AdmOverviewTab';
import { AdmSidebar } from './AdmSidebar';

const ActivityLog = lazy(() => import('../../ActivityLog').then((m) => ({ default: m.ActivityLog })));
const SalesReportModal = lazy(() =>
  import('../../SalesReportModal').then((m) => ({ default: m.SalesReportModal }))
);
const SystemDiagnostics = lazy(() =>
  import('../../SystemDiagnostics').then((m) => ({ default: m.SystemDiagnostics }))
);
const AdmAgendaTab = lazy(() =>
  import('./AdmAgendaAndPermissions').then((m) => ({ default: m.AdmAgendaTab }))
);
const AdmPermissionsTab = lazy(() =>
  import('./AdmAgendaAndPermissions').then((m) => ({ default: m.AdmPermissionsTab }))
);
const AdmCatalogTab = lazy(() => import('./AdmCatalogTab').then((m) => ({ default: m.AdmCatalogTab })));
const AdmContentTab = lazy(() => import('./AdmContentTab').then((m) => ({ default: m.AdmContentTab })));
const AdmTicketsTab = lazy(() => import('./AdmTicketsTab').then((m) => ({ default: m.AdmTicketsTab })));
const AdmTrainingTab = lazy(() => import('./AdmUsersTab').then((m) => ({ default: m.AdmTrainingTab })));
const AdmUsersTab = lazy(() => import('./AdmUsersTab').then((m) => ({ default: m.AdmUsersTab })));
const AdmModals = lazy(() => import('./AdmModals').then((m) => ({ default: m.AdmModals })));

export interface AdmDashboardProps {
  role?: UserRole;
  isTraineeManager?: boolean;
  onPromoteToFullManager?: () => void;
  usersList: UserItem[];
  setUsersList: React.Dispatch<React.SetStateAction<UserItem[]>>;
  eventsList?: EventItem[];
  setEventsList?: React.Dispatch<React.SetStateAction<EventItem[]>>;
  ticketsList?: HelpTicket[];
  setTicketsList?: React.Dispatch<React.SetStateAction<HelpTicket[]>>;
  onSwitchToTrainee?: () => void;
  onOpenTutorial?: () => void;
  onOpenHelpModal?: () => void;
  onAdminApproval?: (ticketId: number, approved: boolean, reason: string) => void;
}

export const AdmDashboard: React.FC<AdmDashboardProps> = ({
  role: propRole,
  isTraineeManager = false,
  usersList,
  setUsersList,
  eventsList: externalEventsList,
  setEventsList: externalSetEventsList,
  ticketsList: externalTicketsList,
  setTicketsList: externalSetTicketsList,
  onOpenTutorial,
  onOpenHelpModal,
  onAdminApproval,
}) => {
  const { user, userProfile, role: authRole, logout, getIdToken } = useAuth();
  const role = propRole || authRole;
  const { t } = useLanguage();
  const { openAccessibility } = useTheme();
  const { addToast } = useToast();

  const actorName =
    userProfile?.display_name ||
    (user as { name?: string; displayName?: string } | null)?.name ||
    (user as { name?: string; displayName?: string } | null)?.displayName ||
    'Gestor';

  const adm = useAdmDashboard({
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
  });

  const hasOpenAdmModal = Boolean(
    adm.photoToTrash ||
      adm.videoToTrashConfirm ||
      adm.isAddTraineeModalOpen ||
      adm.confirmTrainingModal.isOpen ||
      adm.undoPromotionTarget ||
      adm.isMoreOpen
  );

  const handleRequestLogout = () =>
    adm.requestConfirm(
      t('dash.confirmar_saida'),
      t('dash.confirmar_saida_msg'),
      logout,
      t('dash.sim'),
      t('dash.nao')
    );

  const handleRequestLogoutFromMore = () => {
    adm.setIsMoreOpen(false);
    adm.requestConfirm(
      'Deseja sair?',
      'Quer mesmo sair agora da sua conta de gestão? A gente espera você voltar em breve!',
      logout,
      'Sim, sair',
      'Continuar aqui'
    );
  };

  return (
    <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 overflow-hidden">
      <AdmTopBanner isAdm={adm.isAdm} />

      <div className="flex flex-1 h-full overflow-hidden">
        <AdmSidebar
          isAdm={adm.isAdm}
          activeTab={adm.activeTab}
          onSelectTab={adm.setActiveTab}
          adminSystemNavItems={adm.adminSystemNavItems}
          atelieNavItems={adm.atelieNavItems}
          gestorNavItems={adm.gestorNavItems}
          isAtelieGroupOpen={adm.isAtelieGroupOpen}
          onToggleAtelieGroup={() => adm.setIsAtelieGroupOpen((prev) => !prev)}
          isMobileMenuOpen={adm.isMobileMenuOpen}
          onCloseMobileMenu={adm.closeMobileMenu}
          mobileMenuDrawerRef={adm.mobileMenuDrawerRef}
          onOpenAccessibility={openAccessibility}
          accessibilityLabel={t('nav.acessibilidade', 'Acessibilidade')}
          onRequestLogout={handleRequestLogout}
          logoutLabelDesktop="Sair da Conta"
          logoutLabelMobile="Sair do Sistema"
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <AdmHeader
            isAdm={adm.isAdm}
            isTraineeManager={isTraineeManager}
            userName={actorName}
            activeTabLabel={adm.navItems.find((i) => i.id === adm.activeTab)?.label}
            onOpenHelpModal={onOpenHelpModal}
            onOpenTutorial={onOpenTutorial}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
              {adm.isAdm &&
                (adm.activeTab === 'catalog' ||
                  adm.activeTab === 'agenda' ||
                  adm.activeTab === 'users' ||
                  adm.activeTab === 'content') && (
                  <div className="bg-amber-100 dark:bg-amber-950 border-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 py-3.5 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs rounded-2xl animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-amber-700 dark:text-amber-400 shrink-0" />
                      <span className="text-base sm:text-lg font-black">
                        Você está na Gestão do ateliê. O que você fizer aqui fica registrado com o seu nome.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => adm.setActiveTab('overview')}
                      className="min-h-[46px] px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-black text-base shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Voltar para Administração</span>
                    </button>
                  </div>
                )}

              {adm.activeTab !== 'overview' && (
                <button
                  onClick={() => adm.setActiveTab('overview')}
                  title={t('dash.voltar') || 'Voltar'}
                  className="md:hidden flex items-center gap-2 mb-4 p-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-bold transition-colors no-print"
                >
                  <ChevronLeft className="w-5 h-5" /> Voltar
                </button>
              )}

              {adm.activeTab === 'overview' && (
                <AdmOverviewTab
                  isAdm={adm.isAdm}
                  openTechTicketsCount={adm.openTechTicketsCount}
                  openTicketsCount={adm.openTicketsCount}
                  openProdutorTicketsCount={adm.openProdutorTicketsCount}
                  recentPromotionsCount={adm.recentPromotions.length}
                  completedTrainees={adm.completedTrainees}
                  pendingApprovalProducts={adm.pendingApprovalProducts}
                  onSelectTab={adm.setActiveTab}
                  onOpenTeamUsers={() => {
                    adm.setActiveTab('users');
                    adm.setUsersSubTab('equipe');
                  }}
                  onPromoteClick={adm.handlePromoteClick}
                />
              )}

              <Suspense fallback={<DashboardSectionFallback />}>
                {adm.activeTab === 'training' && (
                  <AdmTrainingTab
                    allTrainees={adm.allTrainees}
                    completedTrainees={adm.completedTrainees}
                    inProgressTrainees={adm.inProgressTrainees}
                    allProducts={adm.allProducts}
                    onOpenAddTraineeModal={() => adm.handleOpenAddTraineeModal()}
                    onPromoteClick={adm.handlePromoteClick}
                    onIncompleteActionClick={adm.handleIncompleteActionClick}
                  />
                )}

                {adm.activeTab === 'catalog' && (
                  <AdmCatalogTab
                    allProducts={adm.allProducts}
                    catalogFilter={adm.catalogFilter}
                    setCatalogFilter={adm.setCatalogFilter}
                    adjustingProductId={adm.adjustingProductId}
                    setAdjustingProductId={adm.setAdjustingProductId}
                    adjustmentReason={adm.adjustmentReason}
                    setAdjustmentReason={adm.setAdjustmentReason}
                    processingProductId={adm.processingProductId}
                    onApprovePiece={adm.handleApprovePiece}
                    onSendAdjustment={adm.handleSendAdjustment}
                    onPrintSales={() => adm.setIsPrintingSales(true)}
                    onPrint={adm.handlePrint}
                    onExportProductsToCSV={adm.exportProductsToCSV}
                  />
                )}

                {adm.activeTab === 'users' && (
                  <AdmUsersTab
                    role={role}
                    teamMembers={adm.teamMembers}
                    allTrainees={adm.allTrainees}
                    completedTrainees={adm.completedTrainees}
                    inProgressTrainees={adm.inProgressTrainees}
                    allVisitors={adm.allVisitors}
                    allProducts={adm.allProducts}
                    completedAwaitingCount={adm.completedAwaitingCount}
                    usersSubTab={adm.usersSubTab}
                    setUsersSubTab={adm.setUsersSubTab}
                    userRoleFilter={adm.userRoleFilter}
                    setUserRoleFilter={adm.setUserRoleFilter}
                    visitorSearchTerm={adm.visitorSearchTerm}
                    setVisitorSearchTerm={adm.setVisitorSearchTerm}
                    visitorVisibleCount={adm.visitorVisibleCount}
                    setVisitorVisibleCount={adm.setVisitorVisibleCount}
                    recentPromotions={adm.recentPromotions}
                    onOpenUndoPromotion={adm.setUndoPromotionTarget}
                    onOpenAddTraineeModal={adm.handleOpenAddTraineeModal}
                    onChangeRole={adm.handleChangeRole}
                    onPromoteClick={adm.handlePromoteClick}
                    onIncompleteActionClick={adm.handleIncompleteActionClick}
                    onPrint={adm.handlePrint}
                    onExportUsersToCSV={adm.exportUsersToCSV}
                    onOpenHelpModal={onOpenHelpModal}
                    actorName={actorName}
                  />
                )}

                {adm.activeTab === 'tickets' && (
                  <AdmTicketsTab
                    mode="produtor"
                    ticketsList={adm.ticketsList}
                    setTicketsList={adm.setTicketsList}
                    selectedTicketId={adm.selectedTicketId}
                    setSelectedTicketId={adm.setSelectedTicketId}
                    ticketReplyMessage={adm.ticketReplyMessage}
                    setTicketReplyMessage={adm.setTicketReplyMessage}
                    approvalReasonInputs={adm.approvalReasonInputs}
                    setApprovalReasonInputs={adm.setApprovalReasonInputs}
                    onReplyMensagem={adm.handleReplyMensagem}
                    onCloseMensagem={adm.closeMensagem}
                    onOpenMensagem={adm.openMensagem}
                    onRequestConfirm={adm.requestConfirm}
                    onCloseConfirm={adm.closeConfirm}
                    onAdminApproval={onAdminApproval}
                    onAddToast={addToast}
                    onPrint={adm.handlePrint}
                    onOpenHelpModal={onOpenHelpModal}
                  />
                )}

                {adm.activeTab === 'tech_tickets' && adm.isAdm && (
                  <AdmTicketsTab
                    mode="tecnico"
                    ticketsList={adm.ticketsList}
                    setTicketsList={adm.setTicketsList}
                    selectedTicketId={adm.selectedTicketId}
                    setSelectedTicketId={adm.setSelectedTicketId}
                    ticketReplyMessage={adm.ticketReplyMessage}
                    setTicketReplyMessage={adm.setTicketReplyMessage}
                    approvalReasonInputs={adm.approvalReasonInputs}
                    setApprovalReasonInputs={adm.setApprovalReasonInputs}
                    onReplyMensagem={adm.handleReplyMensagem}
                    onCloseMensagem={adm.closeMensagem}
                    onOpenMensagem={adm.openMensagem}
                    onRequestConfirm={adm.requestConfirm}
                    onCloseConfirm={adm.closeConfirm}
                    onAdminApproval={onAdminApproval}
                    onAddToast={addToast}
                    onPrint={adm.handlePrint}
                    onOpenHelpModal={onOpenHelpModal}
                  />
                )}

                {adm.activeTab === 'permissions' && adm.isAdm && <AdmPermissionsTab />}

                {adm.activeTab === 'agenda' && (
                  <AdmAgendaTab
                    eventsList={adm.eventsList}
                    isTraineeManager={isTraineeManager}
                    onAddEventSubmit={adm.handleAddEventSubmit}
                    onPrint={adm.handlePrint}
                    onExportEventsToCSV={adm.exportEventsToCSV}
                  />
                )}

                {adm.activeTab === 'content' && (
                  <AdmContentTab
                    siteStoryTitle={adm.siteStoryTitle}
                    setSiteStoryTitle={adm.setSiteStoryTitle}
                    siteStoryText={adm.siteStoryText}
                    setSiteStoryText={adm.setSiteStoryText}
                    siteTeamPhoto={adm.siteTeamPhoto}
                    setSiteTeamPhoto={adm.setSiteTeamPhoto}
                    siteVideoUrl={adm.siteVideoUrl}
                    setSiteVideoUrl={adm.setSiteVideoUrl}
                    siteGalleryPhotos={adm.siteGalleryPhotos}
                    setSiteGalleryPhotos={adm.setSiteGalleryPhotos}
                    newPhotoTitle={adm.newPhotoTitle}
                    setNewPhotoTitle={adm.setNewPhotoTitle}
                    newPhotoUrl={adm.newPhotoUrl}
                    setNewPhotoUrl={adm.setNewPhotoUrl}
                    totalMediaBytes={adm.totalMediaBytes}
                    isCompressingPhotos={adm.isCompressingPhotos}
                    onUploadTeamPhoto={adm.handleUploadTeamPhoto}
                    onUploadGalleryPhotos={adm.handleUploadGalleryPhotos}
                    onCompressAllPhotos={adm.handleCompressAllGalleryPhotos}
                    onRequestTrashPhoto={adm.setPhotoToTrash}
                    onRequestTrashVideo={() => adm.setVideoToTrashConfirm(true)}
                    onSaveContent={adm.handleSaveContent}
                    onAddToast={addToast}
                  />
                )}

                {role === 'adm' && adm.activeTab === 'audit' && (
                  <ActivityLog
                    logs={adm.auditLogs}
                    onExportCSV={adm.exportAuditLogsToCSV}
                    trashList={adm.trashList}
                    onRestoreItem={adm.handleRestoreFromTrash}
                    onPermanentDelete={adm.handlePermanentDeleteFromTrash}
                  />
                )}

                {role === 'adm' && adm.activeTab === 'diagnostics' && <SystemDiagnostics />}
              </Suspense>
            </div>
          </main>
        </div>
      </div>

      <AdmMobileNav
        isAdm={adm.isAdm}
        activeTab={adm.activeTab}
        onSelectTab={adm.setActiveTab}
        onOpenMore={() => adm.setIsMoreOpen(true)}
      />

      <ConfirmModal {...adm.confirmAction} onCancel={adm.closeConfirm} />

      {hasOpenAdmModal && (
        <Suspense fallback={null}>
          <AdmModals
            isAdm={adm.isAdm}
            isTraineeManager={isTraineeManager}
            actorName={actorName}
            photoToTrash={adm.photoToTrash}
            photoTrashModalRef={adm.photoTrashModalRef}
            onClosePhotoTrash={adm.closePhotoTrash}
            onConfirmTrashPhoto={adm.handleConfirmTrashPhoto}
            videoToTrashConfirm={adm.videoToTrashConfirm}
            videoTrashModalRef={adm.videoTrashModalRef}
            onCloseVideoTrash={adm.closeVideoTrash}
            onConfirmTrashVideo={adm.handleConfirmTrashVideo}
            isAddTraineeModalOpen={adm.isAddTraineeModalOpen}
            addTraineeModalRef={adm.addTraineeModalRef}
            onCloseAddTraineeModal={adm.closeAddTraineeModal}
            traineeSearchTerm={adm.traineeSearchTerm}
            onChangeTraineeSearchTerm={(term) => {
              adm.setTraineeSearchTerm(term);
              adm.setTraineeVisibleCount(3);
            }}
            traineeVisibleCount={adm.traineeVisibleCount}
            onShowMoreTrainees={() => adm.setTraineeVisibleCount((prev) => prev + 3)}
            filteredModalVisitors={adm.filteredModalVisitors}
            visibleModalVisitors={adm.visibleModalVisitors}
            selectedVisitorForTraining={adm.selectedVisitorForTraining}
            onSelectVisitorForTraining={adm.setSelectedVisitorForTraining}
            newTraineeTrainingFor={adm.newTraineeTrainingFor}
            onChangeNewTraineeTrainingFor={adm.setNewTraineeTrainingFor}
            confirmTrainingModal={adm.confirmTrainingModal}
            onOpenConfirmTraining={(visitor, targetRole) =>
              adm.setConfirmTrainingModal({ isOpen: true, visitor, targetRole })
            }
            onCancelConfirmTraining={() =>
              adm.setConfirmTrainingModal({ isOpen: false, visitor: null, targetRole: 'produtor' })
            }
            onExecuteAddTrainee={adm.handleExecuteAddTrainee}
            undoPromotionTarget={adm.undoPromotionTarget}
            undoPromotionModalRef={adm.undoPromotionModalRef}
            onCloseUndoPromotion={adm.closeUndoPromotion}
            undoReason={adm.undoReason}
            onChangeUndoReason={adm.setUndoReason}
            onExecuteUndoPromotion={adm.handleExecuteUndoPromotion}
            isMoreOpen={adm.isMoreOpen}
            admMoreModalRef={adm.admMoreModalRef}
            onCloseMore={adm.closeAdmMore}
            onOpenAccessibility={openAccessibility}
            onSelectTabFromMore={(tab) => {
              adm.setActiveTab(tab);
              adm.setIsMoreOpen(false);
            }}
            onOpenTutorial={onOpenTutorial}
            onRequestLogoutFromMore={handleRequestLogoutFromMore}
          />
        </Suspense>
      )}

      {adm.isPrintingSales && (
        <Suspense fallback={null}>
          <SalesReportModal
            isOpen={adm.isPrintingSales}
            onClose={() => adm.setIsPrintingSales(false)}
            products={adm.allProducts}
            onCustomExportCSV={adm.exportProductsToCSV}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AdmDashboard;
