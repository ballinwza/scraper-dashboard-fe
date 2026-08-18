export interface ChatbotAnswer {
  message: string
}

export interface ChatbotBlueprint {
  id: string
  user_id: string
  name: string
  description: string
  system_prompt: string
  created_at: string
  updated_at: string
}
