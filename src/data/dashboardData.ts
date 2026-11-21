import type { AnnouncementItem, EventItem, ProductItem, UserItem } from '../types';

export const chartData = [
  { name: 'Seg', activeProducers: 12, newProducts: 4 },
  { name: 'Ter', activeProducers: 15, newProducts: 7 },
  { name: 'Qua', activeProducers: 14, newProducts: 5 },
  { name: 'Qui', activeProducers: 18, newProducts: 10 },
  { name: 'Sex', activeProducers: 22, newProducts: 12 },
  { name: 'Sáb', activeProducers: 25, newProducts: 15 },
  { name: 'Dom', activeProducers: 20, newProducts: 8 },
];

export const mockArtisanProducts: ProductItem[] = [
  { 
    id: 101, 
    title: 'Vaso de Barro Potengi', 
    technique: 'Argila Queimada Tradicional', 
    description: 'Vaso rústico modelado à mão no ateliê.', 
    image: 'https://images.unsplash.com/photo-1610719875508-36f731118182?auto=format&fit=crop&q=80&w=200', 
    isAvailable: true, 
    stock: 2, 
    price: 65, 
    artist: 'Dona Laura',
    isTraining: false,
    status: 'publicado',
    contactsCount: 14
  },
  { 
    id: 102, 
    title: 'Toalha de Mesa Rendada de Bilro Tradicional', 
    technique: 'Renda de Bilro', 
    description: 'Toalha feita com pontos tradicionais do Rio Grande do Norte.', 
    image: 'https://images.unsplash.com/photo-1516954203649-ce1543dafb05?auto=format&fit=crop&q=80&w=200', 
    isAvailable: true, 
    stock: 1, 
    price: 90, 
    artist: 'Dona Laura',
    isTraining: false,
    status: 'em_revisao',
    contactsCount: 9
  },
  { 
    id: 103, 
    title: 'Cesto Trançado de Taboa e Fibras Naturais', 
    technique: 'Trançado em Fibra Natural', 
    description: 'Cesto artesanal modelado com fibras do nosso manguezal.', 
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200', 
    isAvailable: true, 
    stock: 1, 
    price: 55, 
    artist: 'Seu Antônio Barbalho',
    isTraining: false,
    status: 'em_revisao',
    contactsCount: 6
  },
];

export const mockAllProducts: ProductItem[] = [
  ...mockArtisanProducts,
  { 
    id: 1, 
    title: 'Filtro dos Sonhos Grande com Pedrarias e Macramê', 
    technique: 'Macramê e Pedrarias', 
    description: 'Uma peça única para decoração.', 
    image: 'https://images.unsplash.com/photo-1516954203649-ce1543dafb05?auto=format&fit=crop&q=80&w=200', 
    isAvailable: true, 
    stock: 5, 
    price: 120, 
    artist: 'Maria Artesã',
    isTraining: false,
    status: 'publicado',
    contactsCount: 27
  },
  { 
    id: 2, 
    title: 'Centro de Mesa em Macramê com Fios de Algodão Cru', 
    technique: 'Macramê e Fios de Algodão', 
    description: 'Peça artesanal em fase de carinho e revisão para a vitrine Rosa Mística.', 
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=200', 
    isAvailable: true, 
    stock: 3, 
    price: 75, 
    artist: 'Maria Artesã',
    isTraining: false,
    status: 'em_revisao',
    contactsCount: 18
  },
  { 
    id: 3, 
    title: 'Vaso de Barro Rústico Esmaltado', 
    technique: 'Cerâmica Modelada', 
    description: 'Vaso artesanal modelado à mão.', 
    image: 'https://images.unsplash.com/photo-1610719875508-36f731118182?auto=format&fit=crop&q=80&w=200', 
    isAvailable: true, 
    stock: 2, 
    price: 85.5, 
    artist: 'Seu João Batista',
    isTraining: false,
    status: 'publicado',
    contactsCount: 12
  },
];

export const mockUsers: UserItem[] = [
  { id: 1, name: 'João Visitante', email: 'joao.visitante@gmail.com', role: 'visitante', stepText: '' },
  { id: 7, name: 'Dona Francisca Ribeiro', email: 'francisca.ribeiro@gmail.com', role: 'visitante', stepText: '' },
  { id: 8, name: 'Manoel dos Anjos', email: 'manoel.anjos@gmail.com', role: 'visitante', stepText: '' },
  { id: 9, name: 'Dona Helena Bezerra', email: 'helena.bezerra@gmail.com', role: 'visitante', stepText: '' },
  { id: 10, name: 'Severino da Silva', email: 'severino.silva@gmail.com', role: 'visitante', stepText: '' },
  { id: 11, name: 'Maria das Vitórias', email: 'm.vitorias@gmail.com', role: 'visitante', stepText: '' },
  { 
    id: 2, 
    name: 'Dona Laura', 
    email: 'dona.laura@gmail.com', 
    role: 'aprendiz', 
    trainingTarget: 'produtor',
    stepText: '3 de 3 etapas',
    completedStepsCount: 3,
    totalStepsCount: 3,
    completedAt: '30/10/2026',
    lastActivityDate: 'Hoje às 10:15'
  },
  { id: 3, name: 'Maria Artesã', email: 'maria.artesa@gmail.com', role: 'produtor', stepText: '' },
  { id: 4, name: 'Ana Gestora', email: 'ana.gestora@gmail.com', role: 'gestor', stepText: '' },
  { 
    id: 5, 
    name: 'Carlos Ferreira', 
    email: 'carlos.ferreira@gmail.com', 
    role: 'gestor', 
    stepText: 'Promovido para Gestor' 
  },
  { 
    id: 12, 
    name: 'Mariana Lima', 
    email: 'mariana.lima@gmail.com', 
    role: 'aprendiz_gestor', 
    trainingTarget: 'gestor',
    stepText: '2 de 4 tarefas',
    completedStepsCount: 2,
    totalStepsCount: 4,
    lastActivityDate: 'Ontem às 16:40',
    practicedItems: [
      'Editou um texto (rascunho)',
      'Enviou uma foto'
    ]
  },
  { 
    id: 6, 
    name: 'Seu Antônio Barbalho', 
    email: 'antonio.barbalho@gmail.com', 
    role: 'aprendiz', 
    trainingTarget: 'produtor',
    stepText: '1 de 3 etapas',
    completedStepsCount: 1,
    totalStepsCount: 3,
    lastActivityDate: '28/10/2026',
    practicedItems: []
  },
];

export const mockEvents: EventItem[] = [
  { id: 1, title: 'Feira de Domingo', date: '2026-08-09', time: '09:00', type: 'Feira', description: 'Exposição ao ar livre com demonstração de cerâmica e bordado.' },
  { id: 2, title: 'Oficina de Cerâmica', date: '2026-08-12', time: '14:00', type: 'Oficina', description: 'Encontro aberto para iniciantes aprenderem técnicas de modelagem manual.' },
  { id: 3, title: 'Encontro de Rendeiras de Bilro', date: '2026-08-16', time: '15:00', type: 'Encontro Cultural', description: 'Roda de conversa e demonstração de pontos tradicionais do Rio Grande do Norte.' },
];

export const mockAnnouncements: AnnouncementItem[] = [
  {
    id: 1,
    title: 'Atualização nos Horários de Funcionamento do Ateliê',
    category: 'Mudança',
    date: '10/08/2026',
    summary: 'A partir desta semana, o ateliê estará aberto aos sábados das 08h às 17h para visitação pública e oficinas.',
    content: 'Informamos a todos os visitantes e membros da comunidade que o Ateliê Comunitário amplia seu atendimento no final de semana. Agora contaremos com visitas guiadas às 10h e às 15h, com demonstrações ao vivo dos mestres artesãos nas técnicas de cerâmica e renda de bilro.',
    author: 'Gestão do Ateliê'
  },
  {
    id: 2,
    title: 'Novas Peças de Barro Disponíveis na Vitrine Rosa Mística',
    category: 'Publicação',
    date: '08/08/2026',
    summary: 'Peças exclusivas moldadas à mão pela nossa gente já estão disponíveis no Departamento de Vendas Rosa Mística.',
    content: 'A gente tem a alegria de colocar à disposição as novas peças concluídas pela nossa gente na Associação Julieta Barros. As obras utilizam argila local e queima tradicional, com toda a beleza da nossa terra.',
    author: 'Equipe de Gestão'
  },
  {
    id: 3,
    title: 'Regras de Cuidado e Carinho nas Nossas Bancadas Coletivas',
    category: 'Mudança',
    date: '05/08/2026',
    summary: 'A gente organizou o espaço para deixar tudo limpo e agradável nos dias de oficinas abertas.',
    content: 'Para manter o espaço acolhedor e seguro durante as oficinas abertas a quem nos visita, a gente organizou o descarte dos materiais e o reaproveitamento de água e pigmentos naturais. Todos nós cuidamos juntos do ateliê.',
    author: 'Equipe de Gestão'
  },
  {
    id: 4,
    title: 'Abertura da Feira de Artesanato Tradicional',
    category: 'Aviso',
    date: '01/08/2026',
    summary: 'Venha prestigiar quem produz na nossa associação no estande da praça central no domingo.',
    content: 'A gente convida você e sua família para ver de perto as peças da nossa Associação Julieta Barros na Feira da Cidade. Teremos cerâmicas, rendas de bilro e trançados de fibras vegetais, além de uma boa conversa com quem faz a arte.',
    author: 'Equipe de Gestão'
  }
];
