# Segurança — Land-Refrimix

- Nunca commitar `.env` ou chaves privadas (OpenAI, Stripe, etc.).
- Front-end não deve chamar provedores de IA com chave; use `VITE_AI_PROXY_URL` para um backend seguro.
- Supabase com RLS habilitado e políticas por tabela.
- Logs sem PII; ignore `logs/` no Git.
- Revogue e rotacione quaisquer chaves já expostas (histórico Git incluso).

## Backend — Segurança

- Rate limiting por IP/rota (ex.: 60 req/min) com `Retry-After`.
- Headers:
  - Content-Security-Policy (CSP): default-src 'self'; connect-src 'self' https://api.openai.com ...
  - HTTP Strict Transport Security (HSTS)
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
- CORS: allowlist das origens oficiais; bloquear credenciais quando não necessário.
- Validação e sanitização de entrada; limites de payload e timeouts.

## Checklist de Hardening

- [ ] `.env` ignorado e ausente do repositório
- [ ] Removidos fallbacks de credenciais do código-fonte
- [ ] IA via proxy backend (`/api/ai/chat`)
- [ ] Políticas RLS revisadas no Supabase
- [ ] Dependências atualizadas e auditadas
- [ ] Headers de segurança aplicados (CSP/HSTS/NoSniff/FrameOptions)
- [ ] CORS restrito às origens oficiais
- [ ] Rate limiting validado em cenários variados
