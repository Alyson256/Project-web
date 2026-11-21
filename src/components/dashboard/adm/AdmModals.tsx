import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Eye,
  LogOut,
  MessageCircle,
  Palette,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import type { AdmTabType } from '../../../hooks';
import type { UserItem } from '../../../types';
import { ConfirmModal } from '../shared';
import type { GalleryPhoto } from './AdmContentTab';
import type { RecentPromotion } from './AdmUsersTab';

interface AdmModalsProps {
  isAdm: boolean;
  isTraineeManager: boolean;
  actorName: string;
  photoToTrash: GalleryPhoto | null;
  photoTrashModalRef: React.RefObject<HTMLDivElement | null>;
  onClosePhotoTrash: () => void;
  onConfirmTrashPhoto: (photo: GalleryPhoto) => void;
  videoToTrashConfirm: boolean;
  videoTrashModalRef: React.RefObject<HTMLDivElement | null>;
  onCloseVideoTrash: () => void;
  onConfirmTrashVideo: () => void;
  isAddTraineeModalOpen: boolean;
  addTraineeModalRef: React.RefObject<HTMLDivElement | null>;
  onCloseAddTraineeModal: () => void;
  traineeSearchTerm: string;
  onChangeTraineeSearchTerm: (term: string) => void;
  traineeVisibleCount: number;
  onShowMoreTrainees: () => void;
  filteredModalVisitors: UserItem[];
  visibleModalVisitors: UserItem[];
  selectedVisitorForTraining: UserItem | null;
  onSelectVisitorForTraining: (visitor: UserItem) => void;
  newTraineeTrainingFor: 'produtor' | 'gestor';
  onChangeNewTraineeTrainingFor: (target: 'produtor' | 'gestor') => void;
  confirmTrainingModal: {
    isOpen: boolean;
    visitor: UserItem | null;
    targetRole: 'produtor' | 'gestor';
  };
  onOpenConfirmTraining: (visitor: UserItem, targetRole: 'produtor' | 'gestor') => void;
  onCancelConfirmTraining: () => void;
  onExecuteAddTrainee: (visitor: UserItem, targetRole: 'produtor' | 'gestor') => void;
  undoPromotionTarget: RecentPromotion | null;
  undoPromotionModalRef: React.RefObject<HTMLDivElement | null>;
  onCloseUndoPromotion: () => void;
  undoReason: string;
  onChangeUndoReason: (reason: string) => void;
  onExecuteUndoPromotion: () => void;
  isMoreOpen: boolean;
  admMoreModalRef: React.RefObject<HTMLDivElement | null>;
  onCloseMore: () => void;
  onOpenAccessibility: () => void;
  onSelectTabFromMore: (tab: AdmTabType) => void;
  onOpenTutorial?: () => void;
  onRequestLogoutFromMore: () => void;
}

export const AdmModals: React.FC<AdmModalsProps> = ({
  isAdm,
  isTraineeManager,
  actorName,
  photoToTrash,
  photoTrashModalRef,
  onClosePhotoTrash,
  onConfirmTrashPhoto,
  videoToTrashConfirm,
  videoTrashModalRef,
  onCloseVideoTrash,
  onConfirmTrashVideo,
  isAddTraineeModalOpen,
  addTraineeModalRef,
  onCloseAddTraineeModal,
  traineeSearchTerm,
  onChangeTraineeSearchTerm,
  traineeVisibleCount,
  onShowMoreTrainees,
  filteredModalVisitors,
  visibleModalVisitors,
  selectedVisitorForTraining,
  onSelectVisitorForTraining,
  newTraineeTrainingFor,
  onChangeNewTraineeTrainingFor,
  confirmTrainingModal,
  onOpenConfirmTraining,
  onCancelConfirmTraining,
  onExecuteAddTrainee,
  undoPromotionTarget,
  undoPromotionModalRef,
  onCloseUndoPromotion,
  undoReason,
  onChangeUndoReason,
  onExecuteUndoPromotion,
  isMoreOpen,
  admMoreModalRef,
  onCloseMore,
  onOpenAccessibility,
  onSelectTabFromMore,
  onOpenTutorial,
  onRequestLogoutFromMore,
}) => {
  return (
    <>
      {photoToTrash && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClosePhotoTrash();
          }}
        >
          <div
            ref={photoTrashModalRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="adm-photo-trash-title"
            className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3.5 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-700">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 id="adm-photo-trash-title" className="text-2xl font-black text-stone-900 dark:text-white">
                  Mover foto para a lixeira?
                </h3>
                <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
                  Proteção de 30 dias antes da exclusão definitiva
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <img
                src={photoToTrash.url}
                alt={photoToTrash.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-300 dark:border-stone-600"
              />
              <div className="min-w-0 flex-1">
                <p className="font-black text-base text-stone-900 dark:text-white truncate">{photoToTrash.title}</p>
                <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Foto da galeria pública
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
              A foto sairá da galeria pública do site, mas permanecerá guardada na{' '}
              <strong>Lixeira do Administrador por 30 dias</strong>. Qualquer administrador poderá restaurá-la a qualquer
              momento.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onClosePhotoTrash}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-base hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5 shrink-0" />
                <span>Não, manter foto</span>
              </button>
              <button
                type="button"
                onClick={() => onConfirmTrashPhoto(photoToTrash)}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-base inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Trash2 className="w-5 h-5 shrink-0" />
                <span>Sim, mover para lixeira</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {videoToTrashConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseVideoTrash();
          }}
        >
          <div
            ref={videoTrashModalRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="adm-video-trash-title"
            className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3.5 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-700">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 id="adm-video-trash-title" className="text-2xl font-black text-stone-900 dark:text-white">
                  Mover vídeo para a lixeira?
                </h3>
                <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
                  Proteção de 30 dias antes da exclusão definitiva
                </span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
              O vídeo institucional sairá da página principal do site, mas permanecerá guardado na{' '}
              <strong>Lixeira do Administrador por 30 dias</strong>. Você poderá restaurá-lo a qualquer momento.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onCloseVideoTrash}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-base hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5 shrink-0" />
                <span>Não, manter vídeo</span>
              </button>
              <button
                type="button"
                onClick={onConfirmTrashVideo}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-base inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Trash2 className="w-5 h-5 shrink-0" />
                <span>Sim, mover para lixeira</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddTraineeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseAddTraineeModal();
          }}
        >
          <div
            ref={addTraineeModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="adm-add-trainee-title"
            className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shrink-0">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="adm-add-trainee-title" className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
                    Adicionar pessoa
                  </h3>
                  <p className="text-base font-medium text-stone-600 dark:text-stone-400">
                    Escolha um visitante cadastrado para iniciar o treinamento
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseAddTraineeModal}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Fechar janela"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-lg font-black text-stone-900 dark:text-white">
                  Procurar pessoa pelo nome ou e-mail
                </label>
                <div className="relative">
                  <Search className="w-6 h-6 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={traineeSearchTerm}
                    onChange={(e) => onChangeTraineeSearchTerm(e.target.value)}
                    placeholder="Procurar pessoa pelo nome ou e-mail"
                    aria-label="Procurar pessoa pelo nome ou e-mail"
                    className="w-full min-h-[56px] pl-14 pr-4 py-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-lg focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-stone-800 dark:text-stone-200">
                    Visitantes cadastrados ({filteredModalVisitors.length})
                  </span>
                  <span className="text-sm font-bold text-stone-500 dark:text-stone-400">Toque para selecionar</span>
                </div>

                {filteredModalVisitors.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800 text-center border-2 border-stone-200 dark:border-stone-700">
                    <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium">
                      Nenhum visitante encontrado com este nome ou e-mail.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {visibleModalVisitors.map((visitor) => {
                      const isSelected = selectedVisitorForTraining?.id === visitor.id;
                      return (
                        <div
                          key={visitor.id}
                          onClick={() => onSelectVisitorForTraining(visitor)}
                          className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30'
                              : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 flex items-center justify-center text-lg font-black shrink-0">
                              {visitor.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-black text-lg text-stone-900 dark:text-white truncate">
                                {visitor.name}
                              </h4>
                              <p className="text-sm font-bold text-stone-600 dark:text-stone-400 truncate">
                                {visitor.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-200">
                              Visitante
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {filteredModalVisitors.length > traineeVisibleCount && (
                      <button
                        type="button"
                        onClick={onShowMoreTrainees}
                        className="w-full min-h-[56px] px-6 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-black text-base hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ChevronDown className="w-5 h-5" />
                        <span>Ver mais ({filteredModalVisitors.length - traineeVisibleCount} restantes)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {selectedVisitorForTraining && (
                <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <label className="block text-lg font-black text-stone-900 dark:text-white">
                    Colocar {selectedVisitorForTraining.name} em treinamento para:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => onChangeNewTraineeTrainingFor('produtor')}
                      className={`min-h-[56px] p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                        newTraineeTrainingFor === 'produtor'
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30'
                          : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-900 flex items-center justify-center shrink-0 border border-stone-300 dark:border-stone-700">
                        <Palette className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-black text-lg">Equipe de Produção</div>
                        <div className="text-sm font-medium text-stone-600 dark:text-stone-400">
                          Quem produz e vitrine
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onChangeNewTraineeTrainingFor('gestor')}
                      className={`min-h-[56px] p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                        newTraineeTrainingFor === 'gestor'
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 ring-2 ring-teal-500/30'
                          : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-900 flex items-center justify-center shrink-0 border border-stone-300 dark:border-stone-700">
                        <Shield className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                      </div>
                      <div>
                        <div className="font-black text-lg">Gestor</div>
                        <div className="text-sm font-medium text-stone-600 dark:text-stone-400">
                          Coordenação comunitária
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={onCloseAddTraineeModal}
                  className="min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors w-full sm:w-1/2 cursor-pointer flex items-center justify-center"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!selectedVisitorForTraining}
                  onClick={() => {
                    if (!selectedVisitorForTraining) return;
                    onOpenConfirmTraining(selectedVisitorForTraining, newTraineeTrainingFor);
                  }}
                  className={`min-h-[56px] px-6 py-3.5 rounded-2xl font-black text-lg transition-all w-full sm:w-1/2 shadow-sm cursor-pointer flex items-center justify-center gap-2 ${
                    selectedVisitorForTraining
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <UserPlus className="w-5 h-5 shrink-0" />
                  <span>Avançar para confirmação</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmTrainingModal.isOpen && confirmTrainingModal.visitor && (
        <ConfirmModal
          isOpen={true}
          title="Confirmar Treinamento"
          message={`Deseja colocar ${confirmTrainingModal.visitor.name} em treinamento para ${
            confirmTrainingModal.targetRole === 'gestor' ? 'Gestor' : 'Produtor'
          }?`}
          confirmText="Sim, confirmar"
          cancelText="Não, voltar"
          onConfirm={() => onExecuteAddTrainee(confirmTrainingModal.visitor!, confirmTrainingModal.targetRole)}
          onCancel={onCancelConfirmTraining}
        />
      )}

      {undoPromotionTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseUndoPromotion();
          }}
        >
          <div
            ref={undoPromotionModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="adm-undo-promo-title"
            className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="adm-undo-promo-title" className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
                    Desfazer Promoção
                  </h3>
                  <p className="text-base font-medium text-stone-600 dark:text-stone-400">
                    Reverter cargo para Aprendiz
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseUndoPromotion}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Fechar janela"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-stone-900 dark:text-stone-100 space-y-1.5">
                <p className="text-lg font-black leading-snug">
                  Deseja desfazer a promoção de {undoPromotionTarget.promotedUserName}?
                </p>
                <p className="text-base font-bold text-stone-700 dark:text-stone-300">
                  {undoPromotionTarget.promotedUserName} volta a ser{' '}
                  {undoPromotionTarget.previousRole === 'aprendiz_gestor'
                    ? 'Aprendiz (Gestão)'
                    : 'Aprendiz (Artesão)'}
                  .
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-black text-stone-900 dark:text-white">
                  Motivo (opcional)
                </label>
                <input
                  type="text"
                  value={undoReason}
                  onChange={(e) => onChangeUndoReason(e.target.value)}
                  placeholder="Ex.: Precisa praticar mais um pouco"
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCloseUndoPromotion}
                  className="min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors w-full sm:w-1/2 cursor-pointer flex items-center justify-center"
                >
                  Não, voltar
                </button>
                <button
                  type="button"
                  onClick={onExecuteUndoPromotion}
                  className="min-h-[56px] px-6 py-3.5 rounded-2xl font-black text-lg bg-amber-600 hover:bg-amber-700 text-white transition-all w-full sm:w-1/2 shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5 shrink-0" />
                  <span>Sim, desfazer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseMore();
          }}
        >
          <div
            ref={admMoreModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="adm-more-modal-title"
            className="bg-white dark:bg-stone-900 border-t-2 sm:border-2 border-stone-300 dark:border-stone-700 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-200 dark:border-stone-800 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border ${
                    isAdm
                      ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  }`}
                >
                  {actorName.trim().charAt(0).toUpperCase() || 'G'}
                </div>
                <div className="min-w-0">
                  <h3 id="adm-more-modal-title" className="text-lg font-black text-stone-900 dark:text-white leading-tight truncate">
                    {actorName}
                  </h3>
                  <p className={`text-xs font-bold ${isAdm ? 'text-teal-600 dark:text-teal-400' : 'text-emerald-800 dark:text-emerald-400'}`}>
                    {isAdm ? 'Administrador Técnico' : isTraineeManager ? 'Aprendiz de Gestão' : 'Equipe de Gestão'}
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

              {!isAdm ? (
                <>
                  <button
                    type="button"
                    onClick={() => onSelectTabFromMore('users')}
                    className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 text-left font-extrabold text-base flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>Pessoas e Cadastros</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTabFromMore('agenda')}
                    className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 text-left font-extrabold text-base flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>Agenda do Espaço</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTabFromMore('tickets')}
                    className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 text-left font-extrabold text-base flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>Dúvidas e Mensagens</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectTabFromMore('audit')}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 text-left font-extrabold text-base flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Auditoria e Registros</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
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
                    <span>{isAdm ? 'Guia Técnico' : 'Guia da Gestão'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={onRequestLogoutFromMore}
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
};
