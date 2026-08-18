import {
  AddChatMessageReqDTO,
  AddChatMessageResDTO,
  CreateChatSessionReqDTO,
  CreateChatSessionResDTO,
  DeleteChatSessionReqDTO,
  DeleteChatSessionResDTO,
  GetChatSessionResDTO,
  ListChatSessionsReqDTO,
  ListChatSessionsResDTO,
} from '@/application/dto/chat_session.dto'
import { IChatSessionRepository } from '@/domain/repositories/chat_session.repository'

export class CreateChatSession {
  constructor(private repository: IChatSessionRepository) {}

  async execute(
    req: CreateChatSessionReqDTO
  ): Promise<CreateChatSessionResDTO> {
    if (!req.chatbot_id) {
      throw new Error('Chatbot ID is required')
    }

    return await this.repository.createChatSession(req)
  }
}

export class GetChatSession {
  constructor(private repository: IChatSessionRepository) {}

  async execute(id: string): Promise<GetChatSessionResDTO> {
    if (!id) {
      throw new Error('Chat Session ID is required')
    }

    return await this.repository.getChatSession(id)
  }
}

export class ListChatSessions {
  constructor(private repository: IChatSessionRepository) {}

  async execute(
    req: ListChatSessionsReqDTO = {}
  ): Promise<ListChatSessionsResDTO> {
    const payload: ListChatSessionsReqDTO = {
      chatbot_id: req.chatbot_id,
      page_size: req.page_size ?? 20,
      page_token: req.page_token ?? 0,
    }

    return await this.repository.listChatSessions(payload)
  }
}

export class AddChatMessage {
  constructor(private repository: IChatSessionRepository) {}

  async execute(req: AddChatMessageReqDTO): Promise<AddChatMessageResDTO> {
    if (!req.session_id) {
      throw new Error('Session ID is required')
    }
    if (!req.content || req.content.trim() === '') {
      throw new Error('Message content cannot be empty')
    }

    return await this.repository.addChatMessage(req)
  }
}

export class DeleteChatSession {
  constructor(private repository: IChatSessionRepository) {}

  async execute(
    req: DeleteChatSessionReqDTO
  ): Promise<DeleteChatSessionResDTO> {
    if (!req.id) {
      throw new Error('Chat Session ID is required for deletion')
    }

    return await this.repository.deleteChatSession(req)
  }
}
