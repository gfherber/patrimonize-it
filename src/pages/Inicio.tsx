import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Inicio() {
  const [stats, setStats] = useState({
    salas: 0,
    patrimonios: 0,
    turmasHoje: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const { count: salasCount } = await supabase.from("salas").select("*", { count: "exact", head: true })
      const { count: patrimoniosCount } = await supabase.from("patrimonios").select("*", { count: "exact", head: true })
      const { count: turmasCount } = await supabase.from("turmas").select("*", { count: "exact", head: true })
      setStats({
        salas: salasCount || 0,
        patrimonios: patrimoniosCount || 0,
        turmasHoje: turmasCount || 0,
      })
    }
    fetchStats()
  }, [])

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Bem-vindo ao Sistema de Gestão de TI</h1>
      <p className="text-gray-600">
        Aqui você pode gerenciar o patrimônio de TI, planejar o uso das salas e acompanhar as turmas do dia.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold">{stats.salas}</h2>
          <p className="text-gray-500">Salas Cadastradas</p>
        </Card>
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold">{stats.patrimonios}</h2>
          <p className="text-gray-500">Patrimônios</p>
        </Card>
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold">{stats.turmasHoje}</h2>
          <p className="text-gray-500">Turmas Cadastradas</p>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="flex gap-4">
          <Link to="/salas">
            <Button>+ Nova Sala</Button>
          </Link>
          <Link to="/patrimonios">
            <Button>+ Novo Patrimônio</Button>
          </Link>
          <Link to="/planejamento">
            <Button>+ Planejar Aula</Button>
          </Link>
          <Link to="/painel">
            <Button variant="outline">Ver Painel de Aulas</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
