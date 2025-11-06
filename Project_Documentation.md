# Documentação do Projeto: Land-Refrimix

## Visão Geral

Aplicação web para gestão de leads, clientes, agenda e chatbot consultivo em HVAC-R.

## Arquitetura

- Frontend: React + Vite (TS)
- Backend (proposto): Node.js + Express/Fastify com proxy seguro de IA
- Banco: Supabase (PostgreSQL) com RLS obrigatória
- Comunicação: REST/JSON; WebSocket opcional para eventos

## Requisitos Funcionais

1. Cadastro/gestão de leads
2. Chatbot consultivo com histórico por sessão
3. Dashboard com KPIs (leads/mês, agendamentos, OS abertas)
4. Agenda de serviços por técnico

## Requisitos Não Funcionais

- Disponibilidade: 99,9%
- Tempo de resposta < 200ms no backend
- Segurança: sem chaves privadas no front; segredos no servidor; logs sem PII

## Observações de Segurança

- Não commitar `.env` ou chaves privadas.
- Habilitar RLS no Supabase e políticas por tabela.
- Integrar IA via endpoint de backend (`/api/ai/chat`).

## Diagramas (a adicionar)

- Fluxo web → backend → Supabase
- Sequência do chatbot
