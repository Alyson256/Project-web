import React, { useRef, useCallback } from 'react';
import { X, UserCheck, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts';
import { type ShowcaseProduct, formatCategoryName } from '../../data';
import { ProductImage } from '../ProductImage';
import { getArtistPhoto } from '../../lib';
import { useFocusTrap } from '../../hooks';

export interface LandingModalsProps {
  selectedProductDetail: ShowcaseProduct | null;
  onCloseProductDetail: () => void;
  isAuthenticated: boolean;
  isSellerAvailable: boolean;
  onNavigateLogin: () => void;
  onInitiateSellerContact: (product: ShowcaseProduct) => void;
  sellerConfirmProduct: ShowcaseProduct | null;
  onCloseSellerConfirm: () => void;
  onConfirmSellerContact: () => void;
  showRateLimitAlert: boolean;
  onCloseRateLimitAlert: () => void;
}

export function LandingModals({
  selectedProductDetail,
  onCloseProductDetail,
  isAuthenticated,
  isSellerAvailable,
  onNavigateLogin,
  onInitiateSellerContact,
  sellerConfirmProduct,
  onCloseSellerConfirm,
  onConfirmSellerContact,
  showRateLimitAlert,
  onCloseRateLimitAlert
}: LandingModalsProps) {
  const { t, language } = useLanguage();
  const activeModalRef = useRef<HTMLDivElement>(null);

  const closeActiveModal = useCallback(() => {
    if (showRateLimitAlert) onCloseRateLimitAlert();
    else if (sellerConfirmProduct) onCloseSellerConfirm();
    else if (selectedProductDetail) onCloseProductDetail();
  }, [showRateLimitAlert, sellerConfirmProduct, selectedProductDetail, onCloseRateLimitAlert, onCloseSellerConfirm, onCloseProductDetail]);

  const hasOpenModal = Boolean(selectedProductDetail || sellerConfirmProduct || showRateLimitAlert);
  useFocusTrap(hasOpenModal, activeModalRef, closeActiveModal);

  return (
    <>
      {/* MODAL DE DETALHE DA PEÇA */}
      {selectedProductDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onCloseProductDetail}
        >
          <div
            ref={activeModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="landing-product-detail-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-stone-200 dark:border-stone-800 space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <span className="px-4 py-1.5 rounded-full text-base font-extrabold bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300">
                {formatCategoryName(selectedProductDetail.category, language)}
              </span>
              <button
                type="button"
                onClick={onCloseProductDetail}
                className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                aria-label={t('nav.fechar', 'Fechar')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
              <ProductImage
                src={selectedProductDetail.image}
                alt={selectedProductDetail.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 id="landing-product-detail-title" className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white leading-tight">
                {selectedProductDetail.title}
              </h3>
              <p className="text-xl font-bold text-stone-600 dark:text-stone-400 mt-2">
                {t('vitrine.modal_technique', 'Técnica')}: {selectedProductDetail.technique}
              </p>
              <div className="text-3xl font-black text-emerald-800 dark:text-emerald-400 mt-3">
                {new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' }).format(selectedProductDetail.price)}
              </div>
              {selectedProductDetail.description && (
                <p className="text-lg text-stone-700 dark:text-stone-300 font-medium mt-4 leading-relaxed">
                  {selectedProductDetail.description}
                </p>
              )}
            </div>

            {/* Perfil do Artesão */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <img
                src={selectedProductDetail.artistPhoto || getArtistPhoto(selectedProductDetail.artist)}
                alt={selectedProductDetail.artist}
                className="w-16 h-16 rounded-full object-cover border-2 border-stone-300 dark:border-stone-600 shrink-0"
              />
              <div>
                <span className="text-sm font-bold text-stone-500 dark:text-stone-400">
                  {t('vitrine.modal_author', 'Artesão(ã) criador(a)')}
                </span>
                <h4 className="text-xl font-black text-stone-900 dark:text-white">
                  {selectedProductDetail.artist}
                </h4>
              </div>
            </div>

            {/* Ação de contato */}
            <div className="pt-2">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      onCloseProductDetail();
                      onNavigateLogin();
                    }}
                    className="w-full min-h-[56px] px-6 py-3.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 font-black text-[18px] rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <UserCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-300 shrink-0" />
                    <span>{t('vitrine.login_to_contact', 'Entrar para falar com o vendedor')}</span>
                  </button>
                  <p className="text-base text-stone-600 dark:text-stone-300 font-medium text-center leading-relaxed">
                    {t('vitrine.login_safety_note', 'Para cuidar da segurança de quem produz com a gente, só pessoas cadastradas podem falar com o vendedor.')}
                  </p>
                </div>
              ) : !(selectedProductDetail.sellerAvailable !== undefined ? selectedProductDetail.sellerAvailable : isSellerAvailable) ? (
                <div className="w-full min-h-[56px] px-6 py-3.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-[18px] rounded-2xl border-2 border-stone-200 dark:border-stone-700 flex items-center justify-center gap-2.5 shadow-xs">
                  <Clock className="w-5 h-5 text-stone-500 shrink-0" />
                  <span>{t('vitrine.seller_unavailable', 'Vendedor indisponível no momento')}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const prod = selectedProductDetail;
                    onCloseProductDetail();
                    onInitiateSellerContact(prod);
                  }}
                  className="w-full min-h-[56px] flex items-center justify-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[18px] px-6 py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-6 h-6 shrink-0" />
                  <span>{t('vitrine.contact_whatsapp', 'Falar com o vendedor no WhatsApp')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE CONTATO NO WHATSAPP (Texto e regras seguras) */}
      {sellerConfirmProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onCloseSellerConfirm}
        >
          <div
            ref={activeModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="landing-seller-confirm-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-stone-200 dark:border-stone-800 space-y-6"
          >
            
            {/* Foto e nome da peça no topo */}
            <div className="flex items-center gap-4 p-3.5 bg-stone-50 dark:bg-stone-800/70 rounded-2xl border-2 border-stone-200 dark:border-stone-700">
              <ProductImage
                src={sellerConfirmProduct.image}
                alt={sellerConfirmProduct.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-300 dark:border-stone-600 shadow-xs"
              />
              <div className="min-w-0">
                <h4 id="landing-seller-confirm-title" className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight truncate">
                  {t('vitrine.about_prefix', 'Sobre: ')}{sellerConfirmProduct.title}
                </h4>
              </div>
            </div>

            {/* Foto e nome do vendedor com o rótulo "Quem faz esta peça" */}
            <div className="flex items-center gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <img 
                src={sellerConfirmProduct.artistPhoto || getArtistPhoto(sellerConfirmProduct.artist)} 
                alt={sellerConfirmProduct.artist} 
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shrink-0 shadow-sm"
              />
              <div className="min-w-0">
                <span className="text-base font-bold text-stone-500 dark:text-stone-400 block">
                  {t('vitrine.crafted_by', 'Quem faz esta peça')}
                </span>
                <h3 className="text-2xl font-black text-stone-900 dark:text-white leading-tight truncate">
                  {sellerConfirmProduct.artist}
                </h3>
              </div>
            </div>
            
            <p className="text-stone-800 dark:text-stone-200 font-bold text-[18px] leading-relaxed">
              {t('vitrine.whatsapp_confirm_desc', 'Vamos abrir o WhatsApp com uma mensagem pronta. O vendedor vai ver o seu número e o nome do seu WhatsApp. O seu contato fica registrado para a nossa associação.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onCloseSellerConfirm}
                className="min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors w-full sm:w-1/2 cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>{t('dash.voltar', 'Voltar')}</span>
              </button>
              <button
                type="button"
                onClick={onConfirmSellerContact}
                className="min-h-[56px] px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg transition-all w-full sm:w-1/2 shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>{t('vitrine.whatsapp_continue', 'Continuar')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERTA DE LIMITE DE CONTATOS POR HORA */}
      {showRateLimitAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onCloseRateLimitAlert}
        >
          <div
            ref={activeModalRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="landing-rate-limit-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-stone-200 dark:border-stone-800 space-y-6"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 border border-amber-300 shrink-0">
                <Clock className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 id="landing-rate-limit-title" className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
                {t('vitrine.rate_limit_title', 'Aviso')}
              </h3>
            </div>
            
            <p className="text-stone-700 dark:text-stone-300 font-medium text-[18px] leading-relaxed">
              {t('vitrine.rate_limit_desc', 'Você já enviou várias mensagens nesta hora. Por favor, aguarde alguns instantes antes de enviar um novo contato.')}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onCloseRateLimitAlert}
                className="w-full min-h-[56px] px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-black text-lg transition-colors cursor-pointer"
              >
                {t('vitrine.rate_limit_understood', 'Entendido')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
