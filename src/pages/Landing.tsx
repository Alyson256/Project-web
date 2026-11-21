import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import {
  SHOWCASE_PREFS_STORAGE_KEY,
  useAuth,
  useConsent,
  useLanguage,
  useProducts,
  useToast,
} from '../contexts';
import {
  ASSOCIATION_WHATSAPP_NUMBER,
  buildWhatsAppUrl,
  canContactSeller,
  openExternalUrl,
  recordSellerContact,
  useSellerSettings,
} from '../lib';
import {
  SITE_CONTENT_UPDATED_EVENT,
  fetchCooperativeStore,
  normalizeSiteContent,
  readCachedSiteContent,
  readCachedStore,
  type CooperativeSiteContent,
} from '../services';
import { AnimatedSection, Footer, Header, LocationMap } from '../components';
import {
  LandingAgenda,
  LandingGallery,
  LandingHero,
  LandingModals,
  LandingShowcase,
  LandingStory,
} from '../components/landing';
import { ShowcaseProduct, SpaceEvent } from '../data';

function mapPublicEvents(customList: unknown[]): SpaceEvent[] {
  return customList.map((p: any) => ({
    ...p,
    description: p.description || 'Atividade comunitária aberta na Associação Julieta Barros.',
    location: p.location || 'Espaço Comunitário · Associação Julieta Barros',
    instructor: p.instructor || 'Equipe da Associação Julieta Barros',
    vacancies: p.vacancies || 'Vagas limitadas · Presencial',
  }));
}

export default function Landing() {
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const isAuthenticated = Boolean(user || role);
  const { addToast } = useToast();
  const { language, t } = useLanguage();
  const { showcaseProducts: products, isLoading: isProductsLoading } = useProducts();

  const { settings: sellerSettings } = useSellerSettings();
  const isSellerAvailable = sellerSettings.receiveContactsNow && sellerSettings.authorized;

  // Agenda do Espaço Local (Cursos, Oficinas, Outros Eventos reais cadastrados pela gestão)
  const [spaceEvents, setSpaceEvents] = useState<SpaceEvent[]>(() => {
    try {
      const saved = localStorage.getItem('potengi_public_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return mapPublicEvents(parsed);
        }
      }
      const cached = readCachedStore();
      if (Array.isArray(cached.publicEvents)) {
        return mapPublicEvents(cached.publicEvents);
      }
    } catch {
      // Ignora erro de leitura local
    }
    return [];
  });
  const [isStoreLoading, setIsStoreLoading] = useState<boolean>(() => spaceEvents.length === 0);

  // Categorias de agenda
  const [selectedAgendaCategory, setSelectedAgendaCategory] = useState<'todos' | 'Curso' | 'Oficina' | 'Outro Evento'>('todos');
  const coursesCount = spaceEvents.filter((e) => e.type === 'Curso').length;
  const workshopsCount = spaceEvents.filter((e) => e.type === 'Oficina').length;
  const otherEventsCount = spaceEvents.filter((e) => e.type === 'Outro Evento').length;

  const filteredSpaceEvents =
    selectedAgendaCategory === 'todos'
      ? spaceEvents
      : spaceEvents.filter((e) => e.type === selectedAgendaCategory);

  // História, Foto da Equipe, Vídeo YouTube e Galeria comunitárias
  const [siteContent, setSiteContent] = useState<CooperativeSiteContent>(() => readCachedSiteContent());

  const realGallery = siteContent.galleryPhotos.map((p) => ({
    id: p.id,
    url: p.url,
    alt: p.title,
  }));
  const realStory = siteContent.storyText?.trim() ? siteContent.storyText.trim() : null;
  const hasStorySection = Boolean(
    realStory || siteContent.teamPhoto?.trim() || siteContent.videoUrl?.trim()
  );

  useEffect(() => {
    let active = true;

    const handleLocalUpdate = (event: Event) => {
      const detail = (event as CustomEvent<Partial<CooperativeSiteContent>>).detail;
      if (detail) {
        setSiteContent(normalizeSiteContent(detail));
      } else {
        setSiteContent(readCachedSiteContent());
      }
    };

    const handleStorageSync = () => {
      setSiteContent(readCachedSiteContent());
    };

    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, handleLocalUpdate);
    window.addEventListener('storage', handleStorageSync);

    fetchCooperativeStore()
      .then((store) => {
        if (!active || !store) return;
        if (Array.isArray(store.publicEvents)) {
          setSpaceEvents(mapPublicEvents(store.publicEvents));
          try {
            localStorage.setItem('potengi_public_events', JSON.stringify(store.publicEvents));
          } catch {
            // Ignora erro de leitura local
          }
        }
        if (store.siteContent) {
          const normalized = normalizeSiteContent(store.siteContent);
          setSiteContent(normalized);
        }
      })
      .finally(() => {
        if (active) {
          setIsStoreLoading(false);
        }
      });
    return () => {
      active = false;
      window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, handleLocalUpdate);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  const { canStoreShowcase } = useConsent();

  const initialShowcasePrefs = useMemo<{
    searchQuery: string;
    activeFilter: string;
    sortOption: 'recent' | 'price_asc' | 'price_desc';
  }>(() => {
    if (typeof window === 'undefined' || !canStoreShowcase) {
      return { searchQuery: '', activeFilter: 'Todos', sortOption: 'recent' };
    }
    try {
      const raw = localStorage.getItem(SHOWCASE_PREFS_STORAGE_KEY);
      if (!raw) {
        return { searchQuery: '', activeFilter: 'Todos', sortOption: 'recent' };
      }
      const parsed = JSON.parse(raw) as {
        searchQuery?: string;
        activeFilter?: string;
        sortOption?: 'recent' | 'price_asc' | 'price_desc';
      };
      const validSort: 'recent' | 'price_asc' | 'price_desc' =
        parsed.sortOption === 'price_asc' || parsed.sortOption === 'price_desc'
          ? parsed.sortOption
          : 'recent';
      return {
        searchQuery: typeof parsed.searchQuery === 'string' ? parsed.searchQuery : '',
        activeFilter: typeof parsed.activeFilter === 'string' && parsed.activeFilter ? parsed.activeFilter : 'Todos',
        sortOption: validSort,
      };
    } catch {
      return { searchQuery: '', activeFilter: 'Todos', sortOption: 'recent' };
    }
  }, [canStoreShowcase]);

  // Busca e Filtros da Vitrine (persistidos somente com consentimento LGPD)
  const [searchQuery, setSearchQuery] = useState(() => initialShowcasePrefs.searchQuery);
  const [activeFilter, setActiveFilter] = useState(() => initialShowcasePrefs.activeFilter);
  const [sortOption, setSortOption] = useState<'recent' | 'price_asc' | 'price_desc'>(
    () => initialShowcasePrefs.sortOption
  );

  useEffect(() => {
    if (!canStoreShowcase) return;
    try {
      localStorage.setItem(
        SHOWCASE_PREFS_STORAGE_KEY,
        JSON.stringify({ searchQuery, activeFilter, sortOption })
      );
    } catch {
      // Ignora erros de cota do armazenamento local
    }
  }, [canStoreShowcase, searchQuery, activeFilter, sortOption]);

  // Modais de Peça e Contato
  const [selectedProductDetail, setSelectedProductDetail] = useState<ShowcaseProduct | null>(null);
  const [sellerConfirmProduct, setSellerConfirmProduct] = useState<ShowcaseProduct | null>(null);
  const [interestId, setInterestId] = useState<number | null>(null);
  const [showRateLimitAlert, setShowRateLimitAlert] = useState(false);

  // Filtros de produtos disponíveis
  const availableCategories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.technique.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeFilter === 'Todos' || product.category === activeFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      return b.id - a.id;
    });

  const handleInitiateSellerContact = (product: ShowcaseProduct) => {
    if (!canContactSeller()) {
      setShowRateLimitAlert(true);
      return;
    }
    setSellerConfirmProduct(product);
  };

  const handleConfirmSellerContact = () => {
    if (!sellerConfirmProduct) return;
    const product = sellerConfirmProduct;
    recordSellerContact();
    setSellerConfirmProduct(null);
    setInterestId(product.id);
    addToast(
      t('landing.toast_contact', 'Contato registrado para a nossa associação na peça "{title}"!').replace(
        '{title}',
        product.title
      ),
      'success'
    );

    const messageText = `Olá! Tenho interesse na peça "${product.title}" (${product.technique}) de autoria de ${product.artist} que vi na Associação Julieta Barros (Departamento de Vendas Rosa Mística).`;
    const targetPhone = product.sellerWhatsapp || sellerSettings.whatsapp || ASSOCIATION_WHATSAPP_NUMBER;
    const url = buildWhatsAppUrl(targetPhone, messageText);
    openExternalUrl(url);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white">
        {/* CABEÇALHO */}
        <Header
          hasStory={hasStorySection}
          hasGallery={realGallery.length > 0}
        />

        <main className="flex-grow">
          {/* HERO SECTION (Associação Julieta Barros) */}
          <AnimatedSection isHero>
            <LandingHero />
          </AnimatedSection>

          {/* NOSSA HISTÓRIA (Logo abaixo da Associação, dando gancho para o Departamento Rosa Mística) */}
          {hasStorySection && (
            <AnimatedSection>
              <LandingStory
                storyTitle={siteContent.storyTitle}
                story={realStory}
                teamPhoto={siteContent.teamPhoto}
                videoUrl={siteContent.videoUrl}
              />
            </AnimatedSection>
          )}

          {/* VITRINE DE PRODUTOS (Departamento de Vendas Rosa Mística) */}
          <AnimatedSection>
            <LandingShowcase
              products={products}
              filteredProducts={filteredProducts}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              availableCategories={availableCategories}
              sortOption={sortOption}
              setSortOption={setSortOption}
              isAuthenticated={isAuthenticated}
              isSellerAvailable={isSellerAvailable}
              interestId={interestId}
              onSelectProductDetail={setSelectedProductDetail}
              onInitiateSellerContact={handleInitiateSellerContact}
              onNavigateLogin={() => navigate('/login')}
              isLoading={isProductsLoading}
            />
          </AnimatedSection>

          {/* AGENDA DO ESPAÇO LOCAL */}
          <AnimatedSection>
            <LandingAgenda
              spaceEvents={spaceEvents}
              selectedCategory={selectedAgendaCategory}
              onSelectCategory={setSelectedAgendaCategory}
              filteredEvents={filteredSpaceEvents}
              coursesCount={coursesCount}
              workshopsCount={workshopsCount}
              otherEventsCount={otherEventsCount}
              isLoading={isStoreLoading}
            />
          </AnimatedSection>

          {/* GALERIA DA COMUNIDADE */}
          {realGallery.length > 0 && (
            <AnimatedSection>
              <LandingGallery gallery={realGallery} />
            </AnimatedSection>
          )}

          {/* LOCALIZAÇÃO E MAPA (COMO CHEGAR) */}
          <AnimatedSection>
            <LocationMap />
          </AnimatedSection>
        </main>

        {/* RODAPÉ */}
        <AnimatedSection>
          <Footer />
        </AnimatedSection>

      {/* MODAIS (DETALHE, WHATSAPP, RATE LIMIT) */}
      <LandingModals
        selectedProductDetail={selectedProductDetail}
        onCloseProductDetail={() => setSelectedProductDetail(null)}
        isAuthenticated={isAuthenticated}
        isSellerAvailable={isSellerAvailable}
        onNavigateLogin={() => navigate('/login')}
        onInitiateSellerContact={handleInitiateSellerContact}
        sellerConfirmProduct={sellerConfirmProduct}
        onCloseSellerConfirm={() => setSellerConfirmProduct(null)}
        onConfirmSellerContact={handleConfirmSellerContact}
        showRateLimitAlert={showRateLimitAlert}
        onCloseRateLimitAlert={() => setShowRateLimitAlert(false)}
      />
      </div>
    </MotionConfig>
  );
}
