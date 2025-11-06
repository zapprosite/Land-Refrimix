# AGENTS.md

## 1. Descrição dos Agentes

- **Agent1 (Frontend)**: UI/UX, fluxo do chatbot, integração com Supabase (somente cliente) e chamadas ao proxy de IA.
- **Agent2 (Backend/Proxy)**: Endpoints REST, integração com provedores de IA (chaves privadas), autenticação e políticas.
- **Agent3 (Observabilidade)**: Logs, métricas e alertas (sem PII; retenção mínima).

## 2. Fluxos de Trabalho

1. Front recebe input → chama `/api/ai/chat` → responde usuário → CTA WhatsApp
2. CRUD de leads/clientes → persistência no Supabase (RLS)
3. Registro de eventos em logs técnicos (sem dados sensíveis)

## 3. Protocolos de Comunicação

- Padrão: REST/JSON
- Formato de resposta (IA): `{ content: string }`
- Timeout geral: 30s com retry exponencial no backend

## 4. Especificações Técnicas

- Agent1: React + Vite (TS)
- Agent2: Node.js + Express/Fastify (TS)
- Agent3: Stack de observabilidade (a definir); usar masking e retenção curta
