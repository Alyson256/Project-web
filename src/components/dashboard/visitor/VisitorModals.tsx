import { useRef } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  Clock,
  Eye,
  Leaf,
  LogOut,
  MessageCircle,
  X,
} from 'lucide-react';
import type { ProductItem } from '../../../types';
import { getArtistPhoto } from '../../../lib';
import { ProductImage } from '../..';
import { useFocusTrap } from '../../../hooks';

export interface VisitorModalsProps {
  selectedPiece: ProductItem | null;
  onCloseSelectedPiece: () => void;
  isSellerAvailable: boolean;
  onInitiateSellerContact: (piece: ProductItem) => void;
  sellerConfirmPiece: ProductItem | null;
  onCloseSellerConfirm: () => void;
  onConfirmSellerContact: () => void;
  showRateLimitAlert: boolean;
  onCloseRateLimit: () => void;
  confirmExit: boolean;
  onCloseConfirmExit: () => void;
  onLogout: () => void;
  onLogoutRequestFromMore: () => void;
  isMoreOpen: boolean;
  onCloseMore: () => void;
  onOpenAccessibility: () => void;
  hasRealAnnouncements: boolean;
  onSelectAnnouncementsTab: () => void;
  onOpenTutorial?: () => void;
}

export function VisitorModals({
  selectedPiece,
  onCloseSelectedPiece,
  isSellerAvailable,
  onInitiateSellerContact,
  sellerConfirmPiece,
  onCloseSellerConfirm,
  onConfirmSellerContact,
  showRateLimitAlert,
  onCloseRateLimit,
  confirmExit,
  onCloseConfirmExit,
  onLogout,
  onLogoutRequestFromMore,
  isMoreOpen,
  onCloseMore,
  onOpenAccessibility,
  hasRealAnnouncements,
  onSelectAnnouncementsTab,
  onOpenTutorial,
}: VisitorModalsProps) {
  const selectedPieceRef = useRef<HTMLDivElement>(null);
  const sellerConfirmRef = useRef<HTMLDivElement>(null);
  const rateLimitRef = useRef<HTMLDivElement>(null);
  const confirmExitRef = useRef<HTMLDivElement>(null);
  const moreModalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(Boolean(selectedPiece) && !sellerConfirmPiece && !showRateLimitAlert, selectedPieceRef, onCloseSelectedPiece);
  useFocusTrap(Boolean(sellerConfirmPiece) && !showRateLimitAlert, sellerConfirmRef, onCloseSellerConfirm);
  useFocusTrap(showRateLimitAlert, rateLimitRef, onCloseRateLimit);
  useFocusTrap(confirmExit, confirmExitRef, onCloseConfirmExit);
  useFocusTrap(isMoreOpen, moreModalRef, onCloseMore);

  return (
    <>
      {/* Modal de Detalhes da Peça com Falar no WhatsApp */}
      {selectedPiece && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseSelectedPiece();
          }}
        >
          <div
            ref={selectedPieceRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="visitor-piece-modal-title"
            className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="visitor-piece-modal-title" className="text-xl font-black text-stone-900 dark:text-white">
                    Detalhes da Peça
                  </h3>
                  <p className="text-base font-medium text-stone-600 dark:text-stone-400">
                    Atendimento direto com o vendedor
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseSelectedPiece}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer rounded-xl transition-colors"
                aria-label="Fechar janela"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="w-full h-56 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700">
                <ProductImage
                  src={selectedPiece.image}
                  alt={selectedPiece.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-black text-2xl text-stone-900 dark:text-white leading-tight">
                  {selectedPiece.title}
                </h4>
                <p className="text-base font-bold text-emerald-800 dark:text-emerald-400 mt-1">
                  Autoria: {selectedPiece.artist} • Técnica: {selectedPiece.technique}
                </p>
                <p className="text-lg text-stone-700 dark:text-stone-300 font-medium mt-3 leading-relaxed">
                  {selectedPiece.description}
                </p>
                <p className="text-2xl font-black text-stone-900 dark:text-white mt-4">
                  R$ {(selectedPiece.price || 0).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={onCloseSelectedPiece}
                className="min-h-[56px] px-6 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-extrabold text-base hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors w-full sm:w-1/3 cursor-pointer"
              >
                Voltar
              </button>
              {!(selectedPiece.sellerAvailable !== undefined ? selectedPiece.sellerAvailable : isSellerAvailable) ? (
                <div className="w-full sm:w-2/3 min-h-[56px] px-6 py-3.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-[18px] rounded-2xl border-2 border-stone-200 dark:border-stone-700 flex items-center justify-center gap-2.5 shadow-xs">
                  <Clock className="w-5 h-5 text-stone-500 dark:text-stone-400 shrink-0" />
                  <span>Vendedor indisponível no momento</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onInitiateSellerContact(selectedPiece)}
                  className="min-h-[56px] px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-[18px] flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer active:scale-95 w-full sm:w-2/3"
                >
                  <MessageCircle className="w-6 h-6 shrink-0" />
                  <span>Falar com o vendedor no WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmação de Abertura do WhatsApp */}
      {sellerConfirmPiece && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseSellerConfirm();
          }}
        >
          <div
            ref={sellerConfirmRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="visitor-seller-confirm-title"
            className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-4 p-3.5 bg-stone-50 dark:bg-stone-800/70 rounded-2xl border-2 border-stone-200 dark:border-stone-700">
              <ProductImage
                src={sellerConfirmPiece.image}
                alt={sellerConfirmPiece.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-300 dark:border-stone-600 shadow-xs"
              />
              <div className="min-w-0">
                <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight truncate">
                  Sobre: {sellerConfirmPiece.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <img
                src={sellerConfirmPiece.artistPhoto || getArtistPhoto(sellerConfirmPiece.artist)}
                alt={sellerConfirmPiece.artist}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shrink-0 shadow-sm"
              />
              <div className="min-w-0">
                <span className="text-base font-bold text-stone-500 dark:text-stone-400 block">
                  Quem faz esta peça
                </span>
                <h3
                  id="visitor-seller-confirm-title"
                  className="text-2xl font-black text-stone-900 dark:text-white leading-tight truncate"
                >
                  {sellerConfirmPiece.artist}
                </h3>
              </div>
            </div>

            <p className="text-stone-800 dark:text-stone-200 font-bold text-[18px] leading-relaxed">
              Vamos abrir o WhatsApp com uma mensagem pronta. O vendedor vai ver o seu número e o nome do seu WhatsApp. O seu contato fica registrado para a nossa associação.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onCloseSellerConfirm}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-[18px] hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180 shrink-0" />
                <span>Voltar</span>
              </button>
              <button
                type="button"
                onClick={onConfirmSellerContact}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[18px] flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Continuar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limite de contatos por hora atingido */}
      {showRateLimitAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseRateLimit();
          }}
        >
          <div
            ref={rateLimitRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="visitor-ratelimit-title"
            className="bg-white dark:bg-stone-900 border-2 border-amber-300 dark:border-amber-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <h3 id="visitor-ratelimit-title" className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                Aviso de Contatos
              </h3>
            </div>

            <p className="text-lg sm:text-xl font-bold text-stone-800 dark:text-stone-200 leading-relaxed">
              Você já falou com vários vendedores agora. Tente de novo mais tarde.
            </p>

            <button
              type="button"
              onClick={onCloseRateLimit}
              className="w-full min-h-[56px] px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-black text-[18px] cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Saída neutro */}
      {confirmExit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseConfirmExit();
          }}
        >
          <div
            ref={confirmExitRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="visitor-exit-title"
            className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-700">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 id="visitor-exit-title" className="text-2xl font-black text-stone-900 dark:text-white">
                Deseja sair?
              </h3>
            </div>
            <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
              Quer mesmo sair agora da sua conta de visitante? A gente espera você voltar em breve!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onCloseConfirmExit}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-[18px] hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer flex items-center justify-center"
              >
                Continuar aqui
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-[18px] cursor-pointer shadow-sm active:scale-95 flex items-center justify-center"
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Painel "Mais" do Visitante */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseMore();
          }}
        >
          <div
            ref={moreModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="visitor-more-modal-title"
            className="bg-white dark:bg-stone-900 border-t-2 sm:border-2 border-stone-300 dark:border-stone-700 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-200 dark:border-stone-800 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center font-black text-lg shrink-0">
                  <Leaf className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 id="visitor-more-modal-title" className="text-lg font-black text-stone-900 dark:text-white leading-tight truncate">
                    Mais Opções
                  </h3>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    Associação Julieta Barros
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseMore}
                className="min-h-[56px] px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-black text-base flex items-center gap-2 cursor-pointer border border-stone-300 dark:border-stone-700 shadow-xs active:scale-95 shrink-0"
                aria-label="Fechar opções"
              >
                <X className="w-5 h-5 shrink-0" />
                <span>Fechar</span>
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  onCloseMore();
                  onOpenAccessibility();
                }}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 text-left font-black text-base flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>Acessibilidade</span>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </button>

              {hasRealAnnouncements && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectAnnouncementsTab();
                    onCloseMore();
                  }}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 text-left font-extrabold text-base flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>Avisos e Comunicados</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </button>
              )}

              {onOpenTutorial && (
                <button
                  type="button"
                  onClick={() => {
                    onCloseMore();
                    onOpenTutorial();
                  }}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 text-left font-extrabold text-base flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>Guia da Tela (Passo a passo)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  onCloseMore();
                  onLogoutRequestFromMore();
                }}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800 text-left font-black text-base flex items-center justify-center gap-3 cursor-pointer shadow-xs active:scale-95"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
