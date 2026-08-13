import { ChatbotAnswer } from '@/domain/entities/chatbot'
import { IChatbotRepository } from '@/domain/repositories/chatbot.repository'
import { ChatbotMapper } from '@/infrastructure/mappers/chatbot.mapper'

export class GenerateAnswerUsecase {
  constructor(private repository: IChatbotRepository) {}

  async execute(question: string): Promise<ChatbotAnswer> {
    const res = await this.repository.generateAnswer(question)
    return ChatbotMapper.answerDtoToDomain(res)
  }
}
