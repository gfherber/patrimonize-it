export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      movimentacoes: {
        Row: {
          created_at: string | null
          id: string
          motivo: string | null
          patrimonio_id: string | null
          sala_destino_id: string | null
          sala_origem_id: string | null
          usuario_responsavel: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          patrimonio_id?: string | null
          sala_destino_id?: string | null
          sala_origem_id?: string | null
          usuario_responsavel?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          patrimonio_id?: string | null
          sala_destino_id?: string | null
          sala_origem_id?: string | null
          usuario_responsavel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_patrimonio_id_fkey"
            columns: ["patrimonio_id"]
            isOneToOne: false
            referencedRelation: "patrimonios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_sala_destino_id_fkey"
            columns: ["sala_destino_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_sala_origem_id_fkey"
            columns: ["sala_origem_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
        ]
      }
      patrimonios: {
        Row: {
          created_at: string | null
          id: string
          marca: string | null
          modelo: string | null
          numero_patrimonio: string
          observacoes: string | null
          qr_code: string | null
          sala_id: string | null
          status: Database["public"]["Enums"]["status_equipamento"] | null
          tipo: Database["public"]["Enums"]["tipo_equipamento"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          numero_patrimonio: string
          observacoes?: string | null
          qr_code?: string | null
          sala_id?: string | null
          status?: Database["public"]["Enums"]["status_equipamento"] | null
          tipo: Database["public"]["Enums"]["tipo_equipamento"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          numero_patrimonio?: string
          observacoes?: string | null
          qr_code?: string | null
          sala_id?: string | null
          status?: Database["public"]["Enums"]["status_equipamento"] | null
          tipo?: Database["public"]["Enums"]["tipo_equipamento"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patrimonios_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
        ]
      }
      salas: {
        Row: {
          bloco: string | null
          created_at: string | null
          id: string
          nome: string
          observacoes: string | null
          updated_at: string | null
        }
        Insert: {
          bloco?: string | null
          created_at?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          updated_at?: string | null
        }
        Update: {
          bloco?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      status_equipamento:
        | "ativo"
        | "manutencao"
        | "emprestado"
        | "inativo"
        | "descartado"
      tipo_equipamento:
        | "gabinete"
        | "monitor"
        | "notebook"
        | "teclado"
        | "mouse"
        | "impressora"
        | "switch"
        | "roteador"
        | "outro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_equipamento: [
        "ativo",
        "manutencao",
        "emprestado",
        "inativo",
        "descartado",
      ],
      tipo_equipamento: [
        "gabinete",
        "monitor",
        "notebook",
        "teclado",
        "mouse",
        "impressora",
        "switch",
        "roteador",
        "outro",
      ],
    },
  },
} as const
