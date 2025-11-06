import { useEffect, useState } from "react";
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
    <div className="min-h-screen w-full bg-[#F8FAFC]">
      {/* Cabeçalho institucional */}
      <div className="w-full border-b border-gray-200 bg-white shadow-sm px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0056A6]">Patrimônios</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gerencie equipamentos e itens de TI da instituição.
          </p>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#0056A6] hover:bg-[#004b93] text-white shadow-md"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Patrimônio
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {patrimonios.map((p) => (
            <Card
              key={p.id}
              className="transition-all border-gray-200 hover:shadow-lg hover:border-[#0056A6]/40"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold text-[#0056A6]">
                    {p.tipo || "Sem tipo"}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {p.marca ? `${p.marca} ${p.modelo || ""}` : "Sem detalhes"}
                  </p>
                  {p.salas?.nome && (
                    <p className="text-xs text-gray-500 mt-1">
                      📍 Sala: {p.salas.nome}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(p)}
                    className="hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4 text-[#0056A6]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(p.id)}
                    className="hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#0056A6]" />
                    <span className="font-medium">Status:</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.status === "Ativo"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.status || "Indefinido"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {patrimonios.length === 0 && (
            <Card className="col-span-full border-gray-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-gray-500 text-center max-w-md">
                  Nenhum patrimônio cadastrado ainda.  
                  <br />
                  Clique em{" "}
                  <span className="font-semibold text-[#0056A6]">
                    “Novo Patrimônio”
                  </span>{" "}
                  para adicionar o primeiro item.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de criação/edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#0056A6] text-xl font-semibold">
              {selectedPatrimonio ? "Editar Patrimônio" : "Novo Patrimônio"}
            </DialogTitle>
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
