import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Key, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PatrimonioForm } from "@/components/PatrimonioForm";

export default function Patrimonios() {
  const { toast } = useToast();
  const [patrimonios, setPatrimonios] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatrimonio, setSelectedPatrimonio] = useState<any>(null);

  useEffect(() => {
    fetchPatrimonios();
  }, []);

  async function fetchPatrimonios() {
    const { data, error } = await supabase
      .from("patrimonios")
      .select(`
        *,
        salas ( nome )
      `)
      .order("tipo");

    if (error) {
      toast({
        title: "Erro ao carregar patrimônios",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPatrimonios(data || []);
    }
  }

  const handleEdit = (patrimonio: any) => {
    setSelectedPatrimonio(patrimonio);
    setDialogOpen(true);
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
      toast({ title: "Patrimônio excluído com sucesso!" });
      fetchPatrimonios();
    }
  };

  const handleSuccess = () => {
    fetchPatrimonios();
    setDialogOpen(false);
    setSelectedPatrimonio(null);
  };

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen bg-gray-50 px-6 py-10">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0056A6] mb-1">Patrimônios</h1>
          <p className="text-gray-600">
            Gerencie equipamentos e itens de TI da instituição.
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#0056A6] hover:bg-[#004b93] text-white shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Patrimônio
        </Button>
      </div>

      {patrimonios.length === 0 ? (
        <Card className="w-full max-w-4xl bg-white border border-gray-200 shadow-sm text-center py-16">
          <CardContent>
            <p className="text-gray-500 text-lg">
              Nenhum patrimônio cadastrado ainda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 w-full max-w-6xl sm:grid-cols-2 lg:grid-cols-3">
          {patrimonios.map((p) => (
            <Card
              key={p.id}
              className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="pb-2 flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#0056A6]">
                  {p.tipo || "Sem tipo"}
                </CardTitle>
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
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p className="text-gray-800 font-medium">
                  {p.marca} {p.modelo && `(${p.modelo})`}
                </p>
                {p.salas?.nome && (
                  <p className="flex items-center gap-1 text-gray-600">
                    <Key className="w-4 h-4 text-[#0056A6]" />
                    <span>Sala: {p.salas.nome}</span>
                  </p>
                )}
                <p className="flex items-center gap-1 text-gray-600">
                  <Package className="w-4 h-4 text-[#0056A6]" />
                  <span>
                    Status:{" "}
                    <Badge
                      variant="outline"
                      className={`${
                        p.status === "ativo"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#0056A6] text-xl font-semibold">
              {selectedPatrimonio ? "Editar Patrimônio" : "Novo Patrimônio"}
            </DialogTitle>
          </DialogHeader>
          <PatrimoniosForm
            patrimonio={selectedPatrimonio}
            onSuccess={handleSuccess}
            onCancel={() => {
              setDialogOpen(false);
              setSelectedPatrimonio(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
