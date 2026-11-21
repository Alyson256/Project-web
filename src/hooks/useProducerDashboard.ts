import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useProducts, type UserProfile, type UserRole } from '../contexts';
import { useFocusTrap } from './useFocusTrap';
import { isProductOwnedByProfile, useProductSellerActions } from './useProductSellerActions';
import type { UserItem } from '../types';

export type ProducerTab = 'overview' | 'contact' | 'catalog';
export type ProducerProductFilter = 'todas' | 'disponiveis' | 'atencao' | 'esgotadas';

export interface ProducerConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface UseProducerDashboardOptions {
  role: UserRole;
  userProfile: UserProfile | null;
  setUsersList: React.Dispatch<React.SetStateAction<UserItem[]>>;
  getIdToken: () => Promise<string | null>;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function useProducerDashboard({
  role,
  userProfile,
  setUsersList,
  getIdToken,
  addToast,
}: UseProducerDashboardOptions) {
  const isTraining = role === 'aprendiz';
  const { allProducts } = useProducts();

  const [activeTab, setActiveTab] = useState<ProducerTab>('overview');
  const [productFilter, setProductFilter] = useState<ProducerProductFilter>('todas');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showTrainingCompleteModal, setShowTrainingCompleteModal] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(() => {
    if (role !== 'aprendiz') return false;
    try {
      return localStorage.getItem('potengi_trainee_tour_done_aprendiz') !== 'true';
    } catch {
      return true;
    }
  });

  const [checklistStep1] = useState(true);
  const [checklistStep3, setChecklistStep3] = useState(false);

  const sellerActions = useProductSellerActions({
    isTraining,
    userProfile,
    setUsersList,
    getIdToken,
    addToast,
    checklistStep3,
  });

  const { showDeleteContactConfirm, setShowDeleteContactConfirm, trainingCount } = sellerActions;

  const deleteContactModalRef = useRef<HTMLDivElement>(null);
  const stdMoreModalRef = useRef<HTMLDivElement>(null);
  const trainingCompleteModalRef = useRef<HTMLDivElement>(null);

  const closeDeleteContactModal = useCallback(
    () => setShowDeleteContactConfirm(false),
    [setShowDeleteContactConfirm]
  );
  const closeStdMore = useCallback(() => setIsMoreOpen(false), []);
  const closeTrainingCompleteModal = useCallback(() => setShowTrainingCompleteModal(false), []);

  useFocusTrap(showDeleteContactConfirm, deleteContactModalRef, closeDeleteContactModal);
  useFocusTrap(isMoreOpen, stdMoreModalRef, closeStdMore);
  useFocusTrap(showTrainingCompleteModal, trainingCompleteModalRef, closeTrainingCompleteModal);

  useEffect(() => {
    if (isTraining && activeTab === 'contact') {
      setActiveTab('overview');
    }
  }, [isTraining, activeTab]);

  const myProducts = useMemo(
    () =>
      allProducts.filter(
        (p) => Boolean(p.isTraining) === isTraining && isProductOwnedByProfile(p, userProfile)
      ),
    [allProducts, isTraining, userProfile]
  );

  const adjustmentProducts = useMemo(
    () => myProducts.filter((p) => p.status === 'ajuste_solicitado'),
    [myProducts]
  );
  const inReviewProducts = useMemo(
    () => myProducts.filter((p) => p.status === 'em_revisao'),
    [myProducts]
  );
  const attentionProducts = useMemo(
    () => myProducts.filter((p) => p.status === 'ajuste_solicitado' || p.status === 'em_revisao'),
    [myProducts]
  );
  const outOfStockProducts = useMemo(
    () => myProducts.filter((p) => !p.isAvailable || p.stock <= 0),
    [myProducts]
  );
  const availableProducts = useMemo(
    () =>
      myProducts.filter((p) =>
        isTraining
          ? p.isAvailable && p.stock > 0
          : p.status === 'publicado' && p.isAvailable && p.stock > 0
      ),
    [myProducts, isTraining]
  );

  const filteredMyProducts = useMemo(
    () =>
      myProducts.filter((p) => {
        if (productFilter === 'disponiveis') {
          return isTraining
            ? p.isAvailable && p.stock > 0
            : p.status === 'publicado' && p.isAvailable && p.stock > 0;
        }
        if (productFilter === 'atencao') {
          return p.status === 'ajuste_solicitado' || p.status === 'em_revisao';
        }
        if (productFilter === 'esgotadas') {
          return !p.isAvailable || p.stock <= 0;
        }
        return true;
      }),
    [myProducts, productFilter, isTraining]
  );

  const checklistStep2 = trainingCount > 0;
  const completedSteps = (checklistStep1 ? 1 : 0) + (checklistStep2 ? 1 : 0) + (checklistStep3 ? 1 : 0);
  const isAllStepsCompleted = completedSteps === 3;
  const prevAllStepsCompletedRef = useRef(isAllStepsCompleted);

  useEffect(() => {
    if (isTraining && isAllStepsCompleted && !prevAllStepsCompletedRef.current) {
      setShowTrainingCompleteModal(true);
    }
    prevAllStepsCompletedRef.current = isAllStepsCompleted;
  }, [isTraining, isAllStepsCompleted]);

  const [isFirstStepsOpen, setIsFirstStepsOpen] = useState(!isAllStepsCompleted);

  const [confirmAction, setConfirmAction] = useState<ProducerConfirmState>({
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

  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleCompleteTrainingChecklist = useCallback(() => {
    setChecklistStep3(true);
    addToast('Etapa final de treino marcada com sucesso!', 'success');
    setUsersList((prev) =>
      prev.map((u) => {
        const isSameUser =
          (userProfile?.email && u.email?.toLowerCase() === userProfile.email.toLowerCase()) ||
          (userProfile?.display_name && u.name === userProfile.display_name) ||
          (userProfile?.uid?.startsWith('dev_') && u.name === 'Dona Laura');
        return isSameUser ? { ...u, stepText: checklistStep2 ? '3 de 3 etapas' : '2 de 3 etapas' } : u;
      })
    );
    setIsFirstStepsOpen(false);
  }, [addToast, checklistStep2, setUsersList, userProfile]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
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
    ...sellerActions,
  };
}
