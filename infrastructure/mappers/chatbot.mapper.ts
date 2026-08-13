import { ChatbotAnswerResponseDTO } from '@/application/dto/chatbot.dto'
import { ChatbotAnswer } from '@/domain/entities/chatbot'

export class ChatbotMapper {
  static answerDtoToDomain(req: ChatbotAnswerResponseDTO): ChatbotAnswer {
    return {
      message: req.message,
    }
  }
}
