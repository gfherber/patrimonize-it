import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface PatrimonioFormProps {
  patrimonio?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const tipos = [
  { value: "gabinete", label: "Gabinete" },
  { value: "monitor", label: "Monitor" },
  { value: "notebook", label: "Notebook" },
  { value: "teclado", label: "Teclado" },
  { value: "mouse", label: "Mouse" },
  { value: "impressora", label: "Impressora" },
  { value: "switch", label: "Switch" },
  { value: "roteador", label: "Roteador" },
  { value: "outro", label: "Outro" },
];

const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "manutencao", label: "Manutenção" },
  { value: "emprestado", label: "Emprestado" },
  { value: "inativo", label: "Inativo" },
  { value: "descartado", label: "Descartado" },
];

export function PatrimonioForm({ patrimonio, onSuccess, onCancel }: PatrimonioFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [salas, setSalas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    numero_patrimonio: patrimonio?.numero_patrimonio || "",
    tipo: patrimonio?.tipo || "",
    marca: patrimonio?.marca || "",
    modelo: patrimonio?.modelo || "",
    sala_id: patrimonio?.sala_id || "",
    status: patrimonio?.status || "ativo",
    observacoes: patrimonio?.observacoes || "",
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
      if (patrimonio) {
        const { error } = await supabase
          .from("patrimonios")
          .update(formData)
          .eq("id", patrimonio.id);

        if (error) throw error;
        toast({ title: "Patrimônio atualizado com sucesso" });
      } else {
        const { error } = await supabase.from("patrimonios").insert(formData);

        if (error) throw error;
        toast({ title: "Patrimônio cadastrado com sucesso" });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar patrimônio",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero_patrimonio">Número do Patrimônio *</Label>
          <Input
            id="numero_patrimonio"
            value={formData.numero_patrimonio}
            onChange={(e) =>
              setFormData({ ...formData, numero_patrimonio: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo *</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => setFormData({ ...formData, tipo: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Input
            id="marca"
            value={formData.marca}
            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo</Label>
          <Input
            id="modelo"
            value={formData.modelo}
            onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sala_id">Sala</Label>
          <Select
            value={formData.sala_id}
            onValueChange={(value) => setFormData({ ...formData, sala_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a sala" />
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
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
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
