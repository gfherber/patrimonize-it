import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function Planejamento() {
  const { toast } = useToast()
  const [salas, setSalas] = useState<{ id: string; nome: string }[]>([])
  const [turmas, setTurmas] = useState<any[]>([])
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [nomeCurso, setNomeCurso] = useState("")
  const [salaSelecionada, setSalaSelecionada] = useState<string>("")
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([])
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFim, setHoraFim] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchSalas() {
      const { data, error } = await supabase.from("salas").select("id, nome").order("nome")
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao buscar salas",
          description: error.message,
        })
      } else {
        setSalas(data || [])
      }
    }
    fetchSalas()
  }, [toast])

  async function fetchTurmas() {
    const { data, error } = await supabase
      .from("turmas")
      .select(`
        *,
        salas: sala_id ( nome )
      `)
      .order("data_inicio", { ascending: true })

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar turmas",
        description: error.message,
      })
    } else {
      setTurmas(data || [])
    }
  }

  useEffect(() => {
    fetchTurmas()
  }, [])

  const toggleDia = (dia: string) => {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    )
  }

  async function salvarTurma() {
    if (!nomeCurso || !salaSelecionada || diasSelecionados.length === 0 || !dataInicio || !dataFim) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de salvar.",
      })
      return
    }

    setLoading(true)

    const payload = {
      curso: nomeCurso,
      sala_id: salaSelecionada,
      dia_semana: diasSelecionados.join(","),
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      data_inicio: dataInicio,
      data_fim: dataFim,
    }

    const result = editandoId
      ? await supabase.from("turmas").update(payload).eq("id", editandoId)
      : await supabase.from("turmas").insert([payload])

    const { error } = result
    setLoading(false)

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar turma",
        description: error.message,
      })
    } else {
      toast({
        title: editandoId ? "Turma atualizada!" : "Turma salva com sucesso!",
        description: `${nomeCurso} (${diasSelecionados.join(", ")})`,
      })
      setNomeCurso("")
      setSalaSelecionada("")
      setDiasSelecionados([])
      setHoraInicio("")
      setHoraFim("")
      setDataInicio("")
      setDataFim("")
      setEditandoId(null)
      fetchTurmas()
    }
  }

  async function excluirTurma(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta turma?")) return
    const { error } = await supabase.from("turmas").delete().eq("id", id)
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir turma",
        description: error.message,
      })
    } else {
      toast({ title: "Turma excluída com sucesso!" })
      fetchTurmas()
    }
  }

  function editarTurma(t: any) {
    setEditandoId(t.id)
    setNomeCurso(t.curso)
    setSalaSelecionada(t.sala_id)
    setDiasSelecionados(t.dia_semana.split(","))
    setHoraInicio(t.hora_inicio)
    setHoraFim(t.hora_fim)
    setDataInicio(t.data_inicio)
    setDataFim(t.data_fim)
  }

  const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen bg-gray-50 px-6 py-10">
      <div className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-3xl font-bold text-[#0056A6] mb-2">Painel de Planejamento</h1>
        <p className="text-gray-600">
          Cadastre, visualize e edite as turmas semanais de forma simples e profissional.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-10">
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Nome do Curso</label>
              <Input
                placeholder="Ex: Desenvolvimento de Equipes"
                value={nomeCurso}
                onChange={(e) => setNomeCurso(e.target.value)}
              />
            </div>

            <div className="w-1/3">
              <label className="block font-medium mb-1">Sala</label>
              <Select value={salaSelecionada} onValueChange={setSalaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a sala" />
                </SelectTrigger>
                <SelectContent>
                  {salas.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Dias da Semana</label>
            <div className="flex gap-2 flex-wrap justify-center">
              {diasDaSemana.map((dia) => (
                <Button
                  key={dia}
                  type="button"
                  variant={diasSelecionados.includes(dia) ? "default" : "outline"}
                  onClick={() => toggleDia(dia)}
                  className={`w-24 ${
                    diasSelecionados.includes(dia)
                      ? "bg-[#0056A6] hover:bg-[#004b93]"
                      : "text-gray-700 border-gray-300"
                  }`}
                >
                  {dia}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Data Início</label>
              <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Data Fim</label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Hora Início</label>
              <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Hora Fim</label>
              <Input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
            </div>
          </div>

          <Button
            onClick={salvarTurma}
            disabled={loading}
            className="w-full mt-4 bg-[#0056A6] hover:bg-[#004b93] text-white"
          >
            {loading ? "Salvando..." : editandoId ? "Atualizar Turma" : "Salvar Turma"}
          </Button>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4 text-[#0056A6]">Turmas planejadas</h2>
        {turmas.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhuma turma cadastrada ainda.</p>
        ) : (
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-[#E6F0FA] text-[#0056A6]">
                <tr>
                  <th className="p-3 text-left font-semibold">Curso</th>
                  <th className="p-3 text-left font-semibold">Sala</th>
                  <th className="p-3 text-left font-semibold">Dias</th>
                  <th className="p-3 text-left font-semibold">Horário</th>
                  <th className="p-3 text-left font-semibold">Período</th>
                  <th className="p-3 text-center font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{t.curso}</td>
                    <td className="p-3">{t.salas?.nome || "—"}</td>
                    <td className="p-3">{t.dia_semana}</td>
                    <td className="p-3">
                      {t.hora_inicio?.slice(0, 5)} - {t.hora_fim?.slice(0, 5)}
                    </td>
                    <td className="p-3">
                      {t.data_inicio} → {t.data_fim}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => editarTurma(t)}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => excluirTurma(t.id)}>
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
