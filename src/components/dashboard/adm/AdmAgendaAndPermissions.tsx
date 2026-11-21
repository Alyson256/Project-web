import React from 'react';
import {
  AlertTriangle,
  Box,
  Calendar as CalendarIcon,
  Check,
  Download,
  Palette,
  Printer,
  Shield,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { useLanguage } from '../../../contexts';
import { formatLocalDatePtBr } from '../../../lib';
import type { EventItem } from '../../../types';
import { PrivacyWarning } from '../shared';

export const AdmPermissionsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Cargos e Permissões do Sistema
        </h2>
        <p className="text-base text-stone-700 dark:text-stone-300 font-medium mt-1">
          Visão técnica dos 6 níveis de acesso, políticas de segurança e isolamento de privilégios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-stone-900 dark:text-white">1. Visitante</h4>
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Público geral</span>
            </div>
          </div>
          <ul className="text-base text-stone-700 dark:text-stone-300 font-medium space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Visualização das peças na vitrine Rosa Mística</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Conversa direta com quem produz pelo WhatsApp</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Pode receber convite da gente para aprender no ateliê</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shrink-0">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-stone-900 dark:text-white">2. Aprendiz Artesão</h4>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Treinamento prático</span>
            </div>
          </div>
          <ul className="text-base text-stone-700 dark:text-stone-300 font-medium space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Tutoriais guiados passo a passo</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Cadastro simulado de peças (rascunhos)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Promovido pela Gestão para Produtor Oficial</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-stone-900 dark:text-white">3. Aprendiz Gestão</h4>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400">Treinamento de liderança</span>
            </div>
          </div>
          <ul className="text-base text-stone-700 dark:text-stone-300 font-medium space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Painel reduzido com 4 tarefas práticas</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Simula textos, fotos, vídeos e aprovação</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Promoção para Gestor com 3 dias de análise e rollback</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950/60 flex items-center justify-center text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700 shrink-0">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-stone-900 dark:text-white">4. Equipe de Produção</h4>
              <span className="text-xs font-bold text-green-700 dark:text-green-400">Quem produz na nossa associação</span>
            </div>
          </div>
          <ul className="text-base text-stone-700 dark:text-stone-300 font-medium space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Cadastro de peças para o Departamento Rosa Mística</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Acompanhamento de vendas e eventos</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Canal de ajuda (dúvidas vão para a gestão)</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-700 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-200 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-900 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-700 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-stone-900 dark:text-white">5. Equipe de Gestão</h4>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Cuidado do nosso espaço</span>
            </div>
          </div>
          <ul className="text-base text-stone-700 dark:text-stone-300 font-medium space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Aprovação de peças para a vitrine Rosa Mística</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Pessoas, treinamentos e promoções</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>Edição de textos, fotos e vídeos</span>
            </li>
            <li className="flex items-start gap-2 text-rose-700 dark:text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4 mt-1 shrink-0" />
              <span>Sem permissão para promover a Administrador</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-teal-50/60 dark:bg-teal-950/30 border-2 border-teal-500 dark:border-teal-600 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center border border-teal-600 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-stone-900 dark:text-white">6. Administrador Técnico</h4>
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300">Área técnica e suporte</span>
            </div>
          </div>
          <ul className="text-base text-stone-700 dark:text-stone-300 font-medium space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-1 shrink-0" />
              <span>Chamados técnicos e pedidos de aprovação</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-1 shrink-0" />
              <span>Lixeira de fotos/vídeos protegida por 30 dias</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-1 shrink-0" />
              <span>Respostas saem anonimizadas como &quot;Suporte técnico&quot;</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-1 shrink-0" />
              <span>Histórico e auditoria técnica do sistema</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface AdmAgendaTabProps {
  eventsList: EventItem[];
  isTraineeManager: boolean;
  onAddEventSubmit: (e: React.FormEvent) => void;
  onPrint: () => void;
  onExportEventsToCSV: () => void;
}

export const AdmAgendaTab: React.FC<AdmAgendaTabProps> = ({
  eventsList,
  isTraineeManager,
  onAddEventSubmit,
  onPrint,
  onExportEventsToCSV,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white">{t('dash.gestao_agenda')}</h2>
        <div className="flex gap-2">
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-lg font-bold text-sm transition-colors no-print cursor-pointer"
            aria-label="Imprimir Agenda"
          >
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          <button
            onClick={onExportEventsToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-lg font-bold text-sm transition-colors no-print cursor-pointer"
            aria-label="Exportar agenda para CSV"
          >
            <Download className="w-4 h-4" /> Salvar Planilha
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm no-print">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6">Cadastrar Novo Evento</h2>
        <form className="space-y-4" onSubmit={onAddEventSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              aria-label="Nome do Evento"
              placeholder="Nome do Evento"
              className="w-full min-h-[56px] px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-500"
              required
            />
            <input
              type="date"
              aria-label="Data do Evento"
              className="w-full min-h-[56px] px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="time"
              aria-label="Horário do Evento"
              className="w-full min-h-[56px] px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-500"
              required
            />
            <select
              aria-label="Tipo de Evento"
              className="w-full min-h-[56px] px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-base focus:outline-none focus:border-green-500"
              required
            >
              <option value="">Tipo de Evento...</option>
              <option value="oficina">Oficina</option>
              <option value="feira">Feira</option>
              <option value="curso">Curso</option>
            </select>
          </div>
          <PrivacyWarning />
          <button
            type="submit"
            aria-label="Salvar evento na agenda"
            className="w-full sm:w-auto min-h-[56px] px-8 py-3.5 bg-green-700 hover:bg-green-800 text-white font-black text-lg rounded-2xl transition-all cursor-pointer mt-4 flex items-center justify-center gap-2 active:scale-95 shadow-sm"
          >
            <CalendarIcon className="w-5 h-5 shrink-0" />
            <span>{isTraineeManager ? 'Praticar Agendamento de Evento' : 'Adicionar à Agenda'}</span>
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 text-sm">
                <th className="px-6 py-4 font-bold border-b border-stone-200 dark:border-stone-700">
                  {t('dash.th_data_hora')}
                </th>
                <th className="px-6 py-4 font-bold border-b border-stone-200 dark:border-stone-700">
                  {t('dash.th_evento')}
                </th>
                <th className="px-6 py-4 font-bold border-b border-stone-200 dark:border-stone-700">
                  {t('dash.th_tipo')}
                </th>
              </tr>
            </thead>
            <tbody>
              {eventsList.map((event, i) => (
                <tr key={event.id} className={i !== eventsList.length - 1 ? 'border-b border-stone-100 dark:border-stone-800' : ''}>
                  <td className="px-6 py-4 font-medium text-stone-900 dark:text-stone-100">
                    {formatLocalDatePtBr(event.date)} às {event.time}
                  </td>
                  <td className="px-6 py-4 text-stone-800 dark:text-stone-200">{event.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-sm rounded-full uppercase">
                      {event.type}
                    </span>
                  </td>
                </tr>
              ))}
              {eventsList.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-stone-600 dark:text-stone-400">
                    Nenhum evento agendado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
