import React from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Key,
  Printer,
  RotateCcw,
  Shield,
  XCircle,
} from 'lucide-react';
import type { HelpTicket } from '../..';
import { PrivacyWarning } from '../shared';

interface AdmTicketsTabProps {
  mode: 'produtor' | 'tecnico';
  ticketsList: HelpTicket[];
  setTicketsList: React.Dispatch<React.SetStateAction<HelpTicket[]>>;
  selectedTicketId: number | null;
  setSelectedTicketId: React.Dispatch<React.SetStateAction<number | null>>;
  ticketReplyMessage: string;
  setTicketReplyMessage: React.Dispatch<React.SetStateAction<string>>;
  approvalReasonInputs: Record<number, string>;
  setApprovalReasonInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onReplyMensagem: (e: React.FormEvent, ticketId: number) => void;
  onCloseMensagem: (id: number) => void;
  onOpenMensagem: (id: number) => void;
  onRequestConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
  onCloseConfirm: () => void;
  onAdminApproval?: (ticketId: number, approved: boolean, reason: string) => void;
  onAddToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onPrint: () => void;
  onOpenHelpModal?: () => void;
}

export const AdmTicketsTab: React.FC<AdmTicketsTabProps> = ({
  mode,
  ticketsList,
  setTicketsList,
  selectedTicketId,
  setSelectedTicketId,
  ticketReplyMessage,
  setTicketReplyMessage,
  approvalReasonInputs,
  setApprovalReasonInputs,
  onReplyMensagem,
  onCloseMensagem,
  onOpenMensagem,
  onRequestConfirm,
  onCloseConfirm,
  onAdminApproval,
  onAddToast,
  onPrint,
  onOpenHelpModal,
}) => {
  const isTech = mode === 'tecnico';
  const filteredTickets = ticketsList.filter((t) => t.category === mode);
  const selectedTicket =
    filteredTickets.find((t) => t.id === selectedTicketId) ||
    ticketsList.find((t) => t.id === selectedTicketId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            {isTech ? 'Chamados Técnicos' : 'Dúvidas dos Produtores'}
          </h2>
          <p className="text-base text-stone-700 dark:text-stone-300 font-medium mt-1">
            {isTech
              ? 'Solicitações técnicas, problemas reportados e pedidos de aprovação dos usuários'
              : 'Dúvidas e orientações enviadas pela equipe do ateliê para a gestão'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!isTech && onOpenHelpModal && (
            <button
              type="button"
              onClick={onOpenHelpModal}
              className="min-h-[50px] px-5 py-2.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-700 rounded-2xl font-black text-base flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 no-print"
            >
              <HelpCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>Chamar o suporte técnico</span>
            </button>
          )}
          <button
            onClick={onPrint}
            className="min-h-[50px] flex items-center gap-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 px-5 py-2.5 rounded-2xl font-black text-base transition-colors no-print cursor-pointer"
          >
            <Printer className="w-5 h-5" /> {isTech ? 'Imprimir Chamados (PDF)' : 'Imprimir Dúvidas (PDF)'}
          </button>
        </div>
      </div>

      {!selectedTicketId ? (
        filteredTickets.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 space-y-3">
            <CheckCircle2 className={`w-12 h-12 mx-auto ${isTech ? 'text-teal-600 dark:text-teal-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <h3 className="text-2xl font-black text-stone-900 dark:text-white">
              {isTech ? 'Nenhum chamado pendente' : 'Tudo em dia!'}
            </h3>
            <p className="text-base text-stone-600 dark:text-stone-400 font-medium">
              {isTech
                ? 'Todos os chamados e solicitações de aprovação técnica foram respondidos.'
                : 'Nenhuma dúvida de produtor aberta no momento.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start cursor-pointer transition-colors ${
                  isTech ? 'hover:border-teal-500/50' : 'hover:border-emerald-500/50'
                }`}
                onClick={() => setSelectedTicketId(ticket.id)}
              >
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        ticket.status === 'aberto'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                          : isTech
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200 border border-teal-300 dark:border-teal-700'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                      }`}
                    >
                      {ticket.displayStatus || (ticket.status === 'aberto' ? 'Recebido' : 'Resolvido')}
                    </span>

                    {isTech && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                        {ticket.type === 'aprovacao'
                          ? 'Pedido de aprovação'
                          : ticket.type === 'problema'
                            ? 'Problema no sistema'
                            : 'Dúvida técnica'}
                      </span>
                    )}

                    {isTech && ticket.approvalStatus && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          ticket.approvalStatus === 'aprovado'
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                            : ticket.approvalStatus === 'rejeitado'
                              ? 'bg-rose-100 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200 border border-rose-300 dark:border-rose-700'
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                        }`}
                      >
                        {ticket.approvalStatus === 'aprovado'
                          ? '✓ Aprovado'
                          : ticket.approvalStatus === 'rejeitado'
                            ? '✕ Não aprovado'
                            : 'Aguardando decisão'}
                      </span>
                    )}

                    <span className="text-stone-500 dark:text-stone-400 text-sm font-bold">{ticket.date}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">{ticket.title}</h3>
                  <p className="text-base text-stone-600 dark:text-stone-300 line-clamp-2">{ticket.description}</p>

                  {isTech ? (
                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-stone-600 dark:text-stone-400 pt-1">
                      <span>
                        Pessoa: <strong className="text-stone-900 dark:text-white">{ticket.author}</strong> (
                        {ticket.authorRole || 'Usuário'})
                      </span>
                      {ticket.originScreen && (
                        <span>
                          Tela de origem:{' '}
                          <strong className="text-teal-700 dark:text-teal-400">{ticket.originScreen}</strong>
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm font-extrabold text-stone-700 dark:text-stone-300">
                      Produtor: {ticket.author}
                    </p>
                  )}
                </div>

                <div
                  className={`shrink-0 flex items-center font-black text-base ${
                    isTech ? 'text-teal-700 dark:text-teal-400' : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {isTech ? 'Atender Chamado' : 'Ver Conversa'} <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : !selectedTicket ? null : (
        <div
          className={`bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col ${
            isTech ? 'min-h-[600px]' : 'min-h-[500px]'
          }`}
        >
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 shrink-0 bg-stone-50 dark:bg-stone-950">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedTicketId(null)}
                className="p-2.5 -ml-2 rounded-2xl text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Voltar para a lista"
              >
                <ChevronLeft className="w-6 h-6 text-stone-800 dark:text-stone-200" />
              </button>
              <div>
                {isTech && (
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-3 py-0.5 rounded-full text-xs font-black bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                      {selectedTicket.type === 'aprovacao'
                        ? 'Pedido de aprovação'
                        : selectedTicket.type === 'problema'
                          ? 'Problema técnico'
                          : 'Dúvida'}
                    </span>
                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400">ID #{selectedTicket.id}</span>
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                  {selectedTicket.title}
                </h3>
                <p className="text-sm font-bold text-stone-600 dark:text-stone-400">
                  {isTech
                    ? `Por ${selectedTicket.author} (${selectedTicket.authorRole || 'Usuário'}) • ${
                        selectedTicket.userEmail || 'email não informado'
                      } • ${selectedTicket.date}`
                    : `Por ${selectedTicket.author} • ${selectedTicket.date}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  selectedTicket.status === 'aberto'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                    : isTech
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200 border border-teal-300 dark:border-teal-700'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                }`}
              >
                {selectedTicket.displayStatus || (selectedTicket.status === 'aberto' ? 'Recebido' : 'Resolvido')}
              </span>

              {selectedTicket.status === 'aberto' ? (
                <button
                  onClick={() =>
                    onRequestConfirm(
                      isTech ? 'Resolver Chamado Técnico' : 'Resolver Mensagem',
                      isTech
                        ? 'Deseja encerrar este chamado técnico?'
                        : 'Tem certeza que deseja marcar esta mensagem como resolvida?',
                      () => {
                        onCloseMensagem(selectedTicket.id);
                        onCloseConfirm();
                      },
                      'Sim, Resolver',
                      'Cancelar'
                    )
                  }
                  className={`flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-black rounded-xl transition-colors border border-stone-200 dark:border-stone-700 cursor-pointer ${
                    isTech
                      ? 'hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-300'
                      : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isTech ? 'text-teal-600 dark:text-teal-400' : 'text-emerald-600 dark:text-emerald-400'}`} />{' '}
                  {isTech ? 'Resolver Chamado' : 'Marcar como Resolvido'}
                </button>
              ) : (
                <button
                  onClick={() =>
                    onRequestConfirm(
                      isTech ? 'Reabrir Chamado' : 'Reabrir Mensagem',
                      isTech
                        ? 'Deseja reabrir este chamado técnico para novo atendimento?'
                        : 'Deseja desfazer a resolução e reabrir esta mensagem?',
                      () => {
                        onOpenMensagem(selectedTicket.id);
                        onCloseConfirm();
                      },
                      'Sim, Reabrir',
                      'Cancelar'
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-black rounded-xl transition-colors border border-stone-200 dark:border-stone-700 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> {isTech ? 'Reabrir Chamado' : 'Reabrir'}
                </button>
              )}
            </div>
          </div>

          {isTech && (
            <div className="p-4 bg-teal-50/80 dark:bg-teal-950/30 border-b border-teal-200 dark:border-teal-800/50 text-sm text-stone-700 dark:text-stone-300 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 font-black text-teal-800 dark:text-teal-300">
                <Shield className="w-4 h-4" />
                <span>Metadados Técnicos Anexados:</span>
              </div>
              <div>
                Tela de Origem:{' '}
                <strong className="text-stone-900 dark:text-white">{selectedTicket.originScreen || 'Geral'}</strong>
              </div>
              <div>
                Resolução de Tela:{' '}
                <strong className="text-stone-900 dark:text-white">
                  {selectedTicket.screenResolution || '1920x1080'}
                </strong>
              </div>
              <div>
                Navegador:{' '}
                <strong className="text-stone-900 dark:text-white truncate max-w-xs inline-block align-bottom">
                  {selectedTicket.userAgent || 'Chrome/Desktop'}
                </strong>
              </div>
              <div>
                Horário:{' '}
                <strong className="text-stone-900 dark:text-white">
                  {selectedTicket.timestamp || selectedTicket.date}
                </strong>
              </div>
            </div>
          )}

          {isTech && selectedTicket.type === 'aprovacao' && (
            <div className="p-6 bg-stone-50 dark:bg-stone-950/80 border-b border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                  <span>Decisão de Aprovação do Suporte</span>
                </h4>
                {selectedTicket.approvalStatus && (
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-black flex items-center gap-2 ${
                      selectedTicket.approvalStatus === 'aprovado'
                        ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-rose-100 text-rose-950 dark:bg-rose-950/70 dark:text-rose-200 border border-rose-300 dark:border-rose-700'
                    }`}
                  >
                    {selectedTicket.approvalStatus === 'aprovado' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        <span>Aprovado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                        <span>Não aprovado</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {selectedTicket.approvalReason && (
                <p className="text-base font-bold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                  Motivo da decisão: {selectedTicket.approvalReason}
                </p>
              )}

              {(!selectedTicket.approvalStatus || selectedTicket.approvalStatus === 'pendente') && (
                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-black text-stone-800 dark:text-stone-200">
                    Digite o motivo curto para a pessoa (uma frase):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: Parâmetro técnico validado e liberado com sucesso."
                    value={approvalReasonInputs[selectedTicket.id] || ''}
                    onChange={(e) =>
                      setApprovalReasonInputs((prev) => ({ ...prev, [selectedTicket.id]: e.target.value }))
                    }
                    className="w-full min-h-[50px] px-4 py-2.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-base font-bold text-stone-900 dark:text-white focus:outline-none focus:border-teal-600"
                  />
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const reason =
                          approvalReasonInputs[selectedTicket.id]?.trim() || 'Aprovado pelo suporte técnico.';
                        if (onAdminApproval) {
                          onAdminApproval(selectedTicket.id, true, reason);
                        } else {
                          setTicketsList((list) =>
                            list.map((t) =>
                              t.id === selectedTicket.id ? { ...t, approvalStatus: 'aprovado', approvalReason: reason } : t
                            )
                          );
                          onAddToast('Solicitação aprovada pelo suporte!', 'success');
                        }
                      }}
                      className="min-h-[56px] px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 w-full sm:w-1/2"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>Aprovar Solicitação</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const reason =
                          approvalReasonInputs[selectedTicket.id]?.trim() ||
                          'Não aprovado pelo suporte técnico devido a requisitos técnicos.';
                        if (onAdminApproval) {
                          onAdminApproval(selectedTicket.id, false, reason);
                        } else {
                          setTicketsList((list) =>
                            list.map((t) =>
                              t.id === selectedTicket.id
                                ? { ...t, approvalStatus: 'rejeitado', approvalReason: reason }
                                : t
                            )
                          );
                          onAddToast('Solicitação rejeitada pelo suporte.', 'info');
                        }
                      }}
                      className="min-h-[56px] px-6 py-3.5 bg-rose-700 hover:bg-rose-800 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 w-full sm:w-1/2"
                    >
                      <XCircle className="w-5 h-5 shrink-0" />
                      <span>Não Aprovar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Área da Conversa */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 flex items-center justify-center shrink-0 font-black text-lg">
                {selectedTicket.author.charAt(0)}
              </div>
              <div className="bg-stone-100 dark:bg-stone-800 p-5 rounded-3xl rounded-tl-none max-w-2xl space-y-2">
                {isTech ? (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-stone-900 dark:text-white">{selectedTicket.author}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold">
                      {selectedTicket.authorRole || 'Usuário'}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm font-black text-stone-900 dark:text-white">{selectedTicket.author}</p>
                )}
                <p className="text-base text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.description}
                </p>
                {selectedTicket.photoUrl && (
                  <div className="pt-2">
                    {isTech && <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">Foto anexada pelo usuário:</p>}
                    <img
                      src={selectedTicket.photoUrl}
                      alt={isTech ? 'Foto anexada' : 'Anexo do produtor'}
                      className={
                        isTech
                          ? 'w-64 h-48 object-cover rounded-2xl border border-stone-300 dark:border-stone-600 shadow-sm'
                          : 'w-48 h-36 object-cover rounded-2xl border border-stone-300 dark:border-stone-600'
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {(selectedTicket.messages || []).map((msg, idx) => {
              const isReply = isTech
                ? msg.isSystemOrSupport || msg.author.includes('Suporte') || msg.author.includes('Gestor')
                : msg.author.includes('Gestor') || msg.author.includes('Equipe') || msg.isSystemOrSupport;
              return (
                <div key={idx} className={`flex gap-4 ${isReply ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black ${
                      isReply
                        ? isTech
                          ? 'text-sm bg-teal-700 text-white border border-teal-600 shadow-xs'
                          : 'text-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'text-lg bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {isReply ? (isTech ? 'ST' : 'G') : msg.author.charAt(0)}
                  </div>
                  <div
                    className={`p-5 rounded-3xl max-w-2xl space-y-1 ${
                      isReply
                        ? isTech
                          ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-tr-none'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-tr-none'
                        : 'bg-stone-100 dark:bg-stone-800 rounded-tl-none'
                    }`}
                  >
                    <div className={`flex items-baseline gap-2 mb-1 ${isReply ? 'justify-end' : ''}`}>
                      <p
                        className={`text-sm font-black ${
                          isTech ? 'text-teal-950 dark:text-teal-200' : 'text-stone-900 dark:text-white'
                        }`}
                      >
                        {isTech ? (isReply ? 'Suporte técnico' : msg.author) : msg.author}
                      </p>
                      <p className="text-xs font-bold text-stone-500 dark:text-stone-400">{msg.date}</p>
                    </div>
                    <p className="text-base text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Campo de Resposta */}
          {selectedTicket.status === 'aberto' ? (
            <form
              onSubmit={(e) => onReplyMensagem(e, selectedTicket.id)}
              className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shrink-0"
            >
              {isTech ? (
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-teal-800 dark:text-teal-300">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Sua resposta será enviada como &quot;Suporte técnico&quot; (sua identidade pessoal é protegida).</span>
                </div>
              ) : (
                <PrivacyWarning />
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder={
                    isTech
                      ? 'Digite sua resposta oficial de suporte técnico...'
                      : 'Digite uma resposta orientando o produtor...'
                  }
                  value={ticketReplyMessage}
                  onChange={(e) => setTicketReplyMessage(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-base font-bold text-stone-900 dark:text-white placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none ${
                    isTech ? 'focus:border-teal-600' : 'focus:border-emerald-600'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!ticketReplyMessage.trim()}
                  className={`min-h-[50px] px-6 py-3 disabled:opacity-50 text-white font-black text-base rounded-2xl transition-colors cursor-pointer shadow-xs active:scale-95 ${
                    isTech ? 'bg-teal-700 hover:bg-teal-800' : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  {isTech ? 'Enviar como Suporte' : 'Enviar Resposta'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex flex-col items-center justify-center gap-3 shrink-0 text-stone-600 dark:text-stone-400">
              <p className="font-bold text-base">
                {isTech
                  ? 'Este chamado técnico foi resolvido e arquivado.'
                  : 'Esta dúvida foi marcada como respondida e resolvida.'}
              </p>
              <button
                onClick={() =>
                  onRequestConfirm(
                    isTech ? 'Reabrir Chamado' : 'Reabrir Dúvida',
                    isTech
                      ? 'Deseja reabrir este chamado técnico?'
                      : 'Deseja reabrir este atendimento para enviar mais orientações?',
                    () => {
                      onOpenMensagem(selectedTicket.id);
                      onCloseConfirm();
                    },
                    'Sim, Reabrir',
                    'Cancelar'
                  )
                }
                className="min-h-[46px] px-6 py-2.5 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-black rounded-xl transition-colors flex items-center gap-2 border border-stone-200 dark:border-stone-700 shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> {isTech ? 'Reabrir Chamado Técnico' : 'Reabrir Atendimento'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
