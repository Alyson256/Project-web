import { Check, CheckCircle2 } from 'lucide-react';
import { ProductImage } from '../../ProductImage';

export interface TraineeGestorApproveTabProps {
  samplePieceApproved: boolean;
  onApprovePiece: () => void;
}

export function TraineeGestorApproveTab({
  samplePieceApproved,
  onApprovePiece,
}: TraineeGestorApproveTabProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 mb-2">
          <span>Exemplo de Treino</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Aprovar uma peça de exemplo
        </h3>
        <p className="text-lg text-stone-700 dark:text-stone-300 font-medium mt-1">
          Veja como a gente confere e aprova as peças antes de irem para a vitrine Rosa Mística.
        </p>
      </div>

      <div
        data-tour="gestor-approve-card"
        className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700 shrink-0">
            <ProductImage
              src="https://images.unsplash.com/photo-1610719875508-36f731118182?auto=format&fit=crop&q=80&w=200"
              alt="Vaso de Barro"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-black text-stone-900 dark:text-white">
                Vaso de Barro Artesanal
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                Exemplo
              </span>
            </div>
            <p className="text-base font-bold text-emerald-800 dark:text-emerald-400">
              Autora: Dona Laura • Técnica: Argila Vermelha
            </p>
            <p className="text-lg font-black text-stone-900 dark:text-white">
              R$ 65,00
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          {samplePieceApproved ? (
            <div className="min-h-[56px] px-6 py-3 rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-black text-lg flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
              <span>Aprovada na simulação (✓)</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onApprovePiece}
              className="w-full min-h-[56px] px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg inline-flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Publicar (simulação)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
