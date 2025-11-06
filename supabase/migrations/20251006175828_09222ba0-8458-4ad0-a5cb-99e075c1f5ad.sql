-- Criar tabela de salas/laboratórios
CREATE TABLE public.salas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  bloco TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar enum para tipo de equipamento
CREATE TYPE tipo_equipamento AS ENUM (
  'gabinete',
  'monitor',
  'notebook',
  'teclado',
  'mouse',
  'impressora',
  'switch',
  'roteador',
  'outro'
);

-- Criar enum para status
CREATE TYPE status_equipamento AS ENUM (
  'ativo',
  'manutencao',
  'emprestado',
  'inativo',
  'descartado'
);

-- Criar tabela de patrimônios
CREATE TABLE public.patrimonios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_patrimonio TEXT UNIQUE NOT NULL,
  tipo tipo_equipamento NOT NULL,
  marca TEXT,
  modelo TEXT,
  sala_id UUID REFERENCES public.salas(id) ON DELETE SET NULL,
  status status_equipamento DEFAULT 'ativo',
  observacoes TEXT,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de histórico de movimentações
CREATE TABLE public.movimentacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patrimonio_id UUID REFERENCES public.patrimonios(id) ON DELETE CASCADE,
  sala_origem_id UUID REFERENCES public.salas(id),
  sala_destino_id UUID REFERENCES public.salas(id),
  motivo TEXT,
  usuario_responsavel TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patrimonios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (qualquer usuário pode ver/editar tudo)
-- Para um sistema interno, permite acesso total
CREATE POLICY "Permitir acesso total às salas" ON public.salas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total aos patrimônios" ON public.patrimonios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total às movimentações" ON public.movimentacoes FOR ALL USING (true) WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_salas_updated_at
  BEFORE UPDATE ON public.salas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patrimonios_updated_at
  BEFORE UPDATE ON public.patrimonios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_patrimonios_sala ON public.patrimonios(sala_id);
CREATE INDEX idx_patrimonios_numero ON public.patrimonios(numero_patrimonio);
CREATE INDEX idx_patrimonios_tipo ON public.patrimonios(tipo);
CREATE INDEX idx_patrimonios_status ON public.patrimonios(status);
CREATE INDEX idx_movimentacoes_patrimonio ON public.movimentacoes(patrimonio_id);
CREATE INDEX idx_movimentacoes_data ON public.movimentacoes(created_at DESC);