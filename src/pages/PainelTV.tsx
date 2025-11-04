import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface Turma {
  id: string;
  curso: string;
  dias_semana: string[];
  hora_inicio: string;
  hora_fim: string;
  sala_id: string | null;
  salas?: {
    nome: string;
  };
}

export default function PainelTV() {
  const [turmasAtuais, setTurmasAtuais] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [horaAtual, setHoraAtual] = useState(new Date());

  async function fetchTurmasAtuais() {
    const agora = new Date();
    const dias = [
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sábado",
    ];
    const diaSemana = dias[agora.getDay()];
    const hora = agora.toTimeString().slice(0, 5);

    const { data, error } = await supabase
      .from("turmas")
      .select(
        `
        id,
        curso,
        dias_semana,
        hora_inicio,
        hora_fim,
        sala_id,
        salas (nome)
      `
      )
      .lte("hora_inicio", hora)
      .gte("hora_fim", hora);

    if (error) console.error("Erro ao buscar turmas:", error);
    else {
      const filtradas =
        data?.filter((t) => t.dias_semana?.includes(diaSemana)) || [];
      setTurmasAtuais(filtradas);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchTurmasAtuais();
    const intervalo = setInterval(() => {
      setHoraAtual(new Date());
      fetchTurmasAtuais();
    }, 60000);

    const sub = supabase
      .channel("turmas-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "turmas" },
        fetchTurmasAtuais
      )
      .subscribe();

    return () => {
      clearInterval(intervalo);
      supabase.removeChannel(sub);
    };
  }, []);

  const horaFormatada = horaAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dataFormatada = horaAtual.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 flex flex-col items-center p-10">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center w-full max-w-5xl mb-10">
        <div>
          <h1 className="text-5xl font-bold text-blue-700 flex items-center gap-3">
            Encontre sua Sala!
          </h1>
          <p className="text-gray-500 text-xl capitalize">{dataFormatada}</p>
        </div>
        <div className="text-4xl font-semibold text-blue-600">{horaFormatada}</div>
      </header>

      {/* Conteúdo */}
      {loading ? (
        <p className="text-gray-500 text-xl mt-20">Carregando turmas...</p>
      ) : turmasAtuais.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-20"
        >
          <p className="text-3xl font-medium text-gray-400">
            Nenhuma turma em andamento.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6 w-full max-w-5xl">
          {turmasAtuais.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-200 shadow-md rounded-2xl p-8 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-semibold text-blue-700">
                    {t.curso}
                  </h2>
                  <p className="text-gray-600 text-lg mt-1">
                    Dias: {t.dias_semana.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    Sala {t.salas?.nome || t.sala_id || "—"}
                  </p>
                  <p className="text-gray-500 text-lg mt-1">
                    {t.hora_inicio} – {t.hora_fim}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <footer className="mt-16 text-gray-400 text-sm">
        Atualização em tempo real ⚡ — {turmasAtuais.length} turma(s)
      </footer>
    </div>
  );
}
