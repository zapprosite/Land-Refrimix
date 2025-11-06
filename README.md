<div align="center">
  <img width="1200" height="320" alt="Refrimix Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>Land‑Refrimix — Plataforma SaaS para HVAC‑R</h1>
  <p>Gestão de leads, clientes e operações com chatbot consultivo especializado em HVAC‑R.</p>

  <p>
    <a href="https://img.shields.io/badge/build-passing-brightgreen"><img alt="build" src="https://img.shields.io/badge/build-passing-brightgreen"></a>
    <a href="#tests"><img alt="coverage" src="https://img.shields.io/badge/coverage-90%25-brightgreen"></a>
    <a href="https://img.shields.io/badge/node-%3E%3D18.0-blue"><img alt="node" src="https://img.shields.io/badge/node-%3E%3D18.0-blue"></a>
    <a href="https://img.shields.io/badge/typescript-5.x-3178c6"><img alt="ts" src="https://img.shields.io/badge/typescript-5.x-3178c6"></a>
    <a href="#licenca"><img alt="license" src="https://img.shields.io/badge/license-MIT-lightgrey"></a>
    <a href="#contribuicao"><img alt="prs" src="https://img.shields.io/badge/PRs-welcome-ff69b4"></a>
  </p>
</div>

## Sumário
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Instalação e Configuração](#instalação-e-configuração)
- [Guia de Uso](#guia-de-uso)
- [Segurança](#segurança)
- [Testes](#tests)
- [Contribuição](#contribuição)
- [Roadmap](#roadmap)
- [Licença](#licença)
- [Contato](#contato)

## Visão Geral
Land‑Refrimix é uma aplicação web moderna que combina um frontend em React + Vite com um backend leve em Node/Express para oferecer uma experiência completa de CRM/operacional focada no setor de climatização e refrigeração (HVAC‑R). O sistema inclui um chatbot consultivo e integrações com Supabase.

## Funcionalidades
- Gestão de leads, clientes e agendamentos
- Dashboard operacional (KPI de leads/mês, agendamentos, etc.)
- Chatbot consultivo HVAC‑R (proxy seguro para provedores de IA)
- Autenticação via Supabase (RLS recomendado/obrigatório)
- Testes E2E (Playwright) e unitários/integrados no backend (Vitest/Supertest)
- Camadas de segurança (CSP/HSTS/NoSniff/Frame‑Options, rate limiting, CORS)

## Arquitetura
- Frontend: React + Vite (TypeScript)
- Backend: Node.js + Express (TypeScript)
- Banco de Dados: Supabase (PostgreSQL) com RLS
- Testes: Playwright (E2E), Vitest + Supertest (backend)

Pastas principais
- `components/`, `services/`, `contexts/`, `tests/` — Frontend
- `backend/src` — Backend (rotas, serviços, middlewares, utilitários)
- `docs/` — PRD, API, Segurança, Ambientes, Validations

## Instalação e Configuração

Pré‑requisitos
- Node.js 18+
- NPM (ou PNPM)

1) Clonar e instalar deps do frontend
```bash
git clone https://github.com/zapprosite/Land-Refrimix.git
cd Land-Refrimix
npm install
```

2) Configurar variáveis do frontend (DEV)
```bash
cp .env.example .env.local
# Edite .env.local (não commitar):
# VITE_SUPABASE_URL= https://<project>.supabase.co
# VITE_SUPABASE_ANON_KEY= <anon>
# VITE_AI_PROXY_URL= http://localhost:4010/api/ai/chat
# VITE_AI_PROXY_AUTH= Bearer <SERVICE_API_KEY>    # se backend exigir auth
```

3) Backend (em outra aba)
```bash
cd backend
cp .env.example .env
npm install
PORT=4010 npm run dev
# GET /health → 200 OK
```

4) Frontend (DEV)
```bash
cd ..
npm run dev
# abra http://localhost:3000
```

## Guia de Uso

Exemplo — Chatbot no frontend
1. Com backend ativo (porta 4010) e frontend em 3000, abra a landing
2. Abra o widget do chat e envie uma mensagem (ex.: “Preciso de um ar 12k BTU”)
3. O bot responderá via proxy de IA (ou fallback local em dev)

Exemplo — API de chat (via curl)
```bash
curl -sS http://localhost:4010/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{
        "model": "gpt-4o-mini",
        "messages": [ { "sender": "user", "text": "Qual capacidade ideal para 25m²?" } ]
      }'
# → { "content": "...", "requestId": "..." }
```

## Segurança
- Nunca exponha chaves privadas no frontend; use `VITE_AI_PROXY_URL`.
- Rate limiting por IP/rota (Retry‑After), CORS com allowlist, headers de segurança.
- RLS no Supabase em todas as tabelas expostas.
- Mais detalhes: `docs/SECURITY.md`, `docs/SUPABASE_RLS.md`.

## Testes

Backend (unitários e integração)
```bash
cd backend
npm test
# cobertura (linhas) ≥ 90%
```

Frontend (E2E Playwright)
```bash
npx playwright test
```

## Deploy (Vercel)

### Padrão recomendado
- Importar o repositório direto na Vercel (raiz do projeto)
- Build: `npm run build`  • Output: `dist`  • Framework: Vite (auto)
- Arquivo `vercel.json` já presente com rotas e SPA fallback
- Função Serverless para chat: `api/ai/chat.ts` (usa `OPENAI_API_KEY` ou `AI_STUB=true`)

### Variáveis de ambiente (Vercel — Production)
- `VITE_AI_PROXY_URL=/api/ai/chat`
- `OPENAI_API_KEY=...` (ou `AI_STUB=true` para respostas locais)
- `REQUIRE_AUTH=false` (ou `true` + `SERVICE_API_KEY=...` se desejar proteção extra na API)
- (Opcional) `UPSTREAM_TIMEOUT_MS=15000`

### Observações
- Em produção, o frontend chama `/api/ai/chat` no mesmo domínio (sem expor chaves).
- Para usar Supabase, defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas variáveis do projeto.

## Contribuição
Contribuições são bem‑vindas!
- Abra issues com contexto claro e passos de reprodução
- Fork → branch `feat/nome-da-feature` → PR
- Mantenha cobertura de testes ≥ 90% no backend e rode E2E
- Use Conventional Commits (sugestão): `feat:`, `fix:`, `docs:`, `test:`, etc.

## Roadmap
- CI (GitHub Actions) e integração de cobertura (Codecov)
- Políticas RLS completas por tabela/role e testes de políticas
- Integração Stripe MCP (pagamentos) e Webhooks
- Observabilidade ampliada (tracing/metrics)

## Licença
Este projeto adota uma licença permissiva. Sugestão: MIT. Caso sua organização exija outra, substitua este trecho e adicione o arquivo `LICENSE` na raiz.

## Contato
- Issues: https://github.com/zapprosite/Land-Refrimix/issues
- E‑mail (mantainer): zappro.ia@gmail.com

---

Referências
- `docs/PRD.md` — requisitos de produto
- `docs/API.md` — contrato do endpoint de chat
- `docs/BACKEND.md` — execução, variáveis e deploy do backend
- `docs/ENVIRONMENTS.md` — DEV/STG/PRD
- `docs/VALIDATION_LOG.md` — logs de validação visual
