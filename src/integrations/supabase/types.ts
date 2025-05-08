export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agendamentos: {
        Row: {
          aluno_id: string
          aula_id: string
          created_at: string
          dia_semana: number
          hora_inicio: number
          id: string
        }
        Insert: {
          aluno_id: string
          aula_id: string
          created_at?: string
          dia_semana: number
          hora_inicio: number
          id?: string
        }
        Update: {
          aluno_id?: string
          aula_id?: string
          created_at?: string
          dia_semana?: number
          hora_inicio?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      alunos: {
        Row: {
          cpf: string
          data_cadastro: string
          data_nascimento: string
          email: string | null
          endereco: string | null
          id: string
          menor_idade: boolean
          nome: string
          responsavel_id: string | null
          rg: string | null
          telefone: string | null
        }
        Insert: {
          cpf: string
          data_cadastro?: string
          data_nascimento: string
          email?: string | null
          endereco?: string | null
          id?: string
          menor_idade?: boolean
          nome: string
          responsavel_id?: string | null
          rg?: string | null
          telefone?: string | null
        }
        Update: {
          cpf?: string
          data_cadastro?: string
          data_nascimento?: string
          email?: string | null
          endereco?: string | null
          id?: string
          menor_idade?: boolean
          nome?: string
          responsavel_id?: string | null
          rg?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alunos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      aulas: {
        Row: {
          data_cadastro: string
          id: string
          nome: string
          periodicidade: string
          valor: number
          vezes_semanais: number
        }
        Insert: {
          data_cadastro?: string
          id?: string
          nome: string
          periodicidade: string
          valor: number
          vezes_semanais: number
        }
        Update: {
          data_cadastro?: string
          id?: string
          nome?: string
          periodicidade?: string
          valor?: number
          vezes_semanais?: number
        }
        Relationships: []
      }
      avisos: {
        Row: {
          conteudo: string
          data_criacao: string
          id: string
          para_todos: boolean
          publicado: boolean
          titulo: string
        }
        Insert: {
          conteudo: string
          data_criacao?: string
          id?: string
          para_todos?: boolean
          publicado?: boolean
          titulo: string
        }
        Update: {
          conteudo?: string
          data_criacao?: string
          id?: string
          para_todos?: boolean
          publicado?: boolean
          titulo?: string
        }
        Relationships: []
      }
      avisos_alunos: {
        Row: {
          aluno_id: string
          aviso_id: string
          id: string
        }
        Insert: {
          aluno_id: string
          aviso_id: string
          id?: string
        }
        Update: {
          aluno_id?: string
          aviso_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avisos_alunos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avisos_alunos_aviso_id_fkey"
            columns: ["aviso_id"]
            isOneToOne: false
            referencedRelation: "avisos"
            referencedColumns: ["id"]
          },
        ]
      }
      matriculas: {
        Row: {
          aluno_id: string
          ativa: boolean
          aula_id: string
          data_matricula: string
          id: string
        }
        Insert: {
          aluno_id: string
          ativa?: boolean
          aula_id: string
          data_matricula?: string
          id?: string
        }
        Update: {
          aluno_id?: string
          ativa?: boolean
          aula_id?: string
          data_matricula?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matriculas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      mensalidades: {
        Row: {
          data_criacao: string
          data_pagamento: string | null
          data_vencimento: string
          id: string
          matricula_id: string
          status: string
          valor: number
        }
        Insert: {
          data_criacao?: string
          data_pagamento?: string | null
          data_vencimento: string
          id?: string
          matricula_id: string
          status?: string
          valor: number
        }
        Update: {
          data_criacao?: string
          data_pagamento?: string | null
          data_vencimento?: string
          id?: string
          matricula_id?: string
          status?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "mensalidades_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      responsaveis: {
        Row: {
          cpf: string
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          id: string
          nome: string
          rg: string | null
          telefone: string | null
        }
        Insert: {
          cpf: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          rg?: string | null
          telefone?: string | null
        }
        Update: {
          cpf?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          rg?: string | null
          telefone?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
