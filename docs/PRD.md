PRD — Land-Refrimix (HVAC-R)

1. Objetivo
   Disponibilizar backend POST /api/ai/chat, reforçar segurança (Supabase RLS + backend), padronizar documentação e cobrir com testes (unitário/integração/segurança).

2. Escopo

- Backend: Endpoint de chat via proxy de IA, com validação, tratamento de erros e logs estruturados.
- Segurança: RLS Supabase, políticas granulares, rate limiting, headers e CORS.
- Documentação: API, segurança e guias de ambiente.
- Testes: unitários, integração e segurança.

3. Requisitos Funcionais

- RF-01: Receber mensagens do usuário e retornar { content: string }.
- RF-02: Validar o payload (tamanho, tipos, campos requeridos).
- RF-03: Logar requisições e respostas (sem PII) com requestId e latência.

4. Requisitos Não Funcionais

- RNF-01: Disponibilidade 99,9%.
- RNF-02: Timeout do provedor de IA: 15s; do endpoint: 20s.
- RNF-03: Rate limiting por IP (ex.: 60 req/min).
- RNF-04: Headers de segurança e CORS restritivo.

5. API — /api/ai/chat (POST)

- Content-Type: application/json (obrigatório)
- Headers: opcional `X-Request-Id` (gerado se ausente)
- Limites: payload ≤ 32KB; `messages` 1..25; cada `text` 1..1000 chars
- Request body (exemplo):
  {
  "model": "gpt-4o-mini",
  "messages": [
  { "sender": "user", "text": "Preciso de um ar de 12k BTU" }
  ]
  }
- Response (200):
  { "content": "Recomendo modelo inverter 12k para 20m²..." }
- Erros (código → status):
  - 400: `invalid_json`, `invalid_content_type`, `invalid_payload`, `payload_too_large`, `too_many_messages`, `message_too_long`
  - 429: `rate_limited` (incluir header `Retry-After`)
  - 500: `upstream_unavailable`, `upstream_timeout`, `internal_error`

6. Segurança (Backend)

- CSP, HSTS, X-Content-Type-Options, X-Frame-Options.
- CORS com allowlist de origens.
- Validação e sanitização de entrada; rejeitar payloads >32KB.
- Logs sem PII; masking/sumarização; sempre `X-Request-Id`.

7. Supabase RLS (tabelas)

- Tabelas expostas: leads, clientes, agendamentos, chat_messages.
- Ativar RLS em todas; políticas por role:
  - anon: leitura mínima (se aplicável), sem escrita.
  - authenticated: CRUD conforme dono/escopo (ex.: registros do próprio usuário).
  - service_role: bypass para automações no backend.

8. Testes

- Unitários: controlador e serviço de IA (mocks); tratar erros 400/429/500 e timeouts.
- Integração: fluxo end-to-end; CORS; rate limiting (Retry-After); limites de payload.
- Segurança: headers (CSP/HSTS/NoSniff/FrameOptions); inputs malformados; inputs extremos.

9. Aceite

- Endpoint passa testes unitários/integrados.
- RLS ativo e políticas testadas para cada role.
- Rate limiting validado (cenários burst/steady).
- Documentação atualizada e exemplos funcionais.
