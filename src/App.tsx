import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner, toast } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { SidebarProvider } from "@/components/ui/sidebar"
import { supabase } from "./client"

// Páginas
import Inicio from "./pages/Inicio"
import Dashboard from "./pages/Dashboard"
import Patrimonios from "./pages/Patrimonios"
import Salas from "./pages/Salas"
import Historico from "./pages/Historico"
import Planejamento from "./pages/Planejamento"
import PainelTV from "./pages/PainelTV"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const App = () => {
  // 🧠 Teste automático de conexão com o Supabase
  useEffect(() => {
    async function testarConexao() {
      console.log("🔍 Supabase URL:", import.meta.env.VITE_SUPABASE_URL)
      console.log("🔑 Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 8) + "...")

      const { data, error } = await supabase.from("salas").select("*")

      if (error) {
        console.error("❌ Erro na conexão Supabase:", error.message)
        toast.error("Erro ao conectar com o Supabase 🚨")
      } else {
        console.log("✅ Conectado ao Supabase! Tabela 'salas':", data)
        toast.success("Conexão com o Supabase bem-sucedida ✅")
      }
    }

    testarConexao()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Inicio />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/planejamento" element={<Planejamento />} />
                <Route path="/painel" element={<PainelTV />} />
                <Route path="/patrimonios" element={<Patrimonios />} />
                <Route path="/salas" element={<Salas />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
