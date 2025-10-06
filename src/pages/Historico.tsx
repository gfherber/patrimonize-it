import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

export default function Historico() {
  const { toast } = useToast();
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [filteredMovimentacoes, setFilteredMovimentacoes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMovimentacoes();
  }, []);

  useEffect(() => {
    filterMovimentacoes();
  }, [searchTerm, movimentacoes]);

  const loadMovimentacoes = async () => {
    const { data, error } = await supabase
      .from("movimentacoes")
      .select(`
        *,
        patrimonios(numero_patrimonio, tipo),
        sala_origem:salas!movimentacoes_sala_origem_id_fkey(nome),
        sala_destino:salas!movimentacoes_sala_destino_id_fkey(nome)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar histórico",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMovimentacoes(data || []);
    }
  };

  const filterMovimentacoes = () => {
    if (!searchTerm) {
      setFilteredMovimentacoes(movimentacoes);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = movimentacoes.filter(
      (m) =>
        m.patrimonios?.numero_patrimonio?.toLowerCase().includes(term) ||
        m.sala_origem?.nome?.toLowerCase().includes(term) ||
        m.sala_destino?.nome?.toLowerCase().includes(term) ||
        m.motivo?.toLowerCase().includes(term)
    );
    setFilteredMovimentacoes(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Histórico de Movimentações"
        description="Acompanhe todas as movimentações de equipamentos"
      />

      <div className="flex-1 p-6 space-y-6">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por patrimônio, sala ou motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

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
              {filteredMovimentacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhuma movimentação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredMovimentacoes.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="font-medium">
                      {format(new Date(mov.created_at), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      {mov.patrimonios?.numero_patrimonio || "-"}
                    </TableCell>
                    <TableCell>{mov.sala_origem?.nome || "Sem sala"}</TableCell>
                    <TableCell>{mov.sala_destino?.nome || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {mov.motivo || "-"}
                    </TableCell>
                    <TableCell>{mov.usuario_responsavel || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
