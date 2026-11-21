import { Suspense, lazy, useCallback, useState } from 'react';
import { useLanguage, useProducts, useTheme } from '../../../contexts';
import type { AnnouncementItem, EventItem } from '../../../types';
import { useVisitorContact } from '../../../hooks';
import { DashboardSectionFallback } from '../shared';
import { VisitorHeader, VisitorTab } from './VisitorHeader';
import { VisitorMobileNav } from './VisitorMobileNav';
import { VisitorShowcaseTab } from './VisitorShowcaseTab';

const VisitorAgendaTab = lazy(() =>
  import('./VisitorAgendaTab').then((m) => ({ default: m.VisitorAgendaTab }))
);
const VisitorHistoryTab = lazy(() =>
  import('./VisitorHistoryTab').then((m) => ({ default: m.VisitorHistoryTab }))
);
const VisitorAnnouncementsTab = lazy(() =>
  import('./VisitorAnnouncementsTab').then((m) => ({ default: m.VisitorAnnouncementsTab }))
);
const VisitorModals = lazy(() =>
  import('./VisitorModals').then((m) => ({ default: m.VisitorModals }))
);

export interface VisitorDashboardProps {
  logout: () => void;
  eventsList?: EventItem[];
  announcementsList?: AnnouncementItem[];
  onOpenTutorial?: () => void;
}

export function VisitorDashboard({
  logout,
  eventsList,
  announcementsList,
  onOpenTutorial,
}: VisitorDashboardProps) {
  const { openAccessibility } = useTheme();
  const { language } = useLanguage();
  const { publishedProducts } = useProducts();

  const [activeTab, setActiveTab] = useState<VisitorTab>('vitrine');
  const [confirmExit, setConfirmExit] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const closeConfirmExit = useCallback(() => setConfirmExit(false), []);
  const closeMore = useCallback(() => setIsMoreOpen(false), []);

  const {
    isSellerAvailable,
    associationWhatsappUrl,
    associationEventsWhatsappUrl,
    associationSpaceWhatsappUrl,
    selectedPiece,
    closeSelectedPiece,
    sellerConfirmPiece,
    closeSellerConfirm,
    showRateLimitAlert,
    closeRateLimit,
    handleInitiateSellerContact,
    handleConfirmSellerContact,
  } = useVisitorContact(language);

  const publicPieces = publishedProducts;
  const effectiveEvents = Array.isArray(eventsList) ? eventsList : [];
  const effectiveAnnouncements = Array.isArray(announcementsList) ? announcementsList : [];
  const hasRealAnnouncements = effectiveAnnouncements.length > 0;
  const sortedAnnouncements = [...effectiveAnnouncements].reverse();

  return (
    <div className="min-h-screen bg-canvas text-stone-900 dark:text-stone-100 transition-colors duration-500 pb-20 md:pb-0">
      <VisitorHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasRealAnnouncements={hasRealAnnouncements}
        associationWhatsappUrl={associationWhatsappUrl}
        onOpenAccessibility={openAccessibility}
        onOpenTutorial={onOpenTutorial}
        onRequestExit={() => setConfirmExit(true)}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-28 md:pt-8 md:pb-12">
        {activeTab === 'vitrine' && (
          <VisitorShowcaseTab
            publicPieces={publicPieces}
            isSellerAvailable={isSellerAvailable}
            onInitiateSellerContact={handleInitiateSellerContact}
          />
        )}

        <Suspense fallback={<DashboardSectionFallback />}>
          {activeTab === 'agenda' && (
            <VisitorAgendaTab
              events={effectiveEvents}
              language={language}
              associationEventsWhatsappUrl={associationEventsWhatsappUrl}
            />
          )}

          {activeTab === 'historia' && (
            <VisitorHistoryTab
              language={language}
              associationSpaceWhatsappUrl={associationSpaceWhatsappUrl}
            />
          )}

          {activeTab === 'avisos' && hasRealAnnouncements && (
            <VisitorAnnouncementsTab announcements={sortedAnnouncements} />
          )}
        </Suspense>
      </main>

      {(selectedPiece || sellerConfirmPiece || showRateLimitAlert || confirmExit || isMoreOpen) && (
        <Suspense fallback={null}>
          <VisitorModals
            selectedPiece={selectedPiece}
            onCloseSelectedPiece={closeSelectedPiece}
            isSellerAvailable={isSellerAvailable}
            onInitiateSellerContact={handleInitiateSellerContact}
            sellerConfirmPiece={sellerConfirmPiece}
            onCloseSellerConfirm={closeSellerConfirm}
            onConfirmSellerContact={handleConfirmSellerContact}
            showRateLimitAlert={showRateLimitAlert}
            onCloseRateLimit={closeRateLimit}
            confirmExit={confirmExit}
            onCloseConfirmExit={closeConfirmExit}
            onLogout={logout}
            onLogoutRequestFromMore={() => setConfirmExit(true)}
            isMoreOpen={isMoreOpen}
            onCloseMore={closeMore}
            onOpenAccessibility={openAccessibility}
            hasRealAnnouncements={hasRealAnnouncements}
            onSelectAnnouncementsTab={() => setActiveTab('avisos')}
            onOpenTutorial={onOpenTutorial}
          />
        </Suspense>
      )}

      <VisitorMobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMore={() => setIsMoreOpen(true)}
      />
    </div>
  );
}

export default VisitorDashboard;
