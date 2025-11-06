import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/client";
import { useToast } from "@/hooks/use-toast";

interface SalaFormProps {
  sala?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SalaForm({ sala, onSuccess, onCancel }: SalaFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: sala?.nome || "",
    bloco: sala?.bloco || "",
    observacoes: sala?.observacoes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (sala) {
        const { error } = await supabase
          .from("salas")
          .update(formData)
          .eq("id", sala.id);

        if (error) throw error;
        toast({ title: "Sala atualizada com sucesso" });
      } else {
        const { error } = await supabase.from("salas").insert(formData);

        if (error) throw error;
        toast({ title: "Sala cadastrada com sucesso" });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar sala",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Sala *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Ex: Laboratório 203"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bloco">Bloco/Prédio</Label>
        <Input
          id="bloco"
          value={formData.bloco}
          onChange={(e) => setFormData({ ...formData, bloco: e.target.value })}
          placeholder="Ex: Bloco A"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          placeholder="Ex: Laboratório de Hardware"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
