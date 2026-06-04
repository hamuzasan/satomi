export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          status: string | null;
          language_style: string;
          persona_style: string;
          nudge_intensity: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          status?: string | null;
          language_style?: string;
          persona_style?: string;
          nudge_intensity?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          status?: string | null;
          language_style?: string;
          persona_style?: string;
          nudge_intensity?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pockets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          budget_limit: number;
          current_amount: number;
          color: string;
          icon: string;
          warning_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type?: string;
          budget_limit?: number;
          current_amount?: number;
          color?: string;
          icon?: string;
          warning_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          budget_limit?: number;
          current_amount?: number;
          color?: string;
          icon?: string;
          warning_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: string;
          category: string;
          pocket_id: string | null;
          description: string;
          transaction_date: string;
          source: string;
          confidence: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: string;
          category: string;
          pocket_id?: string | null;
          description?: string;
          transaction_date?: string;
          source?: string;
          confidence?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: string;
          category?: string;
          pocket_id?: string | null;
          description?: string;
          transaction_date?: string;
          source?: string;
          confidence?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          goal_type: string;
          target_amount: number;
          current_amount: number;
          target_date: string | null;
          strategy: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          goal_type?: string;
          target_amount: number;
          current_amount?: number;
          target_date?: string | null;
          strategy?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          goal_type?: string;
          target_amount?: number;
          current_amount?: number;
          target_date?: string | null;
          strategy?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          due_date: string;
          frequency: string;
          status: string;
          pocket_id: string | null;
          reminder_days: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          due_date: string;
          frequency?: string;
          status?: string;
          pocket_id?: string | null;
          reminder_days?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          due_date?: string;
          frequency?: string;
          status?: string;
          pocket_id?: string | null;
          reminder_days?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_extractions: {
        Row: {
          id: string;
          user_id: string;
          raw_input: string;
          extracted_json: Json;
          confidence: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          raw_input: string;
          extracted_json?: Json;
          confidence?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          raw_input?: string;
          extracted_json?: Json;
          confidence?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      nudges: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          related_transaction_id: string | null;
          related_pocket_id: string | null;
          related_goal_id: string | null;
          severity: string;
          action_status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          related_transaction_id?: string | null;
          related_pocket_id?: string | null;
          related_goal_id?: string | null;
          severity?: string;
          action_status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          related_transaction_id?: string | null;
          related_pocket_id?: string | null;
          related_goal_id?: string | null;
          severity?: string;
          action_status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      notification_sources: {
        Row: {
          id: string;
          user_id: string;
          app_name: string;
          package_name: string;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          app_name: string;
          package_name: string;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          app_name?: string;
          package_name?: string;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notification_candidates: {
        Row: {
          id: string;
          user_id: string;
          source_app: string;
          source_package: string;
          raw_text_sanitized: string;
          parsed_json: Json;
          status: string;
          created_transaction_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_app: string;
          source_package: string;
          raw_text_sanitized: string;
          parsed_json?: Json;
          status?: string;
          created_transaction_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_app?: string;
          source_package?: string;
          raw_text_sanitized?: string;
          parsed_json?: Json;
          status?: string;
          created_transaction_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<
  TableName extends keyof PublicSchema["Tables"],
> = PublicSchema["Tables"][TableName]["Row"];

export type TablesInsert<
  TableName extends keyof PublicSchema["Tables"],
> = PublicSchema["Tables"][TableName]["Insert"];

export type TablesUpdate<
  TableName extends keyof PublicSchema["Tables"],
> = PublicSchema["Tables"][TableName]["Update"];
