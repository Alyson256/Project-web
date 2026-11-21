import React, { useState, useRef } from 'react';
import { Leaf, Shield, FileText, X } from 'lucide-react';
import { useConsent, useLanguage } from '../contexts';
import { useFocusTrap } from '../hooks';
import { getConfiguredSocialLinks } from '../lib';
import { FooterSocialLinks } from './FooterSocialLinks';

const GOOGLE_MAPS_ADDRESS_URL =
  'https://maps.google.com/?q=Av.+Dr.+Jo%C3%A3o+Medeiros+Filho,+07+-+Potengi,+Natal+-+RN';

export function Footer() {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);
  const { t, language } = useLanguage();
  const { openPreferences } = useConsent();
  const modalRef = useRef<HTMLDivElement>(null);
  const socialLinks = getConfiguredSocialLinks();

  useFocusTrap(activeModal !== null, modalRef, () => setActiveModal(null));

  return (
    <footer id="contato" className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start">
          {/* Coluna 1: Identidade */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 flex items-center justify-center border-2 border-emerald-700 shrink-0">
                <Leaf className="w-6 h-6 text-emerald-400" aria-hidden="true" />
              </div>
              <div>
                <span className="font-black text-xl sm:text-2xl text-white tracking-tight block leading-tight">
                  {t('brand.name', 'Associação Julieta Barros')}
                </span>
                <span className="text-sm font-bold text-emerald-400 block mt-0.5">
                  {t('brand.dept', 'Departamento de Vendas Rosa Mística')}
                </span>
              </div>
            </div>
            <p className="text-base sm:text-lg text-stone-400 leading-relaxed font-medium">
              {t('footer.desc', 'A gente valoriza a arte potiguar e fortalece as famílias da Zona Norte de Natal.')}
            </p>
          </div>

          {/* Coluna 2: Localização e Contato */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-xl tracking-tight">
              {t('localizacao.address_label', 'Endereço Completo')}
            </h4>
            <address className="not-italic text-base sm:text-lg text-stone-300 leading-relaxed font-medium">
              Av. Dr. João Medeiros Filho, 07<br />
              Bairro Potengi, Zona Norte<br />
              Natal - RN, CEP 59104-200
            </address>
            <div className="pt-1 no-print">
              <a
                href={GOOGLE_MAPS_ADDRESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[44px] text-base font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors motion-reduce:transition-none"
              >
                <span>{t('localizacao.maps_btn', 'Abrir no Google Maps')}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Coluna 3: Funcionamento e Redes */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-white font-black text-xl tracking-tight">
                {t('localizacao.hours_label', 'Horário de Funcionamento')}
              </h4>
              <ul className="space-y-2 text-base sm:text-lg text-stone-300 leading-relaxed font-medium list-none p-0 m-0">
                <li>
                  <strong>{t('localizacao.weekdays', 'Segunda a Sexta')}:</strong> {t('localizacao.hours_weekdays_val', '08h às 18h')}
                </li>
                <li>
                  <strong>{t('localizacao.saturday', 'Sábado')}:</strong> {t('localizacao.hours_saturday_val', '08h às 12h')}
                </li>
                <li>
                  <strong>{t('localizacao.sunday', 'Domingo')}:</strong> {t('localizacao.hours_sunday_val', 'Fechado (exceto feiras)')}
                </li>
              </ul>
            </div>

            <FooterSocialLinks socialLinks={socialLinks} />
          </div>
        </div>

        {/* Barra inferior: Direitos, Política de Privacidade e Termos de uso (padding inferior extra evita colisão com botões flutuantes) */}
        <div className="pt-8 pb-28 lg:pb-24 print:pb-0 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-stone-400 text-base sm:text-lg">
          <p className="font-medium text-center sm:text-left">
            &copy; {new Date().getFullYear()} {t('brand.name', 'Associação Julieta Barros')}. {t('footer.rights', 'Todos os direitos reservados.')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => openPreferences('preferences')}
              className="inline-flex items-center min-h-[44px] text-stone-300 hover:text-emerald-400 transition-colors font-bold underline underline-offset-4 cursor-pointer text-base sm:text-lg px-1"
            >
              {language === 'pt' ? 'Cookies e LGPD' : 'Cookies & LGPD'}
            </button>
            <span className="text-stone-700" aria-hidden="true">•</span>
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="inline-flex items-center min-h-[44px] text-stone-300 hover:text-emerald-400 transition-colors font-bold underline underline-offset-4 cursor-pointer text-base sm:text-lg px-1"
            >
              {t('footer.privacy', 'Política de Privacidade')}
            </button>
            <span className="text-stone-700" aria-hidden="true">•</span>
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="inline-flex items-center min-h-[44px] text-stone-300 hover:text-emerald-400 transition-colors font-bold underline underline-offset-4 cursor-pointer text-base sm:text-lg px-1"
            >
              {t('footer.terms', 'Termos de uso')}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Política de Privacidade */}
      {activeModal === 'privacy' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="footer-privacy-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto border-2 border-stone-200 dark:border-stone-800 shadow-2xl space-y-5 text-stone-900 dark:text-stone-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                <h3 id="footer-privacy-title" className="text-2xl font-black">
                  {t('footer.privacy', 'Política de Privacidade')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 cursor-pointer"
                aria-label={t('nav.fechar', 'Fechar')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              <p>
                {t('footer.privacy_desc_1', 'Na Associação Julieta Barros, a gente cuida e respeita a privacidade de cada pessoa.')}
              </p>
              <p>
                {t('footer.privacy_desc_2', 'A gente não repassa seus dados para ninguém nem mostra números de telefone abertos no site.')}
              </p>
              <p>
                {t('footer.privacy_desc_3', 'As conversas no WhatsApp aproximam quem produz de quem quer levar uma peça para casa, sempre com carinho e respeito.')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  openPreferences('rights');
                }}
                className="w-full min-h-[56px] px-5 py-3.5 border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-white rounded-2xl font-black text-base transition-colors cursor-pointer"
              >
                {language === 'pt' ? 'Gerenciar Cookies (LGPD)' : 'Manage Cookies (LGPD)'}
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full min-h-[56px] px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg transition-colors cursor-pointer"
              >
                {t('footer.modal_close_btn', 'Entendido e fechar')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Termos de Uso */}
      {activeModal === 'terms' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="footer-terms-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto border-2 border-stone-200 dark:border-stone-800 shadow-2xl space-y-5 text-stone-900 dark:text-stone-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                <h3 id="footer-terms-title" className="text-2xl font-black">
                  {t('footer.terms', 'Termos de uso')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 cursor-pointer"
                aria-label={t('nav.fechar', 'Fechar')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              <p>
                {t('footer.terms_desc_1', 'Este site funciona como uma vitrine digital das obras da Associação Julieta Barros, com peças disponíveis no nosso Departamento de Vendas Rosa Mística.')}
              </p>
              <p>
                {t('footer.terms_desc_2', 'As informações sobre peças, técnicas e valores sugeridos são cadastradas pela nossa gente e publicadas pelo nosso departamento de vendas.')}
              </p>
              <p>
                {t('footer.terms_desc_3', 'A gente pede que as conversas sejam sempre com respeito, carinho e valorização da nossa arte.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full min-h-[56px] px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg transition-colors cursor-pointer mt-4"
            >
              {t('footer.modal_close_btn', 'Entendido e fechar')}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
