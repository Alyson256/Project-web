import { useCallback, useState } from 'react';
import { useToast } from '../contexts';
import type { ProductItem } from '../types';
import {
  ASSOCIATION_WHATSAPP_NUMBER,
  buildWhatsAppUrl,
  canContactSeller,
  openExternalUrl,
  recordSellerContact,
  useSellerSettings,
} from '../lib';

export function useVisitorContact(language: string) {
  const { addToast } = useToast();
  const { settings: sellerSettings } = useSellerSettings();
  const [selectedPiece, setSelectedPiece] = useState<ProductItem | null>(null);
  const [sellerConfirmPiece, setSellerConfirmPiece] = useState<ProductItem | null>(null);
  const [showRateLimitAlert, setShowRateLimitAlert] = useState(false);

  const isSellerAvailable = sellerSettings.receiveContactsNow && sellerSettings.authorized;

  const associationGeneralMessageText =
    language === 'pt'
      ? 'Olá! Gostaria de tirar dúvidas sobre o espaço da Associação Julieta Barros ou sobre próximos eventos.'
      : 'Hello! I would like to ask questions about the Julieta Barros Association space or upcoming events.';
  const associationEventsMessageText =
    language === 'pt'
      ? 'Olá! Gostaria de tirar dúvidas sobre eventos, oficinas ou programação da Associação Julieta Barros.'
      : 'Hello! I would like to ask questions about events, workshops, or the schedule at the Julieta Barros Association.';
  const associationSpaceMessageText =
    language === 'pt'
      ? 'Olá! Gostaria de tirar dúvidas sobre o espaço físico ou horários de visitação da Associação Julieta Barros.'
      : 'Hello! I would like to ask questions about the physical space or visiting hours of the Julieta Barros Association.';

  const associationWhatsappUrl = buildWhatsAppUrl(ASSOCIATION_WHATSAPP_NUMBER, associationGeneralMessageText);
  const associationEventsWhatsappUrl = buildWhatsAppUrl(ASSOCIATION_WHATSAPP_NUMBER, associationEventsMessageText);
  const associationSpaceWhatsappUrl = buildWhatsAppUrl(ASSOCIATION_WHATSAPP_NUMBER, associationSpaceMessageText);

  const closeSelectedPiece = useCallback(() => setSelectedPiece(null), []);
  const closeSellerConfirm = useCallback(() => setSellerConfirmPiece(null), []);
  const closeRateLimit = useCallback(() => setShowRateLimitAlert(false), []);

  const handleInitiateSellerContact = useCallback((piece: ProductItem) => {
    if (!canContactSeller()) {
      setShowRateLimitAlert(true);
      return;
    }
    setSellerConfirmPiece(piece);
  }, []);

  const handleConfirmSellerContact = useCallback(() => {
    if (!sellerConfirmPiece) return;
    const piece = sellerConfirmPiece;
    recordSellerContact();
    setSellerConfirmPiece(null);
    setSelectedPiece(null);
    addToast(`Contato registrado para a nossa associação na peça "${piece.title}"!`, 'success');
    const messageText = `Olá! Tenho interesse na peça "${piece.title}" (${piece.technique}) de autoria de ${piece.artist} que vi na Associação Julieta Barros (Departamento de Vendas Rosa Mística).`;
    const targetPhone = piece.sellerWhatsapp || sellerSettings.whatsapp || ASSOCIATION_WHATSAPP_NUMBER;
    const url = buildWhatsAppUrl(targetPhone, messageText);
    openExternalUrl(url);
  }, [addToast, sellerConfirmPiece, sellerSettings.whatsapp]);

  return {
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
  };
}
