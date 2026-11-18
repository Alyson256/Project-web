# Artesanato e Espaço — Associação Julieta Barros

> **Status:** MVP Frontend Concluído | Backend & Integração em Estruturação
> **Deploy:** Em breve...

## Visão Geral e Objetivo

Este projeto nasceu da necessidade real de inclusão digital de artesãos e gestores locais (Associação Julieta Barros — Departamento de Vendas Rosa Mística, Natal/RN). Comércios comunitários frequentemente sofrem com a dependência exclusiva do tráfego físico e com barreiras tecnológicas.

A solução desenvolvida é uma **Vitrine Digital** baseada na arquitetura **O2O (Online-to-Offline)**:
* **Online:** Exposição do catálogo de peças, agenda de cursos/oficinas e preservação da história da associação.
* **Offline:** Negociação direta e humanizada entre comprador e artesão via integração dinâmica com o WhatsApp.

### Acessibilidade como Requisito Base (*Accessibility by Design*)
Como a maior parte da equipe de gestão e dos artesãos pertence à terceira idade, a interface foi projetada com foco em **baixa carga cognitiva**, navegação *mobile-first*, alto contraste, ajuste tipográfico nativo e um **Ambiente de Treino Isolado (Sandbox)** para capacitação segura sem risco de alterações em produção.

---

## Segurança e Privacidade (LGPD by Design)

Para proteger os artesãos contra *scraping* de contatos e minimizar riscos jurídicos, o sistema aplica o princípio da **minimização de dados**:
* **Proteção de Contato:** Os números de WhatsApp dos produtores não ficam expostos publicamente; o redirecionamento só é liberado após autenticação do visitante.
* **Identidade Terceirizada:** O sistema não armazena senhas, CPFs, endereços ou dados financeiros. A autenticação ocorre exclusivamente via **Google OAuth2 (Firebase Auth)**, extraindo apenas nome, e-mail e foto de perfil para identificação básica.

---

## Arquitetura e Stack Tecnológica

O sistema adota uma arquitetura desacoplada (SPA + API REST), separando a camada visual da lógica de negócio e persistência:

* **Frontend:** React, TypeScript, Vite, Tailwind CSS e Framer Motion (com suporte a `prefers-reduced-motion` e internacionalização PT-BR/EN-US).
* **Autenticação (IdP):** Firebase Authentication (Google Sign-In).
* **Backend (API REST):** Python + Django REST Framework (DRF) com validação criptográfica via `firebase-admin`.
* **Banco de Dados & Storage:** Banco relacional (PostgreSQL/SQLite) para regras de negócio e armazenamento em nuvem para mídias.
* **Workflow de Prototipação:** AI-Assisted Development (Google AI Studio) para validação rápida de UI/UX.

---

## Controle de Acesso e Governança (RBAC)

O ecossistema gerencia permissões através de uma estrutura híbrida (validação presencial pela gestão + controle digital), dividida em perfis específicos:

1. **Visitante (Autenticado):** Acesso à vitrine, agenda e botão de contato direto via WhatsApp com mensagem pré-estruturada.
2. **Aprendiz (Modo Sandbox):** Ambiente simulado para novos artesãos e gestores praticarem o uso da plataforma sem afetar o site público.
3. **Produtor (Artesão):** Cadastro de peças, controle de estoque, aplicação de preços promocionais nominais e configuração do WhatsApp de vendas.
4. **Gestor:** Curadoria e aprovação de peças submetidas, promoção de cargos (de Visitante/Aprendiz para Produtor), gestão de eventos e conteúdo institucional.
5. **Administrador Técnico (SysAdmin):** Monitoramento de integridade do sistema, logs de auditoria e suporte técnico.

---

## Roadmap e Etapas de Desenvolvimento

### Fase 1: Modelo Conceitual e Engenharia de Requisitos
- [x] Levantamento de requisitos *in loco* com a gestão e artesãos do ateliê.
- [x] Definição da arquitetura de papéis (RBAC) e fluxo de aprovação presencial/digital.
- [x] Modelagem das regras de acessibilidade (WCAG AA) e fluxo O2O via WhatsApp.

### Fase 2: Prototipação e MVP Frontend
- [x] Estruturação da interface responsiva (*Mobile-First*) e Design System minimalista.
- [x] Implementação do menu de acessibilidade nativo (fonte, contraste, dislexia e leitura em voz alta).
- [x] Desenvolvimento dos painéis por cargo e do **Ambiente de Treino (Sandbox)**.
- [x] Implementação de filtros dinâmicos, precificação promocional e alternância de idioma (PT/EN).

### Fase 3: Backend, Persistência e Segurança *(Fase Atual)*
- [ ] Configuração completa do ambiente Django REST Framework e modelagem do banco de dados.
- [ ] Validação estrita do `idToken` do Firebase no backend (`firebase-admin`) e emissão de sessão JWT.
- [ ] Substituição dos dados mockados por endpoints reais (Produtos, Agenda, Chamados e Auditoria).
- [ ] Implementação de travas de integridade (bloqueio de edição em peças *Em revisão*) e upload de imagens.

### Fase 4: Homologação e Deploy
- [ ] Testes assistidos em campo com os gestores e produtores da associação.
- [ ] Ocultação das ferramentas de simulação (`DEV`) e publicação em ambiente de produção.
- [ ] Configuração de notificações por e-mail para chamados críticos de suporte.
