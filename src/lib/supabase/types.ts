import type { CardData } from "@/types/card"

/**
 * Typed Supabase schema. Mirrors supabase/schema.sql (and prisma/schema.prisma).
 * card_data is the structured CardData JSON — the source of truth.
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          avatar_url: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
        }
        Update: {
          username?: string
          email?: string
          avatar_url?: string | null
          bio?: string | null
        }
        Relationships: []
      }
      cards: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          card_data: CardData
          thumbnail_url: string | null
          is_public: boolean
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          card_data: CardData
          thumbnail_url?: string | null
          is_public?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          card_data?: CardData
          thumbnail_url?: string | null
          is_public?: boolean
          likes_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      card_likes: {
        Row: {
          id: string
          user_id: string
          card_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          card_id?: string
        }
        Relationships: []
      }
      card_reports: {
        Row: {
          id: string
          card_id: string
          reporter_id: string
          reason: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          reporter_id: string
          reason: string
          status?: string
          created_at?: string
        }
        Update: {
          status?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
