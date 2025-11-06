Supabase — RLS e Políticas

Tabelas Alvo

- leads, clientes, agendamentos, chat_messages

Passos

1. Ativar RLS: ALTER TABLE <tabela> ENABLE ROW LEVEL SECURITY;
2. Criar políticas por ação/role.

Exemplos (pseudo)

- leads (authenticated): SELECT/INSERT somente do usuário dono
  create policy leads_select_owner on leads for select using (auth.uid() = user_id);
  create policy leads_insert_owner on leads for insert with check (auth.uid() = user_id);

- chat_messages (authenticated): INSERT livre para sessão do usuário; SELECT por sessão
  create policy chat_insert on chat_messages for insert with check (auth.uid() = user_id);
  create policy chat_select_session on chat_messages for select using (session_id = current_setting('app.session_id', true));

Papéis

- anon: mínimo acesso; sem insert/update/delete.
- authenticated: escopo do próprio usuário.
- service_role: acesso administrativo via backend (usar com cautela).

Boas Práticas

- Testar políticas com diferentes roles.
- Restringir colunas sensíveis.
- Auditar alterações de schema/políticas.
