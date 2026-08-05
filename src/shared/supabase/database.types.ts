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
      categoria_documento: {
        Row: {
          activo: boolean
          created_at: string
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      categoria_documento_rol: {
        Row: {
          categoria_documento_id: string
          id: string
          rol: string
        }
        Insert: {
          categoria_documento_id: string
          id?: string
          rol: string
        }
        Update: {
          categoria_documento_id?: string
          id?: string
          rol?: string
        }
        Relationships: [
          {
            foreignKeyName: "categoria_documento_rol_categoria_documento_id_fkey"
            columns: ["categoria_documento_id"]
            isOneToOne: false
            referencedRelation: "categoria_documento"
            referencedColumns: ["id"]
          },
        ]
      }
      copropiedad: {
        Row: {
          banco: string | null
          ciudad: string | null
          correo: string | null
          created_at: string
          direccion: string | null
          estado: string
          id: string
          nit: string | null
          nombre: string
          numero_cuenta: string | null
          telefono: string | null
          tipo: string
          tipo_cuenta: string | null
          updated_at: string
        }
        Insert: {
          banco?: string | null
          ciudad?: string | null
          correo?: string | null
          created_at?: string
          direccion?: string | null
          estado?: string
          id?: string
          nit?: string | null
          nombre: string
          numero_cuenta?: string | null
          telefono?: string | null
          tipo?: string
          tipo_cuenta?: string | null
          updated_at?: string
        }
        Update: {
          banco?: string | null
          ciudad?: string | null
          correo?: string | null
          created_at?: string
          direccion?: string | null
          estado?: string
          id?: string
          nit?: string | null
          nombre?: string
          numero_cuenta?: string | null
          telefono?: string | null
          tipo?: string
          tipo_cuenta?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documento: {
        Row: {
          archivo_path: string
          categoria_documento_id: string
          copropiedad_id: string
          created_at: string
          fecha_elaboracion: string
          id: string
          subido_por: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          archivo_path: string
          categoria_documento_id: string
          copropiedad_id: string
          created_at?: string
          fecha_elaboracion: string
          id?: string
          subido_por?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          archivo_path?: string
          categoria_documento_id?: string
          copropiedad_id?: string
          created_at?: string
          fecha_elaboracion?: string
          id?: string
          subido_por?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documento_categoria_documento_id_fkey"
            columns: ["categoria_documento_id"]
            isOneToOne: false
            referencedRelation: "categoria_documento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_copropiedad_id_fkey"
            columns: ["copropiedad_id"]
            isOneToOne: false
            referencedRelation: "copropiedad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_subido_por_fkey"
            columns: ["subido_por"]
            isOneToOne: false
            referencedRelation: "perfil"
            referencedColumns: ["id"]
          },
        ]
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
          copropiedad_id: string | null
          created_at: string
          id: string
          perfil_id: string
          rol: string
        }
        Insert: {
          copropiedad_id?: string | null
          created_at?: string
          id?: string
          perfil_id: string
          rol: string
        }
        Update: {
          copropiedad_id?: string | null
          created_at?: string
          id?: string
          perfil_id?: string
          rol?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_rol_copropiedad_id_fkey"
            columns: ["copropiedad_id"]
            isOneToOne: false
            referencedRelation: "copropiedad"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "propietario_unidad_privada_id_fkey"
            columns: ["unidad_privada_id"]
            isOneToOne: false
            referencedRelation: "unidad_privada_detalle"
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
      unidad_privada_detalle: {
        Row: {
          bloque: string | null
          coeficiente: number | null
          copropiedad_id: string | null
          id: string | null
          identificador: string | null
          identificador_numero: number | null
          propietarios_nombres: string | null
          tipo: string | null
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
    Functions: {
      fn_tiene_rol: { Args: { rol_buscado: string }; Returns: boolean }
      fn_tiene_rol_en_copropiedad: {
        Args: { cop_id: string; rol_buscado: string }
        Returns: boolean
      }
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

