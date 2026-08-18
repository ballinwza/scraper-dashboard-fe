export enum MessageRole {
  UNSPECIFIED = 0,
  USER = 1,
  AI = 2,
  SYSTEM = 3,
}

export interface ChatMessage {
  role: MessageRole | string
  content: string
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  chatbot_id: string
  session_title: string
  messages?: ChatMessage[]
  created_at: string
  updated_at: string
}
