import React, { Suspense, lazy } from 'react';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { useAuth, useTheme, useToast, type UserRole } from '../../../contexts';
import { useProducerDashboard } from '../../../hooks';
import type { ProductItem, UserItem } from '../../../types';
import { ConfirmModal, DashboardSectionFallback } from '../shared';
import { ProducerFirstStepsCard } from './ProducerFirstStepsCard';
import { ProducerHeader } from './ProducerHeader';
import { ProducerMobileNav } from './ProducerMobileNav';
import { ProducerOverviewAlerts } from './ProducerOverviewAlerts';
import { ProducerProductGrid } from './ProducerProductGrid';

const TraineeOnboardingTour = lazy(() =>
  import('../../guide/TraineeOnboardingTour').then((m) => ({ default: m.TraineeOnboardingTour }))
);
const ProducerContactTab = lazy(() =>
  import('./ProducerContactTab').then((m) => ({ default: m.ProducerContactTab }))
);
const ProducerCatalogView = lazy(() =>
  import('./ProducerCatalogView').then((m) => ({ default: m.ProducerCatalogView }))
);
const ProducerModals = lazy(() =>
  import('./ProducerModals').then((m) => ({ default: m.ProducerModals }))
);

export interface StandardDashboardProps {
  role: UserRole;
  logout: () => void;
  usersList: UserItem[];
  setUsersList: React.Dispatch<React.SetStateAction<UserItem[]>>;
  onSwitchToManager?: () => void;
  onOpenTutorial?: () => void;
  onOpenHelpModal?: () => void;
}

export const StandardDashboard: React.FC<StandardDashboardProps> = ({
  role,
  logout,
  usersList,
  setUsersList,
  onOpenTutorial,
  onOpenHelpModal,
}) => {
  const { openAccessibility } = useTheme();
  const { addToast } = useToast();
  const { getIdToken, userProfile } = useAuth();

  void usersList;

  const {
    isTraining,
    allProducts,
    activeTab,
    setActiveTab,
    productFilter,
    setProductFilter,
    isMoreOpen,
    setIsMoreOpen,
    showTrainingCompleteModal,
    isTourOpen,
    setIsTourOpen,
    checklistStep1,
    checklistStep2,
    checklistStep3,
    completedSteps,
    isAllStepsCompleted,
    isFirstStepsOpen,
    setIsFirstStepsOpen,
    handleCompleteTrainingChecklist,
    myProducts,
    adjustmentProducts,
    inReviewProducts,
    attentionProducts,
    outOfStockProducts,
    availableProducts,
    filteredMyProducts,
    confirmAction,
    requestConfirm,
    closeConfirm,
    scrollToSection,
    handlePrint,
    deleteContactModalRef,
    stdMoreModalRef,
    trainingCompleteModalRef,
    closeDeleteContactModal,
    closeStdMore,
    closeTrainingCompleteModal,
    sellerWhatsapp,
    setSellerWhatsapp,
    sellerAuthorized,
    setSellerAuthorized,
    sellerReceiveNow,
    showDeleteContactConfirm,
    setShowDeleteContactConfirm,
    handleSaveContactSettings,
    handleToggleReceiveNow,
    handleDeleteContactInfo,
    editingProductId,
    setEditingProductId,
    editFormData,
    setEditFormData,
    startEditingProduct,
    handleSaveProductEdit,
    isAddingProduct,
    setIsAddingProduct,
    isSubmittingProduct,
    registrationStep,
    setRegistrationStep,
    newProductImage,
    isProcessingImage,
    handleSelectProductImage,
    handleRemoveProductImage,
    newProductTitle,
    setNewProductTitle,
    newProductTechnique,
    setNewProductTechnique,
    newProductDescription,
    setNewProductDescription,
    newProductStock,
    setNewProductStock,
    newProductPrice,
    setNewProductPrice,
    trainingCount,
    isTrainingLimitReached,
    handleAddProduct,
    handleUpdateStock,
    handleDeleteProduct,
  } = useProducerDashboard({
    role,
    userProfile,
    setUsersList,
    getIdToken,
    addToast,
  });

  const handleRequestLogout = () =>
    requestConfirm(
      'Deseja sair?',
      'Quer mesmo sair agora? A gente espera você voltar em breve!',
      logout,
      'Sim, sair',
      'Continuar aqui'
    );

  const handleRequestLogoutFromMore = () => {
    setIsMoreOpen(false);
    requestConfirm(
      'Deseja sair?',
      isTraining
        ? 'Quer mesmo sair agora do ambiente de treino?'
        : 'Quer mesmo sair agora da sua conta de produtor? A gente espera você voltar em breve!',
      logout,
      'Sim, sair',
      'Continuar aqui'
    );
  };

  const handleRequestDeleteProduct = (product: ProductItem) =>
    requestConfirm(
      'Excluir peça',
      'Tem certeza? Esta ação não pode ser desfeita.',
      () => {
        handleDeleteProduct(product.id);
        closeConfirm();
      },
      'Sim, excluir',
      'Não, voltar'
    );

  return (
    <div className="min-h-screen bg-canvas dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-500">
      <ConfirmModal {...confirmAction} onCancel={closeConfirm} />

      <ProducerHeader
        isTraining={isTraining}
        userName={userProfile?.display_name}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenAccessibility={openAccessibility}
        onOpenHelpModal={onOpenHelpModal}
        onOpenTutorial={onOpenTutorial}
        onRequestExit={handleRequestLogout}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-36 md:py-12">
        {activeTab !== 'overview' && (
          <button
            onClick={() => setActiveTab('overview')}
            title="Voltar para Meus Produtos"
            className="min-h-[56px] flex items-center gap-2 mb-6 px-6 py-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-[18px] text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 font-extrabold transition-colors no-print cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" /> Voltar para Meus Produtos
          </button>
        )}

        {activeTab === 'overview' && (role === 'produtor' || role === 'colaborador' || role === 'aprendiz') && (
          <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 motion-reduce:animate-none">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                  {isTraining ? 'Espaço de Treino' : 'Painel do Produtor'}
                </h1>
                <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1">
                  {isTraining
                    ? 'Pratique o cadastro de peças com segurança. Nada vai para o site público.'
                    : 'Acompanhe os avisos importantes e cuide das suas peças de forma simples.'}
                </p>
              </div>

              {!isTraining && sellerWhatsapp && sellerWhatsapp.trim() && sellerAuthorized && sellerReceiveNow && (
                <button
                  type="button"
                  onClick={() => setActiveTab('contact')}
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-black text-sm inline-flex items-center gap-2 cursor-pointer transition-colors self-start md:self-auto shrink-0"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>WhatsApp ativo · Gerenciar</span>
                </button>
              )}
            </div>

            <ProducerOverviewAlerts
              isTraining={isTraining}
              sellerWhatsapp={sellerWhatsapp}
              sellerAuthorized={sellerAuthorized}
              sellerReceiveNow={sellerReceiveNow}
              myProducts={myProducts}
              availableProducts={availableProducts}
              adjustmentProducts={adjustmentProducts}
              inReviewProducts={inReviewProducts}
              attentionProducts={attentionProducts}
              outOfStockProducts={outOfStockProducts}
              trainingCount={trainingCount}
              isTrainingLimitReached={isTrainingLimitReached}
              completedSteps={completedSteps}
              isAllStepsCompleted={isAllStepsCompleted}
              checklistStep2={checklistStep2}
              onSetProductFilter={setProductFilter}
              onStartEditingProduct={startEditingProduct}
              onScrollToSection={scrollToSection}
              onOpenContactTab={() => setActiveTab('contact')}
              onOpenFirstSteps={() => {
                setIsFirstStepsOpen(true);
                scrollToSection('primeiros-passos');
              }}
            />

            {isTraining && (
              <ProducerFirstStepsCard
                isOpen={isFirstStepsOpen}
                onToggleOpen={() => setIsFirstStepsOpen((prev) => !prev)}
                checklistStep1={checklistStep1}
                checklistStep2={checklistStep2}
                checklistStep3={checklistStep3}
                completedSteps={completedSteps}
                isAllStepsCompleted={isAllStepsCompleted}
                onCompleteTrainingChecklist={handleCompleteTrainingChecklist}
              />
            )}

            <ProducerProductGrid
              isTraining={isTraining}
              isTrainingLimitReached={isTrainingLimitReached}
              isAddingProduct={isAddingProduct}
              isSubmittingProduct={isSubmittingProduct}
              onToggleAddProduct={() => setIsAddingProduct((prev) => !prev)}
              onOpenAddProduct={() => setIsAddingProduct(true)}
              onPrint={handlePrint}
              productFilter={productFilter}
              setProductFilter={setProductFilter}
              myProducts={myProducts}
              availableProducts={availableProducts}
              attentionProducts={attentionProducts}
              adjustmentProducts={adjustmentProducts}
              outOfStockProducts={outOfStockProducts}
              filteredMyProducts={filteredMyProducts}
              registrationStep={registrationStep}
              setRegistrationStep={setRegistrationStep}
              newProductImage={newProductImage}
              isProcessingImage={isProcessingImage}
              onSelectProductImage={handleSelectProductImage}
              onRemoveProductImage={handleRemoveProductImage}
              newProductTitle={newProductTitle}
              setNewProductTitle={setNewProductTitle}
              newProductTechnique={newProductTechnique}
              setNewProductTechnique={setNewProductTechnique}
              newProductDescription={newProductDescription}
              setNewProductDescription={setNewProductDescription}
              newProductStock={newProductStock}
              setNewProductStock={setNewProductStock}
              newProductPrice={newProductPrice}
              setNewProductPrice={setNewProductPrice}
              onAddProduct={handleAddProduct}
              editingProductId={editingProductId}
              setEditingProductId={setEditingProductId}
              editFormData={editFormData}
              setEditFormData={setEditFormData}
              onStartEditingProduct={startEditingProduct}
              onSaveProductEdit={handleSaveProductEdit}
              onUpdateStock={handleUpdateStock}
              onRequestDeleteProduct={handleRequestDeleteProduct}
            />
          </div>
        )}

        {!isTraining && activeTab === 'contact' && (
          <Suspense fallback={<DashboardSectionFallback />}>
            <ProducerContactTab
              sellerWhatsapp={sellerWhatsapp}
              setSellerWhatsapp={setSellerWhatsapp}
              sellerAuthorized={sellerAuthorized}
              setSellerAuthorized={setSellerAuthorized}
              sellerReceiveNow={sellerReceiveNow}
              onSaveContactSettings={handleSaveContactSettings}
              onToggleReceiveNow={handleToggleReceiveNow}
              onOpenDeleteConfirm={() => setShowDeleteContactConfirm(true)}
              onOpenHelpModal={onOpenHelpModal}
            />
          </Suspense>
        )}

        {activeTab === 'catalog' && (
          <Suspense fallback={<DashboardSectionFallback />}>
            <ProducerCatalogView allProducts={allProducts} />
          </Suspense>
        )}
      </main>

      <ProducerMobileNav
        isTraining={isTraining}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenHelpModal={onOpenHelpModal}
        onOpenMore={() => setIsMoreOpen(true)}
      />

      {(showDeleteContactConfirm || isMoreOpen || (isTraining && showTrainingCompleteModal)) && (
        <Suspense fallback={null}>
          <ProducerModals
            isTraining={isTraining}
            showDeleteContactConfirm={showDeleteContactConfirm}
            deleteContactModalRef={deleteContactModalRef}
            onCloseDeleteContact={closeDeleteContactModal}
            onConfirmDeleteContact={handleDeleteContactInfo}
            isMoreOpen={isMoreOpen}
            stdMoreModalRef={stdMoreModalRef}
            onCloseMore={closeStdMore}
            onOpenAccessibility={openAccessibility}
            onOpenTour={() => setIsTourOpen(true)}
            onSelectTab={setActiveTab}
            onOpenTutorial={onOpenTutorial}
            onRequestLogoutFromMore={handleRequestLogoutFromMore}
            showTrainingCompleteModal={showTrainingCompleteModal}
            trainingCompleteModalRef={trainingCompleteModalRef}
            onCloseTrainingCompleteModal={closeTrainingCompleteModal}
            onLogout={logout}
          />
        </Suspense>
      )}

      {isTraining && isTourOpen && (
        <Suspense fallback={null}>
          <TraineeOnboardingTour
            isOpen={isTourOpen}
            onClose={() => setIsTourOpen(false)}
            role="aprendiz"
            onActivateTab={(tab) => setActiveTab(tab as 'overview' | 'contact' | 'catalog')}
          />
        </Suspense>
      )}
    </div>
  );
};

export default StandardDashboard;
