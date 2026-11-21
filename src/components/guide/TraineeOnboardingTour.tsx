import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck, Eye, Sparkles, Plus, Edit2, Trash2, Printer, LogOut,
  CheckCircle2, MessageCircle, HelpCircle, Camera, Video, ArrowRight,
  ArrowLeft, Check, X, Volume2, VolumeX, Compass, Users, Calendar, Newspaper, Lock
} from 'lucide-react';
import { useFocusTrap } from '../../hooks';

export type TraineeTourRole = 'aprendiz' | 'aprendiz_gestor';

export interface TourButtonHighlight {
  label: string;
  description: string;
  iconKey: TourIconKey;
  accent?: 'emerald' | 'amber' | 'stone' | 'red';
}

export type TourIconKey =
  | 'shield'
  | 'eye'
  | 'sparkles'
  | 'plus'
  | 'edit'
  | 'trash'
  | 'printer'
  | 'logout'
  | 'check'
  | 'whatsapp'
  | 'help'
  | 'camera'
  | 'video'
  | 'users'
  | 'calendar'
  | 'newspaper'
  | 'arrow'
  | 'lock';

export interface TraineeTourStep {
  id: string;
  title: string;
  description: string;
  iconKey: TourIconKey;
  buttonPreviewLabel: string;
  buttonPurpose: string;
  targetSelector?: string;
  tabToActivate?: string;
  extraButtons?: TourButtonHighlight[];
  afterCourseFeatures?: TourButtonHighlight[];
}

function renderTourIcon(iconKey: TourIconKey, className = 'w-6 h-6') {
  switch (iconKey) {
    case 'shield':
      return <ShieldCheck className={className} aria-hidden="true" />;
    case 'eye':
      return <Eye className={className} aria-hidden="true" />;
    case 'sparkles':
      return <Sparkles className={className} aria-hidden="true" />;
    case 'plus':
      return <Plus className={className} aria-hidden="true" />;
    case 'edit':
      return <Edit2 className={className} aria-hidden="true" />;
    case 'trash':
      return <Trash2 className={className} aria-hidden="true" />;
    case 'printer':
      return <Printer className={className} aria-hidden="true" />;
    case 'logout':
      return <LogOut className={className} aria-hidden="true" />;
    case 'check':
      return <CheckCircle2 className={className} aria-hidden="true" />;
    case 'whatsapp':
      return <MessageCircle className={className} aria-hidden="true" />;
    case 'help':
      return <HelpCircle className={className} aria-hidden="true" />;
    case 'camera':
      return <Camera className={className} aria-hidden="true" />;
    case 'video':
      return <Video className={className} aria-hidden="true" />;
    case 'users':
      return <Users className={className} aria-hidden="true" />;
    case 'calendar':
      return <Calendar className={className} aria-hidden="true" />;
    case 'newspaper':
      return <Newspaper className={className} aria-hidden="true" />;
    case 'arrow':
      return <ArrowRight className={className} aria-hidden="true" />;
    case 'lock':
      return <Lock className={className} aria-hidden="true" />;
  }
}

const TRAINEE_TOUR_STEPS: Record<TraineeTourRole, TraineeTourStep[]> = {
  aprendiz: [
    {
      id: 'sandbox-welcome',
      title: 'Bem-vinda ao seu espaço seguro de treino',
      description:
        'Aqui você aprende no seu tempo, sem risco de errar. Tudo o que você cadastrar aqui fica guardado apenas neste ambiente de teste e não aparece no site público.',
      iconKey: 'shield',
      buttonPreviewLabel: 'Espaço de Treino Protegido',
      buttonPurpose:
        'A faixa verde no topo confirma sempre que você está praticando em segurança.',
      targetSelector: '[data-tour="aprendiz-banner"]',
      tabToActivate: 'overview',
    },
    {
      id: 'accessibility-btn',
      title: 'Botão Acessibilidade: deixe a tela confortável',
      description:
        'Antes de começar, você pode aumentar o tamanho das letras, ligar o modo de alto contraste ou ativar a leitura simplificada com apenas um toque.',
      iconKey: 'eye',
      buttonPreviewLabel: 'Acessibilidade',
      buttonPurpose:
        'Abre os controles visuais (letra maior, contraste forte e tema claro/escuro) a qualquer momento.',
      targetSelector: '[data-tour="aprendiz-accessibility"]',
      tabToActivate: 'overview',
    },
    {
      id: 'first-steps-checklist',
      title: 'Primeiros passos e conclusão do curso inicial',
      description:
        'O quadro "Primeiros passos" mostra o que falta para completar seu treinamento inicial (ver a vitrine, cadastrar sua primeira peça de treino e finalizar a prática).',
      iconKey: 'sparkles',
      buttonPreviewLabel: 'Concluir treinamento inicial',
      buttonPurpose:
        'Ao completar as 3 etapas, aparece o aviso de parabéns para você aguardar o retorno da Associação Julieta Barros.',
      targetSelector: '[data-tour="aprendiz-steps"]',
      tabToActivate: 'overview',
      extraButtons: [
        {
          label: 'Ver etapas',
          description: 'Abre ou recolhe a lista das 3 etapas do curso inicial.',
          iconKey: 'arrow',
          accent: 'emerald',
        },
        {
          label: 'Ouvir',
          description: 'Lê em voz alta os avisos e mensagens importantes da tela.',
          iconKey: 'check',
          accent: 'amber',
        },
      ],
    },
    {
      id: 'add-product-btn',
      title: 'Botão Adicionar produto (Cadastro em 4 passos)',
      description:
        'Este botão verde abre o formulário passo a passo para você treinar como colocar foto, nome da peça, técnica, estoque e preço (limite de até 5 peças de treino).',
      iconKey: 'plus',
      buttonPreviewLabel: 'Adicionar produto',
      buttonPurpose:
        'Inicia o cadastro guiado de uma peça de treino em 4 telas simples e curtas.',
      targetSelector: '[data-tour="aprendiz-add-product"]',
      tabToActivate: 'overview',
      extraButtons: [
        {
          label: 'Imprimir (PDF)',
          description: 'Gera uma versão limpa da sua lista de peças para imprimir ou guardar.',
          iconKey: 'printer',
          accent: 'stone',
        },
      ],
    },
    {
      id: 'product-card-controls',
      title: 'Botões de controle em cada peça cadastrada',
      description:
        'Depois de criar uma peça, cada cartão traz botões simples para você praticar o controle do seu estoque e corrigir informações.',
      iconKey: 'edit',
      buttonPreviewLabel: 'Editar · + / − · Excluir',
      buttonPurpose:
        'Permite atualizar quantidades rapidamente, mudar texto/preço ou remover uma peça de teste.',
      targetSelector: '[data-tour="aprendiz-products-section"]',
      tabToActivate: 'overview',
      extraButtons: [
        {
          label: 'Botões − e +',
          description: 'Diminuem ou aumentam a quantidade de peças em estoque com um clique.',
          iconKey: 'plus',
          accent: 'emerald',
        },
        {
          label: 'Editar / Excluir',
          description: 'Edita nome, técnica e valor da peça ou apaga o rascunho com confirmação.',
          iconKey: 'trash',
          accent: 'red',
        },
      ],
    },
    {
      id: 'catalog-and-exit',
      title: 'Vitrine Rosa Mística e botão Sair',
      description:
        'Use a aba "Vitrine Rosa Mística" para conhecer como as peças oficiais são mostradas aos visitantes. Quando quiser encerrar, toque em "Sair".',
      iconKey: 'eye',
      buttonPreviewLabel: 'Vitrine Rosa Mística · Sair',
      buttonPurpose:
        'A vitrine mostra exemplos reais em modo leitura; o botão Sair desconecta com uma tela de confirmação.',
      targetSelector: '[data-tour="aprendiz-catalog-tab"]',
      extraButtons: [
        {
          label: 'Sair',
          description: 'Encerra seu acesso ao ambiente de treino depois de confirmar.',
          iconKey: 'logout',
          accent: 'stone',
        },
      ],
    },
    {
      id: 'after-course-features',
      title: 'O que será liberado após concluir o curso',
      description:
        'Depois que a Associação Julieta Barros avaliar e aprovar você para a Equipe de Produção Oficial, novas ferramentas aparecerão na sua tela:',
      iconKey: 'check',
      buttonPreviewLabel: 'Acesso Oficial de Produtor',
      buttonPurpose:
        'No ambiente de treino essas funções ficam ocultas para evitar envios reais por engano.',
      afterCourseFeatures: [
        {
          label: 'Meu Contato (WhatsApp)',
          description:
            'Você poderá cadastrar seu WhatsApp próprio e pausar ou ativar atendimentos direto com compradores.',
          iconKey: 'whatsapp',
          accent: 'emerald',
        },
        {
          label: 'Publicação na Vitrine Rosa Mística',
          description:
            'Suas peças passarão pela conferência da gestão e ficarão visíveis para toda a comunidade comprar.',
          iconKey: 'sparkles',
          accent: 'amber',
        },
        {
          label: 'Pedir Ajuda (Suporte Direto)',
          description:
            'Canal aberto com a equipe da associação para tirar dúvidas ou avisar sobre qualquer dificuldade.',
          iconKey: 'help',
          accent: 'stone',
        },
      ],
    },
  ],

  aprendiz_gestor: [
    {
      id: 'gestor-sandbox-welcome',
      title: 'Bem-vinda ao Treino de Gestão (Ambiente Seguro)',
      description:
        'Neste espaço você pratica as principais rotinas da coordenação do ateliê sem alterar nada no site público da associação.',
      iconKey: 'shield',
      buttonPreviewLabel: 'Ambiente Sandbox de Gestão',
      buttonPurpose:
        'Permite testar edições de texto, envio simulado de mídias e aprovação de peças com tranquilidade.',
      targetSelector: '[data-tour="gestor-banner"]',
      tabToActivate: 'inicio',
    },
    {
      id: 'gestor-accessibility',
      title: 'Botão Acessibilidade no topo da tela',
      description:
        'Precisa de letras maiores, contraste reforçado ou leitura mais limpa? Toque em "Acessibilidade" no topo da tela a qualquer momento.',
      iconKey: 'eye',
      buttonPreviewLabel: 'Acessibilidade',
      buttonPurpose:
        'Ajusta fonte, contraste e tema visual sem sair da tarefa que você está praticando.',
      targetSelector: '[data-tour="gestor-accessibility"]',
      tabToActivate: 'inicio',
    },
    {
      id: 'gestor-tasks',
      title: 'Painel "Seu treino" e botão Fazer tarefa',
      description:
        'O painel inicial lista as 4 tarefas práticas do curso. A barra verde avança conforme você conclui cada uma até liberar o aviso de conclusão.',
      iconKey: 'sparkles',
      buttonPreviewLabel: 'Fazer tarefa / Praticar novamente',
      buttonPurpose:
        'Leva você diretamente para a aba certa daquela tarefa e permite repetir quantas vezes quiser.',
      targetSelector: '[data-tour="gestor-tasks-card"]',
      tabToActivate: 'inicio',
    },
    {
      id: 'gestor-texts',
      title: 'Aba Textos do site e Publicar (simulação)',
      description:
        'Aqui você treina como atualizar o texto de apresentação do ateliê antes de ele ir para os visitantes.',
      iconKey: 'edit',
      buttonPreviewLabel: 'Publicar (simulação)',
      buttonPurpose:
        'Salva seu rascunho de texto localmente e marca a tarefa 1 como concluída no painel.',
      targetSelector: '[data-tour="gestor-text-submit"]',
      tabToActivate: 'textos',
    },
    {
      id: 'gestor-media',
      title: 'Aba Fotos e vídeos: botões de mídia simulada',
      description:
        'Nesta tela você pratica como registrar legendas de fotos das oficinas e colar links de vídeos educativos.',
      iconKey: 'camera',
      buttonPreviewLabel: 'Publicar foto · Publicar vídeo',
      buttonPurpose:
        'Simula o envio seguro de novas fotos e vídeos e conclui as tarefas 2 e 3 do seu treinamento.',
      targetSelector: '[data-tour="gestor-media-grid"]',
      tabToActivate: 'midia',
      extraButtons: [
        {
          label: 'Publicar foto (simulação)',
          description: 'Registra a legenda de uma foto de atividade artesanal no treino.',
          iconKey: 'camera',
          accent: 'emerald',
        },
        {
          label: 'Publicar vídeo (simulação)',
          description: 'Testa a inclusão de um endereço de vídeo do YouTube na galeria.',
          iconKey: 'video',
          accent: 'amber',
        },
      ],
    },
    {
      id: 'gestor-approve-exit',
      title: 'Aba Aprovar peças e botão Sair',
      description:
        'Antes de uma peça aparecer na vitrine Rosa Mística, a gestão confere foto, título e preço. Aqui você simula essa aprovação com segurança.',
      iconKey: 'check',
      buttonPreviewLabel: 'Publicar (simulação) · Sair',
      buttonPurpose:
        'Marca a peça de exemplo como aprovada na simulação; o botão Sair encerra sua sessão com confirmação.',
      targetSelector: '[data-tour="gestor-approve-card"]',
      tabToActivate: 'aprovar',
      extraButtons: [
        {
          label: 'Sair',
          description: 'Abre confirmação antes de voltar para a tela de entrada.',
          iconKey: 'logout',
          accent: 'stone',
        },
      ],
    },
    {
      id: 'gestor-after-course',
      title: 'O que é liberado após o curso (Gestor Oficial)',
      description:
        'Quando a Associação Julieta Barros aprovar sua promoção para a Equipe de Gestão Oficial, estas funções completas serão desbloqueadas:',
      iconKey: 'users',
      buttonPreviewLabel: 'Acesso Oficial de Gestão',
      buttonPurpose:
        'Durante o treinamento essas ferramentas reais ficam bloqueadas para proteger os dados da associação.',
      afterCourseFeatures: [
        {
          label: 'Pessoas e Cadastros',
          description:
            'Acompanhar todos os membros e promover aprendizes que concluíram o curso inicial.',
          iconKey: 'users',
          accent: 'emerald',
        },
        {
          label: 'Agenda de Eventos e Mural',
          description:
            'Publicar oficinas, cursos, feiras e avisos oficiais diretamente na página pública e para visitantes.',
          iconKey: 'calendar',
          accent: 'amber',
        },
        {
          label: 'Revisão Real de Peças & Suporte',
          description:
            'Aprovar ou solicitar ajustes em peças reais dos artesãos e conversar com o suporte técnico.',
          iconKey: 'newspaper',
          accent: 'stone',
        },
      ],
    },
  ],
};

interface TraineeOnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  role: TraineeTourRole;
  onActivateTab?: (tab: string) => void;
}

export function TraineeOnboardingTour({
  isOpen,
  onClose,
  role,
}: TraineeOnboardingTourProps) {
  const steps = TRAINEE_TOUR_STEPS[role];
  const [stepIndex, setStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    stopSpeaking();
    try {
      localStorage.setItem(`potengi_trainee_tour_done_${role}`, 'true');
    } catch {
      // ignore storage errors
    }
    onClose();
  }, [onClose, role, stopSpeaking]);

  useFocusTrap(isOpen, dialogRef, handleClose);

  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
      stopSpeaking();
    }
  }, [isOpen, role, stopSpeaking]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const currentStep = steps[stepIndex] || steps[0];

  if (!isOpen) return null;

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    window.speechSynthesis.cancel();
    const parts = [
      currentStep.title,
      currentStep.description,
      `Objetivo: ${currentStep.buttonPurpose}`,
    ];
    if (currentStep.afterCourseFeatures) {
      parts.push(
        ...currentStep.afterCourseFeatures.map((f) => `${f.label}: ${f.description}`)
      );
    }
    const utterance = new SpeechSynthesisUtterance(parts.join('. '));
    utterance.lang = 'pt-BR';
    utterance.rate = 0.88;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    stopSpeaking();
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    stopSpeaking();
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end sm:items-center justify-center p-2 sm:p-5 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200 motion-reduce:animate-none"
      onClick={handleClose}
      role="presentation"
    >
      {/* Cartão Principal do Tour Guiado */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trainee-tour-title"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-stone-900 border-2 border-emerald-400 dark:border-emerald-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
      >
        {/* Cabeçalho do Tour */}
        <div className="px-4 sm:px-6 py-4 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-sm shrink-0">
              <Compass className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-300 tabular-nums">
                Tour Guiado · Etapa {stepIndex + 1} de {steps.length}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-stone-800 dark:text-stone-200 truncate">
                {role === 'aprendiz' ? 'Aprendiz Artesão (Espaço de Treino)' : 'Aprendiz de Gestão (Espaço de Treino)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar tour guiado"
            className="min-h-[48px] px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-bold text-sm flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Pular tour</span>
          </button>
        </div>

        {/* Barra de progresso das etapas */}
        <div className="px-4 sm:px-6 pt-3 flex items-center gap-1.5 shrink-0" role="tablist" aria-label="Etapas do tour guiado">
          {steps.map((step, idx) => {
            const isCurrent = idx === stepIndex;
            const isPast = idx < stepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setStepIndex(idx);
                }}
                aria-selected={isCurrent}
                aria-label={`Ir para etapa ${idx + 1}: ${step.title}`}
                className={`h-2.5 flex-1 rounded-full transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500'
                    : isPast
                    ? 'bg-emerald-600'
                    : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                }`}
              />
            );
          })}
        </div>

        {/* Conteúdo Rolável */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Bloco com Ícone em Realce + Título */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-2 border-amber-400 dark:border-amber-600 ring-4 ring-amber-400/25 flex items-center justify-center shrink-0 shadow-sm">
              {renderTourIcon(currentStep.iconKey, 'w-9 h-9 sm:w-10 sm:h-10')}
            </div>

            <div className="space-y-2 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-xs">
                {renderTourIcon(currentStep.iconKey, 'w-4 h-4 shrink-0')}
                <span>{currentStep.buttonPreviewLabel}</span>
              </div>
              <h2 id="trainee-tour-title" className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight">
                {currentStep.title}
              </h2>
            </div>
          </div>

          <p className="text-base sm:text-[18px] text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
            {currentStep.description}
          </p>

          {/* Objetivo do Botão em Destaque */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800 space-y-1">
            <p className="text-xs sm:text-sm font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              Objetivo deste recurso
            </p>
            <p className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
              {currentStep.buttonPurpose}
            </p>
          </div>

          {/* Botões relacionados da mesma tela */}
          {currentStep.extraButtons && currentStep.extraButtons.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wide text-stone-600 dark:text-stone-400">
                Outros botões desta área
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.extraButtons.map((btn) => (
                  <div
                    key={btn.label}
                    className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex items-start gap-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        btn.accent === 'amber'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:border-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                          : btn.accent === 'red'
                          ? 'bg-red-100 text-red-700 border-red-300 dark:border-red-700 dark:bg-red-950/70 dark:text-red-300'
                          : btn.accent === 'stone'
                          ? 'bg-stone-200 text-stone-800 border-stone-300 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:border-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                      }`}
                    >
                      {renderTourIcon(btn.iconKey, 'w-5 h-5')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm sm:text-base text-stone-900 dark:text-white leading-snug">
                        {btn.label}
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium leading-snug mt-0.5">
                        {btn.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Funcionalidades Desbloqueadas Após o Curso */}
          {currentStep.afterCourseFeatures && currentStep.afterCourseFeatures.length > 0 && (
            <div className="space-y-3">
              {currentStep.afterCourseFeatures.map((feat) => (
                <div
                  key={feat.label}
                  className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 flex items-start gap-3.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center justify-center shrink-0">
                    {renderTourIcon(feat.iconKey, 'w-6 h-6')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-base sm:text-lg text-stone-900 dark:text-white leading-snug">
                      {feat.label}
                    </h3>
                    <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium leading-relaxed mt-0.5">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botão Ouvir Voz */}
          <div>
            <button
              type="button"
              onClick={handleToggleSpeak}
              className={`min-h-[52px] px-5 py-2.5 rounded-2xl font-black text-base inline-flex items-center gap-2.5 border-2 transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-600 border-amber-700 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Parar leitura</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                  <span>Ouvir explicação</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rodapé com Navegação Step-by-Step */}
        <div className="px-4 sm:px-6 py-4 bg-stone-50 dark:bg-stone-950/90 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className={`min-h-[56px] px-5 py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-colors flex-1 sm:flex-initial ${
              stepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-stone-400 dark:text-stone-600 border border-stone-200 dark:border-stone-800'
                : 'text-stone-800 dark:text-stone-200 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 border-2 border-stone-300 dark:border-stone-700 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Anterior</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="min-h-[56px] px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer active:scale-95 flex-1 sm:flex-initial"
          >
            <span>
              {stepIndex === steps.length - 1 ? 'Concluir e praticar' : 'Próximo passo'}
            </span>
            {stepIndex === steps.length - 1 ? (
              <Check className="w-5 h-5 shrink-0" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
