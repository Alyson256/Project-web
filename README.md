# 🏺 Artesanato Rosa Mística - Vitrine Digital e Gestão O2O

> **Status:** 🚀 MVP em Fase de Validação e Amostragem
> **Deploy:** [em breve...]

## 🎯 Visão Geral
Este projeto nasceu de uma necessidade real de digitalização de cooperativas de artesanato locais. Comércios e ateliês frequentemente sofrem com a dependência exclusiva do tráfego físico. 

A solução desenvolvida é uma "Vitrine Digital" baseada na arquitetura **O2O (Online-to-Offline)**. O objetivo é criar engajamento, transmitir a história da comunidade e expor o catálogo no ambiente digital, enquanto a negociação e finalização ocorrem no meio físico (integração direta via API do WhatsApp).

## 🛡️ Segurança & Conformidade (LGPD by Design)
Uma premissa fundamental da arquitetura foi a **redução da superfície de ataque**.
Para garantir total conformidade com a LGPD (Lei Geral de Proteção de Dados), o sistema foi projetado para **não coletar ou armazenar dados pessoais de clientes** (como CPF, endereços ou perfis de navegação). O banco de dados foca estritamente no gerenciamento do catálogo de produtos e eventos da cooperativa, mitigando riscos jurídicos e vazamento de dados sensíveis.

## 🏗️ Arquitetura e Stack Tecnológica
O projeto foi pivotado de uma infraestrutura tradicional (SQL/Oracle) para uma arquitetura moderna e Serverless, garantindo alta disponibilidade e baixo custo de manutenção.

- **Front-end:** HTML5, CSS3, Vanilla JavaScript (Design Minimalista, Mobile-First).
- **Backend & Banco de Dados:** Firebase (Firestore NoSQL).
- **Autenticação:** Firebase Auth.
- **Workflow:** AI-Assisted Development (Google AI Studio) para prototipagem ágil de UI/UX e estruturação de rotas.

## 🔐 Controle de Acesso (RBAC) - *Em Implementação*
Apesar do escopo atual focar na amostragem pública (Vitrine), o núcleo do sistema já contempla um robusto **Role-Based Access Control (RBAC)** oculto para a gestão da cooperativa, dividido em três camadas de segurança:
1. **Admin (Master):** Acesso à infraestrutura de banco de dados e recuperação de sistema.
2. **Gerência:** Autorização para aprovar envios de novos produtos e gerenciar o catálogo.
3. **Colaboradores (Artesãos):** Interface simplificada apenas para submissão de fotos e informações de novos itens.

## 🚀 Roadmap e Próximos Passos
- [x] Levantamento de Requisitos in loco e UI/UX Minimalista.
- [x] Otimização de SEO e Presença Digital.
- [x] Deploy da Vitrine Digital (MVP de Amostragem).
- [ ] Integração do painel de controle restrito (Firebase Auth).
- [ ] Conexão do fluxo de comunicação via Bot do Telegram para notificações em tempo real.
