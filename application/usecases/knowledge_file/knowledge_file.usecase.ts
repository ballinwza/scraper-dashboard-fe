import {
  DeleteKnowledgeFileReqDTO,
  DeleteKnowledgeFileResponse,
  GetKnowledgeFileResponse,
  ListKnowledgeFilesReqDTO,
  ListKnowledgeFilesResponse,
  UploadFileMultiTenantReqDTO,
  UploadFileMultiTenantResponse,
} from '@/application/dto/knowledge_file.dto'
import { IKnowledgeFileRepository } from '@/domain/repositories/knowledge_file.repository'

export class GetKnowledgeFile {
  constructor(private repository: IKnowledgeFileRepository) {}

  async execute(id: string): Promise<GetKnowledgeFileResponse> {
    if (!id) {
      throw new Error('Knowledge File ID is required')
    }
    return await this.repository.getKnowledgeFile(id)
  }
}

export class ListKnowledgeFiles {
  constructor(private repository: IKnowledgeFileRepository) {}

  async execute(
    req: ListKnowledgeFilesReqDTO
  ): Promise<ListKnowledgeFilesResponse> {
    if (!req.chatbot_id) {
      throw new Error('Chatbot ID is required')
    }

    // กำหนด ค่า Default สำหรับ Pagination หากไม่ได้ระบุมา
    const payload: ListKnowledgeFilesReqDTO = {
      chatbot_id: req.chatbot_id,
      limit: req.limit ?? 10,
      offset: req.offset ?? 0,
    }

    return await this.repository.listKnowledgeFiles(payload)
  }
}

export class UploadFileMultiTenant {
  constructor(private repository: IKnowledgeFileRepository) {}

  async execute(
    req: UploadFileMultiTenantReqDTO
  ): Promise<UploadFileMultiTenantResponse> {
    if (!req.chatbot_id) {
      throw new Error('Chatbot ID is required')
    }
    if (!req.file) {
      throw new Error('File is required for upload')
    }

    return await this.repository.uploadFileMultiTenant(req)
  }
}

export class DeleteKnowledgeFile {
  constructor(private repository: IKnowledgeFileRepository) {}

  async execute(
    req: DeleteKnowledgeFileReqDTO
  ): Promise<DeleteKnowledgeFileResponse> {
    if (!req.chatbot_id) {
      throw new Error('Chatbot ID is required')
    }
    return await this.repository.deleteKnowledgeFile(req)
  }
}
