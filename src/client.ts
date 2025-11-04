import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

console.log("🌐 URL =", supabaseUrl);
console.log("🔑 KEY (início) =", supabaseAnonKey?.slice(0, 10) + "...");

// 🚨 Adicione esse log para debug
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variáveis de ambiente não carregadas corretamente!");
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
