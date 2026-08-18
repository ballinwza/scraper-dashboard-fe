import { MessageRole } from '@/domain/entities/chat_session'

// ==========================================
// Entities DTO
// ==========================================

export interface ChatMessageResDTO {
  role: MessageRole | string
  content: string
  created_at: string
}

export interface ChatSessionResDTO {
  id: string
  user_id: string
  chatbot_id: string
  session_title: string
  messages?: ChatMessageResDTO[]
  created_at: string
  updated_at: string
}

// ==========================================
// Request DTOs
// ==========================================

export interface CreateChatSessionReqDTO {
  chatbot_id: string
  session_title?: string
}

export interface GetChatSessionReqDTO {
  id: string
}

export interface ListChatSessionsReqDTO {
  chatbot_id?: string
  page_size?: number // default = 20
  page_token?: number // default = 0
}

export interface AddChatMessageReqDTO {
  session_id: string
  role: MessageRole | string
  content: string
}

export interface DeleteChatSessionReqDTO {
  id: string
}

// ==========================================
// Response DTOs
// ==========================================

export interface CreateChatSessionResDTO {
  session: ChatSessionResDTO
}

export interface GetChatSessionResDTO {
  session: ChatSessionResDTO
}

export interface ListChatSessionsResDTO {
  sessions: ChatSessionResDTO[]
  total_count: number
}

export interface AddChatMessageResDTO {
  message: ChatMessageResDTO
}

export interface DeleteChatSessionResDTO {
  success: boolean
  message: string
}
