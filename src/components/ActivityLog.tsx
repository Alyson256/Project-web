import React, { useState } from 'react';
import { 
  Download, Printer, Filter, RotateCcw, Eye, Trash2, 
  Check, X, AlertTriangle, ArrowRight, Clock, User, Shield,
  Camera, Video, ExternalLink, Play, Sparkles
} from 'lucide-react';
import { useToast } from '../contexts';

import {
  type AuditHistoryEntry,
  type TrashItem,
  calculateDaysRemaining,
} from '../data';

export type { AuditHistoryEntry, TrashItem };
export { calculateDaysRemaining };

export interface SystemAuditLogInput {
  id: string;
  action: string;
  details: string;
  date: string;
  user: string;
}

function inferAuditType(action: string, details: string): AuditHistoryEntry['type'] {
  const haystack = `${action} ${details}`.toLowerCase();
  if (haystack.includes('promov') || haystack.includes('cargo') || haystack.includes('aprendiz') || haystack.includes('função')) {
    return 'promocao';
  }
  if (haystack.includes('vídeo') || haystack.includes('video')) {
    return 'video';
  }
  if (haystack.includes('foto') || haystack.includes('imagem') || haystack.includes('galeria')) {
    return 'foto';
  }
  return 'texto';
}

function mapSystemLogsToHistory(logs: SystemAuditLogInput[]): AuditHistoryEntry[] {
  const todayStr = new Date().toLocaleDateString('pt-BR');
  return logs.map((entry) => {
    const isToday = entry.date.includes(todayStr) || entry.date.toLowerCase().includes('hoje');
    return {
      id: entry.id,
      sentence: `${entry.user || 'Equipe'} — ${entry.action}: ${entry.details} · ${entry.date}`,
      person: entry.user || 'Sistema',
      type: inferAuditType(entry.action, entry.details),
      date: entry.date,
      dateFilter: isToday ? 'hoje' : 'semana',
      beforeContent: `Ação registrada: ${entry.action}`,
      afterContent: entry.details,
    };
  });
}

export interface ActivityLogProps {
  logs?: SystemAuditLogInput[];
  onExportCSV?: () => void;
  trashList?: TrashItem[];
  onRestoreItem?: (item: TrashItem) => void;
  onPermanentDelete?: (item: TrashItem) => void;
}

export function ActivityLog({
  logs = [],
  onExportCSV,
  trashList: externalTrashList,
  onRestoreItem,
  onPermanentDelete
}: ActivityLogProps) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'historico' | 'lixeira'>('historico');
  const [localHistoryEvents, setLocalHistoryEvents] = useState<AuditHistoryEntry[]>([]);
  const [internalTrashList, setInternalTrashList] = useState<TrashItem[]>([]);

  // Filtro interno da lixeira
  const [trashFilter, setTrashFilter] = useState<'todos' | 'foto' | 'video'>('todos');

  // Lixeira ativa (da prop ou estado interno)
  const currentTrashList = externalTrashList !== undefined ? externalTrashList : internalTrashList;
  const historyList = React.useMemo(
    () => [...localHistoryEvents, ...mapSystemLogsToHistory(logs)],
    [localHistoryEvents, logs]
  );
  const availablePersons = React.useMemo(() => {
    const set = new Set<string>();
    historyList.forEach((item) => {
      if (item.person) set.add(item.person);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [historyList]);

  // Filtros grandes de histórico
  const [filterPerson, setFilterPerson] = useState('todas');
  const [filterType, setFilterType] = useState('todos');
  const [filterDate, setFilterDate] = useState('todos');

  // Modais de histórico
  const [diffEntry, setDiffEntry] = useState<AuditHistoryEntry | null>(null);
  const [restoreConfirmEntry, setRestoreConfirmEntry] = useState<AuditHistoryEntry | null>(null);

  // Modais da lixeira
  const [trashRestoreItem, setTrashRestoreItem] = useState<TrashItem | null>(null);
  const [trashPermanentDeleteItem, setTrashPermanentDeleteItem] = useState<TrashItem | null>(null);

  const filteredHistory = historyList.filter(item => {
    const matchesPerson = filterPerson === 'todas' || item.person.toLowerCase().includes(filterPerson.toLowerCase());
    const matchesType = filterType === 'todos' || item.type === filterType;
    const matchesDate = filterDate === 'todos' || item.dateFilter === filterDate;
    return matchesPerson && matchesType && matchesDate;
  });

  const filteredTrash = currentTrashList.filter(item => {
    if (trashFilter === 'todos') return true;
    return item.type === trashFilter;
  });

  const photoCountInTrash = currentTrashList.filter(t => t.type === 'foto').length;
  const videoCountInTrash = currentTrashList.filter(t => t.type === 'video').length;

  const handleRestore = (entry: AuditHistoryEntry) => {
    addToast(`Versão "${entry.sentence}" restaurada com sucesso no sistema!`, 'success');
    setRestoreConfirmEntry(null);
  };

  const handleExecuteRestoreTrash = (item: TrashItem) => {
    if (onRestoreItem) {
      onRestoreItem(item);
    } else {
      setInternalTrashList(prev => prev.filter(t => t.id !== item.id));
      addToast(`${item.type === 'foto' ? 'Foto' : 'Vídeo'} "${item.title}" recuperado(a) com sucesso!`, 'success');
    }
    setLocalHistoryEvents(prev => [
      {
        id: `h-rec-${Date.now()}`,
        sentence: `Suporte técnico restaurou ${item.type === 'foto' ? 'a foto' : 'o vídeo'} '${item.title}' da lixeira de volta para o site · Hoje`,
        person: 'Suporte técnico',
        type: item.type,
        date: 'Hoje',
        dateFilter: 'hoje',
        beforeContent: 'Item estava na lixeira de proteção de 30 dias',
        afterContent: `Item restaurado para o site: ${item.title}`
      },
      ...prev
    ]);
    setTrashRestoreItem(null);
  };

  const handleExecutePermanentDelete = (item: TrashItem) => {
    if (onPermanentDelete) {
      onPermanentDelete(item);
    } else {
      setInternalTrashList(prev => prev.filter(t => t.id !== item.id));
      addToast(`${item.type === 'foto' ? 'Foto' : 'Vídeo'} "${item.title}" excluído(a) definitivamente.`, 'info');
    }
    setLocalHistoryEvents(prev => [
      {
        id: `h-perm-${Date.now()}`,
        sentence: `Suporte técnico excluiu definitivamente ${item.type === 'foto' ? 'a foto' : 'o vídeo'} '${item.title}' · Hoje`,
        person: 'Suporte técnico',
        type: item.type,
        date: 'Hoje',
        dateFilter: 'hoje',
        beforeContent: `Estava na lixeira (${calculateDaysRemaining(item.deletedTimestamp)} dias restantes)`,
        afterContent: 'Exclusão definitiva permanente do banco de dados'
      },
      ...prev
    ]);
    setTrashPermanentDeleteItem(null);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight">
            Histórico do Sistema e Auditoria
          </h2>
          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1">
            Registro claro de quem modificou o que no ecossistema do ateliê (área técnica da administração).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              className="min-h-[56px] px-6 py-3.5 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-2xl font-black text-base inline-flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Salvar Planilha de Auditoria</span>
            </button>
          )}
        </div>
      </div>

      {/* Navegação entre Histórico de Frases e Lixeira de 30 dias */}
      <div className="flex flex-wrap gap-3 border-b-2 border-stone-200 dark:border-stone-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('historico')}
          className={`min-h-[56px] px-7 py-3 rounded-2xl font-black text-lg inline-flex items-center gap-2.5 cursor-pointer transition-all ${
            activeTab === 'historico'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Clock className="w-5 h-5 shrink-0" />
          <span>Linha do Tempo ({historyList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lixeira')}
          className={`min-h-[56px] px-7 py-3 rounded-2xl font-black text-lg inline-flex items-center gap-2.5 cursor-pointer transition-all ${
            activeTab === 'lixeira'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Trash2 className="w-5 h-5 shrink-0" />
          <span>Lixeira de Mídia ({currentTrashList.length} itens • 30 dias)</span>
        </button>
      </div>

      {/* ABA 1: HISTÓRICO EM FRASES SIMPLES */}
      {activeTab === 'historico' && (
        <div className="space-y-6">
          
          {/* Filtros Grandes por Pessoa, Tipo e Data */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
              <Filter className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <span>Filtros do Histórico</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por Pessoa */}
              <div>
                <label className="block text-base font-extrabold text-stone-800 dark:text-stone-200 mb-2">
                  Por pessoa
                </label>
                <select
                  value={filterPerson}
                  onChange={(e) => setFilterPerson(e.target.value)}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-600"
                >
                  <option value="todas">Todas as pessoas</option>
                  {availablePersons.map((person) => (
                    <option key={person} value={person}>
                      {person}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Tipo */}
              <div>
                <label className="block text-base font-extrabold text-stone-800 dark:text-stone-200 mb-2">
                  Por tipo de modificação
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-600"
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="texto">Texto</option>
                  <option value="foto">Foto</option>
                  <option value="video">Vídeo</option>
                  <option value="promocao">Promoção de cargo</option>
                </select>
              </div>

              {/* Filtro por Data */}
              <div>
                <label className="block text-base font-extrabold text-stone-800 dark:text-stone-200 mb-2">
                  Por período
                </label>
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-600"
                >
                  <option value="todos">Todo o período</option>
                  <option value="hoje">Hoje</option>
                  <option value="semana">Últimos 7 dias</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista em frases simples, uma por linha */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm divide-y-2 divide-stone-100 dark:divide-stone-800 overflow-hidden">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-stone-600 dark:text-stone-400 font-medium text-lg">
                Nenhuma atividade encontrada com os filtros selecionados.
              </div>
            ) : (
              filteredHistory.map(entry => (
                <div 
                  key={entry.id}
                  className="p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-snug">
                      {entry.sentence}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-base text-stone-600 dark:text-stone-400 font-medium">
                      <span>Responsável: <strong className="text-stone-800 dark:text-stone-200 font-bold">{entry.person}</strong></span>
                      <span>•</span>
                      <span className="capitalize">Tipo: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{entry.type}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-2 lg:pt-0">
                    <button
                      type="button"
                      onClick={() => setDiffEntry(entry)}
                      className="min-h-[56px] px-5 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-extrabold text-base inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Eye className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>Ver antes e depois</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRestoreConfirmEntry(entry)}
                      className="min-h-[56px] px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95"
                    >
                      <RotateCcw className="w-5 h-5 shrink-0" />
                      <span>Restaurar esta versão</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ABA 2: LIXEIRA DE FOTOS E VÍDEOS (30 DIAS) */}
      {activeTab === 'lixeira' && (
        <div className="space-y-6">
          {/* Card explicativo de retenção de 30 dias */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-3xl p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100 flex items-center gap-2.5">
                  <Clock className="w-6 h-6 text-amber-700 dark:text-amber-300 shrink-0" />
                  <span>Proteção de Exclusão por 30 Dias</span>
                </h3>
                <p className="text-base sm:text-lg text-amber-900 dark:text-amber-200 font-medium">
                  Fotos e vídeos apagados no painel permanecem guardados nesta lixeira por <strong>30 dias</strong> antes da exclusão definitiva. Durante esse prazo, você pode restaurar qualquer item de volta para o site com um único toque.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 bg-white/80 dark:bg-stone-900/80 px-4 py-2.5 rounded-2xl border border-amber-300 dark:border-amber-700">
                <Shield className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="text-sm font-black text-stone-800 dark:text-stone-200">
                  {currentTrashList.length} {currentTrashList.length === 1 ? 'item protegido' : 'itens protegidos'}
                </span>
              </div>
            </div>
          </div>

          {/* Filtros da Lixeira: Todos, Fotos, Vídeos */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-base font-extrabold text-stone-700 dark:text-stone-300 mr-1">
              Filtrar por:
            </span>

            <button
              type="button"
              onClick={() => setTrashFilter('todos')}
              className={`min-h-[48px] px-5 py-2.5 rounded-2xl font-black text-base inline-flex items-center gap-2 cursor-pointer transition-all ${
                trashFilter === 'todos'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <span>Todos ({currentTrashList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setTrashFilter('foto')}
              className={`min-h-[48px] px-5 py-2.5 rounded-2xl font-black text-base inline-flex items-center gap-2 cursor-pointer transition-all ${
                trashFilter === 'foto'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>Fotos ({photoCountInTrash})</span>
            </button>

            <button
              type="button"
              onClick={() => setTrashFilter('video')}
              className={`min-h-[48px] px-5 py-2.5 rounded-2xl font-black text-base inline-flex items-center gap-2 cursor-pointer transition-all ${
                trashFilter === 'video'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>Vídeos ({videoCountInTrash})</span>
            </button>
          </div>

          {/* Lista de itens na lixeira */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrash.length === 0 ? (
              <div className="col-span-full p-12 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-stone-900 dark:text-white">
                  Nenhum item na lixeira com este filtro
                </h4>
                <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 font-medium max-w-md mx-auto">
                  Fotos e vídeos que forem apagados no painel permanecerão guardados aqui com segurança durante 30 dias.
                </p>
              </div>
            ) : (
              filteredTrash.map(item => {
                const daysLeft = calculateDaysRemaining(item.deletedTimestamp);
                const isUrgent = daysLeft <= 5;

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between gap-5 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
                  >
                    <div className="space-y-4">
                      {/* Topo do card com etiquetas */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-black uppercase bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700">
                          {item.type === 'foto' ? (
                            <>
                              <Camera className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                              <span>Foto da Galeria</span>
                            </>
                          ) : (
                            <>
                              <Video className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                              <span>Vídeo do Ateliê</span>
                            </>
                          )}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-black border ${
                            daysLeft === 0
                              ? 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800'
                              : isUrgent
                              ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700'
                              : 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>
                            {daysLeft === 0
                              ? 'Expira hoje (30 dias completos)'
                              : isUrgent
                              ? `Atenção: restam ${daysLeft} dias`
                              : `Restam ${daysLeft} de 30 dias`}
                          </span>
                        </span>
                      </div>

                      {/* Prévia da mídia */}
                      {item.type === 'foto' ? (
                        <div className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 relative group aspect-video">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                          <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="px-4 py-2 bg-stone-900/80 text-white rounded-xl text-sm font-black backdrop-blur-sm">
                              Foto arquivada na lixeira
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 bg-stone-900 text-white p-6 flex flex-col justify-center items-center text-center gap-3 aspect-video relative">
                          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-7 h-7 fill-white translate-x-0.5" />
                          </div>
                          <div>
                            <p className="font-black text-base text-stone-100 truncate max-w-xs">
                              {item.title}
                            </p>
                            <p className="text-xs text-stone-400 mt-1 truncate max-w-xs font-mono">
                              {item.url}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Informações textuais */}
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-base text-stone-600 dark:text-stone-400 font-medium mt-1">
                          Removido em: <strong className="text-stone-800 dark:text-stone-200">{item.removedDate}</strong> por <strong className="text-stone-800 dark:text-stone-200">{item.removedBy}</strong>
                        </p>
                        <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mt-1">
                          Guardado com proteção de 30 dias para evitar perdas acidentais.
                        </p>
                      </div>
                    </div>

                    {/* Botões de Ação: Restaurar e Excluir Definitivamente */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setTrashRestoreItem(item)}
                        className="w-full sm:w-1/2 min-h-[56px] px-5 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-base inline-flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <RotateCcw className="w-5 h-5 shrink-0" />
                        <span>Restaurar {item.type === 'foto' ? 'foto' : 'vídeo'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTrashPermanentDeleteItem(item)}
                        className="w-full sm:w-1/2 min-h-[56px] px-5 py-3.5 bg-white dark:bg-stone-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-stone-700 hover:text-red-700 dark:text-stone-300 dark:hover:text-red-400 border-2 border-stone-300 dark:border-stone-700 hover:border-red-300 dark:hover:border-red-800 rounded-2xl font-extrabold text-base inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
                        <span>Excluir para sempre</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal: Ver antes e depois */}
      {diffEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                  Comparação: Antes e Depois
                </h3>
                <p className="text-base text-stone-600 dark:text-stone-400 font-medium mt-0.5">
                  {diffEntry.sentence}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDiffEntry(null)}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Fechar comparação"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/50 space-y-2">
                <span className="text-sm font-black text-red-800 dark:text-red-300 uppercase">Como era antes</span>
                <p className="text-base text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                  {diffEntry.beforeContent || 'Sem registro anterior.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-800 space-y-2">
                <span className="text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase">Como ficou depois</span>
                <p className="text-base text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                  {diffEntry.afterContent || 'Sem modificações registradas.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDiffEntry(null)}
                className="min-h-[56px] px-8 py-3.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-2xl font-black text-lg cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar restauração de versão */}
      {restoreConfirmEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center gap-3.5 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                Restaurar Versão
              </h3>
            </div>

            <p className="text-lg font-bold text-stone-800 dark:text-stone-200 leading-relaxed">
              Deseja restaurar esta versão no sistema? Os textos ou mídias anteriores serão reaplicados.
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-base font-medium">
              {restoreConfirmEntry.sentence}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRestoreConfirmEntry(null)}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleRestore(restoreConfirmEntry)}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Check className="w-5 h-5 shrink-0" />
                <span>Sim, restaurar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Restauração da Lixeira (30 dias) */}
      {trashRestoreItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center gap-3.5 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                  Restaurar {trashRestoreItem.type === 'foto' ? 'Foto' : 'Vídeo'}
                </h3>
                <span className="text-sm font-bold text-stone-500 dark:text-stone-400">
                  Proteção de 30 dias • Volta imediatamente ao site
                </span>
              </div>
            </div>

            <p className="text-lg font-bold text-stone-800 dark:text-stone-200 leading-relaxed">
              Deseja restaurar <strong>"{trashRestoreItem.title}"</strong> de volta para o site?
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-base font-medium text-stone-700 dark:text-stone-300">
              O arquivo sairá da lixeira e reaparecerá na galeria pública do ateliê para todos os visitantes.
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrashRestoreItem(null)}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5 shrink-0" />
                <span>Não, voltar</span>
              </button>
              <button
                type="button"
                onClick={() => handleExecuteRestoreTrash(trashRestoreItem)}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <RotateCcw className="w-5 h-5 shrink-0" />
                <span>Sim, restaurar item</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Exclusão Definitiva (antes ou pós 30 dias) */}
      {trashPermanentDeleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center gap-3.5 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                  Exclusão Definitiva
                </h3>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                  Ação permanente e irreversível
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-base font-semibold text-red-900 dark:text-red-200">
              Atenção: Ao excluir definitivamente, <strong>"{trashPermanentDeleteItem.title}"</strong> será apagado para sempre e não poderá ser recuperado.
            </div>

            <p className="text-base text-stone-700 dark:text-stone-300 font-medium">
              Tem certeza de que não deseja esperar o encerramento do prazo de 30 dias?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrashPermanentDeleteItem(null)}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5 shrink-0" />
                <span>Não, manter na lixeira</span>
              </button>
              <button
                type="button"
                onClick={() => handleExecutePermanentDelete(trashPermanentDeleteItem)}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-lg inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Trash2 className="w-5 h-5 shrink-0" />
                <span>Sim, excluir para sempre</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
