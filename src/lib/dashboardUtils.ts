import type { ProductItem } from '../types';

export function formatLocalDatePtBr(dateStr?: string): string {
  if (!dateStr) return 'A definir';
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  }
  const parsed = new Date(dateStr);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('pt-BR');
  }
  return dateStr;
}

export function syncPublishedProductToPublicStorage(action: 'upsert' | 'remove', product: ProductItem) {
  if (product.isTraining) return;
  try {
    const raw = localStorage.getItem('potengi_public_products');
    const parsed = raw ? JSON.parse(raw) : [];
    const baseList = Array.isArray(parsed) ? [...parsed] : [];
    const shouldBePublic = action === 'upsert' && !product.isTraining && product.status === 'publicado';
    if (!shouldBePublic) {
      const filtered = baseList.filter((item: any) => item.id !== product.id);
      localStorage.setItem('potengi_public_products', JSON.stringify(filtered));
      return;
    }
    const mapped = {
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
    const idx = baseList.findIndex((item: any) => item.id === product.id);
    if (idx >= 0) {
      baseList[idx] = { ...baseList[idx], ...mapped };
    } else {
      baseList.unshift(mapped);
    }
    localStorage.setItem('potengi_public_products', JSON.stringify(baseList));
  } catch {
    // Ignora erros de armazenamento local
  }
}
