import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface Turma {
  id: string
  nome: string
  curso: string
  dia_semana: string
  hora_inicio: string
  hora_fim: string
  sala_id: string
}

export function useTurmas() {
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchTurmas() {
    setLoading(true)
    const { data, error } = await supabase.from('turmas').select('*').order('hora_inicio', { ascending: true })
    if (error) setError(error.message)
    else setTurmas(data || [])
    setLoading(false)
  }

  async function addTurma(newTurma: Omit<Turma, 'id'>) {
    // Verifica conflitos antes de salvar
    const conflito = turmas.some(t =>
      t.sala_id === newTurma.sala_id &&
      (
        (newTurma.hora_inicio >= t.hora_inicio && newTurma.hora_inicio < t.hora_fim) ||
        (newTurma.hora_fim > t.hora_inicio && newTurma.hora_fim <= t.hora_fim)
      )
    )
    if (conflito) throw new Error('Conflito: já existe uma turma neste horário e sala.')

    const { error } = await supabase.from('turmas').insert([newTurma])
    if (error) throw error
    await fetchTurmas()
  }

  useEffect(() => {
    fetchTurmas()
  }, [])

  return { turmas, loading, error, addTurma, refetch: fetchTurmas }
}
