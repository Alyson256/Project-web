import React from 'react';
import { Search, Leaf, Clock, Check, MessageCircle, UserCheck } from 'lucide-react';
import { useLanguage } from '../../contexts';
import { type ShowcaseProduct, formatCategoryName, getTranslatedProduct } from '../../data';
import { ProductImage } from '../ProductImage';
import { getArtistPhoto } from '../../lib';
import { LandingShowcaseSkeleton } from './LandingSkeletons';

export interface LandingShowcaseProps {
  products: ShowcaseProduct[];
  filteredProducts: ShowcaseProduct[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  availableCategories: string[];
  sortOption: 'recent' | 'price_asc' | 'price_desc';
  setSortOption: (option: 'recent' | 'price_asc' | 'price_desc') => void;
  isAuthenticated: boolean;
  isSellerAvailable: boolean;
  interestId: number | null;
  onSelectProductDetail: (product: ShowcaseProduct) => void;
  onInitiateSellerContact: (product: ShowcaseProduct) => void;
  onNavigateLogin: () => void;
  isLoading?: boolean;
}

export function LandingShowcase({
  products,
  filteredProducts,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  availableCategories,
  sortOption,
  setSortOption,
  isAuthenticated,
  isSellerAvailable,
  interestId,
  onSelectProductDetail,
  onInitiateSellerContact,
  onNavigateLogin,
  isLoading = false
}: LandingShowcaseProps) {
  const { t, language } = useLanguage();

  return (
    <section id="vitrine" className="bg-stone-100 dark:bg-stone-900/50 py-20 md:py-28 border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white tracking-tight mb-4">
            {t('vitrine.title', 'Vitrine Rosa Mística')}
          </h2>
          <p className="text-xl sm:text-2xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('vitrine.subtitle', 'Produtos disponíveis no nosso departamento de vendas Rosa Mística, aqui na Associação Julieta Barros. A gente cuida de cada peça e você combina tudo direto com quem produziu.')}
          </p>
        </div>

        {/* Esqueleto de carregamento ou Conteúdo da Vitrine */}
        {isLoading && products.length === 0 ? (
          <LandingShowcaseSkeleton />
        ) : (
          <>
            {/* Busca e Filtros Rápidos */}
            {products.length > 0 && (
              <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-stone-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full min-h-[56px] pl-14 pr-5 py-3.5 border-2 border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-900 placeholder-stone-400 text-stone-900 dark:text-white text-lg font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-600 transition-colors shadow-xs"
                    placeholder={t('vitrine.search_placeholder', 'Buscar peça, técnica ou artesão...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {availableCategories.map((filter) => (
                      <button
                        key={filter} 
                        type="button"
                        onClick={() => setActiveFilter(filter)} 
                        className={`min-h-[44px] px-5 py-2 rounded-xl font-bold text-base transition-colors border cursor-pointer ${
                          activeFilter === filter 
                            ? 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-900 dark:border-white shadow-xs' 
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300 dark:bg-stone-950 dark:text-stone-300 dark:border-stone-800'
                        }`}
                      >
                        {formatCategoryName(filter, language)}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-800 pt-3 sm:pt-0 sm:pl-6">
                    <span className="text-base font-bold text-stone-500 dark:text-stone-400 whitespace-nowrap">
                      {t('vitrine.sort_label', 'Ordenar:')}
                    </span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as any)} 
                      className="w-full sm:w-auto bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2 text-base font-bold text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="recent">{t('vitrine.sort_recent', 'Mais Recentes')}</option>
                      <option value="price_asc">{t('vitrine.sort_price_asc', 'Menor Preço')}</option>
                      <option value="price_desc">{t('vitrine.sort_price_desc', 'Maior Preço')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Grid de Produtos ou Cartão Calmo "Em breve" */}
            {products.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 sm:p-16 text-center border-2 border-stone-200 dark:border-stone-800 max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mx-auto mb-4 flex items-center justify-center border-2 border-emerald-300 dark:border-emerald-700">
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-2">
                  {t('vitrine.empty_showcase_title', 'Em breve teremos peças por aqui.')}
                </h3>
                <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 font-medium">
                  {t('vitrine.empty_showcase_desc', 'A gente está preparando novas peças feitas à mão para você.')}
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {filteredProducts.map((rawProduct) => {
              const product = getTranslatedProduct(rawProduct, language);
              return (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-md border-2 border-stone-200 dark:border-stone-800 transition-all flex flex-col group"
                >
                  {/* Imagem do Produto com Fallback Neutro */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <ProductImage 
                      src={product.image} 
                      alt={product.title} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!product.isAvailable ? 'grayscale opacity-75' : ''}`}
                    />
                    
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      {product.isAvailable ? (
                        <span className="bg-emerald-600 text-white font-black px-4 py-1.5 rounded-full text-sm shadow-md">
                          {t('vitrine.available', 'Disponível')}
                        </span>
                      ) : (
                        <span className="bg-red-600 text-white font-black px-4 py-1.5 rounded-full text-sm shadow-md">
                          {t('vitrine.sold_out', 'Esgotado')}
                        </span>
                      )}
                      <span className="bg-stone-900/80 backdrop-blur-sm text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-md">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Detalhes do Produto */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow">
                    <div 
                      className="flex-grow cursor-pointer" 
                      onClick={() => onSelectProductDetail(product)}
                    >
                      <h3 className="text-2xl font-black text-stone-900 dark:text-white mb-2 line-clamp-2 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-lg text-stone-600 dark:text-stone-400 font-medium mb-3">
                        {t('vitrine.modal_technique', 'Técnica')}: {product.technique}
                      </p>
                      <div className="text-3xl font-black text-emerald-800 dark:text-emerald-400 mb-6">
                        {new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </div>
                    </div>

                    {/* Mini perfil do artesão criador */}
                    <div className="flex items-center justify-between gap-4 mb-6 border-t border-stone-100 dark:border-stone-800 pt-5">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={product.artistPhoto || getArtistPhoto(product.artist)} 
                          alt={product.artist} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-stone-300 dark:border-stone-700 shrink-0" 
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-stone-500 uppercase block">
                            {t('vitrine.artisan_label', 'Artesão(ã)')}
                          </span>
                          <span className="font-black text-lg text-stone-800 dark:text-stone-200 truncate block">
                            {product.artist}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectProductDetail(product)}
                        className="text-base font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer shrink-0"
                      >
                        {t('vitrine.view_details', 'Ver detalhes')}
                      </button>
                    </div>

                    {/* Botão de Contato com o Vendedor (Exige Login) */}
                    {product.isAvailable && (
                      !isAuthenticated ? (
                        <div className="space-y-2 pt-1">
                          <button 
                            type="button"
                            onClick={onNavigateLogin}
                            className="w-full min-h-[56px] px-6 py-3.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 font-black text-[18px] rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs active:scale-95"
                          >
                            <UserCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-300 shrink-0" />
                            <span>{t('vitrine.login_to_contact', 'Entrar para falar com o vendedor')}</span>
                          </button>
                          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-medium text-center">
                            {t('vitrine.login_safety_note', 'Para a segurança de quem produz com a gente, entre para conversar.')}
                          </p>
                        </div>
                      ) : !(product.sellerAvailable !== undefined ? product.sellerAvailable : isSellerAvailable) ? (
                        <div className="w-full min-h-[56px] px-6 py-3.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-[18px] rounded-2xl border-2 border-stone-200 dark:border-stone-700 flex items-center justify-center gap-2.5 shadow-xs">
                          <Clock className="w-5 h-5 text-stone-500 shrink-0" />
                          <span>{t('vitrine.seller_unavailable', 'Vendedor indisponível no momento')}</span>
                        </div>
                      ) : (
                        interestId === product.id ? (
                          <div className="w-full min-h-[56px] flex items-center justify-center gap-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-black text-[18px] px-6 py-3.5 rounded-2xl border-2 border-emerald-400 dark:border-emerald-600">
                            <Check className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                            <span>{t('vitrine.contact_registered', 'Contato Registrado!')}</span>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => onInitiateSellerContact(product)}
                            className="w-full min-h-[56px] flex items-center justify-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[18px] px-6 py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            <MessageCircle className="w-6 h-6 shrink-0" />
                            <span>{t('vitrine.contact_whatsapp', 'Falar com o vendedor no WhatsApp')}</span>
                          </button>
                        )
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-stone-200 dark:border-stone-800 max-w-xl mx-auto">
            <p className="text-2xl text-stone-700 dark:text-stone-300 font-bold">
              {t('vitrine.empty_title', 'Nenhuma peça encontrada para esta busca.')}
            </p>
            <button 
              type="button"
              onClick={() => { setSearchQuery(''); setActiveFilter('Todos'); }} 
              className="mt-4 min-h-[48px] px-6 py-2.5 bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 font-black rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              {t('vitrine.empty_btn', 'Limpar busca')}
            </button>
          </div>
        )}
          </>
        )}
      </div>
    </section>
  );
}
