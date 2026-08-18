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

export interface IChatbotRepository {
  /**
   * สร้าง Multi-Tenant Chatbot ใหม่
   * POST /chatbots/create
   */
  createMultiTenantChatbot(
    req: CreateMultiTenantChatbotReqDTO
  ): Promise<CreateMultiTenantChatbotResDTO>

  /**
   * ดึงข้อมูล Chatbot รายตัวตาม ID
   * GET /chatbots/{id}
   */
  getMultiTenantChatbot(id: string): Promise<GetMultiTenantChatbotResDTO>

  /**
   * ดึงรายการ Chatbots แบบ Pagination
   * POST /chatbots/list (หรือ GET ตาม Query Params)
   */
  listMultiTenantChatbots(
    req: ListMultiTenantChatbotsReqDTO
  ): Promise<ListMultiTenantChatbotsResDTO>

  /**
   * อัปเดตข้อมูล Chatbot
   * POST /chatbots/update
   */
  updateMultiTenantChatbot(
    req: UpdateMultiTenantChatbotReqDTO
  ): Promise<UpdateMultiTenantChatbotResDTO>

  /**
   * ลบ Chatbot ตาม ID
   * DELETE /chatbots/delete
   */
  deleteMultiTenantChatbot(
    req: DeleteMultiTenantChatbotReqDTO
  ): Promise<DeleteMultiTenantChatbotResDTO>
}
