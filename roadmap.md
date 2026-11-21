# Roadmap e Documentação do Projeto: Cooperativa Potengi

## Visão Geral

Este documento serve como guia e documentação da interface de usuário (UI) desenvolvida para a **Cooperativa e Ateliê Comunitário Potengi**. A aplicação foi projetada com foco em responsividade (Mobile-First), acessibilidade, usabilidade intuitiva para usuários de diversas idades e uma estética que reflete a cultura local através de tons terrosos e verdes.

## Estrutura do Projeto (Frontend)

O projeto foi construído utilizando **React** (com Vite), **TypeScript**, **Tailwind CSS v4** e **React Router** para navegação. O gerenciamento de estado global (Tema Escuro/Claro e Autenticação) é feito através da Context API do React.

### Arquivos Principais

*   **`src/App.tsx`**: Ponto de entrada das rotas. Configura o `ThemeProvider`, `AuthProvider` e roteia para `/` (Landing), `/login` e `/dashboard`.
*   **`src/contexts/ThemeContext.tsx`**: Gerencia o tema da aplicação (Claro/Escuro). Sincroniza o estado com a classe `.dark` no `<html>` e armazena a preferência no `localStorage`.
*   **`src/contexts/AuthContext.tsx`**: Gerencia o estado de autenticação mockado no frontend. Define os papéis (roles) de usuário: `funcionario` (artesão), `gerente`, `adm`, `visitante` ou `null` (deslogado).
*   **`src/pages/Landing.tsx`**: A Landing Page e Feed Principal, acessível ao público geral (visitantes).
*   **`src/pages/Login.tsx`**: Tela de autenticação baseada em nome de usuário para direcionar ao painel correto.
*   **`src/pages/Dashboard.tsx`**: Painel administrativo dinâmico que renderiza interfaces diferentes com base na permissão do usuário.

## Detalhamento das Telas e Funcionalidades

### 1. Feed Principal / Showcase (Landing Page)
**Arquivo:** `src/pages/Landing.tsx`
**Público-alvo:** Visitantes, clientes e membros da comunidade.

*   **Cabeçalho (Header):** Contém a marca (Logo), links âncora para navegação na página (Agenda, Pilares, História), um alternador de tema e o botão de "Entrar" (Login) que direciona os artesãos ao sistema. É responsivo, transformando-se em um menu hambúrguer no mobile.
*   **Hero Section:** Introdução de impacto focada na força da comunidade da Zona Norte de Natal.
*   **Agenda da Semana:** Exibe eventos locais, integrando a comunidade ao ateliê (ex: aulas, feiras, oficinas).
*   **Vitrine de Produtos (Showcase):** Grid responsiva que exibe o artesanato local.
    *   **Cards de Produto:** Cada card exibe a imagem da peça, título, técnica utilizada, e um mini-perfil do artesão (foto e nome).
    *   **Lógica de Status (Disponível vs. Vendido):** 
        *   **Disponível:** Apresenta uma tag verde e um botão "Tenho Interesse" (com ícone do WhatsApp) para contato direto.
        *   **Vendido:** A imagem do produto recebe uma sobreposição (overlay) escura com um selo vermelho de "Vendido", e o botão de contato é removido, desabilitando a intenção de compra.

### 2. Tela de Login
**Arquivo:** `src/pages/Login.tsx`
**Público-alvo:** Artesãos, Gerentes e Administradores.

*   Tela simples, focada na conversão e acessibilidade.
*   Possui um formulário simulado que, baseado no nome digitado (ex: "funcionario", "gerente", "admin"), direciona o usuário para a interface correta no Dashboard.
*   *Nota para Integração Backend:* O evento `handleLogin` deve ser substituído por uma chamada real de API (ex: Firebase Auth) validando e-mail e senha e recuperando a *role* do usuário do banco de dados.

### 3. Dashboard do Artesão (Visão Funcional)
**Arquivo:** `src/pages/Dashboard.tsx` (Bloco `role === 'funcionario'`)
**Público-alvo:** Produtores locais e artesãos.

*   **Mobile-First e Minimalista:** Projetado para ser usado em dispositivos móveis. Elementos grandes, fluxos curtos e textos legíveis.
*   **Saudação Personalizada:** Exibe uma mensagem acolhedora.
*   **Adição Rápida de Produto:** Formulário enxuto contendo um botão de grande área de toque para "Subir Imagem/Tirar Foto" (simulado), campos de Título e Técnica, e botão de salvar.
*   **Meus Produtos:** Lista de cards horizontais das peças exclusivas daquele artesão.
    *   **Alternância de Status (Toggle):** Um botão interativo que permite ao artesão marcar instantaneamente uma peça como "Disponível" ou "Vendido".
*   *Nota para Integração Backend:* O estado `myProducts` deve ser alimentado por uma query no banco de dados (ex: `where("artesaoId", "==", userId)`). O *toggle* deve disparar um `updateDoc` no Firestore, e a submissão de imagem deve integrar-se ao Firebase Storage.

## Integração Futura com Backend (ex: Firebase)

Para tornar o sistema completamente funcional com persistência de dados, as seguintes substituições devem ocorrer:

1.  **Autenticação:** Substituir a lógica no `AuthContext` e `Login.tsx` pelos métodos `signInWithEmailAndPassword` e `signOut` do Firebase Auth. Salvar a propriedade `role` na *Custom Claims* ou no documento do usuário no Firestore.
2.  **Banco de Dados (Firestore):**
    *   **Coleção `produtos`:** Deverá armazenar cada item do showcase (título, técnica, url_imagem, artesao_nome, artesao_foto, status, data_criacao).
    *   **Coleção `eventos`:** Para popular a Agenda da Semana dinamicamente pelo gerente.
3.  **Armazenamento (Firebase Storage):** O componente de upload de fotos no Dashboard do Artesão deverá fazer o upload do arquivo de imagem para o Storage e salvar a URL de download no Firestore.

## Decisões de Design (UI/UX)
*   **Tailwind CSS:** Uso intenso de utilitários como `dark:` para suporte nativo ao modo noturno.
*   **Cores:** Utilização das escalas `stone`, `green` e `amber` do Tailwind para manter a harmonia terrosa e natural solicitada, evitando cores excessivamente vibrantes ou "brancos de hospital".
*   **Acessibilidade (a11y):** Contraste revisado, fontes grandes, padding confortável para toques e transições suaves de estado.
