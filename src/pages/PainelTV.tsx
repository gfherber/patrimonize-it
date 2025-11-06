import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Turma {
  id: string
  curso: string
  sala_id: string
  dia_semana: string
  hora_inicio: string
  hora_fim: string
}

export default function PainelTV() {
  const [turmasAtuais, setTurmasAtuais] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchTurmasAtuais() {
    const agora = new Date()
    const diasSemana = [
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sábado",
    ]
    const diaAtual = diasSemana[agora.getDay()]
    const horaAtual = agora.toTimeString().slice(0, 5)

    const { data, error } = await supabase
      .from("turmas")
      .select("*")
      .ilike("dia_semana", `%${diaAtual}%`)
      .lte("hora_inicio", horaAtual)
      .gte("hora_fim", horaAtual)

    if (!error) setTurmasAtuais(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTurmasAtuais()
    const interval = setInterval(fetchTurmasAtuais, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-blue-50 text-gray-900 flex flex-col items-center justify-start p-8">
      <h1 className="text-5xl font-bold text-[#0056A6] mb-4">
        Encontre sua Sala!
      </h1>

      <p className="text-lg text-gray-500 mb-6 capitalize">
        {new Date().toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
        })}
      </p>

      {loading ? (
        <p className="text-gray-400 text-lg">Carregando turmas...</p>
      ) : turmasAtuais.length === 0 ? (
        <p className="text-gray-400 text-2xl font-medium">
          Nenhuma turma em andamento.
        </p>
      ) : (
        <div className="grid gap-6 w-full max-w-5xl">
          {turmasAtuais.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-[#0056A6]">
                    {t.curso}
                  </h2>
                  <p className="text-gray-500 text-lg capitalize">
                    Dias: {t.dia_semana}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-gray-800">
                    Sala {t.sala_id}
                  </p>
                  <p className="text-gray-500 text-lg">
                    {t.hora_inicio?.slice(0, 5)} – {t.hora_fim?.slice(0, 5)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-10 text-sm text-gray-400">
        Atualização em tempo real ⚡ — {turmasAtuais.length} turma(s)
      </footer>
    </div>
  )
}
