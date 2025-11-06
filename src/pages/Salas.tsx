import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { supabase } from "@/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SalaForm } from "@/components/SalaForm";
import { Badge } from "@/components/ui/badge";

export default function Salas() {
  const { toast } = useToast();
  const [salas, setSalas] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSala, setSelectedSala] = useState<any>(null);
  const [detalheSala, setDetalheSala] = useState<any>(null);

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

  // 🔹 Ao clicar na sala: abre modal com patrimônios
  const handleViewSala = async (sala: any) => {
    const { data, error } = await supabase
      .from("patrimonios")
      .select("*")
      .eq("sala_id", sala.id);

    if (error) {
      toast({
        title: "Erro ao carregar patrimônios",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setDetalheSala({
      ...sala,
      patrimoniosDetalhes: data || [],
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 🔹 Cabeçalho institucional (sem sanduíche duplicado) */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0056A6]">Salas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie salas e laboratórios de forma simples e eficiente.
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#0056A6] hover:bg-[#004b93] text-white shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Sala
        </Button>
      </div>

      {/* 🔹 Conteúdo principal */}
      <div className="p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {salas.map((sala) => (
            <Card
              key={sala.id}
              onClick={() => handleViewSala(sala)}
              className="border border-gray-200 hover:border-[#0056A6]/40 hover:shadow-md transition-all bg-[#F9FBFD] cursor-pointer"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold text-[#0056A6]">
                    {sala.nome}
                  </CardTitle>
                  {sala.bloco && (
                    <p className="text-sm text-gray-600">{sala.bloco}</p>
                  )}
                </div>

                <div
                  className="flex gap-1"
                  onClick={(e) => e.stopPropagation()} // evita abrir modal ao clicar em editar/excluir
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(sala)}
                    className="hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4 text-[#0056A6]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(sala.id)}
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
                    <span>
                      {sala.patrimonios[0]?.count || 0}{" "}
                      {sala.patrimonios[0]?.count === 1
                        ? "equipamento"
                        : "equipamentos"}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-[#E6F0FA] text-[#0056A6] border-[#0056A6]/20 font-semibold"
                  >
                    {sala.patrimonios[0]?.count || 0}
                  </Badge>
                </div>

                {sala.observacoes && (
                  <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                    {sala.observacoes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {salas.length === 0 && (
            <Card className="col-span-full border-gray-200 bg-[#F9FBFD] shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-gray-500 text-center max-w-md">
                  Nenhuma sala cadastrada ainda.  
                  <br />
                  Clique em{" "}
                  <span className="font-semibold text-[#0056A6]">
                    “Nova Sala”
                  </span>{" "}
                  para adicionar a primeira.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 🔹 Modal principal (adicionar/editar) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#0056A6] text-xl font-semibold">
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

      {/* 🔹 Modal de detalhes da sala */}
      <Dialog open={!!detalheSala} onOpenChange={() => setDetalheSala(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0056A6] text-xl font-semibold">
              {detalheSala?.nome}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {detalheSala?.bloco && (
              <p className="text-gray-600">
                <strong>Bloco:</strong> {detalheSala.bloco}
              </p>
            )}

            <h3 className="text-[#0056A6] font-semibold mt-4 mb-2">
              Equipamentos nesta sala:
            </h3>

            <ul className="space-y-2">
              {detalheSala?.patrimoniosDetalhes?.length > 0 ? (
                detalheSala.patrimoniosDetalhes.map((p: any) => (
                  <li
                    key={p.id}
                    className="border border-gray-200 rounded-md p-3 bg-[#F9FBFD]"
                  >
                    <div className="font-medium text-[#0056A6]">
                      {p.tipo || "Sem tipo"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {p.marca} {p.modelo && `(${p.modelo})`}
                    </div>
                    <div className="text-xs text-gray-500">
                      Nº Patrimônio: {p.numero_patrimonio}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">
                  Nenhum patrimônio encontrado nesta sala.
                </p>
              )}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
