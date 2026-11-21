import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Cookie,
  Database,
  ExternalLink,
  Mail,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CONSENT_COOKIE_NAME,
  CONSENT_STORAGE_KEY,
  LGPD_POLICY_VERSION,
  useConsent,
  useLanguage,
  useToast,
} from '../contexts';
import { useFocusTrap } from '../hooks';
import {
  ASSOCIATION_WHATSAPP_NUMBER,
  buildWhatsAppUrl,
  formatWhatsAppNumber,
} from '../lib';

interface ConsentSwitchProps {
  id: string;
  checked: boolean;
  onToggle: () => void;
  label: string;
}

function ConsentSwitch({ id, checked, onToggle, label }: ConsentSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`relative inline-flex items-center h-11 w-[74px] shrink-0 cursor-pointer rounded-full p-1 border-2 transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50 ${
        checked
          ? 'bg-emerald-700 dark:bg-emerald-600 high-contrast:bg-yellow-400 border-emerald-800 dark:border-emerald-400 high-contrast:border-white'
          : 'bg-stone-300 dark:bg-stone-700 high-contrast:bg-black border-stone-400 dark:border-stone-600 high-contrast:border-yellow-400'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-flex items-center justify-center h-8 w-8 transform rounded-full bg-white dark:bg-stone-100 high-contrast:bg-white shadow-sm transition-transform duration-200 motion-reduce:transition-none ${
          checked ? 'translate-x-8' : 'translate-x-0'
        }`}
      >
        {checked && (
          <Check
            className="w-4 h-4 text-emerald-700 high-contrast:text-black"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}

export function CookieConsentCenter() {
  const {
    consent,
    hasDecided,
    isPreferencesOpen,
    activeTab,
    setActiveTab,
    openPreferences,
    closePreferences,
    acceptAll,
    rejectOptional,
    saveCustomPreferences,
    revokeOptionalConsent,
  } = useConsent();
  const { language } = useLanguage();
  const { addToast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const isPt = language === 'pt';

  const modalRef = useRef<HTMLDivElement>(null);
  const [draftExperience, setDraftExperience] = useState(consent.experience);
  const [draftShowcase, setDraftShowcase] = useState(consent.showcase);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  const associationEmail = (import.meta.env.VITE_ASSOCIATION_EMAIL || '').trim() || null;
  const hasAssociationWhatsapp = Boolean(ASSOCIATION_WHATSAPP_NUMBER.trim());
  const formattedWhatsapp = hasAssociationWhatsapp
    ? formatWhatsAppNumber(ASSOCIATION_WHATSAPP_NUMBER)
    : '';
  const lgpdWhatsappUrl = buildWhatsAppUrl(
    ASSOCIATION_WHATSAPP_NUMBER,
    isPt
      ? 'Olá! Gostaria de falar com a Associação Julieta Barros sobre privacidade, cookies ou direitos da LGPD.'
      : 'Hello! I would like to contact Associação Julieta Barros regarding privacy, cookies, or LGPD data rights.'
  );

  useFocusTrap(isPreferencesOpen, modalRef, closePreferences);

  useEffect(() => {
    if (isPreferencesOpen) {
      setDraftExperience(consent.experience);
      setDraftShowcase(consent.showcase);
      setConfirmRevoke(false);
    }
  }, [isPreferencesOpen, consent.experience, consent.showcase]);

  useEffect(() => {
    if (!isPreferencesOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isPreferencesOpen]);

  const handleAcceptAll = () => {
    acceptAll();
    addToast(
      isPt
        ? 'Preferências salvas! Cookies essenciais e de experiência ativados.'
        : 'Preferences saved! Essential and experience preferences enabled.',
      'success'
    );
  };

  const handleRejectOptional = () => {
    rejectOptional();
    addToast(
      isPt
        ? 'Apenas cookies essenciais mantidos. Preferências opcionais desativadas.'
        : 'Only essential cookies kept. Optional preferences disabled.',
      'info'
    );
  };

  const handleSaveCustom = () => {
    saveCustomPreferences({
      experience: draftExperience,
      showcase: draftShowcase,
    });
    addToast(
      isPt
        ? 'Suas escolhas de privacidade e cookies foram salvas.'
        : 'Your privacy and cookie choices have been saved.',
      'success'
    );
  };

  const handleConfirmRevoke = () => {
    revokeOptionalConsent();
    setDraftExperience(false);
    setDraftShowcase(false);
    setConfirmRevoke(false);
    addToast(
      isPt
        ? 'Consentimento opcional revogado e preferências extras apagadas deste aparelho.'
        : 'Optional consent revoked and extra preferences cleared from this device.',
      'info'
    );
  };

  const formattedUpdatedAt = consent.updatedAt
    ? new Date(consent.updatedAt).toLocaleString(isPt ? 'pt-BR' : 'en-US')
    : isPt
    ? 'Aguardando sua escolha'
    : 'Awaiting your choice';

  const tabs: Array<{ id: 'preferences' | 'rights' | 'data'; label: string }> = [
    { id: 'preferences', label: isPt ? 'Preferências' : 'Preferences' },
    { id: 'rights', label: isPt ? 'Seus Direitos (LGPD)' : 'Your Rights (LGPD)' },
    { id: 'data', label: isPt ? 'Dados no Aparelho' : 'Stored Data' },
  ];

  return (
    <>
      {/* Faixa Discreta de Consentimento no Rodapé (Exibida apenas antes da escolha do usuário) */}
      {!hasDecided && !isPreferencesOpen && (
        <motion.aside
          role="region"
          aria-label={isPt ? 'Aviso de cookies e privacidade LGPD' : 'Cookie and privacy notice'}
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.25, ease: 'easeOut' }}
          className="fixed bottom-20 xl:bottom-5 left-1/2 -translate-x-1/2 z-[48] w-[calc(100%-1.5rem)] max-w-3xl no-print"
        >
          <div className="bg-white dark:bg-stone-900 high-contrast:bg-black border-2 border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3.5">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 high-contrast:bg-yellow-400 border border-emerald-200 dark:border-emerald-800 high-contrast:border-white flex items-center justify-center shrink-0 mt-0.5">
                <Cookie
                  className="w-5 h-5 text-emerald-800 dark:text-emerald-300 high-contrast:text-black"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 leading-snug">
                  {isPt ? 'Cookies e sua privacidade (LGPD)' : 'Cookies and your privacy'}
                </h2>
                <p className="text-sm sm:text-base font-medium text-stone-700 dark:text-stone-300 high-contrast:text-white leading-relaxed">
                  {isPt
                    ? 'Usamos registros essenciais para segurança e acesso. Com sua permissão, guardamos também tema, acessibilidade e filtros da vitrine — sem anúncios ou rastreadores.'
                    : 'We use essential storage for security and sign-in. With your permission, we also save theme, accessibility, and showcase filters — with no ads or tracking.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 high-contrast:bg-black text-stone-900 dark:text-white high-contrast:text-yellow-300 font-extrabold text-sm sm:text-base whitespace-nowrap shrink-0 transition-colors motion-reduce:transition-none cursor-pointer"
              >
                {isPt ? 'Apenas essenciais' : 'Essential only'}
              </button>
              <button
                type="button"
                onClick={() => openPreferences('preferences')}
                className="min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 high-contrast:border-white bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 high-contrast:bg-black text-stone-900 dark:text-white high-contrast:text-white font-extrabold text-sm sm:text-base inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors motion-reduce:transition-none cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{isPt ? 'Gerenciar em abas' : 'Manage preferences'}</span>
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 text-white high-contrast:text-black font-black text-sm sm:text-base whitespace-nowrap shrink-0 shadow-sm transition-colors motion-reduce:transition-none cursor-pointer"
              >
                {isPt ? 'Aceitar todos' : 'Accept all'}
              </button>
            </div>
          </div>
        </motion.aside>
      )}

      {/* Modal Central de Privacidade e Cookies (3 Abas) */}
      {isPreferencesOpen && (
        <div
          className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs no-print"
          onClick={closePreferences}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lgpd-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-stone-900 high-contrast:bg-black border-2 border-stone-200 dark:border-stone-700 high-contrast:border-yellow-400 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-stone-900 dark:text-stone-100 high-contrast:text-white"
          >
            {/* Cabeçalho fixo do modal */}
            <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 high-contrast:bg-yellow-400 border border-emerald-200 dark:border-emerald-800 high-contrast:border-white flex items-center justify-center shrink-0">
                  <ShieldCheck
                    className="w-6 h-6 text-emerald-700 dark:text-emerald-300 high-contrast:text-black"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <h2
                    id="lgpd-modal-title"
                    className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 leading-tight"
                  >
                    {isPt ? 'Cookies e Privacidade (LGPD)' : 'Cookies & Privacy (LGPD)'}
                  </h2>
                  <p className="text-sm font-medium text-stone-600 dark:text-stone-400 high-contrast:text-white mt-0.5">
                    {isPt
                      ? `Associação Julieta Barros · Política v${LGPD_POLICY_VERSION}`
                      : `Associação Julieta Barros · Policy v${LGPD_POLICY_VERSION}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePreferences}
                className="min-h-[48px] px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 high-contrast:bg-yellow-400 high-contrast:text-black text-stone-900 dark:text-white font-black text-base inline-flex items-center gap-2 shrink-0 cursor-pointer transition-colors motion-reduce:transition-none"
                aria-label={isPt ? 'Fechar janela de privacidade' : 'Close privacy window'}
              >
                <X className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{isPt ? 'Fechar' : 'Close'}</span>
              </button>
            </div>

            {/* Navegação por Abas */}
            <div
              role="tablist"
              aria-label={isPt ? 'Seções de privacidade e cookies' : 'Privacy and cookie sections'}
              className="px-5 sm:px-6 pt-3 pb-3 border-b border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 flex items-center gap-2 overflow-x-auto bg-stone-50 dark:bg-stone-950/60 high-contrast:bg-black shrink-0"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`lgpd-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`lgpd-panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-h-[48px] px-4 py-2.5 rounded-xl font-extrabold text-sm sm:text-base whitespace-nowrap shrink-0 transition-colors motion-reduce:transition-none cursor-pointer border-2 ${
                      isActive
                        ? 'bg-emerald-700 text-white border-emerald-800 high-contrast:bg-yellow-400 high-contrast:text-black high-contrast:border-white shadow-xs'
                        : 'bg-white dark:bg-stone-900 high-contrast:bg-black text-stone-800 dark:text-stone-200 high-contrast:text-white border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Conteúdo com rolagem independente */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {activeTab === 'preferences' && (
                <div
                  role="tabpanel"
                  id="lgpd-panel-preferences"
                  aria-labelledby="lgpd-tab-preferences"
                  className="space-y-5"
                >
                  <p className="text-base font-medium text-stone-700 dark:text-stone-300 high-contrast:text-white leading-relaxed">
                    {isPt
                      ? 'Escolha abaixo o que podemos salvar neste navegador para facilitar sua próxima visita. Você pode alterar ou desligar a qualquer momento.'
                      : 'Choose below what we may save in this browser to improve your next visit. You can change or turn off any optional category anytime.'}
                  </p>

                  <div className="divide-y divide-stone-200 dark:divide-stone-800 high-contrast:divide-yellow-400 border border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 rounded-2xl">
                    {/* Categoria 1: Essenciais */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
                          {isPt ? 'Essenciais e Segurança' : 'Essential & Security'}
                        </h3>
                        <p className="text-sm sm:text-base font-medium text-stone-600 dark:text-stone-400 high-contrast:text-white leading-relaxed">
                          {isPt
                            ? 'Necessários para manter sua conta Google conectada, proteger contatos no WhatsApp contra spam, funcionar sem internet e guardar sua escolha da LGPD.'
                            : 'Required to keep your Google sign-in active, protect WhatsApp links from spam, support offline use, and store your LGPD choice.'}
                        </p>
                      </div>
                      <span className="text-sm font-black text-emerald-800 dark:text-emerald-300 high-contrast:text-yellow-300 whitespace-nowrap shrink-0">
                        {isPt ? 'Sempre ativo' : 'Always active'}
                      </span>
                    </div>

                    {/* Categoria 2: Tema e Acessibilidade */}
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="space-y-1 pr-2">
                        <label
                          htmlFor="consent-switch-experience"
                          className="block text-lg font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 cursor-pointer"
                        >
                          {isPt
                            ? 'Tema, Idioma e Acessibilidade'
                            : 'Theme, Language & Accessibility'}
                        </label>
                        <p className="text-sm sm:text-base font-medium text-stone-600 dark:text-stone-400 high-contrast:text-white leading-relaxed">
                          {isPt
                            ? 'Lembra suas preferências de modo escuro, alto contraste, tamanho da letra, espaçamento, fonte para dislexia e idioma (PT/EN).'
                            : 'Remembers your dark mode, high contrast, font size, letter spacing, dyslexia font, and language preferences.'}
                        </p>
                      </div>
                      <ConsentSwitch
                        id="consent-switch-experience"
                        checked={draftExperience}
                        onToggle={() => setDraftExperience((prev) => !prev)}
                        label={
                          isPt
                            ? `Tema, Idioma e Acessibilidade: ${draftExperience ? 'ativado' : 'desativado'}`
                            : `Theme and Accessibility: ${draftExperience ? 'enabled' : 'disabled'}`
                        }
                      />
                    </div>

                    {/* Categoria 3: Filtros da Vitrine */}
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="space-y-1 pr-2">
                        <label
                          htmlFor="consent-switch-showcase"
                          className="block text-lg font-black text-stone-900 dark:text-white high-contrast:text-yellow-300 cursor-pointer"
                        >
                          {isPt
                            ? 'Filtros e Busca da Vitrine Rosa Mística'
                            : 'Rosa Mística Showcase Filters'}
                        </label>
                        <p className="text-sm sm:text-base font-medium text-stone-600 dark:text-stone-400 high-contrast:text-white leading-relaxed">
                          {isPt
                            ? 'Guarda a última categoria, ordenação e busca usada na Vitrine Rosa Mística ao retornar ao site.'
                            : 'Remembers your last category filter, sort order, and search term in the Rosa Mística Showcase.'}
                        </p>
                      </div>
                      <ConsentSwitch
                        id="consent-switch-showcase"
                        checked={draftShowcase}
                        onToggle={() => setDraftShowcase((prev) => !prev)}
                        label={
                          isPt
                            ? `Filtros da Vitrine: ${draftShowcase ? 'ativado' : 'desativado'}`
                            : `Showcase filters: ${draftShowcase ? 'enabled' : 'disabled'}`
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rights' && (
                <div
                  role="tabpanel"
                  id="lgpd-panel-rights"
                  aria-labelledby="lgpd-tab-rights"
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
                      {isPt
                        ? 'Quem cuida dos seus dados (Controlador)'
                        : 'Data Controller'}
                    </h3>
                    <p className="text-base font-medium text-stone-700 dark:text-stone-300 high-contrast:text-white leading-relaxed">
                      <strong>Associação Julieta Barros</strong> · Departamento de Vendas Rosa Mística
                      <br />
                      Av. Dr. João Medeiros Filho, 07, Bairro Potengi, Zona Norte, Natal - RN, CEP 59104-200
                    </p>
                  </div>

                  <hr className="border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400" />

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
                      {isPt
                        ? 'Compromisso de Transparência'
                        : 'Transparency Commitment'}
                    </h3>
                    <ul className="space-y-2 text-base font-medium text-stone-700 dark:text-stone-300 high-contrast:text-white leading-relaxed list-disc pl-5">
                      <li>
                        {isPt
                          ? 'Não utilizamos cookies de publicidade, perfis comportamentais ou rastreadores de venda de dados.'
                          : 'We do not use advertising cookies, behavioral profiling, or data broker trackers.'}
                      </li>
                      <li>
                        {isPt
                          ? 'O login de acesso é usado estritamente para identificar e proteger artesãos, gestores e colaboradores autorizados.'
                          : 'Access authentication is used strictly to identify and protect authorized artisans, managers, and staff.'}
                      </li>
                      <li>
                        {isPt
                          ? 'Suas preferências de tema e vitrine ficam gravadas localmente no seu próprio aparelho apenas se você autorizar.'
                          : 'Theme and showcase preferences are stored locally on your own device only when authorized.'}
                      </li>
                    </ul>
                  </div>

                  <hr className="border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400" />

                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white high-contrast:text-yellow-300">
                      {isPt
                        ? 'Seus Direitos pela LGPD (Art. 18) e Canais Oficiais'
                        : 'Your Rights under LGPD & Official Channels'}
                    </h3>
                    <p className="text-base font-medium text-stone-700 dark:text-stone-300 high-contrast:text-white leading-relaxed">
                      {isPt
                        ? 'Você pode solicitar confirmação de tratamento, acesso, correção, revisão ou exclusão de seus dados e revogar este consentimento a qualquer instante pelos canais oficiais da associação:'
                        : 'You may request confirmation, access, correction, deletion of data, or revoke consent at any time using our official channels:'}
                    </p>

                    <div className="space-y-3 pt-1">
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                        <a
                          href={lgpdWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[52px] px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 high-contrast:bg-yellow-400 high-contrast:text-black text-white font-black text-base inline-flex items-center justify-center gap-2.5 shadow-sm transition-colors motion-reduce:transition-none cursor-pointer"
                        >
                          <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                          <span>
                            {formattedWhatsapp
                              ? isPt
                                ? `WhatsApp Oficial (${formattedWhatsapp})`
                                : `Official WhatsApp (${formattedWhatsapp})`
                              : isPt
                              ? 'Atendimento LGPD via WhatsApp'
                              : 'LGPD Support via WhatsApp'}
                          </span>
                          <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                        </a>

                        {associationEmail && (
                          <a
                            href={`mailto:${associationEmail}?subject=${encodeURIComponent(
                              isPt
                                ? 'Atendimento LGPD - Associação Julieta Barros'
                                : 'LGPD Privacy Request - Associação Julieta Barros'
                            )}`}
                            className="min-h-[52px] px-5 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 high-contrast:bg-black text-stone-900 dark:text-white high-contrast:text-yellow-300 font-black text-base inline-flex items-center justify-center gap-2.5 transition-colors motion-reduce:transition-none cursor-pointer"
                          >
                            <Mail className="w-5 h-5 shrink-0" aria-hidden="true" />
                            <span>{associationEmail}</span>
                          </a>
                        )}
                      </div>

                      {!associationEmail && (
                        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 high-contrast:text-white leading-relaxed">
                          {isPt
                            ? 'Também atendemos solicitações presenciais na sede: Av. Dr. João Medeiros Filho, 07, Bairro Potengi, Natal - RN.'
                            : 'We also handle in-person privacy requests at our headquarters: Av. Dr. João Medeiros Filho, 07, Bairro Potengi, Natal - RN.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div
                  role="tabpanel"
                  id="lgpd-panel-data"
                  aria-labelledby="lgpd-tab-data"
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-stone-900 dark:text-white high-contrast:text-yellow-300">
                      <Database className="w-5 h-5 text-emerald-700 dark:text-emerald-400 high-contrast:text-yellow-300 shrink-0" aria-hidden="true" />
                      <h3 className="text-lg sm:text-xl font-black">
                        {isPt ? 'Registro Atual do Seu Consentimento' : 'Current Consent Record'}
                      </h3>
                    </div>

                    <dl className="divide-y divide-stone-200 dark:divide-stone-800 high-contrast:divide-yellow-400 border border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 rounded-2xl text-sm sm:text-base">
                      <div className="px-4 py-3 flex items-center justify-between gap-4">
                        <dt className="font-bold text-stone-700 dark:text-stone-300 high-contrast:text-white">
                          {isPt ? 'Versão da política' : 'Policy version'}
                        </dt>
                        <dd className="font-black tabular-nums text-stone-900 dark:text-white high-contrast:text-yellow-300">
                          {consent.version}
                        </dd>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between gap-4">
                        <dt className="font-bold text-stone-700 dark:text-stone-300 high-contrast:text-white">
                          {isPt ? 'Data da escolha' : 'Decision timestamp'}
                        </dt>
                        <dd className="font-bold tabular-nums text-stone-900 dark:text-white high-contrast:text-white text-right">
                          {formattedUpdatedAt}
                        </dd>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between gap-4">
                        <dt className="font-bold text-stone-700 dark:text-stone-300 high-contrast:text-white">
                          {isPt ? 'Essenciais (autenticação e segurança)' : 'Essential (auth & security)'}
                        </dt>
                        <dd className="font-black text-emerald-800 dark:text-emerald-300 high-contrast:text-yellow-300">
                          {isPt ? 'Ativo' : 'Active'}
                        </dd>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between gap-4">
                        <dt className="font-bold text-stone-700 dark:text-stone-300 high-contrast:text-white">
                          {isPt ? 'Tema, Idioma e Acessibilidade' : 'Theme, Language & Accessibility'}
                        </dt>
                        <dd className="font-black text-stone-900 dark:text-white high-contrast:text-white">
                          {consent.decided && consent.experience
                            ? isPt
                              ? 'Autorizado'
                              : 'Allowed'
                            : isPt
                            ? 'Desativado'
                            : 'Disabled'}
                        </dd>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between gap-4">
                        <dt className="font-bold text-stone-700 dark:text-stone-300 high-contrast:text-white">
                          {isPt ? 'Filtros da Vitrine Rosa Mística' : 'Showcase Filters'}
                        </dt>
                        <dd className="font-black text-stone-900 dark:text-white high-contrast:text-white">
                          {consent.decided && consent.showcase
                            ? isPt
                              ? 'Autorizado'
                              : 'Allowed'
                            : isPt
                            ? 'Desativado'
                            : 'Disabled'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <p className="text-sm font-medium text-stone-600 dark:text-stone-400 high-contrast:text-white leading-relaxed">
                    {isPt
                      ? `Identificadores essenciais mantidos apenas para registrar sua decisão: cookie "${CONSENT_COOKIE_NAME}" e registro "${CONSENT_STORAGE_KEY}".`
                      : `Essential identifiers kept only to store your decision: cookie "${CONSENT_COOKIE_NAME}" and record "${CONSENT_STORAGE_KEY}".`}
                  </p>

                  {/* Ação destrutiva/revogação com confirmação explícita */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400">
                    {!confirmRevoke ? (
                      <button
                        type="button"
                        onClick={() => setConfirmRevoke(true)}
                        className="min-h-[52px] px-5 py-3 rounded-2xl border-2 border-red-300 dark:border-red-800 high-contrast:border-yellow-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 high-contrast:bg-black text-red-800 dark:text-red-200 high-contrast:text-yellow-300 font-black text-base inline-flex items-center gap-2.5 transition-colors motion-reduce:transition-none cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                        <span>
                          {isPt
                            ? 'Revogar e limpar preferências opcionais'
                            : 'Revoke and clear optional preferences'}
                        </span>
                      </button>
                    ) : (
                      <div
                        role="alertdialog"
                        aria-label={isPt ? 'Confirmar limpeza de preferências opcionais' : 'Confirm clearing optional preferences'}
                        className="p-4 rounded-2xl border-2 border-red-300 dark:border-red-800 high-contrast:border-yellow-400 bg-red-50 dark:bg-red-950/40 high-contrast:bg-black space-y-3"
                      >
                        <p className="text-base font-bold text-red-900 dark:text-red-200 high-contrast:text-white">
                          {isPt
                            ? 'Confirma a revogação e remoção das preferências salvas de tema, acessibilidade e filtros da vitrine neste navegador?'
                            : 'Confirm revoking and deleting saved theme, accessibility, and showcase filter preferences from this browser?'}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={handleConfirmRevoke}
                            className="min-h-[48px] px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 high-contrast:bg-yellow-400 high-contrast:text-black text-white font-black text-base cursor-pointer"
                          >
                            {isPt ? 'Confirmar limpeza' : 'Confirm clear'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmRevoke(false)}
                            className="min-h-[48px] px-5 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-base cursor-pointer"
                          >
                            {isPt ? 'Cancelar' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé fixo de ações */}
            <div className="p-5 sm:p-6 border-t border-stone-200 dark:border-stone-800 high-contrast:border-yellow-400 bg-stone-50 dark:bg-stone-950/60 high-contrast:bg-black flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="min-h-[52px] px-5 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 high-contrast:border-yellow-400 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 high-contrast:bg-black text-stone-900 dark:text-white high-contrast:text-yellow-300 font-extrabold text-base whitespace-nowrap shrink-0 transition-colors motion-reduce:transition-none cursor-pointer"
              >
                {isPt ? 'Apenas essenciais' : 'Essential only'}
              </button>
              {activeTab === 'preferences' ? (
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="min-h-[52px] px-5 py-3 rounded-2xl border-2 border-emerald-700 dark:border-emerald-500 high-contrast:border-white bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 high-contrast:bg-black text-emerald-900 dark:text-emerald-200 high-contrast:text-white font-black text-base whitespace-nowrap shrink-0 transition-colors motion-reduce:transition-none cursor-pointer"
                >
                  {isPt ? 'Salvar escolhas' : 'Save choices'}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleAcceptAll}
                className="min-h-[52px] px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 text-white high-contrast:text-black font-black text-base whitespace-nowrap shrink-0 shadow-sm transition-colors motion-reduce:transition-none cursor-pointer"
              >
                {isPt ? 'Aceitar todos' : 'Accept all'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
