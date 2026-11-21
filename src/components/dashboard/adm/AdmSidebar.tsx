import React from 'react';
import { ChevronDown, ChevronUp, Leaf, LogOut, Shield, SlidersHorizontal, X } from 'lucide-react';
import type { AdmNavItem, AdmTabType } from '../../../hooks';

interface AdmSidebarProps {
  isAdm: boolean;
  activeTab: AdmTabType;
  onSelectTab: (tab: AdmTabType) => void;
  adminSystemNavItems: AdmNavItem[];
  atelieNavItems: AdmNavItem[];
  gestorNavItems: AdmNavItem[];
  isAtelieGroupOpen: boolean;
  onToggleAtelieGroup: () => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  mobileMenuDrawerRef: React.RefObject<HTMLElement | null>;
  onOpenAccessibility?: () => void;
  accessibilityLabel?: string;
  onRequestLogout: () => void;
  logoutLabelDesktop: string;
  logoutLabelMobile: string;
}

export const AdmSidebar: React.FC<AdmSidebarProps> = ({
  isAdm,
  activeTab,
  onSelectTab,
  adminSystemNavItems,
  atelieNavItems,
  gestorNavItems,
  isAtelieGroupOpen,
  onToggleAtelieGroup,
  isMobileMenuOpen,
  onCloseMobileMenu,
  mobileMenuDrawerRef,
  onOpenAccessibility,
  accessibilityLabel = 'Acessibilidade',
  onRequestLogout,
  logoutLabelDesktop,
  logoutLabelMobile,
}) => {
  const handleMobileNavSelect = (tab: AdmTabType) => {
    onSelectTab(tab);
    onCloseMobileMenu();
  };

  return (
    <>
      <aside
        className={`${
          isAdm ? 'md:w-64 lg:w-72 xl:w-80' : 'md:w-64 lg:w-72 xl:w-80'
        } bg-stone-900 dark:bg-stone-950 text-white hidden md:flex flex-col h-full border-r border-stone-800 shrink-0 transition-colors overflow-x-hidden`}
      >
        <div className="h-20 flex items-center gap-3 px-6 border-b border-stone-800 shrink-0">
          {isAdm ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-teal-800/80 text-teal-300 flex items-center justify-center font-black">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-xl tracking-normal block leading-tight">Administração</span>
                <span className="text-xs text-teal-400 font-bold">Área Técnica</span>
              </div>
            </>
          ) : (
            <>
              <Leaf className="w-8 h-8 text-green-500" />
              <span className="font-black text-2xl tracking-normal">Gestão</span>
            </>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-5 px-3.5 space-y-3" aria-label="Navegação Principal">
          {isAdm ? (
            <>
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-xs font-black text-stone-400 uppercase tracking-wider">
                  Suporte e sistema
                </div>
                {adminSystemNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    aria-label={`Ir para ${item.label}`}
                    aria-current={activeTab === item.id ? 'page' : undefined}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-bold transition-all cursor-pointer whitespace-nowrap text-left tracking-normal ${
                      activeTab === item.id
                        ? 'bg-teal-700 text-white shadow-md'
                        : 'text-stone-200 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <item.icon
                        className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-teal-400'}`}
                        aria-hidden="true"
                      />
                      <span className="tracking-normal truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs shrink-0 ml-2 ${
                          activeTab === item.id ? 'bg-white text-teal-900' : 'bg-teal-500 text-stone-950'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-1 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={onToggleAtelieGroup}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-black text-stone-400 uppercase tracking-wider hover:text-stone-200 cursor-pointer tracking-normal"
                >
                  <span>Gestão do ateliê (cuidado pela equipe)</span>
                  {isAtelieGroupOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-300" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>

                {isAtelieGroupOpen && (
                  <div className="space-y-1 pl-1">
                    {atelieNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelectTab(item.id)}
                        aria-label={`Ir para ${item.label}`}
                        aria-current={activeTab === item.id ? 'page' : undefined}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-bold transition-all cursor-pointer whitespace-nowrap text-left tracking-normal ${
                          activeTab === item.id
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <item.icon
                            className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-amber-400'}`}
                            aria-hidden="true"
                          />
                          <span className="tracking-normal truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-stone-950 shrink-0 ml-2">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            gestorNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-label={`Ir para ${item.label}`}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold transition-all cursor-pointer whitespace-nowrap tracking-normal text-left gap-3 ${
                  activeTab === item.id
                    ? 'bg-green-700 text-white shadow-md'
                    : 'text-stone-200 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-1">
                  <item.icon
                    className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-stone-300'}`}
                    aria-hidden="true"
                  />
                  <span className="tracking-normal truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs shrink-0 ml-auto ${
                      activeTab === item.id ? 'bg-white text-green-800' : 'bg-amber-500 text-stone-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))
          )}
        </nav>

        <div className="p-4 border-t border-stone-800 shrink-0 space-y-2">
          {onOpenAccessibility && (
            <button
              type="button"
              onClick={onOpenAccessibility}
              aria-label={accessibilityLabel}
              className="w-full min-h-[46px] flex items-center gap-4 px-4 py-3 rounded-xl text-base font-bold text-emerald-300 bg-stone-800/70 hover:bg-stone-800 hover:text-emerald-200 border border-stone-700/80 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-5 h-5 shrink-0 text-emerald-400" aria-hidden="true" />
              <span className="truncate">{accessibilityLabel}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onRequestLogout}
            aria-label="Sair da conta"
            className="w-full min-h-[46px] flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-bold text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" /> {logoutLabelDesktop}
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onCloseMobileMenu}></div>
          <aside
            ref={mobileMenuDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={isAdm ? 'Menu da Administração' : 'Menu da Gestão'}
            className="w-80 max-w-[85vw] bg-stone-900 text-white h-full relative z-10 flex flex-col border-r border-stone-800 shadow-2xl"
          >
            <div
              className={`h-20 flex items-center justify-between px-6 border-b ${
                isAdm ? 'border-teal-900/60 bg-teal-950/40' : 'border-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {isAdm ? (
                  <Shield className="w-7 h-7 text-teal-400 shrink-0" />
                ) : (
                  <Leaf className="w-6 h-6 text-green-500 shrink-0" />
                )}
                <div>
                  <span className="font-black text-xl tracking-tight block">
                    {isAdm ? 'Administração' : 'Gestão'}
                  </span>
                  <span className={`text-xs font-bold block ${isAdm ? 'text-teal-400' : 'text-stone-400'}`}>
                    {isAdm ? 'Área técnica' : 'Associação Julieta Barros'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseMobileMenu}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
              {isAdm ? (
                <>
                  <div className="space-y-1">
                    <p className="px-3 pb-2 text-xs font-black text-teal-400 uppercase tracking-wider">
                      Suporte e sistema
                    </p>
                    {adminSystemNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMobileNavSelect(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-bold transition-all text-left cursor-pointer ${
                          activeTab === item.id ? 'bg-teal-700 text-white shadow-md' : 'text-stone-200 hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-black ${
                              activeTab === item.id ? 'bg-white text-teal-900' : 'bg-teal-500 text-stone-950'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1 pt-3 border-t border-stone-800">
                    <p className="px-3 pb-2 text-xs font-black text-stone-400 uppercase tracking-wider">
                      Gestão do ateliê (cuidado pela equipe)
                    </p>
                    {atelieNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMobileNavSelect(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-bold transition-all text-left cursor-pointer ${
                          activeTab === item.id ? 'bg-amber-600 text-white shadow-md' : 'text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-stone-950">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  {gestorNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNavSelect(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold transition-all text-left cursor-pointer gap-3 ${
                        activeTab === item.id ? 'bg-green-700 text-white shadow-sm' : 'text-stone-200 hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-1">
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="whitespace-nowrap tracking-normal">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-full text-xs font-black shrink-0 ml-auto">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </nav>

            <div className="p-4 pb-20 border-t border-stone-800 space-y-2">
              {onOpenAccessibility && (
                <button
                  type="button"
                  onClick={() => {
                    onCloseMobileMenu();
                    onOpenAccessibility();
                  }}
                  aria-label={accessibilityLabel}
                  className="w-full min-h-[48px] flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-emerald-300 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-5 h-5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <span>{accessibilityLabel}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onRequestLogout}
                className="w-full min-h-[50px] flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-red-400 hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5 shrink-0" /> {logoutLabelMobile}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
