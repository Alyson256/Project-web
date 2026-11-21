import React from 'react';
import type { ProductItem } from '../../../types';
import { ProductImage } from '../..';

interface ProducerCatalogViewProps {
  allProducts: ProductItem[];
}

export const ProducerCatalogView: React.FC<ProducerCatalogViewProps> = ({ allProducts }) => {
  const publicProducts = allProducts.filter((p) => !p.isTraining && p.status === 'publicado');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 motion-reduce:animate-none">
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Vitrine Rosa Mística
          </h1>
          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium max-w-2xl mt-1 leading-relaxed">
            Veja como as peças da nossa associação estão expostas para o público. A gente cuida de cada detalhe com carinho.
          </p>
        </div>
        <div className="px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-extrabold text-sm sm:text-base border border-stone-200 dark:border-stone-700 shrink-0 tabular-nums">
          {publicProducts.length} peças na vitrine
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {publicProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md"
          >
            <div>
              <div className="relative aspect-[16/10] bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <ProductImage
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                      product.isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {product.isAvailable ? 'Em Exposição' : 'Esgotado'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-xl font-black text-stone-900 dark:text-white leading-tight truncate" title={product.title}>
                  {product.title}
                </h3>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  Autoria: {product.artist}
                </p>
                {product.technique && (
                  <p className="text-xs font-bold text-stone-600 dark:text-stone-400">
                    Técnica: {product.technique}
                  </p>
                )}
                {product.description && (
                  <p className="text-sm text-stone-600 dark:text-stone-300 font-medium line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-stone-100 dark:border-stone-800 mt-2">
              <div className="flex items-baseline justify-between pt-3">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">Valor sugerido</span>
                <span className="text-xl font-black text-stone-900 dark:text-white tabular-nums">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price || 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
