# PROJECT.md

## Visão Geral do Sistema

SaaS de CRM e operações para HVAC-R (climatização/refrigeração) com foco em captação de leads, agenda de serviços e chatbot consultivo.

## Arquitetura Técnica

### Frontend

- React + Vite (TypeScript)
- Integração Supabase (cliente) com RLS habilitado
- Playwright para testes E2E

### Backend (a implementar)

- Node.js/TypeScript + Express/Fastify
- Endpoints REST/JSON
- Proxy seguro para IA: `POST /api/ai/chat`
- Autenticação via Supabase Auth/JWT

### Banco de Dados

- PostgreSQL (Supabase)
- RLS obrigatório para todas as tabelas expostas ao cliente

## Requisitos Funcionais

- CRUD de leads/clientes
- Agenda de serviços e técnicos
- Chatbot consultivo (vendas HVAC-R) com histórico por sessão

## Requisitos Não Funcionais

- Disponibilidade: 99,9%
- Tempo de resposta médio: < 200ms (backend)
- Segurança: sem chaves privadas no frontend; segredos por ambiente no servidor

## Fluxos Principais

1. Lead preenche contato → persiste no Supabase (RLS)
2. Chatbot orienta compra → gera resumo → CTA WhatsApp
3. Agenda: técnico, janela de serviço e status

## Observações

- Este repositório contém apenas o front. O backend/proxy deve ser criado em `backend/`.
