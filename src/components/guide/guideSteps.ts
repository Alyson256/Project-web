import type { UserRole } from '../../contexts';

export interface GuideStep {
  stepNumber: number;
  actionTitle: string;
  phrase: string;
  tip?: string;
}

export interface RoleGuideData {
  role: UserRole;
  roleName: string;
  badgeLabel: string;
  hasPeaceBanner: boolean;
  steps: GuideStep[];
}

export const ROLE_GUIDE_DATA: Record<string, RoleGuideData> = {
  aprendiz: {
    role: 'aprendiz',
    roleName: 'Guia do Aprendiz (Artesão)',
    badgeLabel: 'Aprendiz (Artesão)',
    hasPeaceBanner: true,
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Clique em Novo Produto para abrir a tela de treino',
        phrase: 'Clique no botão Novo Produto para preencher seu primeiro rascunho de teste sem medo de errar.',
        tip: 'Suas peças de treino ficam visíveis só para você e para a equipe de apoio da gente.'
      },
      {
        stepNumber: 2,
        actionTitle: 'Dê um nome à sua peça artesanal e informe a técnica',
        phrase: 'Dê um nome à sua peça artesanal, informe a técnica utilizada e adicione um preço de referência.',
        tip: 'Você pode indicar se foi feita em barro, argila, bordado, renda ou tecido.'
      },
      {
        stepNumber: 3,
        actionTitle: 'Salve o rascunho e consulte suas peças cadastradas',
        phrase: 'Salve o rascunho para acompanhar suas peças de treino e receber a orientação da nossa equipe.',
        tip: 'Assim que terminar suas peças de treino, a gente oficializa sua entrada na Equipe de Produção.'
      }
    ]
  },

  aprendiz_gestor: {
    role: 'aprendiz_gestor',
    roleName: 'Guia de Treinamento em Gestão',
    badgeLabel: 'Em Treinamento (Gestão)',
    hasPeaceBanner: true,
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Abra a aba Pessoas e Cadastros para conhecer a equipe',
        phrase: 'Abra a aba Pessoas e Cadastros para ver quem está em treinamento e quem produz na nossa associação.',
        tip: 'Veja como os perfis estão organizados e acompanhe quem está aprendendo com a gente.'
      },
      {
        stepNumber: 2,
        actionTitle: 'Acesse a Agenda para planejar oficinas e encontros',
        phrase: 'Abra a aba Agenda de Eventos para consultar e simular a programação de oficinas culturais, cursos e feiras comunitárias.',
        tip: 'A gente mantém o calendário de oficinas de argila, bordado e renda sempre atualizado para a comunidade.'
      },
      {
        stepNumber: 3,
        actionTitle: 'Consulte o Mural Comunitário para verificar os comunicados',
        phrase: 'Consulte o Mural Comunitário para acompanhar os avisos e informações publicadas para o público.',
        tip: 'A nossa equipe de gestão oficializa sua promoção para a Equipe de Gestão assim que você concluir as etapas do treinamento.'
      }
    ]
  },

  produtor: {
    role: 'produtor',
    roleName: 'Guia da Equipe de Produção',
    badgeLabel: 'Equipe de Produção',
    hasPeaceBanner: false,
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Cadastre suas peças para o departamento de vendas',
        phrase: 'Clique em Novo Produto para cadastrar suas peças prontas para publicação no Departamento de Vendas Rosa Mística da nossa associação.',
        tip: 'Descreva a técnica com simplicidade e carinho para valorizar seu trabalho manual.'
      },
      {
        stepNumber: 2,
        actionTitle: 'Atualize a quantidade em estoque das suas criações',
        phrase: 'Mantenha a quantidade disponível atualizada para que quem visita a vitrine Rosa Mística saiba o que temos pronto para entrega.',
        tip: 'Você pode editar ou pausar itens conforme sua produção no dia a dia.'
      },
      {
        stepNumber: 3,
        actionTitle: 'Consulte os pedidos e mensagens de clientes interessados',
        phrase: 'Abra o painel de pedidos para visualizar as pessoas que registraram interesse nas suas peças.',
        tip: 'A gente combina tudo pelo WhatsApp para combinar os detalhes de cada encomenda com calma.'
      }
    ]
  },

  colaborador: {
    role: 'produtor',
    roleName: 'Guia da Equipe de Produção',
    badgeLabel: 'Equipe de Produção',
    hasPeaceBanner: false,
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Cadastre suas peças para o departamento de vendas',
        phrase: 'Clique em Novo Produto para cadastrar suas peças prontas para publicação no Departamento de Vendas Rosa Mística da nossa associação.',
        tip: 'Descreva a técnica com simplicidade e carinho para valorizar seu trabalho manual.'
      },
      {
        stepNumber: 2,
        actionTitle: 'Atualize a quantidade em estoque das suas criações',
        phrase: 'Mantenha a quantidade disponível atualizada para que quem visita a vitrine Rosa Mística saiba o que temos pronto para entrega.',
        tip: 'Você pode editar ou pausar itens conforme sua produção no dia a dia.'
      },
      {
        stepNumber: 3,
        actionTitle: 'Consulte os pedidos e mensagens de clientes interessados',
        phrase: 'Abra o painel de pedidos para visualizar as pessoas que registraram interesse nas suas peças.',
        tip: 'A gente combina tudo pelo WhatsApp para combinar os detalhes de cada encomenda com calma.'
      }
    ]
  },

  gestor: {
    role: 'gestor',
    roleName: 'Guia da Equipe de Gestão',
    badgeLabel: 'Equipe de Gestão',
    hasPeaceBanner: false,
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Acompanhe a produção e as peças no resumo inicial',
        phrase: 'Consulte os números principais do nosso espaço para ver a produção ativa e o total de peças no departamento Rosa Mística.',
        tip: 'O painel inicial resume o ritmo da nossa associação e as novidades em andamento.'
      },
      {
        stepNumber: 2,
        actionTitle: 'Organize oficinas, cursos e feiras na Agenda Comunitária',
        phrase: 'Abra a Agenda para programar novos cursos, encontros com quem produz e feiras abertas ao público.',
        tip: 'A agenda orienta a programação semanal e informa a comunidade sobre os horários das atividades.'
      },
      {
        stepNumber: 3,
        actionTitle: 'Publique avisos e novidades no Mural da Comunidade',
        phrase: 'Escreva comunicados e avisos para que visitantes e quem produz fiquem sempre bem informados.',
        tip: 'Mantenha o mural atualizado com feiras regionais, horários e notícias do nosso espaço.'
      },
      {
        stepNumber: 4,
        actionTitle: 'Promova quem concluiu as etapas para Produção ou Gestão',
        phrase: 'Na aba Pessoas em Treinamento ou Pessoas e Cadastros, promova diretamente as pessoas que concluíram todas as etapas.',
        tip: 'Você tem autonomia para promover pessoas capacitadas tanto para a Equipe de Produção quanto para a Equipe de Gestão da nossa associação.'
      }
    ]
  },

  visitante: {
    role: 'visitante',
    roleName: 'Guia de Visitante',
    badgeLabel: 'Visitante',
    hasPeaceBanner: false,
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Explore as peças exclusivas feitas por nós',
        phrase: 'Navegue pelo departamento de vendas Rosa Mística na vitrine da Associação Julieta Barros para conhecer as técnicas tradicionais de cerâmica, renda e costura.',
        tip: 'Você pode filtrar por técnica ou buscar por nome da peça ou de quem fez.'
      },
      {
        stepNumber: 2,
        actionTitle: 'Fale com quem produz para combinar sua peça',
        phrase: 'Clique em Falar com o vendedor para abrir uma conversa direta no WhatsApp com quem faz a peça.',
        tip: 'A gente cuida de cada detalhe e você conversa direto com o produtor com todo respeito e transparência.'
      },
      {
        stepNumber: 3,
        actionTitle: 'Acompanhe as oficinas abertas e a agenda cultural',
        phrase: 'Consulte os dias e horários das oficinas abertas e feiras culturais na Associação Julieta Barros.',
        tip: 'Venha nos visitar e participar das nossas vivências comunitárias.'
      }
    ]
  },

  adm: {
    role: 'adm',
    roleName: 'Guia do Administrador Técnico',
    badgeLabel: 'Administrador Técnico',
    hasPeaceBanner: false,
    steps: [
      {
        stepNumber: 1,
        actionTitle: 'Monitore a integridade do sistema e dos serviços',
        phrase: 'Verifique o status da conexão, latência e diagnóstico dos serviços do sistema.',
        tip: 'Acompanhe métricas essenciais e saúde dos serviços em tempo real.'
      },
      {
        stepNumber: 2,
        actionTitle: 'Audite o registro de alterações de cargos e segurança',
        phrase: 'Consulte o histórico de auditoria para acompanhar todas as mudanças promovidas na equipe.',
        tip: 'Todas as modificações de níveis de acesso ficam registradas com data, hora e responsável.'
      },
      {
        stepNumber: 3,
        actionTitle: 'Audite alterações no ecossistema e logs detalhados',
        phrase: 'Consulte os logs técnicos e o histórico de auditoria para acompanhar quem modificou registros no ecossistema do ateliê.',
        tip: 'O perfil do Administrador é dedicado à parte técnica, diagnósticos e histórico detalhado de quem fez o que no sistema.'
      }
    ]
  }
};
