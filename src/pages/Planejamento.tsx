import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function Planejamento() {
  const [curso, setCurso] = useState("");
  const [sala, setSala] = useState("");
  const [dias, setDias] = useState<string[]>([]);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [loading, setLoading] = useState(false);

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const toggleDia = (dia: string) => {
    setDias((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  async function salvarTurma() {
    if (!curso || !sala || dias.length === 0 || !horaInicio || !horaFim) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("turmas").insert([
      {
        curso,
        sala_id: sala,
        dias_semana: dias,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
      },
    ]);

    if (error) alert("Erro ao salvar turma: " + error.message);
    else alert("Turma cadastrada com sucesso!");

    setLoading(false);
  }

  return (
    <div className="p-8 w-full">
      {/* Título */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-semibold text-blue-700 flex items-center gap-2">
          <span className="text-4xl"> Planejamento de Aulas </span> 
        </h1>
        <p className="text-gray-500 mt-1">
          Cadastre os cursos e horários semanais de forma simples e rápida.
        </p>
      </header>

      {/* Formulário */}
      <div className="max-w-3xl bg-white shadow-sm rounded-xl p-8 border border-gray-100">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Nome do Curso</Label>
            <Input
              placeholder="Ex: Assistente Administrativo"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
            />
          </div>

          <div>
            <Label>Sala</Label>
            <Input
              placeholder="Ex: 101"
              value={sala}
              onChange={(e) => setSala(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Dias da Semana</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {diasSemana.map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={dias.includes(d) ? "default" : "outline"}
                  onClick={() => toggleDia(d)}
                  className="capitalize"
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Hora Início</Label>
            <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
          </div>

          <div>
            <Label>Hora Fim</Label>
            <Input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button onClick={salvarTurma} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Turma"}
          </Button>
        </div>
      </div>
    </div>
  );
}
