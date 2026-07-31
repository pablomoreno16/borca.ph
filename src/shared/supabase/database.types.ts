export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          accion: string
          fecha_hora: string
          id: string
          registro_id: string
          tabla: string
          usuario_id: string | null
          valores_antes: Json | null
          valores_despues: Json | null
        }
        Insert: {
          accion: string
          fecha_hora?: string
          id?: string
          registro_id: string
          tabla: string
          usuario_id?: string | null
          valores_antes?: Json | null
          valores_despues?: Json | null
        }
        Update: {
          accion?: string
          fecha_hora?: string
          id?: string
          registro_id?: string
          tabla?: string
          usuario_id?: string | null
          valores_antes?: Json | null
          valores_despues?: Json | null
        }
        Relationships: []
      }
      carrusel_item: {
        Row: {
          activo: boolean
          created_at: string
          cta_href: string | null
          cta_label: string | null
          descripcion: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          id: string
          orden: number
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          descripcion?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          orden?: number
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          descripcion?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          orden?: number
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      copropiedad: {
        Row: {
          ciudad: string | null
          correo: string | null
          created_at: string
          cuenta_bancaria: string | null
          direccion: string | null
          estado: string
          id: string
          nit: string | null
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          ciudad?: string | null
          correo?: string | null
          created_at?: string
          cuenta_bancaria?: string | null
          direccion?: string | null
          estado?: string
          id?: string
          nit?: string | null
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          ciudad?: string | null
          correo?: string | null
          created_at?: string
          cuenta_bancaria?: string | null
          direccion?: string | null
          estado?: string
          id?: string
          nit?: string | null
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      perfil: {
        Row: {
          auth_user_id: string
          created_at: string
          id: string
          persona_id: string
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          id?: string
          persona_id: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          id?: string
          persona_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
        ]
      }
      perfil_rol: {
        Row: {
          created_at: string
          id: string
          perfil_id: string
          rol: string
        }
        Insert: {
          created_at?: string
          id?: string
          perfil_id: string
          rol: string
        }
        Update: {
          created_at?: string
          id?: string
          perfil_id?: string
          rol?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_rol_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      persona: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nombre: string
          numero_documento: string | null
          telefono: string | null
          tipo_documento: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          nombre: string
          numero_documento?: string | null
          telefono?: string | null
          tipo_documento?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nombre?: string
          numero_documento?: string | null
          telefono?: string | null
          tipo_documento?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      propietario: {
        Row: {
          created_at: string
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          persona_id: string
          porcentaje_participacion: number | null
          unidad_privada_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          persona_id: string
          porcentaje_participacion?: number | null
          unidad_privada_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          persona_id?: string
          porcentaje_participacion?: number | null
          unidad_privada_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "propietario_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propietario_unidad_privada_id_fkey"
            columns: ["unidad_privada_id"]
            isOneToOne: false
            referencedRelation: "unidad_privada"
            referencedColumns: ["id"]
          },
        ]
      }
      unidad_privada: {
        Row: {
          bloque: string
          coeficiente: number
          copropiedad_id: string
          created_at: string
          id: string
          identificador: string
          tipo: string
          updated_at: string
        }
        Insert: {
          bloque?: string
          coeficiente: number
          copropiedad_id: string
          created_at?: string
          id?: string
          identificador: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          bloque?: string
          coeficiente?: number
          copropiedad_id?: string
          created_at?: string
          id?: string
          identificador?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidad_privada_copropiedad_id_fkey"
            columns: ["copropiedad_id"]
            isOneToOne: false
            referencedRelation: "copropiedad"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_tiene_rol: { Args: { rol_buscado: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

