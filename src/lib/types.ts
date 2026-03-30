export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Profile {
  id: string
  email: string
  name: string | null
  plan: 'free' | 'premium'
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  field_of_study: string | null
  problem_statement: string | null
  reference_model_url: string | null
  reference_analysis: Json | null
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  project_id: string
  title: string
  order_index: number
  status: 'pending' | 'generating' | 'completed'
  content: string | null
  word_target: number | null
  created_at: string
}

export interface Message {
  id: string
  project_id: string
  section_id: string | null
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
