import { Box, Clock, MessageCircle } from 'lucide-react';
import type { ProductItem } from '../../../types';
import { ProductImage } from '../..';

export interface VisitorShowcaseTabProps {
  publicPieces: ProductItem[];
  isSellerAvailable: boolean;
  onInitiateSellerContact: (piece: ProductItem) => void;
}

export function VisitorShowcaseTab({
  publicPieces,
  isSellerAvailable,
  onInitiateSellerContact,
}: VisitorShowcaseTabProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight">
              Vitrine Rosa Mística
            </h2>
            <p className="text-sm sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1 max-w-2xl leading-relaxed">
              Peças artesanais expostas no departamento Rosa Mística. O departamento não possui WhatsApp próprio: para comprar ou tirar dúvidas sobre uma peça, fale diretamente com o vendedor pelo botão de cada produto.
            </p>
          </div>
          <div className="px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-extrabold text-xs sm:text-base border border-stone-200 dark:border-stone-700 text-center shrink-0 tabular-nums">
            {publicPieces.length === 1 ? '1 peça disponível' : `${publicPieces.length} peças disponíveis`}
          </div>
        </div>
      </div>

      {publicPieces.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border-2 border-stone-200 dark:border-stone-800">
          <Box className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-xl font-black text-stone-900 dark:text-white mb-1">
            Nenhuma peça disponível no momento
          </h3>
          <p className="text-[18px] text-stone-600 dark:text-stone-400">
            Novas peças artesanais serão publicadas em breve.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {publicPieces.map((piece) => (
            <div
              key={piece.id}
              className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md h-full"
            >
              <div>
                <div className="relative aspect-[16/10] bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <ProductImage
                    src={piece.image}
                    alt={piece.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-900/80 text-white backdrop-blur-sm">
                      {piece.technique}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                      Em Exposição
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
                    {piece.title}
                  </h3>

                  <p className="text-[16px] font-bold text-emerald-800 dark:text-emerald-400">
                    Autoria: {piece.artist}
                  </p>

                  <p className="text-[18px] text-stone-600 dark:text-stone-300 font-medium line-clamp-3 leading-relaxed">
                    {piece.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="flex items-baseline justify-between border-t border-stone-100 dark:border-stone-800 pt-4">
                  <span className="text-base font-bold text-stone-500 dark:text-stone-400">Valor Sugerido</span>
                  <span className="text-2xl font-black text-stone-900 dark:text-white">
                    R$ {(piece.price || 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {!(piece.sellerAvailable !== undefined ? piece.sellerAvailable : isSellerAvailable) ? (
                  <div className="w-full min-h-[56px] px-6 py-3.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-[18px] rounded-2xl border-2 border-stone-200 dark:border-stone-700 flex items-center justify-center gap-2.5 shadow-xs">
                    <Clock className="w-5 h-5 text-stone-500 dark:text-stone-400 shrink-0" />
                    <span>Vendedor indisponível no momento</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onInitiateSellerContact(piece)}
                    className="w-full min-h-[56px] px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-[18px] flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <MessageCircle className="w-6 h-6 shrink-0" />
                    <span>Falar com o vendedor no WhatsApp</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
