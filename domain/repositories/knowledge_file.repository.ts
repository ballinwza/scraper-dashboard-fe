import {
  DeleteKnowledgeFileReqDTO,
  DeleteKnowledgeFileResponse,
  GetKnowledgeFileResponse,
  ListKnowledgeFilesReqDTO,
  ListKnowledgeFilesResponse,
  UploadFileMultiTenantReqDTO,
  UploadFileMultiTenantResponse,
} from '@/application/dto/knowledge_file.dto'

export interface IKnowledgeFileRepository {
  /**
   * ดึงข้อมูล Knowledge File รายชิ้นตาม ID
   * GET /knowledge-files/{id}
   */
  getKnowledgeFile(id: string): Promise<GetKnowledgeFileResponse>

  /**
   * ดึงรายการ Knowledge Files ของ Chatbot
   * POST /knowledge-files/list
   */
  listKnowledgeFiles(
    req: ListKnowledgeFilesReqDTO
  ): Promise<ListKnowledgeFilesResponse>

  /**
   * ลบ Knowledge File ของ Chatbot
   * DELETE /knowledge-files/delete
   */
  deleteKnowledgeFile(
    req: DeleteKnowledgeFileReqDTO
  ): Promise<DeleteKnowledgeFileResponse>

  /**
   * อัปโหลดไฟล์เอกสาร (PDF/Image) สำหรับ Multi-Tenant RAG
   * POST /knowledge-files/upload
   */
  uploadFileMultiTenant(
    req: UploadFileMultiTenantReqDTO
  ): Promise<UploadFileMultiTenantResponse>
}
