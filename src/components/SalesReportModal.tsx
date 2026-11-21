import React, { useState, useMemo, useRef } from 'react';
import { 
  Leaf, Printer, Download, X, Search, CheckCircle2, AlertTriangle, 
  Package, DollarSign, Filter, MessageCircle 
} from 'lucide-react';
import { ProductImage } from './ProductImage';
import { useFocusTrap } from '../hooks';

export interface ReportProductItem {
  id: number;
  title: string;
  technique?: string;
  description?: string;
  image?: string;
  isAvailable: boolean;
  stock?: number;
  price?: number;
  artist: string;
  artistPhoto?: string;
  isTraining?: boolean;
  contactsCount?: number;
  status?: 'publicado' | 'em_revisao' | 'rascunho' | 'ajuste_solicitado';
}

interface SalesReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ReportProductItem[];
  onCustomExportCSV?: () => void;
}

export function SalesReportModal({
  isOpen,
  onClose,
  products,
  onCustomExportCSV,
}: SalesReportModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'out_of_stock'>('all');
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, modalRef, onClose);

  // Cálculos do Relatório
  const totalItems = products.length;
  const availableItems = products.filter(p => p.isAvailable).length;
  const outOfStockItems = products.filter(p => !p.isAvailable).length;

  const totalContacts = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.contactsCount || 0), 0);
  }, [products]);

  const totalCatalogValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.price || 0), 0);
  }, [products]);

  const availableCatalogValue = useMemo(() => {
    return products
      .filter(p => p.isAvailable)
      .reduce((acc, p) => acc + (p.price || 0), 0);
  }, [products]);

  // Filtragem de produtos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.technique && p.technique.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === 'available') return p.isAvailable;
      if (statusFilter === 'out_of_stock') return !p.isAvailable;
      return true;
    });
  }, [products, searchTerm, statusFilter]);

  // Formatação em Real brasileiro
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Exportação nativa CSV com suporte a acentuação (BOM UTF-8)
  const handleExportCSV = () => {
    if (onCustomExportCSV) {
      onCustomExportCSV();
      return;
    }

    const headers = ['ID', 'Peça', 'Técnica', 'Quem Fez (Produtora)', 'Preço (R$)', 'Contatos Recebidos (WhatsApp)', 'Situação'];
    const rows = filteredProducts.map(p => [
      p.id,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.technique || 'Artesanato Potengi').replace(/"/g, '""')}"`,
      `"${(p.artist || 'Associação').replace(/"/g, '""')}"`,
      (p.price || 0).toFixed(2),
      p.contactsCount || 0,
      p.isAvailable ? 'Em Estoque' : 'Esgotado'
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `relatorio_contatos_recebidos_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="relatorio-contatos-title"
    >
      {/* Estilos específicos para impressão limpa e legível */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #relatorio-print-container, #relatorio-print-container * {
            visibility: visible;
          }
          #relatorio-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print-area {
            display: none !important;
          }
        }
      `}</style>

      {/* Caixa do Relatório */}
      <div 
        ref={modalRef}
        id="relatorio-print-container"
        className="relative w-full max-w-5xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabeçalho do Relatório */}
        <div className="p-6 sm:p-8 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Departamento de Vendas Rosa Mística
              </span>
              <span className="text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400">
                Associação Julieta Barros
              </span>
            </div>
            <h2 id="relatorio-contatos-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
              Contatos Recebidos por Peça
            </h2>
            <p className="text-base text-stone-600 dark:text-stone-300">
              Quantas vezes cada peça foi procurada no WhatsApp. Como a venda é combinada diretamente entre quem produz e quem compra, o site registra a procura e o interesse.
            </p>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="no-print-area flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 min-h-[56px] px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-black text-base transition-colors cursor-pointer"
              aria-label="Fechar relatório de contatos"
            >
              <X className="w-5 h-5 shrink-0" />
              <span>Fechar</span>
            </button>
          </div>
        </div>

        {/* Resumo com cartões estatísticos (KPIs) */}
        <div className="p-6 sm:p-8 bg-stone-100/60 dark:bg-stone-950/40 border-b border-stone-200 dark:border-stone-800 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 mb-1">
              <span className="text-base font-bold">Total no Catálogo</span>
              <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              {totalItems} <span className="text-base font-medium text-stone-500 dark:text-stone-400">peças</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-1">
              <span className="text-base font-bold">Total Contatos</span>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
              {totalContacts} <span className="text-base font-medium text-emerald-700/80 dark:text-emerald-300/80">procuras</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-1">
              <span className="text-base font-bold">Em Estoque</span>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
              {availableItems} <span className="text-base font-medium text-emerald-700/80 dark:text-emerald-300/80">prontas</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 mb-1">
              <span className="text-base font-bold">Valor Sugerido</span>
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 truncate">
              {formatCurrency(totalCatalogValue)}
            </span>
            <span className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
              ({formatCurrency(availableCatalogValue)} disponível)
            </span>
          </div>
        </div>

        {/* Barra de Filtros e Busca (Oculta na impressão) */}
        <div className="no-print-area p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por peça, produtora ou técnica..."
              className="w-full pl-11 pr-4 py-3 min-h-[56px] bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1 mr-1">
              <Filter className="w-5 h-5" /> Filtrar:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`min-h-[56px] px-4 py-2.5 rounded-xl text-base font-bold transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              Todas ({totalItems})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`min-h-[56px] px-4 py-2.5 rounded-xl text-base font-bold transition-colors cursor-pointer ${
                statusFilter === 'available'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              Em Estoque ({availableItems})
            </button>
            <button
              onClick={() => setStatusFilter('out_of_stock')}
              className={`min-h-[56px] px-4 py-2.5 rounded-xl text-base font-bold transition-colors cursor-pointer ${
                statusFilter === 'out_of_stock'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              Esgotadas ({outOfStockItems})
            </button>
          </div>
        </div>

        {/* Tabela do Relatório com Rolagem Suave */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-stone-500 dark:text-stone-400">
              <Package className="w-12 h-12 mx-auto mb-3 text-stone-400 opacity-60" />
              <p className="text-xl font-bold">Nenhuma peça encontrada para esta busca.</p>
              <p className="text-base text-stone-500 dark:text-stone-400">Tente buscar por outro termo ou limpar os filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 dark:bg-stone-800/90 border-b border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-base font-extrabold">
                    <th className="p-3.5 sm:p-4">Peça Artesanal</th>
                    <th className="p-3.5 sm:p-4">Quem Fez</th>
                    <th className="p-3.5 sm:p-4">Técnica</th>
                    <th className="p-3.5 sm:p-4 text-right">Preço</th>
                    <th className="p-3.5 sm:p-4 text-center">Contatos (WhatsApp)</th>
                    <th className="p-3.5 sm:p-4 text-center">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-900 dark:text-stone-100 text-base">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                              <ProductImage src={product.image} alt={product.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 dark:text-white truncate text-base">{product.title}</p>
                            <p className="text-sm text-stone-500 dark:text-stone-400 font-semibold">Cód: #{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 font-semibold text-stone-800 dark:text-stone-200 text-base whitespace-nowrap">
                        {product.artist}
                      </td>
                      <td className="p-3.5 sm:p-4 text-stone-600 dark:text-stone-300 text-base">
                        {product.technique || 'Artesanato Local'}
                      </td>
                      <td className="p-3.5 sm:p-4 text-right font-black text-stone-900 dark:text-white text-base whitespace-nowrap">
                        {formatCurrency(product.price || 0)}
                      </td>
                      <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-black bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          <MessageCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>{product.contactsCount || 0} procuras</span>
                        </span>
                      </td>
                      <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                        {product.isAvailable ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            Em Estoque
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800">
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                            Esgotado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rodapé com botões de ação permanentes (sem fechar em milissegundos) */}
        <div className="no-print-area p-4 sm:p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/95 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 min-h-[56px] px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-base transition-all shadow-sm active:scale-[0.98]"
              aria-label="Imprimir ou salvar relatório em PDF"
            >
              <Printer className="w-5 h-5 shrink-0" />
              <span>Imprimir ou Salvar PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 min-h-[56px] px-5 py-3 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 font-bold text-base transition-all shadow-sm active:scale-[0.98]"
              aria-label="Baixar planilha de peças em formato CSV"
            >
              <Download className="w-5 h-5 shrink-0" />
              <span>Salvar Planilha (CSV)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 min-h-[56px] px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-base transition-all shadow-sm active:scale-[0.98]"
            aria-label="Concluir e fechar relatório"
          >
            <X className="w-5 h-5 shrink-0" />
            <span>Fechar Relatório</span>
          </button>
        </div>
      </div>
    </div>
  );
}
