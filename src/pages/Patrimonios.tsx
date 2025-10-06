import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2, ArrowRightLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PatrimonioForm } from "@/components/PatrimonioForm";
import { MovimentacaoForm } from "@/components/MovimentacaoForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  ativo: "bg-success/10 text-success border-success/20",
  manutencao: "bg-warning/10 text-warning border-warning/20",
  emprestado: "bg-primary/10 text-primary border-primary/20",
  inativo: "bg-muted text-muted-foreground border-muted",
  descartado: "bg-destructive/10 text-destructive border-destructive/20",
};

const tipoLabels: Record<string, string> = {
  gabinete: "Gabinete",
  monitor: "Monitor",
  notebook: "Notebook",
  teclado: "Teclado",
  mouse: "Mouse",
  impressora: "Impressora",
  switch: "Switch",
  roteador: "Roteador",
  outro: "Outro",
};

export default function Patrimonios() {
  const { toast } = useToast();
  const [patrimonios, setPatrimonios] = useState<any[]>([]);
  const [filteredPatrimonios, setFilteredPatrimonios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movimentacaoOpen, setMovimentacaoOpen] = useState(false);
  const [selectedPatrimonio, setSelectedPatrimonio] = useState<any>(null);

  useEffect(() => {
    loadPatrimonios();
  }, []);

  useEffect(() => {
    filterPatrimonios();
  }, [searchTerm, patrimonios]);

  const loadPatrimonios = async () => {
    const { data, error } = await supabase
      .from("patrimonios")
      .select("*, salas(nome)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar patrimônios",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPatrimonios(data || []);
    }
  };

  const filterPatrimonios = () => {
    if (!searchTerm) {
      setFilteredPatrimonios(patrimonios);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = patrimonios.filter(
      (p) =>
        p.numero_patrimonio?.toLowerCase().includes(term) ||
        p.tipo?.toLowerCase().includes(term) ||
        p.marca?.toLowerCase().includes(term) ||
        p.modelo?.toLowerCase().includes(term) ||
        p.salas?.nome?.toLowerCase().includes(term)
    );
    setFilteredPatrimonios(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este patrimônio?")) return;

    const { error } = await supabase.from("patrimonios").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Patrimônio excluído com sucesso" });
      loadPatrimonios();
    }
  };

  const handleEdit = (patrimonio: any) => {
    setSelectedPatrimonio(patrimonio);
    setDialogOpen(true);
  };

  const handleMove = (patrimonio: any) => {
    setSelectedPatrimonio(patrimonio);
    setMovimentacaoOpen(true);
  };

  const handleSuccess = () => {
    loadPatrimonios();
    setDialogOpen(false);
    setMovimentacaoOpen(false);
    setSelectedPatrimonio(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Patrimônios"
        description="Gerencie todos os equipamentos cadastrados"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Patrimônio
          </Button>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por patrimônio, tipo, marca, modelo ou sala..."
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
                <TableHead>Patrimônio</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Marca/Modelo</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatrimonios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum patrimônio encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatrimonios.map((patrimonio) => (
                  <TableRow key={patrimonio.id}>
                    <TableCell className="font-medium">
                      {patrimonio.numero_patrimonio}
                    </TableCell>
                    <TableCell>{tipoLabels[patrimonio.tipo]}</TableCell>
                    <TableCell>
                      {patrimonio.marca && patrimonio.modelo
                        ? `${patrimonio.marca} ${patrimonio.modelo}`
                        : patrimonio.marca || patrimonio.modelo || "-"}
                    </TableCell>
                    <TableCell>{patrimonio.salas?.nome || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[patrimonio.status]}>
                        {patrimonio.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMove(patrimonio)}
                          title="Mover equipamento"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(patrimonio)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(patrimonio.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPatrimonio ? "Editar Patrimônio" : "Novo Patrimônio"}
            </DialogTitle>
          </DialogHeader>
          <PatrimonioForm
            patrimonio={selectedPatrimonio}
            onSuccess={handleSuccess}
            onCancel={() => {
              setDialogOpen(false);
              setSelectedPatrimonio(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={movimentacaoOpen} onOpenChange={setMovimentacaoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mover Equipamento</DialogTitle>
          </DialogHeader>
          <MovimentacaoForm
            patrimonio={selectedPatrimonio}
            onSuccess={handleSuccess}
            onCancel={() => {
              setMovimentacaoOpen(false);
              setSelectedPatrimonio(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
