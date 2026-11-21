import React, { useEffect, useState } from 'react';
import { useProducts, type UserProfile } from '../contexts';
import { useSellerSettings } from '../lib';
import { cooperativeApi, isDjangoBackendEnabled } from '../services';
import type { ProductItem, UserItem } from '../types';

interface UseProductSellerActionsOptions {
  isTraining: boolean;
  userProfile: UserProfile | null;
  setUsersList: React.Dispatch<React.SetStateAction<UserItem[]>>;
  getIdToken: () => Promise<string | null>;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  checklistStep3: boolean;
}

const MAX_IMAGE_DIMENSION = 960;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo de imagem.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo selecionado não é uma imagem válida.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof reader.result === 'string' ? reader.result : '');
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
  });
}

export function isProductOwnedByProfile(product: ProductItem, profile: UserProfile | null): boolean {
  if (!profile) return false;
  if (product.ownerUid && profile.uid) {
    return product.ownerUid === profile.uid;
  }
  if (product.ownerEmail && profile.email) {
    return product.ownerEmail.toLowerCase() === profile.email.toLowerCase();
  }
  const normalizedArtist = (product.artist || '').trim().toLowerCase();
  const normalizedDisplayName = (profile.display_name || '').trim().toLowerCase();
  if (!normalizedArtist) return false;
  if (normalizedDisplayName && normalizedArtist === normalizedDisplayName) {
    return true;
  }
  if (profile.role === 'aprendiz' && profile.uid.startsWith('dev_') && normalizedArtist === 'dona laura') {
    return true;
  }
  return false;
}

export function useProductSellerActions({
  isTraining,
  userProfile,
  setUsersList,
  getIdToken,
  addToast,
  checklistStep3,
}: UseProductSellerActionsOptions) {
  const {
    allProducts,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createTrainingProduct,
    updateTrainingProduct,
    deleteTrainingProduct,
  } = useProducts();
  const { settings: sellerSettings, updateSettings: updateSellerSettings } = useSellerSettings();
  const [sellerWhatsapp, setSellerWhatsapp] = useState(sellerSettings.whatsapp);
  const [sellerAuthorized, setSellerAuthorized] = useState(sellerSettings.authorized);
  const [sellerReceiveNow, setSellerReceiveNow] = useState(sellerSettings.receiveContactsNow);
  const [showDeleteContactConfirm, setShowDeleteContactConfirm] = useState(false);

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{ title: string; technique: string; price: string }>({
    title: '',
    technique: '',
    price: '',
  });

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<1 | 2 | 3 | 4>(1);
  const [newProductImage, setNewProductImage] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newProductTechnique, setNewProductTechnique] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductStock, setNewProductStock] = useState('1');
  const [newProductPrice, setNewProductPrice] = useState('65');

  useEffect(() => {
    setSellerWhatsapp(sellerSettings.whatsapp);
    setSellerAuthorized(sellerSettings.authorized);
    setSellerReceiveNow(sellerSettings.receiveContactsNow);
  }, [sellerSettings.whatsapp, sellerSettings.authorized, sellerSettings.receiveContactsNow]);

  useEffect(() => {
    if (isTraining || !isDjangoBackendEnabled()) return;
    let active = true;
    getIdToken()
      .then((token) => (token ? cooperativeApi.getMyContactSettings(token) : null))
      .then((res) => {
        if (!active || !res?.settings) return;
        updateSellerSettings(res.settings);
        setSellerWhatsapp(res.settings.whatsapp || '');
        setSellerAuthorized(Boolean(res.settings.authorized));
        setSellerReceiveNow(Boolean(res.settings.receiveContactsNow));
      })
      .catch(() => {
        // Ignora caso ainda não esteja configurado no servidor
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTraining, userProfile?.uid]);

  const handleSelectProductImage = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Escolha um arquivo de foto válido (JPG, PNG ou WebP).', 'error');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      addToast('A imagem escolhida é muito grande. Escolha uma foto de até 10 MB.', 'error');
      return;
    }
    setIsProcessingImage(true);
    try {
      const compressedDataUrl = await compressImageToDataUrl(file);
      setNewProductImage(compressedDataUrl);
      addToast('Foto da peça carregada com sucesso!', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao processar a foto selecionada.';
      addToast(message, 'error');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemoveProductImage = () => {
    setNewProductImage('');
  };

  const persistContactToServer = async (nextSettings: {
    whatsapp: string;
    authorized: boolean;
    receiveContactsNow: boolean;
  }) => {
    if (isTraining || !isDjangoBackendEnabled()) {
      updateSellerSettings(nextSettings);
      return true;
    }
    try {
      const token = await getIdToken().catch(() => null);
      if (!token) return false;
      const res = await cooperativeApi.updateMyContactSettings(nextSettings, token);
      if (res?.settings) {
        updateSellerSettings(res.settings);
      }
      void refreshProducts();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar contato no servidor.';
      addToast(message, 'error');
      return false;
    }
  };

  const handleSaveContactSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sellerAuthorized) {
      addToast('Marque a autorização para continuar.', 'error');
      return;
    }
    const nextSettings = {
      whatsapp: sellerWhatsapp,
      authorized: sellerAuthorized,
      receiveContactsNow: sellerReceiveNow,
    };
    updateSellerSettings(nextSettings);
    const saved = await persistContactToServer(nextSettings);
    if (saved) {
      addToast('Configurações de contato salvas com sucesso!', 'success');
    }
  };

  const handleToggleReceiveNow = async () => {
    const nextVal = !sellerReceiveNow;
    const nextSettings = {
      whatsapp: sellerWhatsapp,
      authorized: sellerAuthorized,
      receiveContactsNow: nextVal,
    };
    setSellerReceiveNow(nextVal);
    updateSellerSettings(nextSettings);
    await persistContactToServer(nextSettings);
    addToast(
      nextVal
        ? 'Você voltou a receber contatos no WhatsApp!'
        : 'Contatos pausados. Seus produtos mostrarão "Vendedor indisponível".',
      'info'
    );
  };

  const handleDeleteContactInfo = async () => {
    const nextSettings = {
      whatsapp: '',
      authorized: false,
      receiveContactsNow: false,
    };
    setSellerWhatsapp('');
    setSellerAuthorized(false);
    setSellerReceiveNow(false);
    updateSellerSettings(nextSettings);
    await persistContactToServer(nextSettings);
    setShowDeleteContactConfirm(false);
    addToast('Seu número foi apagado e o recebimento de contatos foi encerrado.', 'success');
  };

  const startEditingProduct = (product: ProductItem) => {
    if (product.status === 'em_revisao') {
      addToast('Esta peça está em revisão pela gestão e não pode ser editada no momento.', 'info');
      return;
    }
    setEditingProductId(product.id);
    setEditFormData({
      title: product.title || '',
      technique: product.technique || '',
      price: String(product.price ?? 0),
    });
  };

  const handleSaveProductEdit = async (e: React.FormEvent, product: ProductItem) => {
    e.preventDefault();
    if (product.status === 'em_revisao') {
      addToast('Edição bloqueada enquanto a peça está em revisão pela gestão.', 'error');
      setEditingProductId(null);
      return;
    }
    const cleanTitle = editFormData.title.trim();
    const cleanTechnique = editFormData.technique.trim();
    const parsedPrice = parseFloat(editFormData.price);
    const validPrice = Number.isNaN(parsedPrice) ? 0 : Math.max(0, parsedPrice);

    if (!cleanTitle || !cleanTechnique) {
      addToast('Preencha título e técnica antes de salvar.', 'error');
      return;
    }

    const wasAdjustmentRequested = product.status === 'ajuste_solicitado';

    if (isTraining) {
      updateTrainingProduct(product.id, (current) => ({
        ...current,
        title: cleanTitle,
        technique: cleanTechnique,
        price: validPrice,
        updatedAt: new Date().toISOString(),
        ...(wasAdjustmentRequested ? { status: 'em_revisao' as const, adjustmentFeedback: undefined } : {}),
      }));
    } else {
      try {
        await updateProduct(product.id, {
          title: cleanTitle,
          technique: cleanTechnique,
          price: validPrice,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível salvar as alterações no servidor.';
        addToast(message, 'error');
        return;
      }
    }

    setEditingProductId(null);
    addToast(
      wasAdjustmentRequested
        ? 'Alterações salvas! Peça reenviada para revisão da gestão.'
        : 'Alterações da peça salvas com sucesso!',
      'success'
    );
  };

  const trainingCount = allProducts.filter(
    (p) => Boolean(p.isTraining) && isProductOwnedByProfile(p, userProfile)
  ).length;
  const isTrainingLimitReached = isTraining && trainingCount >= 5;

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTrainingLimitReached || isSubmittingProduct) return;

    const cleanTitle = newProductTitle.trim();
    const cleanTechnique = newProductTechnique.trim();
    if (!cleanTitle || !cleanTechnique) {
      setRegistrationStep(2);
      addToast('Informe o nome e a técnica da peça antes de enviar.', 'error');
      return;
    }

    const parsedStock = parseInt(newProductStock, 10);
    const validStock = Number.isNaN(parsedStock) ? 0 : Math.max(0, parsedStock);
    const parsedPrice = parseFloat(newProductPrice);
    const validPrice = Number.isNaN(parsedPrice) ? 0 : Math.max(0, parsedPrice);
    const nowIso = new Date().toISOString();

    const artistName =
      userProfile?.display_name?.trim() ||
      userProfile?.first_name?.trim() ||
      (isTraining ? 'Aprendiz' : 'Artesão');

    if (isTraining) {
      createTrainingProduct({
        id: Date.now(),
        title: cleanTitle,
        technique: cleanTechnique,
        description: newProductDescription.trim(),
        image: newProductImage,
        isAvailable: validStock > 0,
        stock: validStock,
        price: validPrice,
        artist: artistName,
        artistPhoto: userProfile?.picture || undefined,
        ownerUid: userProfile?.uid || undefined,
        ownerEmail: userProfile?.email || undefined,
        status: 'rascunho',
        isTraining: true,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    } else {
      setIsSubmittingProduct(true);
      try {
        await createProduct({
          title: cleanTitle,
          technique: cleanTechnique,
          description: newProductDescription.trim(),
          image: newProductImage,
          stock: validStock,
          price: validPrice,
          isAvailable: validStock > 0,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível enviar a peça ao servidor.';
        addToast(message, 'error');
        return;
      } finally {
        setIsSubmittingProduct(false);
      }
    }

    setNewProductImage('');
    setNewProductTitle('');
    setNewProductTechnique('');
    setNewProductDescription('');
    setNewProductStock('1');
    setNewProductPrice('65');
    setRegistrationStep(1);

    if (isTraining) {
      addToast('Peça de treino salva! A gestão já pode ver seu progresso.', 'success');
      setUsersList((prev) =>
        prev.map((u) => {
          const isSameUser =
            (userProfile?.email && u.email?.toLowerCase() === userProfile.email.toLowerCase()) ||
            u.name === artistName ||
            (userProfile?.uid?.startsWith('dev_') && u.name === 'Dona Laura');
          return isSameUser
            ? { ...u, stepText: checklistStep3 ? '3 de 3 etapas' : '2 de 3 etapas' }
            : u;
        })
      );
    } else {
      addToast(
        'Peça enviada para análise da gestão! Assim que for aprovada, aparecerá na vitrine Rosa Mística.',
        'success'
      );
    }
    setIsAddingProduct(false);
  };

  const toggleProductStatus = async (id: number) => {
    const product = allProducts.find((p) => p.id === id);
    if (!product) return;
    if (product.status === 'em_revisao') {
      addToast('Peça em revisão pela gestão: alteração bloqueada temporariamente.', 'info');
      return;
    }

    const nextAvailable = !product.isAvailable;

    if (isTraining) {
      updateTrainingProduct(id, (current) => ({
        ...current,
        isAvailable: nextAvailable,
        updatedAt: new Date().toISOString(),
      }));
      addToast(`Status do produto alterado para ${nextAvailable ? 'Disponível' : 'Vendido'}.`, 'info');
      return;
    }

    try {
      const updatedProduct = await updateProduct(id, { isAvailable: nextAvailable });
      addToast(`Status do produto alterado para ${updatedProduct.isAvailable ? 'Disponível' : 'Vendido'}.`, 'info');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar disponibilidade no servidor.';
      addToast(message, 'error');
    }
  };

  const handleUpdateStock = async (id: number, delta: number) => {
    const p = allProducts.find((item) => item.id === id);
    if (!p) return;
    if (p.status === 'em_revisao') {
      addToast('Peça em revisão pela gestão: estoque bloqueado até aprovação.', 'info');
      return;
    }
    const newStock = Math.max(0, p.stock + delta);
    const isNowAvailable = newStock > 0;

    if (isTraining) {
      updateTrainingProduct(id, (current) => ({
        ...current,
        stock: newStock,
        isAvailable: isNowAvailable,
        updatedAt: new Date().toISOString(),
      }));
      if (p.isAvailable && !isNowAvailable) {
        addToast(`"${p.title}" marcado como Esgotado automaticamente.`, 'info');
      } else if (!p.isAvailable && isNowAvailable) {
        addToast(`"${p.title}" marcado como Disponível.`, 'success');
      }
      return;
    }

    try {
      const updatedProduct = await updateProduct(id, { stock: newStock, isAvailable: isNowAvailable });
      if (p.isAvailable && !updatedProduct.isAvailable) {
        addToast(`"${p.title}" marcado como Esgotado automaticamente.`, 'info');
      } else if (!p.isAvailable && updatedProduct.isAvailable) {
        addToast(`"${p.title}" marcado como Disponível.`, 'success');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar estoque no servidor.';
      addToast(message, 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const product = allProducts.find((p) => p.id === id);
    if (!product) return;
    if (product.status === 'em_revisao') {
      addToast('Peça em revisão pela gestão não pode ser excluída no momento.', 'error');
      return;
    }

    if (isTraining) {
      deleteTrainingProduct(id);
      addToast('Produto removido.', 'success');
      return;
    }

    try {
      await deleteProduct(id);
      addToast('Produto removido.', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover peça do servidor.';
      addToast(message, 'error');
    }
  };

  return {
    sellerWhatsapp,
    setSellerWhatsapp,
    sellerAuthorized,
    setSellerAuthorized,
    sellerReceiveNow,
    setSellerReceiveNow,
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
    toggleProductStatus,
    handleUpdateStock,
    handleDeleteProduct,
  };
}
