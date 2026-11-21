# Associação Julieta Barros — Vitrine Digital & Gestão Comunitária

Aplicação web moderna (Frontend SPA) desenvolvida para a **Associação Julieta Barros** e o **Departamento de Vendas Rosa Mística**, localizada na Zona Norte de Natal/RN.

O projeto foi projetado com foco em **acessibilidade para a terceira idade**, **alta usabilidade**, estética acolhedora em tons terrosos/verdes e arquitetura desacoplada pronta para consumo de API REST.

---

## 🚀 Tecnologias Utilizadas

* **React 19** com **Vite 6**
* **TypeScript**
* **Tailwind CSS v4** (tema dinâmico Claro/Escuro e Modo Alto Contraste)
* **React Router v7**
* **Lucide React** (Ícones acessíveis)
* **Framer Motion** (Microinterações suaves)
* **Vite PWA** (Suporte a Progressive Web App e modo offline)

---

## 📦 Como Executar Localmente

### Pré-requisitos
* **Node.js** (versão 18 ou superior)
* **npm** ou gerenciador de pacotes equivalente

### Instalação e Execução

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra seu navegador em:
   ```text
   http://localhost:3000
   ```

---

## 🛠️ Scripts Disponíveis

* `npm run dev`: Inicia o servidor de desenvolvimento na porta 3000 com Hot Module Reloading (HMR).
* `npm run build`: Compila e minifica a aplicação para produção na pasta `dist/`.
* `npm run preview`: Testa a compilação de produção localmente.
* `npm run lint`: Valida a integridade de tipos do TypeScript (`tsc --noEmit`).

---

## ♿ Recursos de Acessibilidade

* Alternador de Tema (Claro / Escuro / Alto Contraste).
* Ajuste de tamanho de fonte e espaçamento de letras pensado para idosos.
* Suporte a navegação por teclado e leitores de tela com `aria-live`.
* Leitura de texto por voz integrada (Web Speech API).
* Design responsivo adaptável para celulares, tablets e monitores desktop.
