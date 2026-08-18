export interface ChatbotAnswerResponseDTO {
  message: string
}

// ==========================================
// Entities DTO
// ==========================================

export interface ChatbotBlueprintResDTO {
  id: string
  user_id: string
  name: string
  description: string
  system_prompt: string
  created_at: string
  updated_at: string
}

// ==========================================
// Request DTOs
// ==========================================

export interface CreateMultiTenantChatbotReqDTO {
  name: string
  description?: string
  system_prompt: string
}

export interface GetMultiTenantChatbotReqDTO {
  id: string
}

export interface ListMultiTenantChatbotsReqDTO {
  page_size?: number // default = 10
  page_token?: number // default = 0
}

export interface UpdateMultiTenantChatbotReqDTO {
  id: string
  name?: string
  description?: string
  system_prompt?: string
}

export interface DeleteMultiTenantChatbotReqDTO {
  id: string
}

// ==========================================
// Response DTOs
// ==========================================

export interface CreateMultiTenantChatbotResDTO {
  chatbot: ChatbotBlueprintResDTO
}

export interface GetMultiTenantChatbotResDTO {
  chatbot: ChatbotBlueprintResDTO
}

export interface ListMultiTenantChatbotsResDTO {
  chatbots: ChatbotBlueprintResDTO[]
  next_page_token: number
  total_count: number
}

export interface UpdateMultiTenantChatbotResDTO {
  chatbot: ChatbotBlueprintResDTO
}

export interface DeleteMultiTenantChatbotResDTO {
  success: boolean
  message: string
}
