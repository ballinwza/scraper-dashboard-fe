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
import { axiosClient } from '../api/axios_client' // หรือ '../api/axios-client'

export class KnowledgeFileRepositoryImpl implements IKnowledgeFileRepository {
  /**
   * GET /knowledge-files/{id}
   */
  async getKnowledgeFile(id: string): Promise<GetKnowledgeFileResponse> {
    const response = await axiosClient.get<GetKnowledgeFileResponse>(
      `/knowledge-files/${id}`
    )
    return response.data
  }

  /**
   * POST /knowledge-files/list
   */
  async listKnowledgeFiles(
    req: ListKnowledgeFilesReqDTO
  ): Promise<ListKnowledgeFilesResponse> {
    const response = await axiosClient.post<ListKnowledgeFilesResponse>(
      '/knowledge-files/list',
      req
    )
    return response.data
  }

  /**
   * DELETE /knowledge-files/delete
   */
  async deleteKnowledgeFile(
    req: DeleteKnowledgeFileReqDTO
  ): Promise<DeleteKnowledgeFileResponse> {
    const response = await axiosClient.delete<DeleteKnowledgeFileResponse>(
      '/knowledge-files/delete',
      {
        data: req,
      }
    )
    return response.data
  }

  /**
   * POST /knowledge-files/upload
   * ส่งไฟล์แบบ Multipart Form Data
   */
  async uploadFileMultiTenant(
    req: UploadFileMultiTenantReqDTO
  ): Promise<UploadFileMultiTenantResponse> {
    const formData = new FormData()
    formData.append('chatbot_id', req.chatbot_id)
    formData.append('file', req.file)

    const response = await axiosClient.post<UploadFileMultiTenantResponse>(
      '/knowledge-files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  }
}
