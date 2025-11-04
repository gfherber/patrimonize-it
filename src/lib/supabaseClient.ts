import { createClient } from "@supabase/supabase-js";

// 🔧 Lê variáveis do ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Variáveis do Supabase não configuradas corretamente!");
}

// ✅ Cria e exporta o cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
