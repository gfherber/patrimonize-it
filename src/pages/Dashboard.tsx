import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DoorOpen, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalPatrimonios: 0,
    totalSalas: 0,
    emManutencao: 0,
    movimentacoesRecentes: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [patrimoniosRes, salasRes, manutencaoRes, movimentacoesRes] = await Promise.all([
        supabase.from("patrimonios").select("id", { count: "exact", head: true }),
        supabase.from("salas").select("id", { count: "exact", head: true }),
        supabase.from("patrimonios").select("id", { count: "exact", head: true }).eq("status", "manutencao"),
        supabase.from("movimentacoes").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      setStats({
        totalPatrimonios: patrimoniosRes.count || 0,
        totalSalas: salasRes.count || 0,
        emManutencao: manutencaoRes.count || 0,
        movimentacoesRecentes: movimentacoesRes.count || 0,
      });
    } catch (error) {
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive",
      });
    }
  };

  const statCards = [
    {
      title: "Total de Patrimônios",
      value: stats.totalPatrimonios,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Salas Cadastradas",
      value: stats.totalSalas,
      icon: DoorOpen,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Em Manutenção",
      value: stats.emManutencao,
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Movimentações (7 dias)",
      value: stats.movimentacoesRecentes,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Dashboard"
        description="Visão geral do patrimônio de TI"
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo ao Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Este sistema permite gerenciar todo o patrimônio de TI de forma centralizada.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Cadastre e gerencie equipamentos</li>
                <li>Organize por salas e laboratórios</li>
                <li>Acompanhe movimentações em tempo real</li>
                <li>Mantenha histórico completo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Comece cadastrando suas salas e depois adicione os equipamentos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
