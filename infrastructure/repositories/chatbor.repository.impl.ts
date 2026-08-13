import { ChatbotAnswerResponseDTO } from '@/application/dto/chatbot.dto'
import { IChatbotRepository } from '@/domain/repositories/chatbot.repository'
import { axiosClient } from '../api/axios_client'

export class ChatbotRepositoryImpl implements IChatbotRepository {
  async generateAnswer(question: string): Promise<ChatbotAnswerResponseDTO> {
    const response = await axiosClient.post<ChatbotAnswerResponseDTO>(
      '/rag/qna',
      {
        question,
      }
    )
    return response.data
  }
}
