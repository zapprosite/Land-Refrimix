Backend (Node/TS) — Land-Refrimix

Estrutura

- backend/src/app.ts — configuração do Express, middlewares e rotas
- backend/src/routes/ai.ts — controlador POST /api/ai/chat
- backend/src/services/aiService.ts — integração com provedor de IA (stub/real)
- backend/src/middlewares — rate limit, security headers, requestId
- backend/tests/ai.spec.ts — testes (Vitest + Supertest)

Executar localmente

1. cd backend
2. Copie .env.example para .env e ajuste variáveis (o backend carrega .env automaticamente via dotenv)
3. npm install
4. npm run dev (sobe em http://localhost:4000)

Variáveis principais

- PORT=4000
- CORS_ORIGINS=http://localhost:3000
- AI_STUB=true (usa resposta local sem chamar provedor)
- AI_PROVIDER=openai
- OPENAI_API_KEY= (quando AI_STUB=false)
- UPSTREAM_TIMEOUT_MS=15000
- RATE_LIMIT_MAX=60
- REQUIRE_AUTH=false (se true, exigir Authorization: Bearer <SERVICE_API_KEY>)
- SERVICE_API_KEY=

API

- POST /api/ai/chat — ver docs/API.md

Segurança

- Headers: CSP/HSTS/NoSniff/FrameOptions
- CORS allowlist
- Rate limiting 60 req/min/IP (ajustável)
- Cache-Control: no-store
- X-Request-Id em todas as respostas

Testes

- npm run test (Vitest com cobertura ≥90% configurada)
- Cenários cobertos: 200, 400, 429, 500 e timeout

Deploy

- Build: npm run build (gera dist/)
- Start: npm start (node dist/server.js)
- Configure variáveis de ambiente conforme docs/ENVIRONMENTS.md
