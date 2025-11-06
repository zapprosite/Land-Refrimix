API — Land-Refrimix

Endpoint: POST /api/ai/chat

Request

- Headers obrigatórios:
  - `Content-Type: application/json`
  - Opcional: `X-Request-Id` (será gerado se ausente)
- Limites e validação:
  - Tamanho máximo do payload: 32KB
  - `messages`: array 1..25
  - Cada `text`: string 1..1000 caracteres
  - `sender`: "user" | "bot"
  - `model`: string (ex.: "gpt-4o-mini")
- Exemplo de body válido:
  {
  "model": "gpt-4o-mini",
  "messages": [
  { "sender": "user", "text": "Qual capacidade ideal para 25m²?" }
  ]
  }

Response

- 200 OK:
  { "content": "Para 25m², recomendo 12k BTU inverter...", "requestId": "abc-123" }
- 400 Bad Request (invalid payload):
  { "error": { "code": "invalid_payload", "message": "messages[0].text is required" }, "requestId": "abc-123" }
- 429 Too Many Requests:
  { "error": { "code": "rate_limited", "message": "Rate limit exceeded" }, "retryAfter": 30, "requestId": "abc-123" }
- 500 Internal Error (upstream):
  { "error": { "code": "upstream_unavailable", "message": "AI provider unavailable" }, "requestId": "abc-123" }

Headers de resposta

- Sempre incluir `X-Request-Id` e `Cache-Control: no-store`
- Em 429: incluir `Retry-After: <segundos>`

Catálogo de erros (código → status)

- 400 Bad Request:
  - `invalid_json` (JSON malformado)
  - `invalid_content_type` (Content-Type incorreto)
  - `invalid_payload` (erros de schema)
  - `payload_too_large` (>32KB)
  - `too_many_messages` (len(messages) > 25)
  - `message_too_long` (len(text) > 1000)
- 429 Too Many Requests:
  - `rate_limited` (limite excedido)
- 500 Internal Server Error:
  - `upstream_unavailable` (falha do provedor)
  - `upstream_timeout` (timeout do provedor)
  - `internal_error` (erro inesperado)

Rate limiting

- Janela deslizante: 60 req/min por IP na rota `/api/ai/chat`
- Picos curtos permitidos (burst); ao exceder, retornar 429 com `Retry-After`

Timeouts e tentativas

- Timeout do provedor de IA: 15s
- Timeout total do endpoint: 20s
- Recomendado: 1 re‑tentativa rápida (backoff exponencial inicial: 200ms) para erros transitórios (5xx/timeout)

Observações de logging

- Logs estruturados com: requestId, status, duração (ms), tamanho do payload (bytes)
- Nunca logar conteúdo completo das mensagens; aplicar masking/sumarização quando necessário
