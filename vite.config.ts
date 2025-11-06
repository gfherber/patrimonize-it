import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: true, // ✅ garante que o servidor rode no Codespaces corretamente
    port: 8080, // ✅ mesma porta que você já usa
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ permite importar com "@/client", "@/components", etc.
    },
  },
  define: {
    "process.env": {}, // ✅ evita erro em libs que tentam acessar process.env (ex: Supabase, shadcn)
  },
});
