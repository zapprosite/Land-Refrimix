import { createClient } from '@supabase/supabase-js';

// As credenciais do Supabase devem ser configuradas como variáveis de ambiente no projeto.
// Para este ambiente de desenvolvimento, estamos usando valores de placeholder.
// Substitua pelos seus dados reais do projeto Supabase para conectar a um back-end funcional.
const supabaseUrl = "https://elrtxrbrwitqxpgaiimw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscnR4cmJyd2l0cXhwZ2FpaW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjQzNTQsImV4cCI6MjA3Nzg0MDM1NH0.7dj4v4X9-uJfaXqjdkWwC3juKboVbyU4oOqHkgVC7O4key";

if (!supabaseUrl || !supabaseAnonKey) {
  // Isso não deve acontecer com valores fixos, mas é uma boa prática.
  throw new Error("Credenciais do Supabase não estão definidas. Verifique o arquivo lib/supabase.ts.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
