import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type MovRow = {
  id: string;
  patrimonio_id: string | null;
  sala_origem_id: string | null;
  sala_destino_id: string | null;
  motivo: string | null;
  usuario_responsavel: string | null;
  created_at: string;
};

type Sala = { id: string; nome: string };
type Patrimonio = { id: string; numero_patrimonio: string | null };

export default function Historico() {
  const { toast } = useToast();
  const [rows, setRows] = useState<MovRow[]>([]);
  const [salasMap, setSalasMap] = useState<Record<string, Sala>>({});
  const [patrMap, setPatrMap] = useState<Record<string, Patrimonio>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Carrega movimentações (sem join pra não depender de FK no Supabase)
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("movimentacoes")
        .select(
          "id, patrimonio_id, sala_origem_id, sala_destino_id, motivo, usuario_responsavel, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar histórico",
          description: error.message,
          variant: "destructive",
        });
        setRows([]);
        return;
      }

      const movs = (data || []) as MovRow[];
      setRows(movs);

      // Busca paralela dos nomes de salas e patrimônio
      const salaIds = Array.from(
        new Set(
          movs.flatMap((m) => [m.sala_origem_id, m.sala_destino_id]).filter(Boolean) as string[]
        )
      );
      const patrIds = Array.from(
        new Set(movs.map((m) => m.patrimonio_id).filter(Boolean) as string[])
      );

      // Salas
      if (salaIds.length) {
        const { data: salasData } = await supabase
          .from("salas")
          .select("id, nome")
          .in("id", salaIds);
        const map: Record<string, Sala> = {};
        (salasData || []).forEach((s) => (map[s.id] = s));
        setSalasMap(map);
      } else {
        setSalasMap({});
      }

      // Patrimônios
      if (patrIds.length) {
        const { data: patrData } = await supabase
          .from("patrimonios")
          .select("id, numero_patrimonio")
          .in("id", patrIds);
        const map: Record<string, Patrimonio> = {};
        (patrData || []).forEach((p) => (map[p.id] = p));
        setPatrMap(map);
      } else {
        setPatrMap({});
      }
    })();
  }, [toast]);

  // Enriquecimento + filtro no cliente
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const enr = rows.map((m) => {
      const origem = m.sala_origem_id ? salasMap[m.sala_origem_id]?.nome ?? "Sem sala" : "Sem sala";
      const destino = m.sala_destino_id ? salasMap[m.sala_destino_id]?.nome ?? "-" : "-";
      const patrimonio = m.patrimonio_id ? patrMap[m.patrimonio_id]?.numero_patrimonio ?? "-" : "-";
      return { ...m, origem, destino, patrimonio };
    });

    if (!term) return enr;

    return enr.filter(
      (m) =>
        (m.patrimonio || "-").toLowerCase().includes(term) ||
        (m.origem || "-").toLowerCase().includes(term) ||
        (m.destino || "-").toLowerCase().includes(term) ||
        (m.motivo || "-").toLowerCase().includes(term) ||
        (m.usuario_responsavel || "-").toLowerCase().includes(term)
    );
  }, [rows, salasMap, patrMap, searchTerm]);

  // --- UI (sempre centralizado) ---
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-6 py-6">
        <PageHeader
          title="Histórico de Movimentações"
          description="Acompanhe todas as movimentações de equipamentos"
        />

        <div className="space-y-6 mt-4">
          {/* Busca */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por patrimônio, sala, motivo ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Tabela */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Patrimônio</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                      Nenhuma movimentação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">
                        {format(new Date(m.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{m.patrimonio || "-"}</TableCell>
                      <TableCell>{m.origem}</TableCell>
                      <TableCell>{m.destino}</TableCell>
                      <TableCell className="max-w-xs truncate">{m.motivo || "-"}</TableCell>
                      <TableCell>{m.usuario_responsavel || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
