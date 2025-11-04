import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { supabase } from "@/client";
import { useToast } from "@/hooks/use-toast";
import { PatrimonioForm } from "@/components/PatrimoniosForm";

export default function Patrimonios() {
  const { toast } = useToast();
  const [patrimonios, setPatrimonios] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatrimonio, setSelectedPatrimonio] = useState<any>(null);

  useEffect(() => {
    loadPatrimonios();
  }, []);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este patrimônio?")) return;

    const { error } = await supabase.from("patrimonios").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir patrimônio",
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

  const handleSuccess = () => {
    loadPatrimonios();
    setDialogOpen(false);
    setSelectedPatrimonio(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Patrimônios"
        description="Gerencie equipamentos e itens de TI"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Patrimônio
          </Button>
        }
      />

      <div className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {patrimonios.map((p) => (
            <Card key={p.id} className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">{p.tipo || "Sem tipo"}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {p.marca ? `${p.marca} ${p.modelo || ""}` : "Sem detalhes"}
                  </p>
                  {p.salas?.nome && (
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 Sala: {p.salas.nome}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{p.status}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          {patrimonios.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Nenhum patrimônio cadastrado. Clique em “Novo Patrimônio” para começar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPatrimonio ? "Editar Patrimônio" : "Novo Patrimônio"}</DialogTitle>
          </DialogHeader>
          <PatrimonioForm
            patrimonio={selectedPatrimonio}
            onSuccess={handleSuccess}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
