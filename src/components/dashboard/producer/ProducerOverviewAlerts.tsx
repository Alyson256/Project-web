import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Edit2,
  Eye,
  MessageCircle,
  Sparkles,
  Volume2,
} from 'lucide-react';
import type { ProductItem } from '../../../types';

interface ProducerOverviewAlertsProps {
  isTraining: boolean;
  sellerWhatsapp: string;
  sellerAuthorized: boolean;
  sellerReceiveNow: boolean;
  myProducts: ProductItem[];
  availableProducts: ProductItem[];
  adjustmentProducts: ProductItem[];
  inReviewProducts: ProductItem[];
  attentionProducts: ProductItem[];
  outOfStockProducts: ProductItem[];
  trainingCount: number;
  isTrainingLimitReached: boolean;
  completedSteps: number;
  isAllStepsCompleted: boolean;
  checklistStep2: boolean;
  onSetProductFilter: (filter: 'todas' | 'disponiveis' | 'atencao' | 'esgotadas') => void;
  onStartEditingProduct: (product: ProductItem) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenContactTab: () => void;
  onOpenFirstSteps: () => void;
}

export const ProducerOverviewAlerts: React.FC<ProducerOverviewAlertsProps> = ({
  isTraining,
  sellerWhatsapp,
  sellerAuthorized,
  sellerReceiveNow,
  myProducts,
  availableProducts,
  adjustmentProducts,
  inReviewProducts,
  attentionProducts,
  outOfStockProducts,
  trainingCount,
  isTrainingLimitReached,
  completedSteps,
  isAllStepsCompleted,
  checklistStep2,
  onSetProductFilter,
  onStartEditingProduct,
  onScrollToSection,
  onOpenContactTab,
  onOpenFirstSteps,
}) => {
  const isWhatsappMissingOrPaused =
    !isTraining && (!sellerWhatsapp || !sellerWhatsapp.trim() || !sellerAuthorized || !sellerReceiveNow);
  const hasAdjustments = adjustmentProducts.length > 0;
  const hasOutOfStock = outOfStockProducts.length > 0;
  const hasInReview = inReviewProducts.length > 0;
  const hasTrainingAlert = isTraining;
  const totalAlertCount =
    (hasAdjustments ? 1 : 0) +
    (isWhatsappMissingOrPaused ? 1 : 0) +
    (hasTrainingAlert ? 1 : 0) +
    (hasOutOfStock ? 1 : 0) +
    (hasInReview ? 1 : 0);

  return (
    <>
      {/* 2. PRIORIDADE MAXIMA: O que precisa da sua atenção hoje */}
      <section
        aria-labelledby="producer-alerts-heading"
        className="bg-transparent sm:bg-white dark:sm:bg-stone-900 rounded-none sm:rounded-3xl p-0 sm:p-8 border-0 sm:border-2 border-stone-200 dark:border-stone-800 shadow-none sm:shadow-sm space-y-4 sm:space-y-6"
      >
        <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2
              id="producer-alerts-heading"
              className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight"
            >
              O que precisa da sua atenção hoje
            </h2>
            <p className="text-xs sm:text-base text-stone-600 dark:text-stone-400 font-medium">
              Avisos prioritários para manter suas peças prontas para venda
            </p>
          </div>
        </div>

        {totalAlertCount === 0 ? (
          <div className="py-8 sm:py-10 px-4 sm:px-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-700 text-center space-y-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-700">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white">Tudo em dia.</h3>
            <p className="text-sm sm:text-lg text-stone-600 dark:text-stone-400 font-medium max-w-lg mx-auto">
              Suas peças estão disponíveis na vitrine e seu WhatsApp está pronto para receber contatos.
            </p>
          </div>
        ) : (
          <div className={totalAlertCount > 1 ? 'grid grid-cols-1 xl:grid-cols-2 gap-4' : 'space-y-4'}>
            {/* Prioridade 1: Peças com pedido de ajuste pela gestão */}
            {hasAdjustments && (
              <div className="p-4 sm:p-6 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-300 dark:border-orange-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xs">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-orange-100 dark:bg-orange-900/60 border border-orange-300 dark:border-orange-700 flex items-center justify-center text-orange-800 dark:text-orange-300 shrink-0">
                    <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
                      {adjustmentProducts.length === 1
                        ? `Ajuste pedido em "${adjustmentProducts[0].title}"`
                        : `${adjustmentProducts.length} peças precisam de ajuste`}
                    </h3>
                    <p className="text-xs sm:text-base font-bold text-orange-900 dark:text-orange-200 mt-1 leading-relaxed">
                      {adjustmentProducts.length === 1 && adjustmentProducts[0].adjustmentFeedback
                        ? `Observação da gestão: "${adjustmentProducts[0].adjustmentFeedback}"`
                        : 'A gestão enviou observações. Edite para reenviar para aprovação.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSetProductFilter('atencao');
                    if (adjustmentProducts.length === 1) {
                      onStartEditingProduct(adjustmentProducts[0]);
                    }
                    onScrollToSection('meus-produtos');
                  }}
                  className="min-h-[56px] px-6 sm:px-8 py-3 bg-orange-700 hover:bg-orange-800 text-white rounded-2xl font-black text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer whitespace-nowrap active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <Edit2 className="w-5 h-5 shrink-0" />
                  <span>Corrigir agora</span>
                </button>
              </div>
            )}

            {/* Prioridade 2: WhatsApp pendente ou pausado */}
            {isWhatsappMissingOrPaused && (
              <div className="p-4 sm:p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xs">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                    <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
                      {!sellerWhatsapp || !sellerWhatsapp.trim() || !sellerAuthorized
                        ? 'Falta configurar o seu WhatsApp'
                        : 'Contatos no WhatsApp pausados'}
                    </h3>
                    <p className="text-xs sm:text-base font-bold text-amber-900 dark:text-amber-200 mt-1 leading-relaxed">
                      {!sellerWhatsapp || !sellerWhatsapp.trim() || !sellerAuthorized
                        ? 'Configure seu número e autorize o contato para que compradores possam falar com você.'
                        : 'Seus produtos estão exibindo "Vendedor indisponível no momento" na vitrine.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenContactTab}
                  className="min-h-[56px] px-6 sm:px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-2xl font-black text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer whitespace-nowrap active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>Configurar agora</span>
                </button>
              </div>
            )}

            {/* Prioridade 3 (Modo Treino) */}
            {isTraining &&
              (isTrainingLimitReached ? (
                <div className="p-4 sm:p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xs">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                      <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
                        Você atingiu o limite de 5 peças de treino
                      </h3>
                      <p className="text-xs sm:text-base font-bold text-amber-900 dark:text-amber-200 mt-1 leading-relaxed">
                        Suas 5 peças estão salvas neste ambiente seguro. Aguarde o retorno da Associação Julieta Barros ou
                        edite suas peças de treino abaixo.
                      </p>
                    </div>
                  </div>
                </div>
              ) : isAllStepsCompleted ? (
                <div className="p-4 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xs">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shrink-0">
                      <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
                        Parabéns! Seu curso inicial foi concluído.
                      </h3>
                      <p className="text-xs sm:text-base font-bold text-emerald-900 dark:text-emerald-200 mt-1 leading-relaxed">
                        Aguarde o retorno da Associação Julieta Barros. Enquanto isso, você pode continuar testando ou
                        sair do ambiente.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(
                          'Parabéns! Seu curso inicial foi concluído. Aguarde o retorno da associação.'
                        );
                        utterance.lang = 'pt-BR';
                        utterance.rate = 0.88;
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="min-h-[56px] px-6 sm:px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer whitespace-nowrap active:scale-95 w-full sm:w-auto shrink-0"
                  >
                    <Volume2 className="w-5 h-5 shrink-0" />
                    <span>Ouvir</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xs">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shrink-0">
                      <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
                        Primeiros passos do treino ({completedSteps} de 3 concluídos)
                      </h3>
                      <p className="text-xs sm:text-base font-bold text-emerald-900 dark:text-emerald-200 mt-1 leading-relaxed">
                        {!checklistStep2
                          ? 'Cadastre sua primeira peça de treino usando o botão "Adicionar produto".'
                          : 'Falta apenas finalizar o treinamento inicial nas etapas abaixo.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenFirstSteps}
                    className="min-h-[56px] px-6 sm:px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer whitespace-nowrap active:scale-95 w-full sm:w-auto shrink-0"
                  >
                    <ArrowRight className="w-5 h-5 shrink-0" />
                    <span>Ver etapas</span>
                  </button>
                </div>
              ))}

            {/* Prioridade 4: Peças esgotadas sem estoque */}
            {hasOutOfStock && (
              <div className="p-4 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xs">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                    <Box className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
                      {outOfStockProducts.length === 1
                        ? `"${outOfStockProducts[0].title}" está esgotada`
                        : `${outOfStockProducts.length} peças estão esgotadas`}
                    </h3>
                    <p className="text-xs sm:text-base font-bold text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                      Quando produzir novas unidades, aumente o estoque para ela voltar à vitrine.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSetProductFilter('esgotadas');
                    onScrollToSection('meus-produtos');
                  }}
                  className="min-h-[56px] px-6 sm:px-8 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer whitespace-nowrap active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <Eye className="w-5 h-5 shrink-0" />
                  <span>Ver esgotadas</span>
                </button>
              </div>
            )}

            {/* Prioridade 5: Informativo de peças em revisão pela gestão */}
            {hasInReview && (
              <div className="p-4 sm:p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-300 dark:border-blue-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xs">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-700 flex items-center justify-center text-blue-800 dark:text-blue-300 shrink-0">
                    <Clock className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
                      {inReviewProducts.length === 1
                        ? '1 peça em análise pela gestão'
                        : `${inReviewProducts.length} peças em análise pela gestão`}
                    </h3>
                    <p className="text-xs sm:text-base font-bold text-blue-900 dark:text-blue-200 mt-1 leading-relaxed">
                      A edição desta peça fica travada temporariamente até a aprovação.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSetProductFilter('atencao');
                    onScrollToSection('meus-produtos');
                  }}
                  className="min-h-[56px] px-6 sm:px-8 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer whitespace-nowrap active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <Eye className="w-5 h-5 shrink-0" />
                  <span>Ver peças</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Resumo Compacto sem Redundâncias (3 Cartões Interativos) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => {
            onSetProductFilter('disponiveis');
            onScrollToSection('meus-produtos');
          }}
          className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border-2 border-stone-200 dark:border-stone-800 hover:border-emerald-400 dark:hover:border-emerald-700 shadow-xs flex items-center gap-4 text-left cursor-pointer transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">
              {isTraining ? 'Peças de Treino' : 'Disponíveis na Vitrine'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 leading-tight block tabular-nums">
              {isTraining ? `${trainingCount} / 5` : availableProducts.length}
            </span>
            <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium block">
              {isTraining ? 'em rascunho seguro' : `de ${myProducts.length} cadastradas`}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onSetProductFilter('atencao');
            onScrollToSection('meus-produtos');
          }}
          className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border-2 border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-700 shadow-xs flex items-center gap-4 text-left cursor-pointer transition-colors"
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
              adjustmentProducts.length > 0
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-700'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700'
            }`}
          >
            <Clock className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">
              Ajustes e Revisão
            </span>
            <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight block tabular-nums">
              {attentionProducts.length}
            </span>
            <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium block">
              {adjustmentProducts.length > 0
                ? `${adjustmentProducts.length} com ajuste pedido`
                : `${inReviewProducts.length} aguardando análise`}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onSetProductFilter('esgotadas');
            onScrollToSection('meus-produtos');
          }}
          className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border-2 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 shadow-xs flex items-center gap-4 text-left cursor-pointer transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 shrink-0">
            <Box className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">
              Esgotadas
            </span>
            <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight block tabular-nums">
              {outOfStockProducts.length}
            </span>
            <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium block">
              sem estoque ativo
            </span>
          </div>
        </button>
      </div>
    </>
  );
};
