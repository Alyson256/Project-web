import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { mockAllProducts, type ShowcaseProduct } from '../data';
import {
  cooperativeApi,
  isDjangoBackendEnabled,
  readCachedStore,
  writeCachedStore,
  type CreateProductPayload,
  type UpdateProductPayload,
} from '../services';
import type { ProductItem } from '../types';
import { useAuth } from './AuthContext';

export interface ProductContextValue {
  /** Lista de peças reais vindas do backend (sem itens de sandbox de treino). */
  products: ProductItem[];
  /** Lista isolada de peças de treino para ambientes Aprendiz. */
  trainingProducts: ProductItem[];
  /** Lista unificada considerando o perfil ativo (reais + treino apenas para aprendizes). */
  allProducts: ProductItem[];
  /** Peças reais aprovadas e publicadas para a vitrine pública. */
  publishedProducts: ProductItem[];
  /** Peças publicadas já formatadas para os componentes da Vitrine Pública. */
  showcaseProducts: ShowcaseProduct[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastSyncedAt: string | null;
  refreshProducts: () => Promise<ProductItem[]>;
  createProduct: (payload: CreateProductPayload) => Promise<ProductItem>;
  updateProduct: (id: number, payload: UpdateProductPayload) => Promise<ProductItem>;
  approveProduct: (id: number) => Promise<ProductItem>;
  requestProductAdjustment: (id: number, reason: string) => Promise<ProductItem>;
  deleteProduct: (id: number) => Promise<void>;
  createTrainingProduct: (item: ProductItem) => void;
  updateTrainingProduct: (id: number, updater: (current: ProductItem) => ProductItem) => void;
  deleteTrainingProduct: (id: number) => void;
}

export const ProductContext = createContext<ProductContextValue | undefined>(undefined);

const PUBLIC_PRODUCTS_STORAGE_KEY = 'potengi_public_products';

function deduplicateRealProducts(items: ProductItem[]): ProductItem[] {
  const seen = new Set<number>();
  const result: ProductItem[] = [];
  for (const item of items) {
    if (!item || item.isTraining) continue;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

function mapProductToShowcase(product: ProductItem): ShowcaseProduct {
  return {
    id: product.id,
    title: product.title,
    technique: product.technique,
    category: (product.technique || 'Artesanato').split(' ')[0] || 'Artesanato',
    image: product.image || '',
    artist: product.artist,
    artistPhoto: product.artistPhoto,
    isAvailable: product.isAvailable,
    price: product.price || 0,
    description: product.description || '',
    sellerWhatsapp: product.sellerWhatsapp,
    sellerAvailable: product.sellerAvailable,
  };
}

function writePublicProductsSnapshot(realProducts: ProductItem[]): void {
  try {
    const publicList = realProducts
      .filter((p) => !p.isTraining && p.status === 'publicado')
      .map(mapProductToShowcase);
    localStorage.setItem(PUBLIC_PRODUCTS_STORAGE_KEY, JSON.stringify(publicList));
  } catch {
    // Ignora erros de cota do armazenamento local
  }
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, user, getIdToken } = useAuth();
  const isTrainingRole = role === 'aprendiz' || role === 'aprendiz_gestor';

  const [products, setProducts] = useState<ProductItem[]>(() => {
    const cached = readCachedStore();
    return Array.isArray(cached.products) ? deduplicateRealProducts(cached.products) : [];
  });
  const [trainingProducts, setTrainingProducts] = useState<ProductItem[]>(() =>
    mockAllProducts.filter((p) => Boolean(p.isTraining))
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Contador monotônico para evitar race conditions entre GET em voo e POST/PATCH/DELETE recentes
  const syncVersionRef = useRef<number>(0);
  const productsRef = useRef<ProductItem[]>(products);
  productsRef.current = products;

  const commitRealProducts = useCallback((nextList: ProductItem[]) => {
    const normalized = deduplicateRealProducts(nextList);
    productsRef.current = normalized;
    setProducts(normalized);
    writeCachedStore({ products: normalized });
    writePublicProductsSnapshot(normalized);
    return normalized;
  }, []);

  const refreshProducts = useCallback(async (): Promise<ProductItem[]> => {
    const requestSeq = ++syncVersionRef.current;

    if (!isDjangoBackendEnabled()) {
      const cached = readCachedStore();
      const localList = Array.isArray(cached.products) ? cached.products : [];
      const committed = commitRealProducts(localList);
      setError(null);
      setLastSyncedAt(null);
      setIsLoading(false);
      setIsSyncing(false);
      return committed;
    }

    setIsSyncing(true);
    try {
      const token = await getIdToken().catch(() => null);
      const apiProducts = await cooperativeApi.getProducts(token);
      if (requestSeq === syncVersionRef.current) {
        const committed = commitRealProducts(Array.isArray(apiProducts) ? apiProducts : []);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
        return committed;
      }
      return productsRef.current;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao sincronizar catálogo de produtos.';
      if (requestSeq === syncVersionRef.current) {
        setError(message);
      }
      return productsRef.current;
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [commitRealProducts, getIdToken]);

  useEffect(() => {
    void refreshProducts();

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        void refreshProducts();
      }
    };

    const handleConnectionRestored = () => {
      void refreshProducts();
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    window.addEventListener('potengi:sw-online', handleConnectionRestored);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      window.removeEventListener('potengi:sw-online', handleConnectionRestored);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [refreshProducts, role, user?.uid]);

  const assertCanMutateCatalog = useCallback(() => {
    if (!role || role === 'visitante') {
      throw new Error('Permissão insuficiente: visitantes não podem alterar o catálogo de produtos.');
    }
  }, [role]);

  const createProduct = useCallback(
    async (payload: CreateProductPayload): Promise<ProductItem> => {
      assertCanMutateCatalog();
      syncVersionRef.current += 1;
      setIsSyncing(true);
      try {
        const token = await getIdToken().catch(() => null);
        const created = await cooperativeApi.createProduct(payload, token);
        commitRealProducts([created, ...productsRef.current.filter((p) => p.id !== created.id)]);
        await refreshProducts();
        setError(null);
        return created;
      } finally {
        setIsSyncing(false);
      }
    },
    [assertCanMutateCatalog, commitRealProducts, getIdToken, refreshProducts]
  );

  const updateProduct = useCallback(
    async (id: number, payload: UpdateProductPayload): Promise<ProductItem> => {
      assertCanMutateCatalog();
      const existing = productsRef.current.find((p) => p.id === id);
      if (existing?.status === 'em_revisao') {
        throw new Error('Peça em revisão pela gestão — edição travada até a conclusão da análise.');
      }
      syncVersionRef.current += 1;
      setIsSyncing(true);
      try {
        const token = await getIdToken().catch(() => null);
        const updated = await cooperativeApi.updateProduct(id, payload, token);
        commitRealProducts(productsRef.current.map((p) => (p.id === id ? updated : p)));
        await refreshProducts();
        setError(null);
        return updated;
      } finally {
        setIsSyncing(false);
      }
    },
    [assertCanMutateCatalog, commitRealProducts, getIdToken, refreshProducts]
  );

  const approveProduct = useCallback(
    async (id: number): Promise<ProductItem> => {
      if (role !== 'gestor' && role !== 'adm') {
        throw new Error('Apenas gestores ou administradores podem aprovar peças.');
      }
      syncVersionRef.current += 1;
      setIsSyncing(true);
      try {
        const token = await getIdToken().catch(() => null);
        const approved = await cooperativeApi.approveProduct(id, token);
        commitRealProducts(productsRef.current.map((p) => (p.id === id ? approved : p)));
        await refreshProducts();
        setError(null);
        return approved;
      } finally {
        setIsSyncing(false);
      }
    },
    [commitRealProducts, getIdToken, refreshProducts, role]
  );

  const requestProductAdjustment = useCallback(
    async (id: number, reason: string): Promise<ProductItem> => {
      if (role !== 'gestor' && role !== 'adm') {
        throw new Error('Apenas gestores ou administradores podem solicitar ajustes.');
      }
      syncVersionRef.current += 1;
      setIsSyncing(true);
      try {
        const token = await getIdToken().catch(() => null);
        const updated = await cooperativeApi.requestProductAdjustment(id, reason, token);
        commitRealProducts(productsRef.current.map((p) => (p.id === id ? updated : p)));
        await refreshProducts();
        setError(null);
        return updated;
      } finally {
        setIsSyncing(false);
      }
    },
    [commitRealProducts, getIdToken, refreshProducts, role]
  );

  const deleteProduct = useCallback(
    async (id: number): Promise<void> => {
      assertCanMutateCatalog();
      const existing = productsRef.current.find((p) => p.id === id);
      if (existing?.status === 'em_revisao') {
        throw new Error('Peça em revisão pela gestão — exclusão bloqueada até a conclusão da análise.');
      }
      syncVersionRef.current += 1;
      setIsSyncing(true);
      try {
        const token = await getIdToken().catch(() => null);
        await cooperativeApi.deleteProduct(id, token);
        commitRealProducts(productsRef.current.filter((p) => p.id !== id));
        await refreshProducts();
        setError(null);
      } finally {
        setIsSyncing(false);
      }
    },
    [assertCanMutateCatalog, commitRealProducts, getIdToken, refreshProducts]
  );

  const createTrainingProduct = useCallback((item: ProductItem) => {
    setTrainingProducts((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
  }, []);

  const updateTrainingProduct = useCallback((id: number, updater: (current: ProductItem) => ProductItem) => {
    setTrainingProducts((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
  }, []);

  const deleteTrainingProduct = useCallback((id: number) => {
    setTrainingProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const allProducts = useMemo(
    () => (isTrainingRole ? [...products, ...trainingProducts] : products),
    [isTrainingRole, products, trainingProducts]
  );

  const publishedProducts = useMemo(
    () => products.filter((p) => !p.isTraining && p.status === 'publicado'),
    [products]
  );

  const showcaseProducts = useMemo(
    () => publishedProducts.map(mapProductToShowcase),
    [publishedProducts]
  );

  const value = useMemo<ProductContextValue>(
    () => ({
      products,
      trainingProducts,
      allProducts,
      publishedProducts,
      showcaseProducts,
      isLoading,
      isSyncing,
      error,
      lastSyncedAt,
      refreshProducts,
      createProduct,
      updateProduct,
      approveProduct,
      requestProductAdjustment,
      deleteProduct,
      createTrainingProduct,
      updateTrainingProduct,
      deleteTrainingProduct,
    }),
    [
      products,
      trainingProducts,
      allProducts,
      publishedProducts,
      showcaseProducts,
      isLoading,
      isSyncing,
      error,
      lastSyncedAt,
      refreshProducts,
      createProduct,
      updateProduct,
      approveProduct,
      requestProductAdjustment,
      deleteProduct,
      createTrainingProduct,
      updateTrainingProduct,
      deleteTrainingProduct,
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export function useProducts(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider.');
  }
  return ctx;
}
