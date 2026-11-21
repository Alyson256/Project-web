import { Suspense, lazy, useCallback, useState } from 'react';
import { useTheme } from '../../../contexts';
import { useTraineeGestorSimulation } from '../../../hooks';
import { DashboardSectionFallback } from '../shared';
import { TraineeGestorHeader } from './TraineeGestorHeader';
import { TraineeGestorMobileNav } from './TraineeGestorMobileNav';
import { TraineeGestorOverviewTab, TraineeGestorTab } from './TraineeGestorOverviewTab';

const TraineeOnboardingTour = lazy(() =>
  import('../../guide/TraineeOnboardingTour').then((m) => ({ default: m.TraineeOnboardingTour }))
);
const TraineeGestorTextsTab = lazy(() =>
  import('./TraineeGestorTextsTab').then((m) => ({ default: m.TraineeGestorTextsTab }))
);
const TraineeGestorMediaTab = lazy(() =>
  import('./TraineeGestorMediaTab').then((m) => ({ default: m.TraineeGestorMediaTab }))
);
const TraineeGestorApproveTab = lazy(() =>
  import('./TraineeGestorApproveTab').then((m) => ({ default: m.TraineeGestorApproveTab }))
);
const TraineeGestorModals = lazy(() =>
  import('./TraineeGestorModals').then((m) => ({ default: m.TraineeGestorModals }))
);

export interface TraineeGestorDashboardProps {
  userName?: string;
  logout: () => void;
  onTaskCompleted?: (taskTitle: string) => void;
}

export function TraineeGestorDashboard({
  userName = 'Mariana',
  logout,
  onTaskCompleted,
}: TraineeGestorDashboardProps) {
  const { openAccessibility } = useTheme();

  const [activeTab, setActiveTab] = useState<TraineeGestorTab>('inicio');
  const [confirmExit, setConfirmExit] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(() => {
    try {
      return localStorage.getItem('potengi_trainee_tour_done_aprendiz_gestor') !== 'true';
    } catch {
      return true;
    }
  });

  const closeMore = useCallback(() => setIsMoreOpen(false), []);
  const closeConfirmExit = useCallback(() => setConfirmExit(false), []);

  const {
    tasks,
    completedCount,
    isAllDone,
    showCompletionModal,
    closeCompletionModal,
    sampleText,
    setSampleText,
    sampleVideoUrl,
    setSampleVideoUrl,
    samplePhotoTitle,
    setSamplePhotoTitle,
    samplePieceApproved,
    handleSaveTextSimulation,
    handleSavePhotoSimulation,
    handleSaveVideoSimulation,
    handleApprovePieceSimulation,
  } = useTraineeGestorSimulation({ onTaskCompleted });

  return (
    <div className="min-h-screen bg-canvas dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      <TraineeGestorHeader
        userName={userName}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenAccessibility={openAccessibility}
        onRequestExit={() => setConfirmExit(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8 pb-36 md:pb-8">
        {activeTab === 'inicio' && (
          <TraineeGestorOverviewTab
            tasks={tasks}
            completedCount={completedCount}
            isAllDone={isAllDone}
            onSelectTab={setActiveTab}
            onLogout={logout}
          />
        )}

        <Suspense fallback={<DashboardSectionFallback />}>
          {activeTab === 'textos' && (
            <TraineeGestorTextsTab
              sampleText={sampleText}
              onChangeSampleText={setSampleText}
              onSubmit={handleSaveTextSimulation}
            />
          )}

          {activeTab === 'midia' && (
            <TraineeGestorMediaTab
              samplePhotoTitle={samplePhotoTitle}
              onChangeSamplePhotoTitle={setSamplePhotoTitle}
              onSubmitPhoto={handleSavePhotoSimulation}
              sampleVideoUrl={sampleVideoUrl}
              onChangeSampleVideoUrl={setSampleVideoUrl}
              onSubmitVideo={handleSaveVideoSimulation}
            />
          )}

          {activeTab === 'aprovar' && (
            <TraineeGestorApproveTab
              samplePieceApproved={samplePieceApproved}
              onApprovePiece={handleApprovePieceSimulation}
            />
          )}
        </Suspense>
      </main>

      <TraineeGestorMobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMore={() => setIsMoreOpen(true)}
      />

      {(isMoreOpen || confirmExit || showCompletionModal) && (
        <Suspense fallback={null}>
          <TraineeGestorModals
            userName={userName}
            isMoreOpen={isMoreOpen}
            onCloseMore={closeMore}
            onOpenAccessibility={openAccessibility}
            onOpenTour={() => setIsTourOpen(true)}
            onSelectApproveTab={() => setActiveTab('aprovar')}
            onRequestExitFromMore={() => setConfirmExit(true)}
            confirmExit={confirmExit}
            onCloseConfirmExit={closeConfirmExit}
            onLogout={logout}
            showCompletionModal={showCompletionModal}
            onCloseCompletionModal={closeCompletionModal}
          />
        </Suspense>
      )}

      {isTourOpen && (
        <Suspense fallback={null}>
          <TraineeOnboardingTour
            isOpen={isTourOpen}
            onClose={() => setIsTourOpen(false)}
            role="aprendiz_gestor"
            onActivateTab={(tab) => setActiveTab(tab as TraineeGestorTab)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default TraineeGestorDashboard;
