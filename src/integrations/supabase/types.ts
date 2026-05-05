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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          id: string
          label: string | null
          module_id: string
          subtopic_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          module_id: string
          subtopic_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          module_id?: string
          subtopic_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_mappings: {
        Row: {
          chunk_text: string
          created_at: string
          created_by: string
          document_id: string
          id: string
          module_id: string
          page_id: string | null
          position: number
          subtopic_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          chunk_text?: string
          created_at?: string
          created_by: string
          document_id: string
          id?: string
          module_id: string
          page_id?: string | null
          position?: number
          subtopic_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          chunk_text?: string
          created_at?: string
          created_by?: string
          document_id?: string
          id?: string
          module_id?: string
          page_id?: string | null
          position?: number
          subtopic_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_mappings_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_mappings_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pdf_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_reviews: {
        Row: {
          card_id: string
          created_at: string
          due_at: string
          ease: number
          id: string
          interval_days: number
          last_rating: string | null
          module_id: string | null
          repetitions: number
          reviewed_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          due_at?: string
          ease?: number
          id?: string
          interval_days?: number
          last_rating?: string | null
          module_id?: string | null
          repetitions?: number
          reviewed_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          due_at?: string
          ease?: number
          id?: string
          interval_days?: number
          last_rating?: string | null
          module_id?: string | null
          repetitions?: number
          reviewed_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          arabic_hint: string | null
          back: string
          created_at: string
          difficulty: string
          front: string
          id: string
          module_id: string
          subtopic_id: string | null
          updated_at: string
        }
        Insert: {
          arabic_hint?: string | null
          back: string
          created_at?: string
          difficulty?: string
          front: string
          id?: string
          module_id: string
          subtopic_id?: string | null
          updated_at?: string
        }
        Update: {
          arabic_hint?: string | null
          back?: string
          created_at?: string
          difficulty?: string
          front?: string
          id?: string
          module_id?: string
          subtopic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_subtopic_id_fkey"
            columns: ["subtopic_id"]
            isOneToOne: false
            referencedRelation: "subtopics"
            referencedColumns: ["id"]
          },
        ]
      }
      glossary_terms: {
        Row: {
          arabic: string | null
          category: string
          created_at: string
          definition: string
          id: string
          term: string
          updated_at: string
        }
        Insert: {
          arabic?: string | null
          category?: string
          created_at?: string
          definition: string
          id?: string
          term: string
          updated_at?: string
        }
        Update: {
          arabic?: string | null
          category?: string
          created_at?: string
          definition?: string
          id?: string
          term?: string
          updated_at?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          created_at: string
          description: string
          estimated_minutes: number
          icon: string
          id: string
          number: number
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          estimated_minutes?: number
          icon?: string
          id: string
          number: number
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_minutes?: number
          icon?: string
          id?: string
          number?: number
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          module_id: string | null
          subtopic_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          module_id?: string | null
          subtopic_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          module_id?: string | null
          subtopic_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_documents: {
        Row: {
          created_at: string
          error_message: string | null
          filename: string
          id: string
          page_count: number
          status: Database["public"]["Enums"]["pdf_status"]
          storage_path: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          filename: string
          id?: string
          page_count?: number
          status?: Database["public"]["Enums"]["pdf_status"]
          storage_path: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          filename?: string
          id?: string
          page_count?: number
          status?: Database["public"]["Enums"]["pdf_status"]
          storage_path?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      pdf_pages: {
        Row: {
          content: string
          created_at: string
          document_id: string
          id: string
          page_number: number
        }
        Insert: {
          content?: string
          created_at?: string
          document_id: string
          id?: string
          page_number: number
        }
        Update: {
          content?: string
          created_at?: string
          document_id?: string
          id?: string
          page_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "pdf_pages_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          daily_goal_minutes: number
          display_name: string | null
          id: string
          preferred_language: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_goal_minutes?: number
          display_name?: string | null
          id: string
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_goal_minutes?: number
          display_name?: string | null
          id?: string
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          created_at: string
          duration_seconds: number
          id: string
          module_id: string | null
          score: number
          total: number
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          duration_seconds?: number
          id?: string
          module_id?: string | null
          score?: number
          total?: number
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          duration_seconds?: number
          id?: string
          module_id?: string | null
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          arabic_explanation: string | null
          correct_index: number
          created_at: string
          explanation: string
          id: string
          module_id: string
          options: Json
          question: string
          subtopic_id: string | null
          updated_at: string
        }
        Insert: {
          arabic_explanation?: string | null
          correct_index?: number
          created_at?: string
          explanation?: string
          id?: string
          module_id: string
          options?: Json
          question: string
          subtopic_id?: string | null
          updated_at?: string
        }
        Update: {
          arabic_explanation?: string | null
          correct_index?: number
          created_at?: string
          explanation?: string
          id?: string
          module_id?: string
          options?: Json
          question?: string
          subtopic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_questions_subtopic_id_fkey"
            columns: ["subtopic_id"]
            isOneToOne: false
            referencedRelation: "subtopics"
            referencedColumns: ["id"]
          },
        ]
      }
      subtopic_progress: {
        Row: {
          created_at: string
          id: string
          last_visited_at: string
          module_id: string
          progress_pct: number
          status: Database["public"]["Enums"]["progress_status"]
          subtopic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_visited_at?: string
          module_id: string
          progress_pct?: number
          status?: Database["public"]["Enums"]["progress_status"]
          subtopic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_visited_at?: string
          module_id?: string
          progress_pct?: number
          status?: Database["public"]["Enums"]["progress_status"]
          subtopic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subtopics: {
        Row: {
          created_at: string
          description: string
          exam_relevance: number
          id: string
          module_id: string
          position: number
          reading_minutes: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          exam_relevance?: number
          id: string
          module_id: string
          position?: number
          reading_minutes?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          exam_relevance?: number
          id?: string
          module_id?: string
          position?: number
          reading_minutes?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtopics_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
      pdf_status: "uploaded" | "processing" | "ready" | "failed"
      progress_status: "not_started" | "in_progress" | "review" | "done"
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
      app_role: ["admin", "student"],
      pdf_status: ["uploaded", "processing", "ready", "failed"],
      progress_status: ["not_started", "in_progress", "review", "done"],
    },
  },
} as const
