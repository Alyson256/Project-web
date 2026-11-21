import React from 'react';
import {
  AlertCircle,
  Box,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  MessageCircle,
  Printer,
  Send,
  X,
} from 'lucide-react';
import type { ProductItem } from '../../../types';
import { ProductImage } from '../..';

interface AdmCatalogTabProps {
  allProducts: ProductItem[];
  catalogFilter: 'aguardando' | 'ajustes' | 'publicadas' | 'todas';
  setCatalogFilter: React.Dispatch<React.SetStateAction<'aguardando' | 'ajustes' | 'publicadas' | 'todas'>>;
  adjustingProductId: number | null;
  setAdjustingProductId: React.Dispatch<React.SetStateAction<number | null>>;
  adjustmentReason: string;
  setAdjustmentReason: React.Dispatch<React.SetStateAction<string>>;
  processingProductId?: number | null;
  onApprovePiece: (product: ProductItem) => void;
  onSendAdjustment: (productId: number) => void;
  onPrintSales: () => void;
  onPrint: () => void;
  onExportProductsToCSV: () => void;
}

export const AdmCatalogTab: React.FC<AdmCatalogTabProps> = ({
  allProducts,
  catalogFilter,
  setCatalogFilter,
  adjustingProductId,
  setAdjustingProductId,
  adjustmentReason,
  setAdjustmentReason,
  processingProductId = null,
  onApprovePiece,
  onSendAdjustment,
  onPrintSales,
  onPrint,
  onExportProductsToCSV,
}) => {
  const realProducts = allProducts.filter((p) => !p.isTraining);
  const pendingPieces = realProducts.filter((p) => p.status === 'em_revisao');
  const adjustmentPieces = realProducts.filter((p) => p.status === 'ajuste_solicitado');
  const publishedPieces = realProducts.filter((p) => p.status === 'publicado');
  const currentPieces =
    catalogFilter === 'aguardando'
      ? pendingPieces
      : catalogFilter === 'ajustes'
        ? adjustmentPieces
        : catalogFilter === 'publicadas'
          ? publishedPieces
          : realProducts;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Peças da Vitrine Rosa Mística
          </h2>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium mt-1">
            Acompanhe, aprove e gerencie as peças cadastradas pela nossa equipe de artesãos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto no-print">
          <button
            type="button"
            onClick={onPrintSales}
            className="flex items-center justify-center gap-2.5 px-5 py-3 min-h-[56px] bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl font-black text-base transition-all shadow-sm active:scale-95 cursor-pointer"
            aria-label="Ver relatório de contatos recebidos"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span>Contatos recebidos</span>
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center justify-center gap-2.5 px-5 py-3 min-h-[56px] bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-2xl font-black text-base transition-all shadow-sm active:scale-95 cursor-pointer"
            aria-label="Imprimir Peças"
          >
            <Printer className="w-5 h-5 shrink-0" />
            <span>Imprimir Peças</span>
          </button>
          <button
            type="button"
            onClick={onExportProductsToCSV}
            className="flex items-center justify-center gap-2.5 px-5 py-3 min-h-[56px] bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-2xl font-black text-base transition-all shadow-sm active:scale-95 cursor-pointer"
            aria-label="Salvar peças em planilha"
          >
            <Download className="w-5 h-5 shrink-0" />
            <span>Salvar Planilha</span>
          </button>
        </div>
      </div>

      {/* Abas Grandes no topo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full">
        <button
          type="button"
          onClick={() => setCatalogFilter('aguardando')}
          className={`min-h-[56px] px-4 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
            catalogFilter === 'aguardando'
              ? 'bg-emerald-700 text-white border-2 border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
          }`}
        >
          <Clock className="w-5 h-5 shrink-0" />
          <span>Aguardando ({pendingPieces.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setCatalogFilter('ajustes')}
          className={`min-h-[56px] px-4 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
            catalogFilter === 'ajustes'
              ? 'bg-emerald-700 text-white border-2 border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
          }`}
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Ajustes ({adjustmentPieces.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setCatalogFilter('publicadas')}
          className={`min-h-[56px] px-4 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
            catalogFilter === 'publicadas'
              ? 'bg-emerald-700 text-white border-2 border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Publicadas ({publishedPieces.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setCatalogFilter('todas')}
          className={`min-h-[56px] px-4 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
            catalogFilter === 'todas'
              ? 'bg-emerald-700 text-white border-2 border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
          }`}
        >
          <Box className="w-5 h-5 shrink-0" />
          <span>Todas ({realProducts.length})</span>
        </button>
      </div>

      {/* Listagem de peças */}
      <div className="space-y-6">
        {currentPieces.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center space-y-3">
            <Box className="w-12 h-12 mx-auto text-stone-400" />
            <p className="text-xl font-black text-stone-900 dark:text-white">
              {catalogFilter === 'aguardando'
                ? 'Nenhuma peça aguardando aprovação no momento.'
                : catalogFilter === 'ajustes'
                  ? 'Nenhuma peça aguardando correção do artesão.'
                  : catalogFilter === 'publicadas'
                    ? 'Nenhuma peça publicada ainda.'
                    : 'Nenhuma peça cadastrada.'}
            </p>
            <p className="text-base text-stone-600 dark:text-stone-400 font-medium">
              Novas criações enviadas pelos artesãos aparecerão nesta lista.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {currentPieces.map((product) => {
              const isWaiting = product.status === 'em_revisao';
              const isAdjusting = adjustingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="w-full h-full bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 relative">
                      <ProductImage src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      {!product.isAvailable && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white text-sm font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                          Esgotado
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white line-clamp-2 break-words leading-snug">
                        {product.title}
                      </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price || 0)}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-stone-700 dark:text-stone-300">
                        Por: <span className="font-black text-stone-900 dark:text-white">{product.artist}</span>
                      </p>
                    </div>

                    {product.technique && (
                      <p className="text-base font-semibold text-stone-600 dark:text-stone-400">
                        Técnica: {product.technique}
                      </p>
                    )}

                    <div className="pt-1">
                      {product.status === 'em_revisao' ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-base font-black bg-amber-100 text-amber-950 dark:bg-amber-950/80 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-700">
                          <Clock className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
                          <span>Aguardando Aprovação</span>
                        </span>
                      ) : product.status === 'ajuste_solicitado' ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-base font-black bg-orange-100 text-orange-950 dark:bg-orange-950/80 dark:text-orange-200 border-2 border-orange-300 dark:border-orange-700">
                          <AlertCircle className="w-5 h-5 text-orange-700 dark:text-orange-400 shrink-0" />
                          <span>Ajuste Solicitado</span>
                        </span>
                      ) : product.status === 'publicado' ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-base font-black bg-emerald-100 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>Publicada</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-base font-black bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 border-2 border-stone-300 dark:border-stone-700">
                          <Edit3 className="w-5 h-5 text-stone-600 dark:text-stone-400 shrink-0" />
                          <span>Rascunho</span>
                        </span>
                      )}
                    </div>

                      {product.adjustmentFeedback && (
                        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-300 dark:border-orange-800 text-base font-semibold text-orange-950 dark:text-orange-200">
                          <strong className="font-black">Observação enviada:</strong> {product.adjustmentFeedback}
                        </div>
                      )}
                    </div>
                  </div>

                  {isWaiting && (
                    <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          disabled={processingProductId === product.id}
                          onClick={() => onApprovePiece(product)}
                          className="flex-1 min-h-[56px] px-5 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <CheckCircle2 className="w-6 h-6 shrink-0" />
                          <span>{processingProductId === product.id ? 'Processando...' : 'Aprovar'}</span>
                        </button>

                        <button
                          type="button"
                          disabled={processingProductId === product.id}
                          onClick={() => {
                            if (isAdjusting) {
                              setAdjustingProductId(null);
                              setAdjustmentReason('');
                            } else {
                              setAdjustingProductId(product.id);
                              setAdjustmentReason(product.adjustmentFeedback || '');
                            }
                          }}
                          className="flex-1 min-h-[56px] px-5 py-3.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 disabled:opacity-60 disabled:cursor-not-allowed text-amber-950 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600 font-black text-base sm:text-lg rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <Edit3 className="w-6 h-6 text-amber-700 dark:text-amber-400 shrink-0" />
                          <span>Pedir ajuste</span>
                        </button>
                      </div>

                      {isAdjusting && (
                        <div className="p-4 sm:p-5 bg-amber-50/90 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-600 rounded-2xl space-y-3 animate-in fade-in">
                          <label
                            htmlFor={`adjust-${product.id}`}
                            className="block text-base sm:text-lg font-black text-amber-950 dark:text-amber-100"
                          >
                            O que precisa mudar?
                          </label>
                          <textarea
                            id={`adjust-${product.id}`}
                            rows={3}
                            value={adjustmentReason}
                            onChange={(e) => setAdjustmentReason(e.target.value)}
                            placeholder="Descreva o que o artesão precisa ajustar (ex: foto mais nítida, ajustar preço, conferir descrição)..."
                            className="w-full p-3.5 rounded-xl border-2 border-amber-400 dark:border-amber-600 bg-white dark:bg-stone-900 text-base text-stone-900 dark:text-white font-medium placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20"
                          />
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="button"
                              disabled={processingProductId === product.id}
                              onClick={() => onSendAdjustment(product.id)}
                              className="flex-1 min-h-[56px] px-5 py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                            >
                              <Send className="w-5 h-5 shrink-0" />
                              <span>{processingProductId === product.id ? 'Enviando...' : 'Enviar pedido'}</span>
                            </button>
                            <button
                              type="button"
                              disabled={processingProductId === product.id}
                              onClick={() => {
                                setAdjustingProductId(null);
                                setAdjustmentReason('');
                              }}
                              className="min-h-[56px] px-5 py-3 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-black text-base rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <X className="w-5 h-5 shrink-0" />
                              <span>Cancelar</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
