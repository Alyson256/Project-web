import React, { Suspense, lazy } from 'react';
import {
  AlertCircle,
  Box,
  CheckCircle2,
  Clock,
  Edit2,
  Leaf,
  Lock,
  Plus,
  Printer,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import type { ProducerProductFilter } from '../../../hooks';
import type { ProductItem } from '../../../types';
import { ProductImage } from '../..';
import { DashboardSectionFallback } from '../shared';

const ProductRegistrationWizard = lazy(() =>
  import('./ProductRegistrationWizard').then((m) => ({ default: m.ProductRegistrationWizard }))
);

interface ProducerProductGridProps {
  isTraining: boolean;
  isTrainingLimitReached: boolean;
  isAddingProduct: boolean;
  isSubmittingProduct: boolean;
  onToggleAddProduct: () => void;
  onOpenAddProduct: () => void;
  onPrint: () => void;
  productFilter: ProducerProductFilter;
  setProductFilter: (filter: ProducerProductFilter) => void;
  myProducts: ProductItem[];
  availableProducts: ProductItem[];
  attentionProducts: ProductItem[];
  adjustmentProducts: ProductItem[];
  outOfStockProducts: ProductItem[];
  filteredMyProducts: ProductItem[];
  registrationStep: 1 | 2 | 3 | 4;
  setRegistrationStep: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4>>;
  newProductImage: string;
  isProcessingImage: boolean;
  onSelectProductImage: (file: File | null) => void;
  onRemoveProductImage: () => void;
  newProductTitle: string;
  setNewProductTitle: React.Dispatch<React.SetStateAction<string>>;
  newProductTechnique: string;
  setNewProductTechnique: React.Dispatch<React.SetStateAction<string>>;
  newProductDescription: string;
  setNewProductDescription: React.Dispatch<React.SetStateAction<string>>;
  newProductStock: string;
  setNewProductStock: React.Dispatch<React.SetStateAction<string>>;
  newProductPrice: string;
  setNewProductPrice: React.Dispatch<React.SetStateAction<string>>;
  onAddProduct: (e: React.FormEvent) => void;
  editingProductId: number | null;
  setEditingProductId: React.Dispatch<React.SetStateAction<number | null>>;
  editFormData: { title: string; technique: string; price: string };
  setEditFormData: React.Dispatch<React.SetStateAction<{ title: string; technique: string; price: string }>>;
  onStartEditingProduct: (product: ProductItem) => void;
  onSaveProductEdit: (e: React.FormEvent, product: ProductItem) => void;
  onUpdateStock: (productId: number, delta: number) => void;
  onRequestDeleteProduct: (product: ProductItem) => void;
}

export const ProducerProductGrid: React.FC<ProducerProductGridProps> = ({
  isTraining,
  isTrainingLimitReached,
  isAddingProduct,
  isSubmittingProduct,
  onToggleAddProduct,
  onOpenAddProduct,
  onPrint,
  productFilter,
  setProductFilter,
  myProducts,
  availableProducts,
  attentionProducts,
  adjustmentProducts,
  outOfStockProducts,
  filteredMyProducts,
  registrationStep,
  setRegistrationStep,
  newProductImage,
  isProcessingImage,
  onSelectProductImage,
  onRemoveProductImage,
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
  onAddProduct,
  editingProductId,
  setEditingProductId,
  editFormData,
  setEditFormData,
  onStartEditingProduct,
  onSaveProductEdit,
  onUpdateStock,
  onRequestDeleteProduct,
}) => {
  return (
    <>
      <div
        id="meus-produtos"
        className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-5 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
              <Box className="w-8 h-8 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
              <span>Meus Produtos</span>
            </h2>
            <p className="text-base sm:text-[18px] text-stone-700 dark:text-stone-300 font-medium mt-1">
              {isTraining
                ? 'Gerencie suas peças de prática no espaço de treinamento.'
                : 'Gerencie estoque, preços e atualizações para o Departamento de Vendas Rosa Mística.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              data-tour="aprendiz-add-product"
              onClick={onToggleAddProduct}
              disabled={isTrainingLimitReached}
              aria-label={
                isTrainingLimitReached
                  ? 'Limite de 5 peças de treino atingido'
                  : isAddingProduct
                    ? 'Fechar formulário de cadastro'
                    : 'Adicionar produto'
              }
              className={`min-h-[56px] px-7 py-3.5 rounded-2xl font-black text-[18px] flex items-center justify-center gap-3 shadow-md transition-colors cursor-pointer w-full sm:w-auto ${
                isTrainingLimitReached
                  ? 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-400 cursor-not-allowed opacity-70'
                  : isAddingProduct
                    ? 'bg-stone-800 hover:bg-stone-700 text-white'
                    : 'bg-green-700 hover:bg-green-800 text-white'
              }`}
              title={isTrainingLimitReached ? 'Limite de 5 peças de treino atingido' : undefined}
            >
              {isTrainingLimitReached ? (
                <>
                  <Lock className="w-6 h-6" />
                  <span>Limite de 5 peças</span>
                </>
              ) : isAddingProduct ? (
                <>
                  <X className="w-6 h-6" />
                  <span>Fechar Cadastro</span>
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  <span>Adicionar produto</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="min-h-[56px] px-6 py-3.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 rounded-2xl font-extrabold text-[18px] flex items-center justify-center gap-2 transition-colors cursor-pointer no-print shadow-xs w-full sm:w-auto"
            >
              <Printer className="w-5 h-5" />
              <span>Imprimir (PDF)</span>
            </button>
          </div>
        </div>

        {myProducts.length > 0 && (
          <div
            className="flex flex-wrap gap-2 pt-4 border-t border-stone-100 dark:border-stone-800"
            role="group"
            aria-label="Filtrar meus produtos por estado"
          >
            {(
              [
                { id: 'todas', label: `Todas (${myProducts.length})` },
                { id: 'disponiveis', label: `Disponíveis (${availableProducts.length})` },
                { id: 'atencao', label: `Revisão e Ajustes (${attentionProducts.length})` },
                { id: 'esgotadas', label: `Esgotadas (${outOfStockProducts.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProductFilter(tab.id)}
                className={`min-h-[44px] px-4 py-2 rounded-2xl font-extrabold text-sm sm:text-base transition-colors cursor-pointer tabular-nums ${
                  productFilter === tab.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : tab.id === 'atencao' && adjustmentProducts.length > 0
                      ? 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-700'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isAddingProduct && !isTrainingLimitReached && (
        <Suspense fallback={<DashboardSectionFallback />}>
          <ProductRegistrationWizard
            isTraining={isTraining}
            isTrainingLimitReached={isTrainingLimitReached}
            isSubmittingProduct={isSubmittingProduct}
            registrationStep={registrationStep}
            setRegistrationStep={setRegistrationStep}
            newProductImage={newProductImage}
            isProcessingImage={isProcessingImage}
            onSelectProductImage={onSelectProductImage}
            onRemoveProductImage={onRemoveProductImage}
            newProductTitle={newProductTitle}
            setNewProductTitle={setNewProductTitle}
            newProductTechnique={newProductTechnique}
            setNewProductTechnique={setNewProductTechnique}
            newProductDescription={newProductDescription}
            setNewProductDescription={setNewProductDescription}
            newProductStock={newProductStock}
            setNewProductStock={setNewProductStock}
            newProductPrice={newProductPrice}
            setNewProductPrice={setNewProductPrice}
            onSubmit={onAddProduct}
          />
        </Suspense>
      )}

      <div data-tour="aprendiz-products-section" className="space-y-4">
        {myProducts.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-12 border-2 border-dashed border-stone-300 dark:border-stone-700 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300 mx-auto">
              <Box className="w-8 h-8" />
            </div>
            <p className="text-2xl font-black text-stone-800 dark:text-stone-200">
              Você ainda não tem peças cadastradas.
            </p>
            <p className="text-[18px] text-stone-600 dark:text-stone-400 max-w-md mx-auto">
              {isTraining
                ? 'Clique no botão grande "Adicionar produto" acima para praticar o cadastro em 4 passos!'
                : 'Cadastre sua primeira peça para o Departamento de Vendas Rosa Mística da nossa associação.'}
            </p>
            {!isTrainingLimitReached && (
              <button
                type="button"
                onClick={onOpenAddProduct}
                className="min-h-[56px] px-8 py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-black text-[18px] inline-flex items-center gap-2.5 cursor-pointer shadow-md"
              >
                <Plus className="w-6 h-6" />
                <span>Adicionar produto</span>
              </button>
            )}
          </div>
        ) : filteredMyProducts.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-stone-200 dark:border-stone-800 text-center space-y-4">
            <p className="text-xl font-black text-stone-900 dark:text-white">
              Nenhuma peça encontrada neste filtro.
            </p>
            <button
              type="button"
              onClick={() => setProductFilter('todas')}
              className="min-h-[48px] px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black text-base cursor-pointer"
            >
              Mostrar todas as peças ({myProducts.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {filteredMyProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-xs hover:shadow-md border-2 flex flex-col justify-between transition-shadow ${
                  product.status === 'ajuste_solicitado'
                    ? 'border-orange-300 dark:border-orange-700'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                <div className="relative h-56 sm:h-64 bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0">
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                  />
                  <div className="absolute top-3 right-3">
                    {product.isTraining ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-700 font-extrabold text-xs shadow-xs">
                        <Leaf className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                        <span>Treino</span>
                      </span>
                    ) : product.status === 'ajuste_solicitado' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/90 text-orange-950 dark:text-orange-200 border border-orange-400 dark:border-orange-700 font-extrabold text-xs shadow-xs">
                        <AlertCircle className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400 shrink-0" />
                        <span>Ajuste solicitado</span>
                      </span>
                    ) : product.status === 'em_revisao' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border border-amber-400 dark:border-amber-700 font-extrabold text-xs shadow-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                        <span>Em revisão</span>
                      </span>
                    ) : product.status === 'rascunho' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-extrabold text-xs shadow-xs">
                        <Edit2 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400 shrink-0" />
                        <span>Rascunho</span>
                      </span>
                    ) : !product.isAvailable || product.stock <= 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs shadow-xs">
                        <span>Esgotado</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white font-extrabold text-xs shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Publicado</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  {editingProductId === product.id ? (
                    <form className="space-y-4" onSubmit={(e) => onSaveProductEdit(e, product)}>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">
                          Título
                        </label>
                        <input
                          type="text"
                          aria-label="Editar título do produto"
                          value={editFormData.title}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
                          className="w-full min-h-[48px] px-3.5 py-2 border-2 border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-800 text-base font-bold text-stone-900 dark:text-white"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                            Técnica
                          </label>
                          <input
                            type="text"
                            aria-label="Editar técnica do produto"
                            value={editFormData.technique}
                            onChange={(e) => setEditFormData((prev) => ({ ...prev, technique: e.target.value }))}
                            className="w-full min-h-[48px] px-3 py-2 border-2 border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-800 text-sm font-medium text-stone-900 dark:text-white focus:outline-none focus:border-emerald-600"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                            Preço (R$)
                          </label>
                          <input
                            type="number"
                            aria-label="Editar preço do produto"
                            value={editFormData.price}
                            onChange={(e) => setEditFormData((prev) => ({ ...prev, price: e.target.value }))}
                            step="0.01"
                            min="0"
                            className="w-full min-h-[48px] px-3 py-2 border-2 border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-800 text-sm font-bold text-stone-900 dark:text-white tabular-nums focus:outline-none focus:border-emerald-600"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="min-h-[48px] px-4 py-2 text-stone-700 dark:text-stone-300 font-extrabold text-sm hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="min-h-[48px] px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>{product.status === 'ajuste_solicitado' ? 'Salvar e reenviar' : 'Salvar'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-black text-xl text-stone-900 dark:text-white line-clamp-1 leading-snug">
                            {product.title}
                          </h3>
                          <span className="font-black text-xl text-emerald-700 dark:text-emerald-400 whitespace-nowrap tabular-nums">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                              product.price || 0
                            )}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                          Técnica: <strong className="text-stone-900 dark:text-white font-bold">{product.technique}</strong>
                        </p>
                        {product.description && (
                          <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                        {product.status === 'ajuste_solicitado' && (
                          <div className="text-xs sm:text-sm font-bold text-orange-950 dark:text-orange-200 bg-orange-50 dark:bg-orange-950/40 px-3.5 py-2.5 rounded-xl border border-orange-300 dark:border-orange-700 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Ajuste pedido:</strong>{' '}
                              {product.adjustmentFeedback || 'Revise os dados e salve para reenviar.'}
                            </span>
                          </div>
                        )}
                        {product.status === 'em_revisao' && (
                          <p className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                            <span>Em revisão pela gestão — edição travada até análise.</span>
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                            Estoque disponível:
                          </span>
                          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700">
                            <button
                              type="button"
                              aria-label="Diminuir estoque"
                              disabled={product.status === 'em_revisao'}
                              onClick={() => onUpdateStock(product.id, -1)}
                              className="w-11 h-11 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed font-black text-lg flex items-center justify-center cursor-pointer transition-colors"
                            >
                              −
                            </button>
                            <span className="px-3 font-black text-base min-w-[2.5rem] text-center tabular-nums text-stone-900 dark:text-white">
                              {product.stock}
                            </span>
                            <button
                              type="button"
                              aria-label="Aumentar estoque"
                              disabled={product.status === 'em_revisao'}
                              onClick={() => onUpdateStock(product.id, 1)}
                              className="w-11 h-11 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed font-black text-lg flex items-center justify-center cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={product.status === 'em_revisao'}
                            onClick={() => onStartEditingProduct(product)}
                            className="min-h-[48px] px-3.5 py-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>{product.status === 'ajuste_solicitado' ? 'Corrigir' : 'Editar'}</span>
                          </button>
                          <button
                            type="button"
                            disabled={product.status === 'em_revisao'}
                            onClick={() => onRequestDeleteProduct(product)}
                            className="min-h-[48px] px-3.5 py-2 text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
