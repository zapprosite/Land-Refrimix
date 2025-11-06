import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Carregar via variáveis de ambiente em tempo de build (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const mode = (import.meta as any).env?.MODE || process.env.NODE_ENV || 'development';

let supabaseClient: SupabaseClient | any;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  if (mode === 'production') {
    throw new Error(
      '[supabase] Variáveis de ambiente ausentes em produção: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
    );
  }
  // Stub de desenvolvimento/teste para permitir E2E offline
  // Não persiste dados; apenas evita que o app quebre.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stub: any = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => ({
        eq: () => ({
          select: () => ({ single: () => Promise.resolve({ data: {}, error: null }) }),
        }),
      }),
      gte: () => ({ lt: () => Promise.resolve({ count: 0, error: null }) }),
      eq: () => Promise.resolve({ count: 0, error: null }),
    }),
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: (_cb: unknown) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
    },
  };
  supabaseClient = stub as SupabaseClient;
}

export const supabase = supabaseClient as SupabaseClient;
