import React, { useRef } from 'react';
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  Loader2,
  Lock,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { useLanguage, useToast } from '../../../contexts';
import { PrivacyWarning } from '../shared';

interface ProductRegistrationWizardProps {
  isTraining: boolean;
  isTrainingLimitReached: boolean;
  isSubmittingProduct: boolean;
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
  onSubmit: (e: React.FormEvent) => void;
}

export const ProductRegistrationWizard: React.FC<ProductRegistrationWizardProps> = ({
  isTraining,
  isTrainingLimitReached,
  isSubmittingProduct,
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
  onSubmit,
}) => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      id="form-cadastro-4-passos"
      className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl shadow-sm border-2 border-green-500 dark:border-green-600 scroll-mt-24 animate-in fade-in motion-reduce:animate-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center text-green-700 dark:text-green-400">
            <Plus className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              {isTraining ? 'Cadastrar Peça de Treino' : t('dash.nova_peca')}
            </h2>
            <p className="text-[18px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              Passo {registrationStep} de 4
            </p>
          </div>
        </div>

        {/* Marcadores de Passos 1 a 4 */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRegistrationStep(s as 1 | 2 | 3 | 4)}
              className={`w-11 h-11 rounded-full font-black text-base flex items-center justify-center transition-colors cursor-pointer ${
                registrationStep === s
                  ? 'bg-green-700 text-white shadow-md ring-4 ring-green-100 dark:ring-green-900'
                  : registrationStep > s
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                    : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
              }`}
              aria-label={`Ir para passo ${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* PASSO 1: FOTO DA PEÇA */}
        {registrationStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <span className="block text-[18px] font-black text-stone-900 dark:text-white mb-2">
                Passo 1: Foto da Peça
              </span>
              <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed mb-4">
                Tire uma foto bem iluminada da sua peça de artesanato ou escolha uma imagem do seu aparelho.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              aria-label="Escolher foto da peça"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                void onSelectProductImage(file);
                e.target.value = '';
              }}
              className="sr-only"
            />

            {newProductImage ? (
              <div className="border-2 border-emerald-500 dark:border-emerald-600 rounded-3xl p-4 sm:p-5 bg-stone-50 dark:bg-stone-800/50 space-y-4">
                <div className="w-full max-w-md mx-auto aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-900 border border-stone-300 dark:border-stone-700">
                  <img
                    src={newProductImage}
                    alt="Prévia da peça selecionada"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    disabled={isProcessingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[56px] px-6 py-3 rounded-2xl border-2 border-emerald-600 bg-white dark:bg-stone-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-black text-base inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-5 h-5 shrink-0" />
                    <span>Trocar foto</span>
                  </button>
                  <button
                    type="button"
                    disabled={isProcessingImage}
                    onClick={onRemoveProductImage}
                    className="min-h-[56px] px-6 py-3 rounded-2xl border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-800 dark:text-red-200 font-black text-base inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5 shrink-0" />
                    <span>Remover foto</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-4 border-dashed border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-stone-50 dark:bg-stone-800/40 hover:border-green-600 transition-colors space-y-4">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-700 dark:text-green-400">
                  {isProcessingImage ? (
                    <Loader2 className="w-10 h-10 animate-spin" />
                  ) : (
                    <Camera className="w-10 h-10" />
                  )}
                </div>
                <div>
                  <span className="text-xl font-black text-stone-900 dark:text-white block mb-1">
                    {isProcessingImage ? 'Preparando sua foto...' : 'Nenhuma foto escolhida ainda'}
                  </span>
                  <span className="text-[17px] text-stone-600 dark:text-stone-400 font-medium">
                    Toque no botão abaixo para tirar foto ou escolher da galeria.
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isProcessingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[56px] px-7 py-3.5 bg-white dark:bg-stone-900 border-2 border-emerald-700 dark:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 rounded-2xl font-black text-[18px] inline-flex items-center justify-center gap-2.5 shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <Upload className="w-5 h-5 shrink-0" />
                  <span>Escolher Foto da Peça</span>
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={isProcessingImage}
              onClick={() => setRegistrationStep(2)}
              className="w-full min-h-[56px] h-14 bg-green-700 hover:bg-green-800 text-white font-extrabold text-[18px] rounded-2xl flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              <span>{newProductImage ? 'Avançar para Nome e Técnica' : 'Continuar sem foto por enquanto'}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* PASSO 2: NOME E TÉCNICA */}
        {registrationStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="block text-[18px] font-black text-stone-900 dark:text-white mb-1">
                Passo 2: Nome e Técnica da Peça
              </span>
              <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                Diga como se chama sua criação e que tipo de trabalho manual você utilizou.
              </p>
            </div>

            <div>
              <label className="block text-[18px] font-extrabold text-stone-900 dark:text-white mb-2">
                Título ou Nome da Peça
              </label>
              <input
                type="text"
                aria-label="Título ou Nome da Peça"
                placeholder="Ex: Vaso de Barro Rústico, Toalha Rendada"
                value={newProductTitle}
                onChange={(e) => setNewProductTitle(e.target.value)}
                className="w-full min-h-[56px] px-5 py-3.5 border-2 border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-800 text-[18px] font-bold text-stone-900 dark:text-white focus:outline-none focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-[18px] font-extrabold text-stone-900 dark:text-white mb-2">
                Técnica Usada no Artesanato
              </label>
              <input
                type="text"
                aria-label="Técnica Usada no Artesanato"
                placeholder="Ex: Cerâmica Modelada, Renda de Bilro, Macramê"
                value={newProductTechnique}
                onChange={(e) => setNewProductTechnique(e.target.value)}
                className="w-full min-h-[56px] px-5 py-3.5 border-2 border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-800 text-[18px] font-bold text-stone-900 dark:text-white focus:outline-none focus:border-green-600"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRegistrationStep(1)}
                className="min-h-[56px] h-14 flex-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-extrabold text-[18px] rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
                <span>Voltar ao Passo 1</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newProductTitle.trim()) {
                    addToast('Por favor, informe o nome da peça.', 'info');
                    return;
                  }
                  setRegistrationStep(3);
                }}
                className="min-h-[56px] h-14 flex-1 bg-green-700 hover:bg-green-800 text-white font-extrabold text-[18px] rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <span>Avançar para Estoque e Preço</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 3: ESTOQUE E PREÇO */}
        {registrationStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="block text-[18px] font-black text-stone-900 dark:text-white mb-1">
                Passo 3: Quantidade e Preço
              </span>
              <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                Quantas peças você tem prontas e qual o valor sugerido para venda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[18px] font-extrabold text-stone-900 dark:text-white mb-2">
                  Quantidade em Estoque
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const curr = parseInt(newProductStock, 10) || 1;
                      setNewProductStock(String(Math.max(1, curr - 1)));
                    }}
                    className="w-16 min-h-[56px] h-14 rounded-2xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-black text-2xl flex items-center justify-center cursor-pointer"
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    aria-label="Quantidade em Estoque"
                    min="1"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="flex-1 min-h-[56px] text-center border-2 border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-800 text-2xl font-black text-stone-900 dark:text-white focus:outline-none focus:border-green-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const curr = parseInt(newProductStock, 10) || 1;
                      setNewProductStock(String(curr + 1));
                    }}
                    className="w-16 min-h-[56px] h-14 rounded-2xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-black text-2xl flex items-center justify-center cursor-pointer"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[18px] font-extrabold text-stone-900 dark:text-white mb-2">
                  Preço em Reais (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-stone-600 dark:text-stone-400">
                    R$
                  </span>
                  <input
                    type="number"
                    aria-label="Preço do novo produto em Reais"
                    min="1"
                    step="0.01"
                    placeholder="0,00"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full min-h-[56px] pl-14 pr-5 py-3.5 border-2 border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-800 text-[20px] font-black text-stone-900 dark:text-white focus:outline-none focus:border-green-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRegistrationStep(2)}
                className="min-h-[56px] h-14 flex-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-extrabold text-[18px] rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
                <span>Voltar ao Passo 2</span>
              </button>
              <button
                type="button"
                onClick={() => setRegistrationStep(4)}
                className="min-h-[56px] h-14 flex-1 bg-green-700 hover:bg-green-800 text-white font-extrabold text-[18px] rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <span>Avançar para Salvar</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 4: RESUMO E SALVAR */}
        {registrationStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="block text-[18px] font-black text-stone-900 dark:text-white mb-1">
                {isTraining
                  ? 'Passo 4: Descrição e Confirmação'
                  : 'Passo 4: Descrição e Envio para Análise'}
              </span>
              <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                {isTraining
                  ? 'Escreva um detalhe especial sobre a peça e confirme para salvar em modo treino.'
                  : 'Escreva um detalhe especial sobre a peça e envie para aprovação da gestão antes de aparecer na vitrine.'}
              </p>
            </div>

            <div>
              <label className="block text-[18px] font-extrabold text-stone-900 dark:text-white mb-2">
                História ou Detalhes da Peça (opcional)
              </label>
              <textarea
                aria-label="Descrição da nova peça"
                placeholder="Conte como esta peça foi feita ou o que ela representa..."
                value={newProductDescription}
                onChange={(e) => setNewProductDescription(e.target.value)}
                className="w-full min-h-[120px] p-5 border-2 border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-800 text-[18px] text-stone-900 dark:text-white focus:outline-none focus:border-green-600 resize-none font-medium"
              />
            </div>

            {/* Resumo da peça */}
            <div className="p-5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border-2 border-stone-200 dark:border-stone-700 space-y-2">
              <span className="text-sm font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                {isTraining ? 'Resumo da sua peça de treino' : 'Resumo da peça para análise'}
              </span>
              <div className="flex justify-between items-center text-[18px]">
                <span className="font-bold text-stone-700 dark:text-stone-300">Foto:</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {newProductImage ? 'Foto anexada' : 'Sem foto no momento'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[18px]">
                <span className="font-bold text-stone-700 dark:text-stone-300">Peça:</span>
                <span className="font-black text-stone-900 dark:text-white">
                  {newProductTitle || 'Peça sem título'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[18px]">
                <span className="font-bold text-stone-700 dark:text-stone-300">Técnica:</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {newProductTechnique || 'Tradicional'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[18px]">
                <span className="font-bold text-stone-700 dark:text-stone-300">Estoque / Preço:</span>
                <span className="font-black text-emerald-700 dark:text-emerald-400">
                  {newProductStock} unid. • R$ {parseFloat(newProductPrice || '0').toFixed(2)}
                </span>
              </div>
            </div>

            <PrivacyWarning />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRegistrationStep(3)}
                className="min-h-[56px] h-14 flex-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-extrabold text-[18px] rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
                <span>Voltar ao Passo 3</span>
              </button>

              <button
                type="submit"
                disabled={isTrainingLimitReached || isSubmittingProduct}
                aria-busy={isSubmittingProduct}
                aria-label={isTraining ? 'Salvar peça de treino' : 'Enviar peça para análise da gestão'}
                className={`min-h-[56px] h-14 flex-1 rounded-2xl font-black text-[18px] flex items-center justify-center gap-2 shadow-md transition-all ${
                  isTrainingLimitReached || isSubmittingProduct
                    ? 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-300 cursor-not-allowed'
                    : 'bg-green-700 hover:bg-green-800 text-white cursor-pointer active:scale-[0.99]'
                }`}
              >
                {isTrainingLimitReached ? (
                  <>
                    <Lock className="w-6 h-6 shrink-0" />
                    <span>Limite de 5 peças atingido</span>
                  </>
                ) : isSubmittingProduct ? (
                  <>
                    <Loader2 className="w-6 h-6 shrink-0 animate-spin" />
                    <span>{isTraining ? 'Salvando...' : 'Enviando para análise...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6 shrink-0" />
                    <span>{isTraining ? 'Salvar Peça de Treino' : 'Enviar para Análise da Gestão'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
