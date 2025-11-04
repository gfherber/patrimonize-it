import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { supabase } from "@/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SalaForm } from "@/components/SalaForm";
import { Badge } from "@/components/ui/badge";

export default function Salas() {
  const { toast } = useToast();
  const [salas, setSalas] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSala, setSelectedSala] = useState<any>(null);

  useEffect(() => {
    loadSalas();
  }, []);

  const loadSalas = async () => {
    const { data, error } = await supabase
      .from("salas")
      .select(`
        *,
        patrimonios:patrimonios(count)
      `)
      .order("nome");

    if (error) {
      toast({
        title: "Erro ao carregar salas",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSalas(data || []);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta sala?")) return;

    const { error } = await supabase.from("salas").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Sala excluída com sucesso" });
      loadSalas();
    }
  };

  const handleEdit = (sala: any) => {
    setSelectedSala(sala);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    loadSalas();
    setDialogOpen(false);
    setSelectedSala(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Salas"
        description="Gerencie salas e laboratórios"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Sala
          </Button>
        }
      />

      <div className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {salas.map((sala) => (
            <Card key={sala.id} className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{sala.nome}</CardTitle>
                  {sala.bloco && (
                    <p className="text-sm text-muted-foreground">{sala.bloco}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(sala)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(sala.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>
                      {sala.patrimonios[0]?.count || 0}{" "}
                      {sala.patrimonios[0]?.count === 1 ? "equipamento" : "equipamentos"}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {sala.patrimonios[0]?.count || 0}
                  </Badge>
                </div>
                {sala.observacoes && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {sala.observacoes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {salas.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma sala cadastrada. Clique em "Nova Sala" para começar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSala ? "Editar Sala" : "Nova Sala"}
            </DialogTitle>
          </DialogHeader>
          <SalaForm
            sala={selectedSala}
            onSuccess={handleSuccess}
            onCancel={() => {
              setDialogOpen(false);
              setSelectedSala(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
