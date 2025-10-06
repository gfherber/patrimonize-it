import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MovimentacaoFormProps {
  patrimonio: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MovimentacaoForm({ patrimonio, onSuccess, onCancel }: MovimentacaoFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [salas, setSalas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    sala_destino_id: "",
    motivo: "",
  });

  useEffect(() => {
    loadSalas();
  }, []);

  const loadSalas = async () => {
    const { data } = await supabase.from("salas").select("*").order("nome");
    setSalas(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Criar registro de movimentação
      const { error: movError } = await supabase.from("movimentacoes").insert({
        patrimonio_id: patrimonio.id,
        sala_origem_id: patrimonio.sala_id,
        sala_destino_id: formData.sala_destino_id,
        motivo: formData.motivo,
        usuario_responsavel: "Sistema", // Pode ser atualizado com dados do usuário logado
      });

      if (movError) throw movError;

      // Atualizar a sala do patrimônio
      const { error: updateError } = await supabase
        .from("patrimonios")
        .update({ sala_id: formData.sala_destino_id })
        .eq("id", patrimonio.id);

      if (updateError) throw updateError;

      toast({ title: "Movimentação registrada com sucesso" });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao registrar movimentação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const salaAtual = salas.find((s) => s.id === patrimonio.sala_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Equipamento</Label>
        <div className="text-sm font-medium">{patrimonio.numero_patrimonio}</div>
      </div>

      <div className="space-y-2">
        <Label>Sala Atual</Label>
        <div className="text-sm text-muted-foreground">
          {salaAtual?.nome || "Sem sala definida"}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sala_destino_id">Nova Sala *</Label>
        <Select
          value={formData.sala_destino_id}
          onValueChange={(value) => setFormData({ ...formData, sala_destino_id: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a nova sala" />
          </SelectTrigger>
          <SelectContent>
            {salas.map((sala) => (
              <SelectItem key={sala.id} value={sala.id}>
                {sala.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo</Label>
        <Textarea
          id="motivo"
          value={formData.motivo}
          onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
          placeholder="Descreva o motivo da movimentação (opcional)"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Movendo..." : "Confirmar Movimentação"}
        </Button>
      </div>
    </form>
  );
}
