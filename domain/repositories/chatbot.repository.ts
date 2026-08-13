import { ChatbotAnswerResponseDTO } from '@/application/dto/chatbot.dto'

export interface IChatbotRepository {
  generateAnswer(question: string): Promise<ChatbotAnswerResponseDTO>
}
