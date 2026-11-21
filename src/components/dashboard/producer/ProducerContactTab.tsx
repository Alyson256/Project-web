import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Box,
  Clock,
  Eye,
  Heart,
  HelpCircle,
  MessageCircle,
  Pause,
  Play,
  Save,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { formatWhatsAppNumber } from '../../../lib';

interface ProducerContactTabProps {
  sellerWhatsapp: string;
  setSellerWhatsapp: React.Dispatch<React.SetStateAction<string>>;
  sellerAuthorized: boolean;
  setSellerAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
  sellerReceiveNow: boolean;
  onSaveContactSettings: (e?: React.FormEvent) => void;
  onToggleReceiveNow: () => void;
  onOpenDeleteConfirm: () => void;
  onOpenHelpModal?: () => void;
}

export const ProducerContactTab: React.FC<ProducerContactTabProps> = ({
  sellerWhatsapp,
  setSellerWhatsapp,
  sellerAuthorized,
  setSellerAuthorized,
  sellerReceiveNow,
  onSaveContactSettings,
  onToggleReceiveNow,
  onOpenDeleteConfirm,
  onOpenHelpModal,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Cabeçalho da Seção */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 shrink-0">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Meu contato e WhatsApp
            </h1>
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium max-w-2xl mt-0.5">
              A gente conecta quem visita a vitrine diretamente com você no WhatsApp, com total segurança e respeito ao seu tempo.
            </p>
          </div>
        </div>
        <div
          className={`px-4 py-2.5 rounded-2xl font-black text-sm sm:text-base border-2 shrink-0 ${
            sellerReceiveNow
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
              : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
          }`}
        >
          {sellerReceiveNow ? '● Recebendo conversas' : '⏸ Contatos pausados'}
        </div>
      </div>

      {/* Layout CSS Grid: 12 Colunas (7 colunas para formulário + 5 colunas para prévia viva e suporte) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Formulário e Ajustes (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={onSaveContactSettings}
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6"
          >
            {/* Campo: Meu WhatsApp (com DDD) */}
            <div className="space-y-3">
              <label htmlFor="seller-whatsapp" className="block text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                Meu WhatsApp (com DDD)
              </label>
              <div className="w-full">
                <input
                  id="seller-whatsapp"
                  type="tel"
                  inputMode="numeric"
                  value={sellerWhatsapp}
                  onChange={(e) => setSellerWhatsapp(formatWhatsAppNumber(e.target.value))}
                  placeholder="84 99999-9999"
                  className="w-full min-h-[56px] px-5 py-3.5 border-2 border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xl sm:text-2xl font-bold placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all shadow-xs"
                />
                <p className="text-base text-stone-600 dark:text-stone-400 font-medium mt-2 leading-relaxed">
                  O número não fica exposto abertamente na página. Ao tocar em &apos;Falar com o vendedor&apos;, quem compra inicia uma conversa diretamente com você no WhatsApp.
                </p>
              </div>
            </div>

            {/* Caixa de Marcação: Autorização */}
            <div className="pt-2">
              <label className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                <input
                  type="checkbox"
                  checked={sellerAuthorized}
                  onChange={(e) => setSellerAuthorized(e.target.checked)}
                  className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg accent-emerald-700 text-emerald-700 border-2 border-stone-400 focus:ring-emerald-500 mt-0.5 shrink-0 cursor-pointer"
                />
                <span className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
                  Autorizo que pessoas cadastradas no site me chamem neste número para falar sobre minhas peças
                </span>
              </label>
            </div>

            {/* Interruptor Grande: Receber contatos agora */}
            <div className="pt-2 border-t-2 border-stone-100 dark:border-stone-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40">
                <div className="space-y-1">
                  <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white block">
                    Receber contatos agora
                  </span>
                  <p
                    className={`text-lg sm:text-xl font-black ${
                      sellerReceiveNow ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {sellerReceiveNow ? 'Você está recebendo contatos' : 'Contatos pausados'}
                  </p>
                  <p className="text-base text-stone-600 dark:text-stone-300 font-medium">
                    {sellerReceiveNow
                      ? 'Visitantes cadastrados podem tocar no botão para falar com você no WhatsApp.'
                      : 'Seus produtos mostram "Vendedor indisponível no momento" para você descansar.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onToggleReceiveNow}
                  aria-label={sellerReceiveNow ? 'Pausar contatos no WhatsApp' : 'Voltar a receber contatos no WhatsApp'}
                  className={`min-h-[56px] px-6 py-3.5 rounded-2xl font-black text-[18px] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm shrink-0 active:scale-95 ${
                    sellerReceiveNow
                      ? 'bg-stone-200 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-900 dark:text-white border-2 border-stone-300 dark:border-stone-600'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md'
                  }`}
                >
                  {sellerReceiveNow ? (
                    <>
                      <Pause className="w-5 h-5 shrink-0" />
                      <span>Pausar contatos</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 shrink-0" />
                      <span>Voltar a receber contatos</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="pt-2 space-y-3">
              {!sellerAuthorized && (
                <p className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Marque a autorização acima para salvar as alterações.</span>
                </p>
              )}
              <button
                type="submit"
                disabled={!sellerAuthorized}
                className={`w-full min-h-[56px] px-8 py-3.5 rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-3 transition-all ${
                  sellerAuthorized
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md cursor-pointer active:scale-95'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed border-2 border-stone-300 dark:border-stone-700'
                }`}
              >
                <Save className="w-6 h-6 shrink-0" />
                <span>Salvar configurações de contato</span>
              </button>
            </div>

            {/* Botão para apagar número de contato */}
            <div className="pt-4 border-t-2 border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={onOpenDeleteConfirm}
                className="min-h-[52px] px-5 py-3 rounded-2xl border-2 border-red-300 dark:border-red-800 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-800 dark:text-red-300 font-extrabold text-base flex items-center justify-center gap-2.5 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Trash2 className="w-5 h-5 shrink-0" />
                <span>Apagar meu número e parar de receber contatos</span>
              </button>
            </div>
          </form>
        </div>

        {/* Coluna Direita: Prévia Ao Vivo + Ajuda e Segurança (5 colunas) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
              <Eye className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-xl font-black text-stone-900 dark:text-white leading-tight">
                  Como as pessoas veem sua peça
                </h3>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  Prévia ao vivo do botão na vitrine Rosa Mística
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 p-4 space-y-4">
              <div className="aspect-[16/10] rounded-xl bg-stone-200 dark:bg-stone-700 flex items-center justify-center relative overflow-hidden">
                <Box className="w-10 h-10 text-stone-400" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-stone-900/80 text-white">
                  Artesanato
                </span>
                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white">
                  Em Exposição
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-stone-900 dark:text-white leading-snug">
                  Peça de Exemplo da Sua Coleção
                </h4>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  Autoria: Você (Sua Coleção)
                </p>
              </div>

              <div className="flex items-baseline justify-between border-t border-stone-200 dark:border-stone-700 pt-2">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Valor sugerido</span>
                <span className="text-xl font-black text-stone-900 dark:text-white">R$ 85,00</span>
              </div>

              {sellerReceiveNow ? (
                <div className="w-full min-h-[48px] px-4 py-3 bg-emerald-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xs">
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Falar com o vendedor no WhatsApp</span>
                </div>
              ) : (
                <div className="w-full min-h-[48px] px-4 py-3 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-sm rounded-xl border border-stone-300 dark:border-stone-600 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0" />
                  <span>Vendedor indisponível no momento</span>
                </div>
              )}

              <p className="text-xs text-stone-500 dark:text-stone-400 text-center font-medium">
                Esta prévia reflete imediatamente o botão de pausa ou recebimento ao lado.
              </p>
            </div>
          </div>

          {/* Cartão "Alguém me incomodou?" */}
          <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6 text-amber-700 dark:text-amber-400 shrink-0" />
                <h3 className="text-xl font-black text-amber-950 dark:text-amber-100">
                  Alguém te incomodou?
                </h3>
              </div>
              <p className="text-base font-medium text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                Se você recebeu mensagens indesejadas, você pode pausar os contatos acima a qualquer momento e falar com o suporte.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenHelpModal}
              className="min-h-[52px] px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2.5 shadow-xs w-full cursor-pointer active:scale-95"
            >
              <HelpCircle className="w-5 h-5 shrink-0" />
              <span>Pedir ajuda ao suporte</span>
            </button>
          </div>

          {/* Cartão de Dicas e Convivência */}
          <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700 space-y-3">
            <h4 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <span>Dicas de convivência e acolhimento</span>
            </h4>
            <ul className="text-sm text-stone-700 dark:text-stone-300 font-medium space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">•</span>
                <span>Combine entregas e retiradas preferencialmente no ateliê da Associação Julieta Barros.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">•</span>
                <span>Defina horários de atendimento confortáveis e pause os contatos sempre que precisar de descanso.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">•</span>
                <span>A gente cuida uns dos outros: qualquer dúvida, acione nossa equipe.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
