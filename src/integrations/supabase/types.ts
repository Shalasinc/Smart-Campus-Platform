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
      bookings: {
        Row: {
          created_at: string
          end_time: string
          id: string
          purpose: string
          room_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          purpose: string
          room_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          purpose?: string
          room_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_submissions: {
        Row: {
          answers: Json
          exam_id: string
          id: string
          score: number | null
          student_id: string
          submitted_at: string
        }
        Insert: {
          answers?: Json
          exam_id: string
          id?: string
          score?: number | null
          student_id: string
          submitted_at?: string
        }
        Update: {
          answers?: Json
          exam_id?: string
          id?: string
          score?: number | null
          student_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_submissions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          course_id: string
          created_at: string
          duration: number
          end_time: string
          id: string
          questions: Json
          start_time: string
          status: Database["public"]["Enums"]["exam_status"]
          teacher_id: string
          tenant: Database["public"]["Enums"]["tenant_type"]
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          duration?: number
          end_time: string
          id?: string
          questions?: Json
          start_time: string
          status?: Database["public"]["Enums"]["exam_status"]
          teacher_id: string
          tenant?: Database["public"]["Enums"]["tenant_type"]
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          duration?: number
          end_time?: string
          id?: string
          questions?: Json
          start_time?: string
          status?: Database["public"]["Enums"]["exam_status"]
          teacher_id?: string
          tenant?: Database["public"]["Enums"]["tenant_type"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_at_time?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          price: number
          seller_id: string
          stock: number
          tenant: Database["public"]["Enums"]["tenant_type"]
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          price?: number
          seller_id: string
          stock?: number
          tenant?: Database["public"]["Enums"]["tenant_type"]
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          price?: number
          seller_id?: string
          stock?: number
          tenant?: Database["public"]["Enums"]["tenant_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          name: string
          tenant: Database["public"]["Enums"]["tenant_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          tenant?: Database["public"]["Enums"]["tenant_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          tenant?: Database["public"]["Enums"]["tenant_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          building: string
          capacity: number
          created_at: string
          floor: number
          id: string
          is_available: boolean
          name: string
          tenant: Database["public"]["Enums"]["tenant_type"]
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          building: string
          capacity?: number
          created_at?: string
          floor?: number
          id?: string
          is_available?: boolean
          name: string
          tenant?: Database["public"]["Enums"]["tenant_type"]
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          building?: string
          capacity?: number
          created_at?: string
          floor?: number
          id?: string
          is_available?: boolean
          name?: string
          tenant?: Database["public"]["Enums"]["tenant_type"]
          updated_at?: string
        }
        Relationships: []
      }
      sensor_data: {
        Row: {
          id: string
          location: string
          sensor_id: string
          tenant: Database["public"]["Enums"]["tenant_type"]
          timestamp: string
          type: Database["public"]["Enums"]["sensor_type"]
          unit: string
          value: number
        }
        Insert: {
          id?: string
          location: string
          sensor_id: string
          tenant?: Database["public"]["Enums"]["tenant_type"]
          timestamp?: string
          type: Database["public"]["Enums"]["sensor_type"]
          unit: string
          value: number
        }
        Update: {
          id?: string
          location?: string
          sensor_id?: string
          tenant?: Database["public"]["Enums"]["tenant_type"]
          timestamp?: string
          type?: Database["public"]["Enums"]["sensor_type"]
          unit?: string
          value?: number
        }
        Relationships: []
      }
      shuttles: {
        Row: {
          eta: number
          heading: number
          id: string
          last_updated: string
          latitude: number
          longitude: number
          name: string
          next_stop: string
          route: string
          shuttle_id: string
          speed: number
          status: Database["public"]["Enums"]["shuttle_status"]
        }
        Insert: {
          eta?: number
          heading?: number
          id?: string
          last_updated?: string
          latitude: number
          longitude: number
          name: string
          next_stop: string
          route: string
          shuttle_id: string
          speed?: number
          status?: Database["public"]["Enums"]["shuttle_status"]
        }
        Update: {
          eta?: number
          heading?: number
          id?: string
          last_updated?: string
          latitude?: number
          longitude?: number
          name?: string
          next_stop?: string
          route?: string
          shuttle_id?: string
          speed?: number
          status?: Database["public"]["Enums"]["shuttle_status"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["tenant_type"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin"
      booking_status: "pending" | "confirmed" | "cancelled"
      exam_status: "draft" | "scheduled" | "active" | "completed"
      notification_type: "info" | "success" | "warning" | "error"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      sensor_type: "temperature" | "humidity" | "occupancy" | "air-quality"
      shuttle_status: "active" | "idle" | "maintenance"
      tenant_type: "engineering" | "medical"
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
      app_role: ["student", "teacher", "admin"],
      booking_status: ["pending", "confirmed", "cancelled"],
      exam_status: ["draft", "scheduled", "active", "completed"],
      notification_type: ["info", "success", "warning", "error"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      sensor_type: ["temperature", "humidity", "occupancy", "air-quality"],
      shuttle_status: ["active", "idle", "maintenance"],
      tenant_type: ["engineering", "medical"],
    },
  },
} as const
