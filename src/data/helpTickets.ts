import { HelpTicket } from '../components/HelpSupportModal';

export interface TicketItem {
  id: number;
  title: string;
  description: string;
  author: string;
  status: 'aberto' | 'fechado';
  date: string;
  category: 'tecnico' | 'produtor';
  priority?: 'normal' | 'alta';
  messages?: { author: string; text: string; date: string }[];
}

export const initialHelpTickets: HelpTicket[] = [
  {
    id: 201,
    title: 'Erro 500 ao subir foto na galeria do ateliê',
    description: 'Quando tentamos adicionar uma foto grande de alta resolução na galeria pública, a página recarrega e dá erro 500.',
    author: 'Ana Gestora',
    authorRole: 'Gestor',
    type: 'problema',
    originScreen: 'Textos, Fotos e Vídeos',
    category: 'tecnico',
    status: 'aberto',
    displayStatus: 'Estamos vendo',
    hasUnread: true,
    photoUrl: 'https://images.unsplash.com/photo-1610719875508-36f731118182?auto=format&fit=crop&q=80&w=400',
    date: '31/10 às 11:20',
    technicalDetails: {
      screenResolution: '1920x1080',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
      timestamp: '31/10/2026 11:20:00'
    },
    messages: [
      { author: 'Ana Gestora', text: 'Aconteceu quando tentei subir a foto da turma de cerâmica com mais de 5MB.', date: '31/10 às 11:25' },
      { author: 'Suporte técnico', text: 'Recebemos o relato e o arquivo anexado. A compressão do servidor está sendo revisada.', date: '31/10 às 11:40', isSystemOrSupport: true }
    ]
  },
  {
    id: 202,
    title: 'Aprovação para inclusão de nova categoria de rendas tradicionais',
    description: 'Precisamos de liberação técnica para adicionar uma subcategoria de Rendado tradicional para o Departamento de Vendas Rosa Mística.',
    author: 'Ana Gestora',
    authorRole: 'Gestor',
    type: 'aprovacao',
    originScreen: 'Verificar Produtos',
    category: 'tecnico',
    status: 'aberto',
    displayStatus: 'Recebido',
    approvalStatus: 'pendente',
    date: '30/10 às 16:40',
    technicalDetails: {
      screenResolution: '1366x768',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: '30/10/2026 16:40:00'
    },
    messages: [
      { author: 'Ana Gestora', text: 'Por favor, liberar a subcategoria técnica para cadastro das peças das rendeiras.', date: '30/10 às 16:40' }
    ]
  },
  {
    id: 203,
    title: 'Backup automático semanal das fotos e cadastros',
    description: 'Relatório do sistema: O backup de todas as fotos, produtos e cadastros foi gerado sem erros.',
    author: 'Sistema Automático',
    authorRole: 'Sistema',
    type: 'problema',
    originScreen: 'Ajustes e backup',
    category: 'tecnico',
    status: 'fechado',
    displayStatus: 'Resolvido',
    date: '28/10 às 04:00',
    messages: [{ author: 'Suporte técnico', text: 'Registro verificado e armazenado com segurança no repositório.', date: '28/10 às 04:15', isSystemOrSupport: true }]
  },
  {
    id: 101,
    title: 'Dúvida sobre repasse das vendas da feira online',
    description: 'Como e quando as artesãs recebem o valor das peças vendidas na loja online?',
    author: 'Dona Laura',
    authorRole: 'Aprendiz',
    type: 'duvida',
    originScreen: 'Meus Produtos',
    category: 'produtor',
    status: 'aberto',
    displayStatus: 'Recebido',
    date: '31/10 às 09:30',
    messages: [
      { author: 'Dona Laura', text: 'Gostaria de entender se o pagamento cai direto na conta ou se vem no final do mês.', date: '31/10 às 09:30' }
    ]
  },
  {
    id: 102,
    title: 'Horário de uso da bancada de queima de cerâmica',
    description: 'Gostaria de saber se a bancada do forno elétrico estará liberada na próxima quinta-feira.',
    author: 'Seu Antônio Barbalho',
    authorRole: 'Aprendiz',
    type: 'duvida',
    originScreen: 'Meus Produtos',
    category: 'produtor',
    status: 'fechado',
    displayStatus: 'Resolvido',
    date: '27/10 às 14:15',
    messages: [
      { author: 'Seu Antônio Barbalho', text: 'Boa tarde, preciso queimar duas fornadas de vasos.', date: '27/10 às 14:15' },
      { author: 'Ana Gestora', text: 'Olá Seu Antônio! A bancada estará livre na quinta à tarde das 14h às 17h.', date: '27/10 às 15:30' }
    ]
  },
];

export const mockTickets = initialHelpTickets;
