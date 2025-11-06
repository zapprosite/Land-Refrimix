Ambientes — DEV / STG / PRD

DEV

- VITE_AI_PROXY_URL=http://localhost:4000/api/ai/chat
- RLS: habilitada; dados de teste
- Logs: nível debug; sem PII

STG

- Chaves segregadas; domains de teste permitidos no CORS
- Rate limit próximo ao PRD
- Testes de integração e segurança executados

PRD

- CORS restrito às origens oficiais
- RLS + políticas revisadas
- Segredos rotacionados; HSTS ativo
- Observabilidade com alertas
