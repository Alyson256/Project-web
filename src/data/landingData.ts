export interface SpaceEvent {
  id: number;
  title: string;
  day: string;
  date?: string;
  time: string;
  type: 'Curso' | 'Oficina' | 'Outro Evento' | string;
  description: string;
  location?: string;
  instructor?: string;
  vacancies?: string;
}

export interface ShowcaseProduct {
  id: number;
  title: string;
  technique: string;
  category: string;
  image: string;
  artist: string;
  artistPhoto?: string;
  isAvailable: boolean;
  price: number;
  description?: string;
  sellerWhatsapp?: string;
  sellerAvailable?: boolean;
}

export const initialSpaceEvents: SpaceEvent[] = [
  {
    id: 1,
    title: 'Curso de Cerâmica Tradicional e Modelagem em Barro',
    day: 'Terças e Quintas',
    date: '10 a 28 de Novembro',
    time: '14:00 às 17:00',
    type: 'Curso',
    description: 'Aprenda do zero a modelagem manual em argila vermelha, preparação da massa, acabamento com estecas e técnicas tradicionais de queima no forno a lenha.',
    location: 'Bancada de Cerâmica · Ateliê Principal',
    instructor: 'Mestre Seu João Batista',
    vacancies: 'Vagas abertas · Presencial'
  },
  {
    id: 2,
    title: 'Oficina Prática de Macramê e Fibras do Sertão',
    day: 'Quarta-feira',
    date: '12 de Novembro',
    time: '09:00 às 12:00',
    type: 'Oficina',
    description: 'Oficina para confeccionar suportes de plantas e painéis decorativos com cordões de algodão cru e sementes nativas da região.',
    location: 'Tenda Comunitária do Ateliê',
    instructor: 'Artesã Maria Auxiliadora',
    vacancies: 'Material incluso · Gratuito'
  },
  {
    id: 3,
    title: 'Encontro de Rendeiras de Bilro e Roda de Saberes',
    day: 'Sábado',
    date: '15 de Novembro',
    time: '15:00 às 18:00',
    type: 'Outro Evento',
    description: 'Roda cultural com mestras rendeiras da comunidade, demonstração dos pontos no rebolo de bilro potiguar, causos antigos e café da tarde comunitário.',
    location: 'Pátio Cultural do Ateliê',
    instructor: 'Dona Lúcia e Mestre Mariinha',
    vacancies: 'Entrada livre para toda a família'
  },
  {
    id: 4,
    title: 'Oficina de Bordado Criativo em Chita e Algodão',
    day: 'Sexta-feira',
    date: '21 de Novembro',
    time: '14:30 às 17:30',
    type: 'Oficina',
    description: 'Prática de pontos livres de bordado tradicional inspirados na vegetação e dunas potiguares, com aplicação em peças de uso diário.',
    location: 'Bancada de Costura do Ateliê',
    instructor: 'Artesã Ana Beatriz',
    vacancies: 'Iniciantes e praticantes'
  },
  {
    id: 5,
    title: 'Feira Cultural de Artesanato & Troca de Saberes',
    day: 'Domingo',
    date: '23 de Novembro',
    time: '08:30 às 13:00',
    type: 'Outro Evento',
    description: 'Encontro mensal aberto no espaço com exposição e venda direta das peças dos produtores, apresentações de forró pé-de-serra e comidas típicas.',
    location: 'Área Aberta da Associação Julieta Barros',
    instructor: 'Associação Julieta Barros',
    vacancies: 'Aberto à comunidade'
  }
];

export const initialShowcaseProducts: ShowcaseProduct[] = [
  {
    id: 1,
    title: 'Filtro dos Sonhos Grande',
    technique: 'Macramê e Pedrarias',
    category: 'Macramê',
    image: 'https://images.unsplash.com/photo-1516954203649-ce1543dafb05?auto=format&fit=crop&q=80&w=800',
    artist: 'Maria Auxiliadora',
    artistPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    isAvailable: true,
    price: 120.00,
    description: 'Peça artesanal feita com nós detalhados em macramê e pedrarias naturais do Rio Grande do Norte.'
  },
  {
    id: 2,
    title: 'Vaso de Barro Rústico',
    technique: 'Cerâmica Modelada à Mão',
    category: 'Cerâmica',
    image: 'https://images.unsplash.com/photo-1610719875508-36f731118182?auto=format&fit=crop&q=80&w=800',
    artist: 'Seu João Batista',
    artistPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    isAvailable: false,
    price: 85.50,
    description: 'Vaso de argila vermelha moldado artesanalmente no torno manual e queimado em forno tradicional.'
  },
  {
    id: 3,
    title: 'Bolsa Ecológica Estampada',
    technique: 'Costura Criativa e Silk',
    category: 'Costura',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
    artist: 'Ana Beatriz',
    artistPhoto: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfdd8?auto=format&fit=crop&q=80&w=150',
    isAvailable: true,
    price: 65.00,
    description: 'Bolsa de tecido 100% algodão cru com estampas inspiradas nas dunas e vegetação costeira potiguar.'
  },
  {
    id: 4,
    title: 'Manta de Tear Manual',
    technique: 'Tear Manual',
    category: 'Costura',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800',
    artist: 'Dona Lúcia',
    artistPhoto: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfdd8?auto=format&fit=crop&q=80&w=150',
    isAvailable: true,
    price: 350.00,
    description: 'Manta confeccionada em tear artesanal com fios naturais, acabamento em franjas feitas à mão.'
  }
];

export const getTranslatedEvent = (event: SpaceEvent, lang: 'pt' | 'en'): SpaceEvent => {
  if (lang === 'pt') return event;
  const translations: Record<number, { title: string; day: string; date?: string; description: string; location?: string; vacancies?: string }> = {
    1: {
      title: 'Traditional Pottery & Clay Modeling Course',
      day: 'Tuesdays & Thursdays',
      date: 'November 10 to 28',
      description: 'Learn manual red clay modeling from scratch, clay preparation, rib shaping, and traditional wood-fired kiln firing techniques.',
      location: 'Pottery Workshop · Main Atelier',
      vacancies: 'Open Enrollments · In-Person'
    },
    2: {
      title: 'Practical Macramé & Sertão Fibers Workshop',
      day: 'Wednesday',
      date: 'November 12',
      description: 'Workshop to craft plant hangers and decorative wall panels using raw cotton cords and native regional seeds.',
      location: 'Community Tent · Atelier',
      vacancies: 'Materials Included · Free'
    },
    3: {
      title: 'Bobbin Lace Makers Gathering & Wisdom Circle',
      day: 'Saturday',
      date: 'November 15',
      description: 'Cultural gathering with master community lace makers, live demonstrations on the potiguar bobbin bolster, folklore storytelling, and afternoon tea.',
      location: 'Cultural Courtyard · Atelier',
      vacancies: 'Free Admission for All'
    },
    4: {
      title: 'Creative Embroidery Workshop on Chita & Cotton',
      day: 'Friday',
      date: 'November 21',
      description: 'Practice freehand traditional embroidery stitches inspired by coastal dunes and local flora, applied to everyday home items.',
      location: 'Sewing Workshop · Atelier',
      vacancies: 'Beginners & Enthusiasts'
    },
    5: {
      title: 'Cultural Craft Fair & Knowledge Exchange',
      day: 'Sunday',
      date: 'November 23',
      description: 'Monthly open-air craft gathering featuring direct exhibits and sales from local artisan producers, forró music, and regional cuisine.',
      location: 'Open Courtyard · Julieta Barros Association',
      vacancies: 'Open to the Community'
    }
  };
  const tInfo = translations[event.id];
  if (!tInfo) return event;
  return {
    ...event,
    title: tInfo.title,
    day: tInfo.day,
    date: tInfo.date || event.date,
    description: tInfo.description,
    location: tInfo.location || event.location,
    vacancies: tInfo.vacancies || event.vacancies
  };
};

export const getTranslatedProduct = (product: ShowcaseProduct, lang: 'pt' | 'en'): ShowcaseProduct => {
  if (lang === 'pt') return product;
  const translations: Record<number, { title: string; technique: string; category?: string; description?: string }> = {
    1: {
      title: 'Large Dreamcatcher',
      technique: 'Macramé & Gemstones',
      category: 'Macramé',
      description: 'Handcrafted piece featuring intricate macramé knotting and natural stones from Rio Grande do Norte.'
    },
    2: {
      title: 'Rustic Clay Vase',
      technique: 'Hand-Molded Ceramic',
      category: 'Ceramics',
      description: 'Red clay vase handcrafted on a manual wheel and fired in a traditional wood kiln.'
    },
    3: {
      title: 'Eco-Friendly Printed Tote Bag',
      technique: 'Creative Sewing & Silk',
      category: 'Sewing',
      description: '100% unbleached raw cotton tote bag with prints inspired by coastal dunes and potiguar flora.'
    },
    4: {
      title: 'Handloom Blanket Throw',
      technique: 'Handloom Weaving',
      category: 'Sewing',
      description: 'Blanket crafted on a traditional loom with natural threads and hand-knotted fringe edges.'
    }
  };
  const tInfo = translations[product.id];
  if (!tInfo) return product;
  return {
    ...product,
    title: tInfo.title,
    technique: tInfo.technique,
    category: tInfo.category || product.category,
    description: tInfo.description || product.description
  };
};

export const formatCategoryName = (cat: string, lang: 'pt' | 'en') => {
  if (lang === 'pt') return cat;
  const map: Record<string, string> = {
    'Todos': 'All',
    'Macramê': 'Macramé',
    'Cerâmica': 'Ceramics',
    'Costura': 'Sewing'
  };
  return map[cat] || cat;
};
