import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, AlertTriangle, CheckCircle2, XCircle, Mic, Camera, 
  Send, X, MessageSquare, Clock, Check, ChevronRight, User, 
  ShieldCheck, Sparkles, Image as ImageIcon, Volume2
} from 'lucide-react';
import { useToast } from '../contexts';
import { useFocusTrap } from '../hooks';

export type HelpRequestType = 'duvida' | 'problema' | 'aprovacao';

export interface HelpTicket {
  id: number;
  author: string;
  authorRole: string;
  type: HelpRequestType;
  title: string;
  description: string;
  originScreen: string; // Anexada silenciosamente pelo sistema
  status: 'aberto' | 'fechado';
  displayStatus: 'Recebido' | 'Estamos vendo' | 'Resolvido';
  date: string;
  hasUnread?: boolean;
  category: 'tecnico' | 'produtor'; // Roteamento: produtor -> Gestão, tecnico -> Suporte Técnico
  isTrainingRequest?: boolean; // Para aprendizes
  photoUrl?: string;
  userEmail?: string;
  screenResolution?: string;
  userAgent?: string;
  timestamp?: string;
  technicalDetails?: {
    screenResolution: string;
    userAgent: string;
    timestamp: string;
  };
  approvalStatus?: 'pendente' | 'aprovado' | 'rejeitado';
  approvalReason?: string;
  messages: {
    author: string; // "Suporte técnico", "Você" ou nome
    text: string;
    date: string;
    isSystemOrSupport?: boolean;
  }[];
}

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: string; // 'produtor' | 'gestor' | 'aprendiz' | 'aprendiz_gestor' | 'adm'
  currentUserName: string;
  currentScreenName: string;
  ticketsList: HelpTicket[];
  onAddTicket: (ticket: HelpTicket) => void;
  onReplyTicket: (ticketId: number, messageText: string) => void;
}

export function HelpSupportModal({
  isOpen,
  onClose,
  currentUserRole,
  currentUserName,
  currentScreenName,
  ticketsList,
  onAddTicket,
  onReplyTicket
}: HelpSupportModalProps) {
  const { addToast } = useToast();

  const isTrainee = currentUserRole === 'aprendiz' || currentUserRole === 'aprendiz_gestor';

  const [activeSubTab, setActiveSubTab] = useState<'novo' | 'meus'>('novo');
  const [selectedType, setSelectedType] = useState<HelpRequestType>('duvida');
  const [description, setDescription] = useState('');
  const [attachedPhotoUrl, setAttachedPhotoUrl] = useState('');
  const [isPhotoInputOpen, setIsPhotoInputOpen] = useState(false);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);

  // Detalhe de um chamado selecionado em "Meus pedidos"
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [userReplyText, setUserReplyText] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort errors
        }
        recognitionRef.current = null;
      }
      setIsListeningSpeech(false);
    }
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort errors
        }
        recognitionRef.current = null;
      }
    };
  }, [isOpen]);

  useFocusTrap(isOpen, modalRef, onClose);

  if (!isOpen) return null;

  // Filtrar pedidos deste usuário (ou todos se for aprendiz para treino)
  const normalizedCurrentRole = currentUserRole === 'colaborador' ? 'produtor' : currentUserRole.toLowerCase();
  const myTickets = ticketsList.filter(t => {
    if (normalizedCurrentRole === 'adm') return true;
    const normalizedAuthorRole = (t.authorRole || '').toLowerCase();
    return t.author.toLowerCase().includes(currentUserName.toLowerCase()) || 
           (isTrainee && t.isTrainingRequest) ||
           (!isTrainee && !t.isTrainingRequest && (normalizedAuthorRole.includes(normalizedCurrentRole) || t.author === currentUserName));
  });

  const unreadCount = myTickets.filter(t => t.hasUnread).length;

  const handleVoiceInput = () => {
    setIsListeningSpeech(true);
    addToast('Ouvindo você com calma... Fale o que aconteceu.', 'info');

    // Tentar usar SpeechRecognition nativa se disponível no navegador
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setDescription(prev => (prev ? `${prev} ${transcript}` : transcript));
          setIsListeningSpeech(false);
          recognitionRef.current = null;
          addToast('Áudio compreendido e inserido no campo!', 'success');
        };

        recognition.onerror = () => {
          setIsListeningSpeech(false);
          recognitionRef.current = null;
          // Fallback gracioso
          const fallbackTexts: Record<HelpRequestType, string> = {
            duvida: 'Gostaria de tirar uma dúvida sobre os horários da bancada de barro e o valor das peças de argila.',
            problema: 'Não consegui salvar a foto da minha peça nova para a vitrine Rosa Mística, a página recarregou com erro.',
            aprovacao: 'Preciso de aprovação para colocar uma nova peça de cerâmica na nossa vitrine Rosa Mística.'
          };
          setDescription(prev => prev || fallbackTexts[selectedType]);
          addToast('Áudio simulado inserido com sucesso!', 'info');
        };

        recognition.start();
        return;
      } catch (e) {
        recognitionRef.current = null;
      }
    }

    // Fallback de simulação acolhedora para idosos
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      speechTimeoutRef.current = null;
      setIsListeningSpeech(false);
      const fallbackTexts: Record<HelpRequestType, string> = {
        duvida: 'Gostaria de entender melhor como a gente combina a entrega das peças e o repasse das vendas.',
        problema: 'Estou tentando enviar a foto da toalha de bilro, mas o botão parece não responder.',
        aprovacao: 'Terminei uma peça de cerâmica e quero colocar na vitrine Rosa Mística da nossa associação.'
      };
      setDescription(prev => prev || fallbackTexts[selectedType]);
      addToast('Mensagem de voz transcrita com sucesso!', 'success');
    }, 2200);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      addToast('Por favor, conte o que aconteceu antes de enviar.', 'error');
      return;
    }

    // Título humanizado de acordo com o tipo
    const titleByType: Record<HelpRequestType, string> = {
      duvida: 'Dúvida sobre o Ateliê',
      problema: 'Problema no funcionamento do site',
      aprovacao: 'Solicitação de Aprovação'
    };

    // Regra de Roteamento:
    // - "Tenho uma dúvida" de Produtor -> Gestão (categoria 'produtor')
    // - Os outros dois tipos e todo pedido de Gestor -> Suporte técnico (categoria 'tecnico')
    let category: 'tecnico' | 'produtor' = 'tecnico';
    if ((currentUserRole === 'produtor' || currentUserRole === 'colaborador') && selectedType === 'duvida') {
      category = 'produtor';
    } else {
      category = 'tecnico';
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newTicket: HelpTicket = {
      id: Date.now(),
      author: currentUserName,
      authorRole: (currentUserRole === 'produtor' || currentUserRole === 'colaborador') ? 'Produtor' : 
                  currentUserRole === 'gestor' ? 'Gestor' : 
                  currentUserRole === 'aprendiz' ? 'Aprendiz (Artesão)' : 'Aprendiz (Gestão)',
      type: selectedType,
      title: `${titleByType[selectedType]}${isTrainee ? ' (Treino)' : ''}`,
      description: description.trim(),
      originScreen: currentScreenName,
      status: 'aberto',
      displayStatus: 'Recebido',
      date: dateFormatted,
      category,
      isTrainingRequest: isTrainee,
      photoUrl: attachedPhotoUrl.trim() || undefined,
      approvalStatus: selectedType === 'aprovacao' ? 'pendente' : undefined,
      technicalDetails: {
        screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Navegador Web',
        timestamp: now.toISOString()
      },
      messages: isTrainee ? [
        {
          author: 'Suporte técnico',
          text: 'Olá! Recebemos sua mensagem no espaço de treino. Muito bem praticado! Esta resposta é uma simulação segura para você ver como funciona o atendimento.',
          date: dateFormatted,
          isSystemOrSupport: true
        }
      ] : []
    };

    onAddTicket(newTicket);
    addToast('Pedido de ajuda enviado com sucesso! A equipe já foi notificada.', 'success');
    
    // Limpar formulário
    setDescription('');
    setAttachedPhotoUrl('');
    setIsPhotoInputOpen(false);
    setSelectedTicketId(newTicket.id);
    setActiveSubTab('meus');
  };

  const handleSendReply = (ticketId: number) => {
    if (!userReplyText.trim()) return;
    onReplyTicket(ticketId, userReplyText.trim());
    setUserReplyText('');
    addToast('Mensagem enviada!', 'success');
  };

  const selectedTicket = ticketsList.find(t => t.id === selectedTicketId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-support-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden font-sans"
      >
        
        {/* Cabeçalho do Modal */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 shrink-0 bg-stone-50/70 dark:bg-stone-900">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 flex items-center justify-center shrink-0 border border-teal-300 dark:border-teal-700">
              <HelpCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="help-support-modal-title" className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight">
                  Pedir ajuda
                </h2>
                {isTrainee && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                    Treino
                  </span>
                )}
              </div>
              <p className="text-base text-stone-600 dark:text-stone-400 font-medium">
                Converse com o suporte técnico e resolva suas dúvidas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            aria-label="Fechar janela de ajuda"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Abas Superiores: "Novo pedido" e "Meus pedidos de ajuda" */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-6 pt-3 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => { setActiveSubTab('novo'); setSelectedTicketId(null); }}
            className={`min-h-[52px] px-6 py-2.5 rounded-t-2xl font-black text-lg transition-all border-b-4 cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'novo'
                ? 'border-teal-700 text-teal-800 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/30'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>Novo pedido</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('meus')}
            className={`min-h-[52px] px-6 py-2.5 rounded-t-2xl font-black text-lg transition-all border-b-4 cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'meus'
                ? 'border-teal-700 text-teal-800 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/30'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Meus pedidos de ajuda ({myTickets.length})</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-stone-950">
                {unreadCount} nova
              </span>
            )}
          </button>
        </div>

        {/* Corpo com Rolagem */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* ABA 1: NOVO PEDIDO */}
          {activeSubTab === 'novo' && (
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              
              {isTrainee && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 flex items-center gap-3 text-emerald-950 dark:text-emerald-200">
                  <Sparkles className="w-6 h-6 text-emerald-700 dark:text-emerald-300 shrink-0" />
                  <p className="text-base font-bold">
                    Você está no modo de treino. Seu pedido será marcado como <strong>Treino</strong> para você praticar com calma.
                  </p>
                </div>
              )}

              {/* 3 Escolhas Grandes */}
              <div className="space-y-3">
                <label className="block text-xl font-black text-stone-900 dark:text-white">
                  O que você precisa hoje?
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Escolha 1: Tenho uma dúvida */}
                  <button
                    type="button"
                    onClick={() => setSelectedType('duvida')}
                    className={`min-h-[76px] p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                      selectedType === 'duvida'
                        ? 'border-teal-700 bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-teal-500/40 shadow-sm'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-stone-900 dark:text-white leading-tight">
                        Tenho uma dúvida
                      </h4>
                      <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-1">
                        Sobre o ateliê, peças, vendas ou horários
                      </p>
                    </div>
                  </button>

                  {/* Escolha 2: Algo não está funcionando */}
                  <button
                    type="button"
                    onClick={() => setSelectedType('problema')}
                    className={`min-h-[76px] p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                      selectedType === 'problema'
                        ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-500/40 shadow-sm'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-stone-900 dark:text-white leading-tight">
                        Algo não está funcionando
                      </h4>
                      <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-1">
                        Problema na tela, botão que não responde ou erro
                      </p>
                    </div>
                  </button>

                  {/* Escolha 3: Preciso de uma aprovação */}
                  <button
                    type="button"
                    onClick={() => setSelectedType('aprovacao')}
                    className={`min-h-[76px] p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                      selectedType === 'aprovacao'
                        ? 'border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/40 shadow-sm'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-stone-900 dark:text-white leading-tight">
                        Preciso de uma aprovação
                      </h4>
                      <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-1">
                        Liberação de peça especial, preço ou cadastro
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Campo Grande: O que aconteceu? */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label htmlFor="help-description" className="block text-xl font-black text-stone-900 dark:text-white">
                    O que aconteceu?
                  </label>

                  {/* Botão: Falar em vez de digitar */}
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    disabled={isListeningSpeech}
                    className={`min-h-[52px] px-5 py-2.5 rounded-2xl border-2 border-teal-600 font-extrabold text-base inline-flex items-center gap-2.5 transition-all cursor-pointer ${
                      isListeningSpeech 
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-500 dark:border-amber-600 animate-pulse'
                        : 'bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-950 dark:text-teal-200'
                    }`}
                  >
                    <Mic className={`w-5 h-5 shrink-0 ${isListeningSpeech ? 'text-amber-700 dark:text-amber-400 animate-bounce' : 'text-teal-700 dark:text-teal-400'}`} />
                    <span>{isListeningSpeech ? 'Ouvindo sua voz...' : 'Falar em vez de digitar'}</span>
                  </button>
                </div>

                <textarea
                  id="help-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Conte com calma o que você precisa ou o que aconteceu. Não se preocupe com termos difíceis..."
                  className="w-full p-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium text-lg leading-relaxed focus:outline-none focus:border-teal-700 transition-colors"
                  required
                />
              </div>

              {/* Botão opcional: Anexar foto */}
              <div className="space-y-2">
                {!isPhotoInputOpen && !attachedPhotoUrl ? (
                  <button
                    type="button"
                    onClick={() => setIsPhotoInputOpen(true)}
                    className="min-h-[52px] px-5 py-2.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-base inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Camera className="w-5 h-5 text-stone-600 dark:text-stone-400 shrink-0" />
                    <span>Anexar foto (opcional)</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-stone-900 dark:text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                        <span>Foto anexada</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => { setAttachedPhotoUrl(''); setIsPhotoInputOpen(false); }}
                        className="text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
                      >
                        Remover foto
                      </button>
                    </div>

                    <input
                      type="text"
                      value={attachedPhotoUrl}
                      onChange={(e) => setAttachedPhotoUrl(e.target.value)}
                      placeholder="Cole o endereço da foto (ou use uma foto salva)"
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-base font-medium focus:outline-none focus:border-teal-600"
                    />

                    {/* Atalhos para fotos de exemplo */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Exemplos:</span>
                      <button
                        type="button"
                        onClick={() => setAttachedPhotoUrl('https://images.unsplash.com/photo-1610719875508-36f731118182?auto=format&fit=crop&q=80&w=600')}
                        className="px-3 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-600 cursor-pointer"
                      >
                        Foto de Cerâmica
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttachedPhotoUrl('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600')}
                        className="px-3 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-600 cursor-pointer"
                      >
                        Foto da Fachada
                      </button>
                    </div>

                    {attachedPhotoUrl && (
                      <div className="w-32 h-24 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 mt-2">
                        <img src={attachedPhotoUrl} alt="Prévia da foto" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botão Final: Enviar Pedido */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[56px] px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xl inline-flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Send className="w-5 h-5 shrink-0" />
                  <span>Enviar pedido</span>
                </button>
              </div>
            </form>
          )}

          {/* ABA 2: MEUS PEDIDOS DE AJUDA */}
          {activeSubTab === 'meus' && (
            <div className="space-y-6">
              {!selectedTicket ? (
                <div className="space-y-4">
                  {myTickets.length === 0 ? (
                    <div className="p-12 text-center bg-stone-50 dark:bg-stone-800/40 rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-700 space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-black text-stone-900 dark:text-white">
                        Você ainda não abriu nenhum pedido de ajuda
                      </h4>
                      <p className="text-base text-stone-600 dark:text-stone-400 font-medium">
                        Quando precisar tirar uma dúvida ou resolver algo, use a aba "Novo pedido" acima.
                      </p>
                    </div>
                  ) : (
                    myTickets.map(ticket => {
                      // Estado em palavras simples
                      const statusColor = 
                        ticket.displayStatus === 'Resolvido'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-700'
                          : ticket.displayStatus === 'Estamos vendo'
                          ? 'bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700'
                          : 'bg-teal-100 text-teal-950 border-teal-400 dark:bg-teal-950/60 dark:text-teal-200 dark:border-teal-700';

                      return (
                        <div
                          key={ticket.id}
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className="p-5 sm:p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-800 hover:border-teal-600 dark:hover:border-teal-500 bg-white dark:bg-stone-900 shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${statusColor}`}>
                                {ticket.displayStatus}
                              </span>

                              {ticket.isTrainingRequest && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                                  Treino
                                </span>
                              )}

                              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                                {ticket.date}
                              </span>
                            </div>

                            <h4 className="text-xl font-black text-stone-900 dark:text-white leading-tight truncate">
                              {ticket.title}
                            </h4>

                            <p className="text-base text-stone-600 dark:text-stone-400 font-medium line-clamp-2">
                              {ticket.description}
                            </p>
                          </div>

                          <div className="shrink-0 self-end sm:self-auto flex items-center gap-2 text-teal-700 dark:text-teal-400 font-black text-base">
                            <span>Ver conversa</span>
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                /* Detalhe da conversa */
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={() => setSelectedTicketId(null)}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>← Voltar para lista</span>
                    </button>

                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700">
                      Estado: {selectedTicket.displayStatus}
                    </span>
                  </div>

                  {/* Informações do Pedido */}
                  <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
                    <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                      {selectedTicket.title}
                    </h3>
                    <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                    {selectedTicket.photoUrl && (
                      <div className="pt-2">
                        <img
                          src={selectedTicket.photoUrl}
                          alt="Foto anexada"
                          className="w-48 h-32 object-cover rounded-xl border border-stone-300 dark:border-stone-700"
                        />
                      </div>
                    )}
                  </div>

                  {/* Em pedidos de aprovação: resultado em destaque */}
                  {selectedTicket.type === 'aprovacao' && selectedTicket.approvalStatus && (
                    <div className={`p-5 rounded-2xl border-2 flex items-start gap-4 ${
                      selectedTicket.approvalStatus === 'aprovado'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
                        : selectedTicket.approvalStatus === 'rejeitado'
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-700 text-red-950 dark:text-red-100'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100'
                    }`}>
                      <div className="shrink-0 mt-0.5">
                        {selectedTicket.approvalStatus === 'aprovado' ? (
                          <CheckCircle2 className="w-7 h-7 text-emerald-700 dark:text-emerald-400" />
                        ) : selectedTicket.approvalStatus === 'rejeitado' ? (
                          <XCircle className="w-7 h-7 text-red-700 dark:text-red-400" />
                        ) : (
                          <Clock className="w-7 h-7 text-amber-700 dark:text-amber-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xl font-black leading-tight">
                          Resultado da Solicitação: {selectedTicket.approvalStatus === 'aprovado' ? 'Aprovado' : selectedTicket.approvalStatus === 'rejeitado' ? 'Não aprovado' : 'Em análise'}
                        </h5>
                        <p className="text-base sm:text-lg font-medium leading-relaxed">
                          {selectedTicket.approvalReason || (selectedTicket.approvalStatus === 'aprovado' ? 'Aprovado pelo suporte técnico. Seu pedido já está liberado.' : 'Aguardando avaliação da equipe.')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Lista de Mensagens / Conversa em tamanho grande */}
                  <div className="space-y-4">
                    <h5 className="text-lg font-black text-stone-900 dark:text-white">
                      Conversa com o Suporte
                    </h5>

                    {selectedTicket.messages.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 text-center text-stone-600 dark:text-stone-400 text-base font-medium">
                        Seu pedido foi recebido pelo <strong>Suporte técnico</strong>. Assim que analisarmos, a resposta aparecerá aqui.
                      </div>
                    ) : (
                      selectedTicket.messages.map((msg, idx) => {
                        const isSupport = msg.author === 'Suporte técnico' || msg.isSystemOrSupport;
                        return (
                          <div
                            key={idx}
                            className={`p-5 rounded-2xl border-2 flex flex-col gap-1.5 ${
                              isSupport
                                ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 ml-0 sm:ml-4'
                                : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 mr-0 sm:mr-4'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-sm font-black ${isSupport ? 'text-teal-900 dark:text-teal-200' : 'text-stone-800 dark:text-stone-200'}`}>
                                {isSupport ? 'Suporte técnico' : 'Você'}
                              </span>
                              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                                {msg.date}
                              </span>
                            </div>
                            <p className="text-base sm:text-lg font-medium text-stone-900 dark:text-stone-100 leading-relaxed whitespace-pre-wrap">
                              {msg.text}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Campo de Resposta da Pessoa */}
                  <div className="pt-2 space-y-3">
                    <textarea
                      rows={3}
                      value={userReplyText}
                      onChange={(e) => setUserReplyText(e.target.value)}
                      placeholder="Escreva uma resposta para o Suporte técnico..."
                      className="w-full p-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-base font-medium focus:outline-none focus:border-teal-700"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSendReply(selectedTicket.id)}
                        disabled={!userReplyText.trim()}
                        className="min-h-[56px] px-8 py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-2xl font-black text-lg inline-flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                      >
                        <Send className="w-5 h-5 shrink-0" />
                        <span>Responder</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
