import {
  CreateMultiTenantChatbotReqDTO,
  CreateMultiTenantChatbotResDTO,
  DeleteMultiTenantChatbotReqDTO,
  DeleteMultiTenantChatbotResDTO,
  GetMultiTenantChatbotResDTO,
  ListMultiTenantChatbotsReqDTO,
  ListMultiTenantChatbotsResDTO,
  UpdateMultiTenantChatbotReqDTO,
  UpdateMultiTenantChatbotResDTO,
} from '@/application/dto/chatbot.dto'
import { IChatbotRepository } from '@/domain/repositories/chatbot.repository'

export class CreateMultiTenantChatbot {
  constructor(private repository: IChatbotRepository) {}

  async execute(
    req: CreateMultiTenantChatbotReqDTO
  ): Promise<CreateMultiTenantChatbotResDTO> {
    if (!req.name || req.name.trim() === '') {
      throw new Error('Chatbot name is required')
    }
    if (!req.system_prompt || req.system_prompt.trim() === '') {
      throw new Error('System prompt is required')
    }

    return await this.repository.createMultiTenantChatbot(req)
  }
}

export class GetMultiTenantChatbot {
  constructor(private repository: IChatbotRepository) {}

  async execute(id: string): Promise<GetMultiTenantChatbotResDTO> {
    if (!id) {
      throw new Error('Chatbot ID is required')
    }

    return await this.repository.getMultiTenantChatbot(id)
  }
}

export class ListMultiTenantChatbots {
  constructor(private repository: IChatbotRepository) {}

  async execute(
    req: ListMultiTenantChatbotsReqDTO = {}
  ): Promise<ListMultiTenantChatbotsResDTO> {
    const payload: ListMultiTenantChatbotsReqDTO = {
      page_size: req.page_size ?? 10,
      page_token: req.page_token ?? 0,
    }

    return await this.repository.listMultiTenantChatbots(payload)
  }
}

export class UpdateMultiTenantChatbot {
  constructor(private repository: IChatbotRepository) {}

  async execute(
    req: UpdateMultiTenantChatbotReqDTO
  ): Promise<UpdateMultiTenantChatbotResDTO> {
    if (!req.id) {
      throw new Error('Chatbot ID is required for update')
    }

    return await this.repository.updateMultiTenantChatbot(req)
  }
}

export class DeleteMultiTenantChatbot {
  constructor(private repository: IChatbotRepository) {}

  async execute(
    req: DeleteMultiTenantChatbotReqDTO
  ): Promise<DeleteMultiTenantChatbotResDTO> {
    if (!req.id) {
      throw new Error('Chatbot ID is required for deletion')
    }

    return await this.repository.deleteMultiTenantChatbot(req)
  }
}
